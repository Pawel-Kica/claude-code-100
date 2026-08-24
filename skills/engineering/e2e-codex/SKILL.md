---
name: e2e-codex
description: "Drive the real app end to end through Chrome DevTools MCP, with video proof. Trigger 'e2e it through codex'."
---

Give it a goal. Drive the real thing until you can answer whether it works. Fix what breaks, verify the fix, answer.

## Scope

- Goal is whatever the user said, in prose.
- Args may be a spec, PRD, or plan path: read it for intent, the file is not the target.
- Nothing said: scope from `git status` plus `git diff --stat`, or from the checklist written earlier in the conversation.

## Wrong surface

The most common way this skill lies:

- Green on a page where the user is logged out, on the tab next to the right one, or on a modal that never opened.
- URL is the one intended, and the account, tenant, and role are the ones intended.
- Assert on state watched changing, then reload and assert it survived when persistence is part of the promise.
- What is asserted is the feature, not a lookalike such as editor source text, a hidden span, or the component's own progress label.
- Poll a count of real result nodes and a discriminating value. An SPA can keep the previous step mounted.
- The DOM can be right while the pixels are wrong. On canvas, WebGL, maps, charts, animation, and layout, inspect the screenshot.

## Drive

Testing is always Chrome DevTools MCP. Playwright is for artifacts, nothing else.

**Chrome DevTools MCP** is the `chrome-devtools` server, always headless and isolated. It drives every verification run:

- Confirm it is loaded with `codex mcp list`. When it is missing, add it once with `codex mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest --isolated --headless`, then start a fresh Codex session so the tools appear. When it still does not load, report that this skill requires Chrome DevTools MCP instead of driving a different browser.
- Click through by hand and read state back: `navigate_page`, `take_snapshot` for the accessibility tree, `click`, `hover`, `fill`, `fill_form`, `type_text`, `press_key`, `select_page`, `wait_for`, `list_console_messages`, `list_network_requests`, `take_screenshot`. No script to write.
- A long or fiddly flow is not a reason to switch. Click it, do not script it.
- Interactions go through the interaction tools so hover, focus, and input events stay real. `evaluate_script` reads state back and samples behaviour; it does not replace the click.
- Each `take_snapshot` mints fresh element uids. Re-snapshot after anything that mutates the DOM and act on the uid from that snapshot.
- One shared browser instance serves every agent on this machine. Keep to your own page, select it explicitly before each payoff action, and expect a stolen tab whenever you do not.
- MCP file writes land where the server is permitted to write. A kept artifact whose destination sits outside that is Playwright's job.

**Playwright** is artifacts only, always `chromium.launch({headless: true})`, never `headless: false`:

- The recording, and the kept screenshots that go with it.
- Parallel runs, where the one shared MCP instance would collide. Not a preference, the only other exit.
- Global install, run as `NODE_PATH=$(npm root -g) node script.js`, CommonJS. Same prefix for the check: `NODE_PATH=$(npm root -g) node -e "require.resolve('playwright')"`. Bare `node` will not find it, and `playwright --version` can be the Python package.
- Working directory from `mktemp -d /tmp/e2e-codex-XXXXXX`. Timestamps collide when agents start together.

**TESTING IS ALWAYS CHROME DEVTOOLS MCP. PLAYWRIGHT IS FOR GENERATING ARTIFACTS ONLY.**

Then:

- 1728x1117 through `resize_page`, a MacBook Pro 16 inch at default scaling. Mobile pass 402x874 through `emulate`, iPhone 17 Pro, when responsive layout is in scope. Reset the viewport at the end.
- Someone else's site is not a contract. Its DOM can differ between loads, so read visible text from a coarse container and match meaning instead of trusting a fragile selector.
- Logged-out or second-user flows use the visible sign-out and sign-in path, or `new_page` with a named `isolatedContext` so the second identity gets its own cookies and storage. Assert identity after switching, and leave the main session signed in.
- Behaviour a screenshot cannot catch, such as a sub-second flash, duplicate requests, or a race: install a MutationObserver or rAF sampler through `evaluate_script`, or patch `window.fetch` and read the counts back. `list_network_requests` covers the request-level version.
- No UI for the change, such as a scheduled task, API, or webhook: drive it anyway and say that is what happened. `curl` the real endpoint on the running server, or call the service function in the app's own shell. Assert on the response and on what it changed.

