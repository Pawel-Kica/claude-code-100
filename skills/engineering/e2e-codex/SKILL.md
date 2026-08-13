---
name: e2e-codex
description: "Verify a real app end to end through Codex Desktop Browser, fix failures, and re-verify with runtime and visual evidence. Trigger /e2e-codex, 'e2e it through codex', or requests to record, frame-lock, or generate an HTML proof report."
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

Testing is always Codex Desktop Browser for UI flows.

Use the `browser:control-in-app-browser` skill. Read its complete `SKILL.md` before the first browser action and follow its setup, safety, screenshot, local-development, and cleanup instructions.

Select the in-app Browser explicitly with `agent.browsers.get("iab")`. Keep one persistent browser binding and reuse controlled tabs. When it is unavailable, report that this skill requires Codex Desktop Browser.

Use the Browser APIs by purpose:

- `tab.playwright`: semantic locators, DOM snapshots, exact waits, and read-only evaluation.
- `tab.dom_cua` or `tab.cua`: visible user interactions.
- `tab.screenshot`: pixel evidence and recording frames.
- `tab.dev.logs`: console evidence.
- Browser viewport capability: 1728x1117 desktop at default scaling; 402x874 mobile when responsive layout is in scope. Reset it at the end.

Use one controlled Browser run. Keep each action grounded in fresh visible state. After clicking, scrolling, typing, or navigation, collect the cheapest evidence that proves its effect before continuing.

Then:

- Someone else's site is not a contract. Its DOM can differ between loads, so read visible text from a coarse container and match meaning instead of trusting a fragile selector.
- Logged-out or second-user flows use the correct visible sign-out and sign-in path, or an already-open tab with the intended identity. Assert identity after switching.
- Behaviour a screenshot cannot catch, such as a sub-second flash, duplicate requests, or a race, uses a tick-and-sample loop with repeated DOM reads and screenshots.
- No UI for the change, such as a scheduled task, API, or webhook: call the real endpoint or service path and assert the response plus what it changed.

## Map first

- Multi-step flows cost time. Run a throwaway probe first and dump visible inputs, buttons, links, dialogs, placeholders, values, and text from a DOM snapshot.
- Keep the probe state available and remap whenever a screenshot disproves an assumption.
- Validate every wait predicate in the probe. A predicate that cannot resolve aborts the attempt.
- Recording starts only after the probe is trustworthy.
- Probe with throwaway inputs, then run with a fresh discriminating value. Cached responses can skip the step intended for proof.

## Fix

- Fix by default, re-verify the failed step, then carry on through the full user-visible path.
- A skipped optional step is logged explicitly with a short timeout. If it was the payoff, rerun it.
- A step that fails twice triggers a clean remap and a fresh full attempt.
- Stop and report schema redesign, architecture changes, migrations with uncertain data impact, and anything another agent is actively changing.
- Logs: Browser console and visible state first, then the project's own logs.

## Test data

- Reuse what exists.
- Mutate and restore reversible state, then verify the restoration.
- Seed through the app's API or service so side effects remain real.
- Back up persistent data before a broad write.
- Use the user's own authorized test endpoints for external test sends.

## Answer

Answer the question asked: what works, what did not, what was fixed, and the strongest evidence. Keep the handoff concise.

## Artifacts, on request only

One self-contained HTML page, light theme. Fill `assets/report-template.html` through `scripts/build-report.mjs`; the helper replaces `__TITLE__`, `__SUB__`, `__VERDICT__`, `__DATA__`, and `__VIDEO__`.

And:

- Use the task's declared output directory when available. Otherwise create a fresh `/tmp/e2e-codex-*` run directory. Keep artifacts outside the product repo.
- Name artifacts after the run so parallel attempts stay distinct.
- Base64-inline every image and MP4 into the one HTML file.
- Keep stage images at full source resolution. The helper creates thumbnails at roughly 380px.
- Keep `max-height: 76vh; object-fit: contain`; crops and full-page shots share the same stage.
- Captions carry the answer. If the question was "how far is it", put the number in the caption.
- Stills come from the same run as the video, captured when the wait resolves and before a hold. Chapter timecodes point at those frames.
- Serve the report directory through a temporary localhost HTTP server. Open the report URL in Codex Browser and verify video readiness, screenshots, chapters, gallery controls, overflow, and console errors. Stop the server after verification.
- Include requested screenshots inline in the final response and link the self-contained report.

Write `manifest.json` before capture. Use `"mode": "record"` or `"mode": "screenshots"` matching the user's request. The helper validates the requested mode.

Example record manifest:

```json
{
  "title": "Settings flow",
  "subtitle": "Codex Browser, 1728x1117",
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

Build with:

```bash
node <skill-directory>/scripts/build-report.mjs <run-directory>/manifest.json
```

### Screenshots only

Use for `show me` and `generate HTML`.

- Capture key states through `tab.screenshot()`.
- Set `"mode": "screenshots"` in the manifest.
- Omit frame and video fields. The template removes video and chapters automatically.
- Verify each displayed image is loaded and the gallery controls reach every step.

### MP4

Use for `record it`.

- Test through Codex Browser while saving ordered `tab.screenshot()` bytes as `frames/frame_00000.jpg`, `frame_00001.jpg`, and so on.
- Use `.jpg` for JPEG magic `ff d8 ff` and `.png` for PNG magic `89 50 4e 47`.
- Capture at a steady measured rate, normally 8 to 12 frames per second, and set `capture_fps` to that rate. Encode `output_fps` at 60.
- Keep capturing while polling so waits remain visible in the recording.
- Give every action and payoff wait a short explicit timeout. A timed-out payoff aborts the run.
- Move the CUA cursor along the action path to produce real hover states. Make chapters and captions carry the action context.
- Take stills in the same run. They do not stall the frame sequence.
- Treat a validated, non-empty MP4 embedded as `data:video/mp4;base64,...` as part of completion.
- Inspect the encoded frame at 0.5 seconds and confirm it shows real content.

### Frame-locked

Use for `frame locked`, or when motion itself is the subject: animation, scroll, transition, drag, hover, or typing.

- Map the run to a playback timeline before capture. Give each action, wait, animation, inspection, and hold enough screen time to be understood at normal viewing speed. Let the flow determine the total duration.
- Write `expected_duration_seconds` in the manifest and derive the frame budget as `ceil(expected_duration_seconds * 60)`. A short form can be about 15 seconds; a long drawing can be 60 to 90 seconds. These are examples, not limits.
- Capture one fresh Browser screenshot for every output frame and set both `capture_fps` and `output_fps` to 60.
- After each small motion step, await two `requestAnimationFrame` ticks through `tab.playwright.evaluate`, then capture the frame.
- Wrap the two-rAF tick in a local recovery path with a fixed 16ms fallback. Navigation can replace the execution context between frames.
- Ease scroll over 1.5 to 4 seconds per leg, with roughly 1 second of identical hold frames at each end.
- Move the cursor over 0.9 to 1.3 seconds. For typing, add one character and capture enough frames for readable input, normally three to six frames per character.
- Implement waits as tick, screenshot, inspect, repeat. A timed-out predicate aborts the run.
- Preserve elapsed playback time during waits and animations. Continue fresh captures through quiet intervals, where identical hashes are expected; advance a site's real animation with tick-and-capture frames. Every planned second contributes 60 output frames.
- Drop frames before the first real paint, then shift every chapter timecode by the same amount.
- Keep output dimensions even. The helper crops odd dimensions by one pixel and encodes H.264 yuv420p with fast start.
- Check hashes of adjacent frames. Moving intervals should be meaningfully unique; deliberate holds should be identical.
- Build only after the captured frame count reaches the planned frame budget. The helper rejects a frame-locked video whose encoded duration differs from `expected_duration_seconds` by more than `duration_tolerance_seconds`, default 0.25 seconds.
- Expect Browser capture to run slower than playback. At roughly 7 captured frames per second, 1,800 output frames take about 4.5 minutes to collect.
- Derive stills directly from the frame directory so screenshots and chapter frames cannot drift.

## Gotchas

- After `goto`, assert `tab.url()` is still the intended host. Consent, login, and geographic interstitials can redirect.
- A consent wall follows geography, not locale. Match visible choices by meaning and record which one appeared.
- A canvas or WebGL surface can remain unpainted while the DOM is correct. Nudge it through a small visible interaction and reload the attempt if pixels remain blank.
- App chrome can carry the same units as the feature. Constrain assertions by content and position.
- Poll a specific visible state on SPAs that keep network activity alive.
- Old forms may use `<input type="submit" value="Foo">`; inspect element type and value in the DOM snapshot.
- A link styled as disabled can still receive a click. Assert enabled semantics and the expected state change.
- If a parent intercepts a click, use the visible intercepting element identified by the fresh DOM and screenshot.
- Close modals through their own visible control before later interactions.
- `locator.count()` includes hidden nodes. Pair counts with visibility or rendered text.
- An `aria-label` can contain the current value. Match a stable prefix and keep the current locator grounded.
- Empty `innerText` on visible SVG or image content is a pixel assertion.
- With no stable selector, read `document.elementFromPoint(x, y)`, climb to the intended visible control, then click the verified coordinates through CUA.
- Hover actions can exist for every card. Scope to the intended visible card.
- Infinite scroll grows only at the bottom. After each leg, wait for `scrollHeight` or real result count to grow.
- Close mounted notification drawers and overlays through visible controls.
- Assert auto-dismissing toasts immediately.
- Custom controls often use `role="button"`; map roles from the DOM snapshot.
- Native `<select>` uses `selectOption`.
- Client-side search covers loaded rows only. Use the authoritative backend path for completeness.
- Report chips and thumbnails wrap. Video and stage remain decoupled: thumbnails and arrows change the stage, playback changes chip highlight, and only a chip or `play from here` seeks the video.
