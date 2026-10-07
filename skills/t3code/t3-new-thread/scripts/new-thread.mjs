#!/usr/bin/env node
// new-thread.mjs - start a new T3 Code thread in the running desktop app.
//
// Usage: node new-thread.mjs --prompt <text> [--cwd <project dir>] [--image <path>]...
//
// Talks to the local server the way the mobile app does: one `thread.turn.start`
// command with `bootstrap.createThread`, sent as Effect RPC over the WebSocket.
// Model and access mode are copied from the newest thread in the project.
// A `$skill-name` in the prompt runs that skill, the server rewrites it to `/skill-name`.
// Prints `SPAWNED t3 <threadId>` on success.
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, extname, resolve } from "node:path";

const args = process.argv.slice(2);
const argAll = (name) => args.flatMap((value, i) => (value === name ? [args[i + 1]] : []));
const prompt = argAll("--prompt")[0];
const cwd = resolve(argAll("--cwd")[0] ?? process.cwd());
if (!prompt) {
  console.error("error: --prompt is required");
  process.exit(2);
}

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp" };
const attachments = argAll("--image").map((path) => {
  const mimeType = MIME[extname(path).toLowerCase()];
  if (!mimeType) {
    console.error(`error: unsupported image type: ${path}`);
    process.exit(2);
  }
  const bytes = readFileSync(path);
  return {
    type: "image",
    name: basename(path),
    mimeType,
    sizeBytes: bytes.length,
    dataUrl: `data:${mimeType};base64,${bytes.toString("base64")}`,
  };
});

const userdata = `${homedir()}/.t3/userdata`;
const { origin } = JSON.parse(readFileSync(`${userdata}/server-runtime.json`, "utf8"));

// Read-only lookups, the app owns the database.
const query = (sql) =>
  JSON.parse(
    execFileSync("sqlite3", ["-readonly", "-json", `${userdata}/state.sqlite`, sql], {
      encoding: "utf8",
    }) || "[]",
  );
const quote = (value) => `'${value.replaceAll("'", "''")}'`;

const [project] = query(
  `select project_id from projection_projects where deleted_at is null and workspace_root = ${quote(cwd)}`,
);
if (!project) {
  console.error(`error: no T3 project for ${cwd}, add it with \`t3 project add\``);
  process.exit(2);
}
const [last] = query(
  `select model_selection_json, runtime_mode from projection_threads
   where model_selection_json is not null
   order by project_id = ${quote(project.project_id)} desc, created_at desc limit 1`,
);
if (!last) {
  console.error("error: no existing thread to copy the model from");
  process.exit(2);
}
const modelSelection = JSON.parse(last.model_selection_json);
const runtimeMode = last.runtime_mode;

let branch = null;
try {
  branch =
    execFileSync("git", ["-C", cwd, "branch", "--show-current"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim() || null;
} catch {}

const token = execFileSync(
  "t3",
  ["auth", "session", "issue", "--token-only", "--ttl", "5m", "--label", "new-thread"],
  { encoding: "utf8" },
).trim();
const ticketResponse = await fetch(`${origin}/api/auth/websocket-ticket`, {
  method: "POST",
  headers: { authorization: `Bearer ${token}` },
});
if (!ticketResponse.ok) {
  console.error(`error: websocket ticket failed, HTTP ${ticketResponse.status}`);
  process.exit(1);
}
const { ticket } = await ticketResponse.json();

const threadId = randomUUID();
const createdAt = new Date().toISOString();
const compact = prompt.trim().replace(/\s+/g, " ");
const title = compact.length <= 72 ? compact : `${compact.slice(0, 69).trimEnd()}...`;
const command = {
  type: "thread.turn.start",
  commandId: randomUUID(),
  threadId,
  message: { messageId: randomUUID(), role: "user", text: prompt, attachments },
  modelSelection,
  titleSeed: title,
  runtimeMode,
  interactionMode: "default",
  bootstrap: {
    createThread: {
      projectId: project.project_id,
      title,
      modelSelection,
      runtimeMode,
      interactionMode: "default",
      branch,
      worktreePath: null,
      createdAt,
    },
  },
  createdAt,
};

const wsUrl = new URL(`${origin.replace(/^http/, "ws")}/ws`);
wsUrl.searchParams.set("wsTicket", ticket);
const socket = new WebSocket(wsUrl);
const fail = (message) => {
  console.error(`error: ${message}`);
  process.exit(1);
};
const timeout = setTimeout(() => fail("no reply from the server in 30s"), 30_000);

socket.addEventListener("open", () => {
  socket.send(
    JSON.stringify({
      _tag: "Request",
      id: "1",
      tag: "orchestration.dispatchCommand",
      payload: command,
      headers: [],
    }),
  );
});
socket.addEventListener("message", (event) => {
  const parsed = JSON.parse(event.data);
  for (const message of Array.isArray(parsed) ? parsed : [parsed]) {
    if (message._tag === "Exit" && message.requestId === "1") {
      clearTimeout(timeout);
      socket.close();
      if (message.exit._tag !== "Success") fail(JSON.stringify(message.exit));
      console.log(`SPAWNED t3 ${threadId}`);
    } else if (message._tag === "Defect" || message._tag === "ClientProtocolError") {
      fail(JSON.stringify(message));
    }
  }
});
socket.addEventListener("error", () => fail("websocket connection failed"));