## Map first

- Multi-step flows cost 30 to 60 seconds per attempt. Run a throwaway probe first and dump visible inputs, buttons, links, dialogs, placeholders, values, and text from a snapshot. Two fields and a submit button do not need this.
- Keep the probe output available and remap whenever a screenshot disproves an assumption.
- Every probe round replays the flow from the top, sign-in included. Batch the open questions into one round that captures element geometry, the scrolling container, and the wait predicate together.
- Validate every wait predicate in the probe. A predicate that cannot resolve stalls the run instead of failing fast.
- Recording starts only after the probe is trustworthy. Recording blind bakes the failures into the artifact.
- Probe with throwaway inputs, then run with a fresh discriminating value. Cached responses can skip the step intended for proof.

## Fix

- Fix by default, re-verify the failed step, then carry on through the full user-visible path.
- A skipped optional step is logged explicitly with a short timeout. If it was the payoff, run it again.
- A step that fails twice triggers a clean remap and a fresh full attempt, not a patch around it.
- Stop and report schema redesign, architecture changes, migrations with uncertain data impact, and anything another agent is actively changing.
- Logs: `list_console_messages` and `list_network_requests` first, then the project's own log commands.

## Test data

- Reuse what exists, never delete.
- Mutate and restore reversible state, then verify the restoration.
- Seed through the app's API or service so side effects remain real. Direct DB writes skip them and fake a broken UI.
- Back up persistent data before a broad write.
- Use the user's own authorized test endpoints for external test sends.

## Answer

Answer the question asked: what works, what did not, what was fixed, and the strongest evidence. No step tables, no checklists.

## Artifacts, on request only

Four modes:

- **Default**, no artifacts. The prose answer is the deliverable. This is what runs unless the user asked for more.
- **Screenshots**, **Record** and **Frame Locked**, one self-contained HTML page each. Picked by what the user asked for, described below.

The page is light theme. Never hand-roll it: fill `assets/report-template.html` through `scripts/build-report.mjs`, which replaces `__TITLE__`, `__SUB__`, `__VERDICT__`, `__DATA__`, and `__VIDEO__`. The template is the starting point, not a cage: extend it when the run needs more.

Artifact capture is Playwright, driven live in its own run. Chrome DevTools MCP still owns the verification; the artifact run replays the already-proven flow.

And:

- Use the task's declared output directory when available. Otherwise create a fresh `/tmp/e2e-codex-*` run directory. Keep artifacts outside the product repo.
- Name artifacts after the run so parallel attempts stay distinct.
- Hand back the path and `pbcopy` it.
- Base64-inline every image and MP4 into the one HTML file.
- Keep stage images at full source resolution, JPEG q85. A 1728px capture stays 1728px, because retina displays make 1280px blurry. The helper creates thumbnails at roughly 380px. PNG only when the pixels are the point.
- Keep `max-height: 76vh; object-fit: contain`; crops and full-page shots share the same stage.
- Captions carry the answer. If the question was "how far is it", put the number in the caption.
- Stills come from the same run as the video, captured when the wait resolves and before a hold. Chapter timecodes point at those frames.
- Verify the built report before handing it over. Serve the run directory through a temporary localhost HTTP server, open it in Chrome DevTools MCP, and check video readiness, screenshots, chapters, gallery controls, overflow, and console errors. Stop the server after verification.
- Include requested screenshots inline in the final response and link the self-contained report.

Write `manifest.json` before capture. Set `"mode"` to `"screenshots"`, `"record"`, or `"frame_locked"`, matching the user's request. The helper validates the mode you declared and rejects a manifest that does not carry what that mode promises.

Example Record manifest:

