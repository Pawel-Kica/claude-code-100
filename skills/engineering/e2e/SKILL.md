---
name: e2e
description: "Verify a change really works by driving the real app end to end, fix what breaks, re-verify. Browser, or the real code path when there is no UI. Trigger /e2e, 'e2e it', 'test it for real'."
---

Give it a goal. Drive the real thing until you can answer whether it works. Fix what breaks, verify the fix, answer.

## Scope

- Goal is whatever the user said, in prose
- Args may be a spec, PRD or plan path: read it for intent, the file is not the target
- Nothing said: scope from `git status` + `git diff --stat`, or from the checklist you wrote earlier in the conversation

## Wrong surface

The most common way this skill lies:
- green on a page you were logged out of, on the tab next to the right one, on a modal that never opened
- URL is the one you meant, and you are the user you meant to be
- assert on state you watched change, then reload and assert it survived
- what you asserted on is the feature, not a lookalike: editor source text, hidden span, the component's own progress label
- poll a count of the real result nodes. Never the absence of a spinner, never the disappearance of the previous step, an SPA keeps it mounted
- same nodes reused for a new result: poll a discriminating value, the count is green before the numbers change
- the DOM can be right while the pixels are wrong. On canvas, WebGL, maps and charts no DOM assertion proves the render, look at the screenshot

## Drive

Testing is always Chrome DevTools MCP. Playwright is for artifacts, nothing else.

**MCP** (`mcp__chrome-devtools__*`), always headless. The driver for every verification run:
- clicking through by hand, reading the a11y tree, checking console and network. No script to write
- a long or fiddly flow is not a reason to switch. Click it, don't script it
- one shared browser instance. Running alongside other agents, don't touch it, they will steal each other's tab
- writes only inside its workspace roots, so it cannot save to `/tmp`. A shot you keep inside a workspace root is still MCP's job

**Playwright**, always `chromium.launch({headless: true})`, never `headless: false`. Artifacts only:
- the recording, and the kept screenshots that go with it, when the destination is outside the MCP workspace roots
- parallel runs, where the one shared MCP instance would collide. Not a preference, the only other exit
- global install, run as `NODE_PATH=$(npm root -g) node script.js`, CommonJS. Same prefix for the check: `NODE_PATH=$(npm root -g) node -e "require.resolve('playwright')"`, bare `node` won't find it, and `playwright --version` can be the Python package
- working dir from `mktemp -d /tmp/e2e-XXXXXX`. Timestamps collide when agents start together

**TESTING IS ALWAYS CHROME DEVTOOLS MCP. PLAYWRIGHT IS FOR GENERATING ARTIFACTS ONLY.**

Then:
- 1728x1117, a MacBook Pro 16 inch at default scaling, `deviceScaleFactor: 1`. Mobile pass 402x874, iPhone 17 Pro, when layout is in scope
- Someone else's site is not a contract. Its DOM can differ between two loads in the same browser, so scrape `innerText` off a coarse container and regex it instead of trusting a selector
- Logged-out or second-user flows: a fresh context, don't log the main one out
- Behaviour a screenshot can't catch (sub-second flash, duplicate requests, race): `initScript` with a MutationObserver or rAF sampler, or patch `window.fetch` and read the counts back
- No UI for the change (scheduled task, API only, webhook): drive it anyway, say that is what you did. `curl` the real endpoint on the running server first, else call the service function in the app's own shell. Assert on the response and on what it changed

## Map first

- Multi-step flows cost 30-60s per attempt. Throwaway probe run first, dump every visible input, button and `[role=button]` with its class, placeholder, value and text, then write the real script against known selectors
- Keep the probe script alive and re-run it whenever a screenshot disproves an assumption. On a public site expect two or three rounds, the first one usually only maps the consent wall
- Validate every wait predicate in the probe. A predicate that never resolves does not fail fast, it stalls or records dead frames
- Recording blind bakes the failures into the artifact
- Probe with throwaway inputs, then run with a fresh one. Backends cache, and a cached response skips the very step you wanted to show

## Fix

- Fix by default, re-verify the failed step, carry on
- try/catch on an optional step turns a hard failure into a lie. Log every skip, keep its timeout short, and if the skipped one was the payoff, run it again
- A step that will not work after two tries is a signal to throw the whole attempt away and rerun clean, not to patch around it
- Stop and report: migrations, schema, architecture, anything another agent is mid-flight on
- Logs: console and network first, then the project's own log commands

## Test data

- Reuse what exists, never delete
- Mutate and restore: rename, verify, rename back
- Seed through the app's own API or service, not direct DB writes. Those skip side effects and fake a broken UI
- Back up before any destructive DB op

## Answer

Answer the question that was asked: what works, what didn't, what you fixed. No step tables, no checklists.

## Artifacts, on request only

One self-contained HTML page, light theme. Never hand-roll it: fill `~/.claude/skills/e2e/report-template.html`, replacing `__TITLE__`, `__SUB__`, `__VERDICT__`, `__DATA__` (steps array, shape in the comment above it) and `__VIDEO__` (data URI, or `""` for screenshots-only, which drops the video and chapters by itself). It is the starting point, not a cage: extend it when the run needs more, several recordings, features side by side, anything the six-step strip cannot carry.

And:
- everything lands in your `/tmp` working dir. Never write into the repo
- name it after the run, not the topic, or a parallel agent overwrites you
- hand back the path and `pbcopy` it. Open it with `open -a "Google Chrome"` only if you are the one talking to the user, not when an orchestrator will present it. Verify it rendered with your own Playwright
- base64-inline every image and the MP4 into the one file
- stage images full source resolution (1728px capture stays 1728px) JPEG q85, thumbnails ~380px. Never downscale the stage, retina displays make 1280px blurry. PNG only when the pixels are the point
- `max-height: 76vh; object-fit: contain`, crops and full-page shots share the same slot
- the captions carry the answer. If the question was "how far is it", the number belongs in the caption
- stills come from the same run as the video, stamped with their frame the moment the wait resolves, before any hold. Otherwise "play from here" lies

