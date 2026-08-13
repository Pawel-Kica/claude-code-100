#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const usage = "Usage: node build-report.mjs <manifest.json>";
const manifestArg = process.argv[2];

if (!manifestArg || manifestArg === "--help" || manifestArg === "-h") {
  console.log(usage);
  process.exit(manifestArg ? 0 : 1);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.dirname(scriptDir);
const manifestPath = path.resolve(manifestArg);
const runDir = path.dirname(manifestPath);
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

const required = ["title", "subtitle", "verdict", "mode", "output", "steps"];
for (const key of required) {
  if (manifest[key] === undefined) throw new Error(`Manifest is missing ${key}`);
}
if (!Array.isArray(manifest.steps) || manifest.steps.length === 0) {
  throw new Error("Manifest steps must contain at least one item");
}
if (!["record", "screenshots"].includes(manifest.mode)) {
  throw new Error('Manifest mode must be "record" or "screenshots"');
}
if (manifest.mode === "record" && !manifest.frames_dir) {
  throw new Error("Record mode requires frames_dir and captured Browser frames");
}
if (manifest.expected_duration_seconds !== undefined && manifest.mode !== "record") {
  throw new Error("expected_duration_seconds requires record mode");
}
if (manifest.expected_duration_seconds !== undefined && !(Number(manifest.expected_duration_seconds) > 0)) {
  throw new Error("expected_duration_seconds must be greater than zero");
}

const resolveRun = value => path.resolve(runDir, value);
const run = (command, args) => {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`${command} failed\n${result.stdout}\n${result.stderr}`);
  }
  return result.stdout.trim();
};

const detectMime = async file => {
  const bytes = await fs.readFile(file);
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return "image/webp";
  throw new Error(`Unsupported image type: ${file}`);
};

const asDataUri = async (file, mime) => {
  const bytes = await fs.readFile(file);
  return `data:${mime};base64,${bytes.toString("base64")}`;
};

let videoPath;
if (manifest.frames_dir) {
  const framesDir = resolveRun(manifest.frames_dir);
  const framePattern = manifest.frame_pattern || "frame_%05d.jpg";
  const firstFrame = resolveRun(path.join(manifest.frames_dir, framePattern.replace(/%0?\d*d/, "0".padStart(Number(framePattern.match(/%0?(\d*)d/)?.[1] || 1), "0"))));
  const mime = await detectMime(firstFrame);
  const codec = mime === "image/png" ? "png" : mime === "image/jpeg" ? "mjpeg" : "webp";
  const captureFps = Number(manifest.capture_fps || 12);
  const outputFps = Number(manifest.output_fps || 60);
  videoPath = resolveRun(manifest.video_file || "recording.mp4");
  await fs.mkdir(path.dirname(videoPath), { recursive: true });
  run("ffmpeg", [
    "-y",
    "-framerate", String(captureFps),
    "-c:v", codec,
    "-i", path.join(framesDir, framePattern),
    "-vf", `crop=trunc(iw/2)*2:trunc(ih/2)*2,fps=${outputFps}`,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", String(manifest.crf || 20),
    "-movflags", "+faststart",
    videoPath,
  ]);
  const probe = JSON.parse(run("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration,size:stream=codec_name,width,height,r_frame_rate",
    "-of", "json",
    videoPath,
  ]));
  const stream = probe.streams?.[0];
  const encodedDuration = Number(probe.format?.duration);
  if (stream?.codec_name !== "h264" || encodedDuration <= 0) {
    throw new Error("Encoded video failed metadata validation");
  }
  if (manifest.expected_duration_seconds !== undefined) {
    const expectedDuration = Number(manifest.expected_duration_seconds);
    const tolerance = Number(manifest.duration_tolerance_seconds ?? 0.25);
    if (!(tolerance >= 0)) throw new Error("duration_tolerance_seconds must be zero or greater");
    if (Math.abs(encodedDuration - expectedDuration) > tolerance) {
      throw new Error(`Encoded duration ${encodedDuration.toFixed(3)}s differs from expected ${expectedDuration.toFixed(3)}s by more than ${tolerance.toFixed(3)}s`);
    }
  }
} else if (manifest.video_file) {
  videoPath = resolveRun(manifest.video_file);
}
if (manifest.mode === "record" && !videoPath) {
  throw new Error("Record mode requires a validated video");
}

const thumbsDir = path.join(runDir, ".e2e-codex-thumbs");
await fs.mkdir(thumbsDir, { recursive: true });
const steps = [];

for (const [index, step] of manifest.steps.entries()) {
  if (!step.image) throw new Error(`Step ${index + 1} is missing image`);
  const imagePath = resolveRun(step.image);
  const imageMime = await detectMime(imagePath);
  let thumbPath = step.thumb ? resolveRun(step.thumb) : path.join(thumbsDir, `step-${index + 1}.jpg`);
  if (!step.thumb) {
    run("ffmpeg", ["-y", "-i", imagePath, "-vf", "scale=380:-2", "-frames:v", "1", "-q:v", "4", thumbPath]);
  }
  const thumbMime = await detectMime(thumbPath);
  steps.push({
    n: step.n ?? index + 1,
    title: step.title,
    caption: step.caption,
    img: await asDataUri(imagePath, imageMime),
    thumb: await asDataUri(thumbPath, thumbMime),
    ...(step.t !== undefined ? { t: Number(step.t) } : {}),
    ...(step.flag ? { flag: step.flag } : {}),
  });
}

const templatePath = manifest.template
  ? resolveRun(manifest.template)
  : path.join(skillDir, "assets", "report-template.html");
const video = videoPath ? await asDataUri(videoPath, "video/mp4") : "";
const html = (await fs.readFile(templatePath, "utf8"))
  .replaceAll("__TITLE__", manifest.title)
  .replace("__SUB__", manifest.subtitle)
  .replace("__VERDICT__", manifest.verdict)
  .replace("__DATA__", JSON.stringify(steps))
  .replace("__VIDEO__", video);

if (/__(TITLE|SUB|VERDICT|DATA|VIDEO)__/.test(html)) {
  throw new Error("Report template still contains unresolved placeholders");
}
if (manifest.mode === "record" && !html.includes("data:video/mp4;base64,")) {
  throw new Error("Record mode report is missing embedded MP4 data");
}

const outputPath = resolveRun(manifest.output);
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, html);
console.log(outputPath);