```json
{
  "title": "Settings flow",
  "subtitle": "Chrome DevTools MCP verified, Playwright capture, 1728x1117",
  "verdict": "Passed",
  "mode": "record",
  "output": "settings-e2e.html",
  "frames_dir": "frames",
  "frame_pattern": "frame_%05d.jpg",
  "capture_fps": 12,
  "output_fps": 60,
  "video_file": "settings-e2e.mp4",
  "steps": [
    {
      "n": 1,
      "title": "Saved settings",
      "caption": "The saved value remains after reload.",
      "image": "saved.jpg",
      "t": 3.4
    }
  ]
}
```

Example Frame Locked manifest, which adds the duration contract and pins both rates to 60:

```json
{
  "title": "Sidebar collapse",
  "subtitle": "Chrome DevTools MCP verified, Playwright capture, 1728x1080",
  "verdict": "Passed",
  "mode": "frame_locked",
  "output": "sidebar-e2e.html",
  "frames_dir": "frames",
  "frame_pattern": "frame_%05d.png",
  "expected_duration_seconds": 18,
  "duration_tolerance_seconds": 0.25,
  "capture_fps": 60,
  "output_fps": 60,
  "video_file": "sidebar-e2e.mp4",
  "steps": [
    {
      "n": 1,
      "title": "Collapsed",
      "caption": "The sidebar finishes its transition at 220ms.",
      "image": "frames/frame_00420.png",
      "t": 7.0
    }
  ]
}
```

Build with:

```bash
node <skill-directory>/scripts/build-report.mjs <run-directory>/manifest.json
```

### Screenshots

Use for `show me`, `screenshots`, and `generate HTML`.

- Capture key states with Playwright `page.screenshot()` in the artifact run, or reuse MCP screenshots already written inside a permitted directory.
- Set `"mode": "screenshots"` in the manifest.
- Omit frame and video fields. The template removes video and chapters automatically.
- Verify each displayed image is loaded and the gallery controls reach every step.

### Record

Use for `record it`.

- Drive the flow with Playwright while saving ordered screenshot bytes as `frames/frame_00000.jpg`, `frame_00001.jpg`, and so on. `recordVideo` on `newContext` is the alternative; its file appears only after both `page.close()` and `context.close()`, one run can leave several webm files, so take the largest and confirm duration with `ffprobe` before transcoding to MP4.
- Use `.jpg` for JPEG magic `ff d8 ff` and `.png` for PNG magic `89 50 4e 47`.
- Capture at a steady measured rate, normally 8 to 12 frames per second, and set `capture_fps` to that rate. Encode `output_fps` at 60.
- Keep capturing while polling so waits remain visible in the recording.
- Give every action a short explicit timeout, normally 5 seconds. A 45-second catch is 45 seconds of dead frame baked into the file, and a timed-out payoff aborts the run.
- Draw a cursor or the video is unreadable: a `position:fixed`, `pointer-events:none` div added through `addInitScript` so it survives navigation, moved together with a real `mouse.move` so hover states are genuine. Make chapters and captions carry the action context.
- Take stills in the same run. They do not stall the frame sequence.
- Treat a validated, non-empty MP4 embedded as `data:video/mp4;base64,...` as part of completion.
- Inspect the encoded frame at 0.5 seconds and confirm it shows real content, not the blank first paint.

### Frame Locked

Use for `frame locked`, or when motion itself is the subject: animation, scroll, transition, drag, hover, or typing.