**Screenshots only** ("show me", "generate html").

**MP4** ("record it"): Playwright `recordVideo`, driving live and reacting as you go.

- `recordVideo: {dir, size}` goes on `newContext`, not `launch`. The file appears only after both `page.close()` and `context.close()`. One run can leave several webm files, take the largest and confirm the duration with `ffprobe`
- transcode WebM to MP4, and check the frame at 0.5s shows real content, not the blank first paint
- every action gets `{timeout: 5000}`, a 45s catch is 45s of dead frame baked into the file
- draw a cursor or the video is unreadable: a `position:fixed`, `pointer-events:none` div added via `addInitScript` so it survives navigation, moved together with a real `mouse.move` so hover states are genuine
- take the stills in the same run, they do not stall the video clock
- 25fps wallclock, and during a scroll only ~2 frames in 3 are new. Enough to show a flow, not to show motion

**Frame-locked** ("frame locked", or motion is the subject: animation, scroll, transition):
- map the run to a playback timeline before capture. Give each action, wait, animation, inspection and hold enough screen time to be understood at normal viewing speed. Let the flow determine the total duration
- set `expectedDurationSeconds` in the capture script and derive `frameBudget = Math.ceil(expectedDurationSeconds * 60)`. A short form can be ~15s; a long drawing can be 60-90s. Examples, not limits
- one fresh screenshot per output frame after two rAFs, encoded CFR 60
- wrap every `evaluate` in try/catch with a fixed ~16ms fallback tick. Navigation destroys the execution context and kills the capture mid-run
- ease the scroll, 1.5-4s per leg, ~1s hold at each end. Cursor travel 0.9-1.3s, typing 3-6 frames per character so input stays readable
- every wait is tick-and-poll, keep shooting while you poll. A plain `waitFor` stalls the frame clock and cuts the video
- a poll that times out aborts the run. Left alone it keeps shooting a page that never arrived
- preserve playback time through waits and animations. Continue fresh captures through quiet intervals, where identical hashes are expected. Every planned second contributes 60 output frames
- drop the frames before the first real paint, then shift every recorded timecode by the same offset or the chapters point at the wrong moment
- `ffmpeg -y -framerate 60 -i frames/f_%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart out.mp4`, even viewport dims (1728x1080)
- check with md5 of adjacent frames. Unique should land near your moving time x 60, holds are correctly identical. `mpdecimate` under-reports on sparse pages, don't gate on it
- encode only after the frame count reaches `frameBudget`. After encoding, use `ffprobe` to assert duration is within 0.25s of `expectedDurationSeconds`; a mismatch aborts the run
- capture runs ~7 frames/sec at 1728x1080, so 1800 frames is ~4.5 min
- stills come straight out of the frame dir, no separate screenshot pass

## Gotchas

- After `goto`, assert `page.url()` is still the host you asked for. Consent, login and geo interstitials redirect off-origin and every selector then points at the wrong page
- A consent wall comes in the geography's language, not your `locale`, and can flip between runs. Match a list of texts and log which one fired. Pre-seeding the consent cookie skips it entirely
- A canvas or WebGL surface can stay unpainted headless while the DOM is correct. Nudge it first (small drag, zoom click), and if that fails reload the whole attempt. `deviceScaleFactor: 2` makes it worse
- App chrome carries the same units as your feature. A map scale bar reading `500 km` satisfies a `km` regex. Constrain on content and position
- Never `waitForLoadState('networkidle')`, an SPA that polls never reaches it. Wait on text or a visible selector
- MCP `wait_for` takes `text` as an array, a bare string throws InputValidationError
- Old-school forms: the primary action is `<input type="submit" value="Foo">`. `text=Foo`, `button` and `role=button` all miss it
- A link with a `disabled` class is still clickable to Playwright. The click succeeds, nothing happens, and the next wait times out pointing at the wrong step
- Click intercepted by a parent (`li` wrapping its own `a`): click the intercepting ancestor, don't hide it
- Modals swallow every later hover and `Escape` often does nothing. Find the modal's own close button
- `locator.count()` counts `display:none` nodes, so a hidden tab or a loading grid reports ready. Assert on `innerText` or `isVisible()`
- An `aria-label` often bakes in the current value (`Destination London, United Kingdom`). Match with `^=`, and hold an element handle rather than re-resolving a label that mutates
- `innerText` empty on something you can plainly see means SVG or an image. Assert on the screenshot, not the text
- No stable selector anywhere (SVG cards, hashed CSS modules): `document.elementFromPoint(x, y)`, climb parents to the card, click by coordinates
- In a card grid, hover-revealed actions exist in the DOM for every card. Use `:visible`, never `.first()`
- Infinite scroll only grows the document once you hit the bottom. After each leg wait for `scrollHeight` to grow, or you scroll the same place twice
- App overlays (notification drawer, toast) swallow clicks: inject `display:none`. Removing the node can break the page
- Auto-dismissing toasts: assert immediately, or you will miss it and call it missing
- Custom controls are often `<div role="button">` or `<tr role="button">`. `locator('button')` won't see them
- Native `<select>`: `selectOption()`, else set `.value` and dispatch `change`
- Client-side-only search returns nothing for rows not on the loaded page. Read the source before trusting an empty result
- Report template: chips and thumbs both wrap, no horizontal sliders, nothing auto-scrolls the page during playback. Video and stage are decoupled: thumbs/arrows change only the stage, playback moves only the chip highlight, only a chip or "play from here" seeks the video. Keep all of that when extending