- Map the run to a playback timeline before capture. Give each action, wait, animation, inspection, and hold enough screen time to be understood at normal viewing speed. Let the flow determine the total duration.
- Set `"mode": "frame_locked"`, write `expected_duration_seconds` in the manifest, and derive the frame budget as `ceil(expected_duration_seconds * 60)`. A short form can be about 15 seconds; a long drawing can be 60 to 90 seconds. These are examples, not limits.
- Capture one fresh Playwright screenshot for every output frame and set both `capture_fps` and `output_fps` to 60. The helper rejects a frame-locked manifest at any other rate.
- After each small motion step, await two `requestAnimationFrame` ticks through `page.evaluate`, then capture the frame.
- Wrap the two-rAF tick in a local recovery path with a fixed 16ms fallback. Navigation replaces the execution context between frames and kills the capture mid-run.
- Ease scroll over 1.5 to 4 seconds per leg, with roughly 1 second of identical hold frames at each end.
- Move the cursor over 0.9 to 1.3 seconds. For typing, add one character and capture enough frames for readable input, normally three to six frames per character.
- Implement waits as tick, screenshot, inspect, repeat. A plain `waitFor` stalls the frame clock and cuts the video, and a timed-out predicate aborts the run.
- Preserve elapsed playback time during waits and animations. Continue fresh captures through quiet intervals, where identical hashes are expected; advance a site's real animation with tick-and-capture frames. Every planned second contributes 60 output frames.
- Drop frames before the first real paint, then shift every chapter timecode by the same amount.
- Keep output dimensions even, for example 1728x1080. The helper crops odd dimensions by one pixel and encodes H.264 yuv420p with fast start.
- Check hashes of adjacent frames. Moving intervals should be meaningfully unique; deliberate holds should be identical. `mpdecimate` under-reports on sparse pages, so do not gate on it.
- Build only after the captured frame count reaches the planned frame budget. The helper rejects a frame-locked video whose encoded duration differs from `expected_duration_seconds` by more than `duration_tolerance_seconds`, default 0.25 seconds.
- Expect capture to run slower than playback. At roughly 7 captured frames per second, 1,800 output frames take about 4.5 minutes to collect.
- Derive stills directly from the frame directory so screenshots and chapter frames cannot drift.

## Gotchas

- After `navigate_page`, assert the page URL is still the intended host. Consent, login, and geographic interstitials redirect off-origin and every later assertion then points at the wrong page.
- A consent wall follows geography, not locale, and can flip between runs. Match visible choices by meaning, record which one appeared, and pre-seed the consent cookie when it keeps costing rounds.
- A canvas or WebGL surface can remain unpainted headless while the DOM is correct. Nudge it through a small visible interaction, and reload the whole attempt if pixels remain blank.
- App chrome can carry the same units as the feature. A map scale bar reading `500 km` satisfies a `km` regex, so constrain assertions by content and position.
- Never wait on network idle. An SPA that polls never reaches it. Wait on visible text or a specific visible state.
- `wait_for` takes `text` as an array. A bare string throws InputValidationError.
- Old forms may use `<input type="submit" value="Foo">`; inspect element type and value in the snapshot rather than looking for a button role.
- A link styled as disabled can still receive a click. The click succeeds, nothing happens, and the next wait times out pointing at the wrong step. Assert enabled semantics and the expected state change.
- If a parent intercepts a click, click the intercepting element identified by the fresh snapshot and screenshot rather than hiding it.
- Close a modal or drawer by pressing Escape first, then through its own visible control. Confirm that control sits inside the viewport before clicking, because an off-screen control still resolves in the snapshot and still fails the click.
- Hidden nodes still appear in a snapshot and in an `evaluate_script` count, so a hidden tab or a loading grid reports ready. Pair counts with visibility or rendered text.
- An `aria-label` can contain the current value, for example `Destination London, United Kingdom`. Match a stable prefix and re-snapshot rather than trusting a label that mutates.
- Empty `innerText` on visible SVG or image content means you assert on pixels, not on text.
- With no stable selector, read `document.elementFromPoint(x, y)` through `evaluate_script`, climb to the intended visible control, and act on the uid the fresh snapshot gives that element.
- Hover-revealed actions exist in the DOM for every card in a grid. Scope to the intended visible card.
- Infinite scroll grows only at the bottom. After each leg, wait for `scrollHeight` or the real result count to grow, or you scroll the same place twice.
- Assert auto-dismissing toasts immediately, or you will miss one and call it missing.
- Custom controls often use `role="button"` on a `div` or `tr`. Map roles from the snapshot instead of looking for a `button` tag.
- Drive a native `<select>` with `fill`, passing the option text as the value.
- Client-side search covers loaded rows only. Use the authoritative backend path for completeness.
- `close_page` leaves no page selected, so every later call errors until `select_page` picks one. Close your pages at the end of the run, then select what remains.
- Report chips and thumbnails wrap, no horizontal sliders, and nothing auto-scrolls the page during playback. Video and stage remain decoupled: thumbnails and arrows change the stage, playback changes the chip highlight, and only a chip or `play from here` seeks the video. Keep all of that when extending.
