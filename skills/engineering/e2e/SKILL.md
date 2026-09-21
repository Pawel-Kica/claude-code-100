---
name: e2e
description: Drive the real app end to end, fix what breaks, re-verify. Trigger 'e2e it', 'test it for real'.
---

Give it a goal. Drive the real thing until you can answer whether it works. Fix what breaks, verify the fix, answer.

## Scope

- Goal is whatever the user said, in prose
- Args may be a spec, PRD or plan path: read it for intent, the file is not the target
- Nothing said: scope from `git status` + `git diff --stat`, or from the checklist you wrote earlier in the conversation

## Wrong surface

The most common way this skill lies:
- green on a page you were logged out of, on the tab next to the right one, on a modal that never opened. A `target=_blank` click prints `Open tabs` and stays on the old tab, `tab-select <n>` before asserting
- URL is the one you meant, and you are the user you meant to be
- assert on state you watched change, then reload and assert it survived
- what you asserted on is the feature, not a lookalike: editor source text, hidden span, the component's own progress label
- poll a count of the real result nodes, `locator('.row:visible').count()` in `run-code`. Never the absence of a spinner, never the disappearance of the previous step, an SPA keeps it mounted
- same nodes reused for a new result: the count is green before the numbers change. Click and wait in one `run-code`, on a value bound to its node: `page.locator('#list li').first().filter({hasText: /^20$/}).waitFor({timeout: 5000})`. `getByText('20')` finds the old 20 in the next row, exact or not
- the DOM can be right while the pixels are wrong. On canvas, WebGL, maps and charts no DOM assertion proves the render, take `screenshot <selector>` and look at it

## Drive

Testing is always `playwright-cli`. A Playwright script is for high-quality capture, nothing else.

**`playwright-cli`**, headless with an in-memory profile by default, never `--headed`. The driver for every verification run, for Screenshots and for Record:
- clicking through by hand, reading the snapshot, checking `console` and `requests`. No script to write
- a long or fiddly flow is not a reason to switch. Click it, don't script it
- working dir from `mktemp -d /tmp/e2e-XXXXXX`, and run every command from inside it: the CLI drops `.playwright-cli/` into cwd, and that stays out of the repo. Timestamps collide when agents start together
- your own named session on every command, `-s=<working dir basename>`. `open <url>` once, then `resize 1728 1117`, then `goto` for every later URL: a second `open` on the same session silently replaces the browser, cookies and viewport gone. `close` it when the run ends, it lingers otherwise. `list` shows every agent's sessions, so `close-all` and `kill-all` are off limits
- a click returns before delayed UI lands, and there is no wait command. Wait with `run-code 'async page => page.getByText("Saved").waitFor({timeout: 5000})'`, it exits 1 on timeout. `run-code` also clicks, waits and reads in one call, which is how you catch a toast, and `--raw run-code` prints what it returns. No `expect` or `require` in there, assert with `waitFor` or `page.waitForFunction(fn, null, {timeout: 5000})`, the `null` matters
- single-quote the code and use double quotes inside the JS. In zsh double quotes `$x` and backticks expand and the call returns empty with exit 0. Both quote kinds needed: `cat > code.js <<'EOF'`, then `run-code --filename=code.js`
- a target that is not in the DOM yet fails in 0.2s with `does not match any elements`, there is no auto-wait for it. A covered or hidden one burns the full 5s. `click` has no `--force` or `--timeout`, those go through `run-code` with `locator.click({...})`
- exit 1 is the failure signal, and a pipe eats it: `| head` reports head's exit code. Redirect to a file, or read `${pipestatus[1]}`
- target by snapshot ref, CSS selector, or a locator like `getByRole('button', { name: 'Save' })`. Refs die on navigation, take a new `snapshot`
- actions print a link to the snapshot file, bare `snapshot` prints it all inline, 16k lines on a Wikipedia article. On a big page: `snapshot --depth=4` for the outline, then `snapshot "<unique selector>"`, a narrow `find --regex "..."`, or `snapshot --filename=x.yml` and grep it. `find` with no match exits 0, so it cannot gate a step
- `--raw` prints only the value, as a JSON string on one line, `| jq -r .` for real lines. It also hides `Page URL` and `Modal state`, so leave it off `goto` and off any click that may open a dialog
- `playwright-cli --help <command>` when unsure of a flag

**Playwright script**, always `chromium.launch({headless: true})`, never `headless: false`. high-quality capture only, the CLI's video tops out at 25fps:
- global install, run as `NODE_PATH=$(npm root -g) node script.js`, CommonJS. Same prefix for the check: `NODE_PATH=$(npm root -g) node -e "require.resolve('playwright')"`, bare `node` won't find it, and `playwright --version` can be the Python package
- same `/tmp` working dir as the run it belongs to

Then:
- 1728x1117, a MacBook Pro 16 inch at default scaling. Mobile pass when layout is in scope: a second session with `open <url> --device="iPhone 17 Pro"` (DPR 3, touch, viewport 402x681). `resize 402 874` alone is a narrow desktop with hover and no touch. Device names are case-sensitive and a wrong one silently gives desktop, check `eval '() => devicePixelRatio'`. Screenshots stay CSS-pixel sized, `--hires` for device pixels
- Someone else's site is not a contract. Its DOM can differ between two loads in the same browser, so scrape `innerText` off a coarse container with `--raw eval` and regex it instead of trusting a selector. A regex miss prints `undefined` with exit 0, index the match (`.match(/x/)[1]`) so it throws
- Logged-out or second-user flows: a second named session, don't log the main one out
- Behaviour a screenshot can't catch (sub-second flash, duplicate requests, race): `run-code 'async page => page.addInitScript(() => {...})'` with a MutationObserver or rAF sampler, or a patched `window.fetch`, then `reload` (it applies from the next load on, for the rest of the session) and read the counts back with `eval`. For request counts without a patch: `requests --clear` before the action, `requests --filter="<regexp>"` after. The list survives `reload`, and the document itself only shows with `--static`
- Local dev without hot reload keeps serving the old bundle. After a code or build change, `reload` and take a new `snapshot` before continuing
- No UI for the change (scheduled task, API only, webhook): drive it anyway, say that is what you did. `curl` the real endpoint on the running server first, else call the service function in the app's own shell. Assert on the response and on what it changed

## Map first

- Multi-step flows cost 30-60s per attempt. Throwaway probe run first: `snapshot --boxes` for roles, refs and geometry, plus one `eval` that dumps every visible input, button and `[role=button]` with its class, placeholder, value and text. Then do the real run against known targets. Two fields and a submit button do not need this
- Keep the probe commands and re-run them whenever a screenshot disproves an assumption. On a public site expect two or three rounds, the first one usually only maps the consent wall
- Every probe round replays the flow from the top, login included. Batch the open questions into one round that dumps element geometry, the scrolling container and the wait predicate together, rather than paying a fresh login per question
- Validate every wait predicate in the probe. A predicate that never resolves does not fail fast, it stalls or records dead frames
- Recording blind bakes the failures into the artifact
- Probe with throwaway inputs, then run with a fresh one. Backends cache, and a cached response skips the very step you wanted to show

## Fix

- Fix by default, re-verify the failed step, carry on
- try/catch on an optional step turns a hard failure into a lie. Log every skip, keep its timeout short, and if the skipped one was the payoff, run it again
- A step that will not work after two tries is a signal to throw the whole attempt away and rerun clean (`close` the session and `open` a new one), not to patch around it
- Stop and report: migrations, schema, architecture, anything another agent is mid-flight on
- Logs: console and network first, then the project's own log commands

## Test data

- Reuse what exists, never delete. A destructive feature gets tested on data you created in this run
- Mutate and restore: rename, verify, rename back
- Seed through the app's own API or service, not direct DB writes. Those skip side effects and fake a broken UI
- Back up before any destructive DB op
- External test sends (email, SMS, WhatsApp) go to the user's own authorized endpoints

## Answer

Answer the question that was asked: what works, what didn't, what you fixed. No step tables, no checklists.

## Artifacts, on request only

Four modes:
- **Default**, no artifacts. The prose answer is the deliverable. This is what runs unless the user asked for more
- **Screenshots**, **Record** and **high-quality**, one self-contained HTML page each. Picked by what the user asked for, described below

The page is light theme. Never hand-roll it: fill `~/.claude/skills/e2e/report-template.html`, replacing `__TITLE__`, `__SUB__`, `__VERDICT__`, `__DATA__` (steps array, shape in the comment above it) and `__VIDEO__` (data URI, or `""` for Screenshots mode, which drops the video and chapters by itself). It is the starting point, not a cage: extend it when the run needs more, several recordings, features side by side, anything the six-step strip cannot carry.

And:
- everything lands in your `/tmp` working dir. Never write into the repo
- name it after the run, not the topic, or a parallel agent overwrites you
- hand back the path and `pbcopy` it. Open it with `open -a "Google Chrome"` only if you are the one talking to the user, not when an orchestrator will present it. Verify it rendered: open it in a throwaway session with `playwright-cli -s=<name>-report open file://<path>` and look at a `screenshot`
- base64-inline every image and the MP4 into the one file
- stage images full source resolution (1728px capture stays 1728px) JPEG q85, thumbnails ~380px. Never downscale the stage, retina displays make 1280px blurry. PNG only when the pixels are the point
- `max-height: 76vh; object-fit: contain`, crops and full-page shots share the same slot
- the captions carry the answer. If the question was "how far is it", the number belongs in the caption
- stills come from the same run as the video, stamped with their frame the moment the wait resolves, before any hold. Otherwise "play from here" lies
- include the requested screenshots inline in the final response, and link the self-contained report next to them

**Screenshots** ("show" is the main trigger; also "screenshots", "generate html"): `screenshot --filename=<abs path>` into a dir that exists, `--full-page` for the whole document, a ref or selector for one element, not both. Close overlays and sticky bars before `--full-page`, fixed elements paint once over the first viewport.

**Record** ("record it"; "record annotate" is the same mode): `playwright-cli` video, driving live and reacting as you go.

- Record runs at 1728x1080, stills included: `resize 1728 1080`, then `video-start run.webm --size=1728x1080`. A size with a different aspect than the viewport gets a grey bar, and no `--size` gives 800px
- `video-show-actions --duration=900` draws the cursor, a click dot and a callout per action, without it the video is unreadable. The callout prints typed values, so `video-hide-actions` around a secret, and again after `video-stop`: it stays on and slows every action
- open every step with `video-chapter "Title" --description="..." --duration=1500`: it blurs the page and centers a card, a short title plus one line on what the step proves. It blocks for its duration. No step goes uncarded, the cards are what make the video read without narration
- every wait gets `{timeout: 5000}`, a 45s catch is 45s of dead frame baked into the file
- take the stills in the same run with `screenshot --filename=`, and log the seconds since `video-start` for each: `python3 -c 'import time;print(time.time())'` right after `video-start` returns, again before each `screenshot`, subtract. Chips seek to where the step starts, so give them the time of its `video-chapter` call. Check one timecode with `ffmpeg -ss <t> -i run.mp4 -frames:v 1` and look at the frame
- `video-stop` writes the file. Transcode WebM to MP4 (`-c:v libx264 -pix_fmt yuv420p`), confirm the duration with `ffprobe`, and check the frame at 0.5s shows real content, not a blank first paint
- 25fps wallclock, and during a scroll only ~2 frames in 3 are new. Enough to show a flow, not to show motion

**high-quality** ("high-quality", or motion is the subject: animation, scroll, transition):
- map the run to a playback timeline before capture. Give each action, wait, animation, inspection and hold enough screen time to be understood at normal viewing speed. Let the flow determine the total duration
- set `expectedDurationSeconds` in the capture script and derive `frameBudget = Math.ceil(expectedDurationSeconds * 60)`. A short form can be ~15s; a long drawing can be 60-90s. Examples, not limits
- a Playwright script, not the CLI. One fresh screenshot per output frame after two rAFs, encoded CFR 60
- draw a cursor or the video is unreadable: a `position:fixed`, `pointer-events:none` div added via `addInitScript` so it survives navigation, moved together with a real `mouse.move` so hover states are genuine
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

- After `goto`, read the `Page URL` line. It exits 0 on an off-origin redirect (yahoo.com lands on consent.yahoo.com) and every selector then points at the wrong page. A bare domain gaining `www.` is normal. `goto` waits for the load event, an ad-heavy site takes 30s
- Most consent walls are in-page dialogs on the right URL, so the URL check misses them: `find --regex "Accept all|Zaakceptuj"`. The wall comes in the geography's language, not your locale, and can flip between runs. Match a list of texts and log which one fired
- Pre-seed the consent cookie to skip the wall: `open` with no URL, `cookie-set <name> <value> --domain=.site.com`, then `goto`. Get the value by accepting once and `cookie-get`
- A public site that times out or 403s headless is bot protection. Report it, don't fight it
- A canvas never appears in `snapshot`, and it can stay unpainted headless while the DOM is correct. Gate a 2d canvas on a non-zero pixel count from `eval` with `getImageData`, then look at `screenshot <selector>`. Blank: nudge it (small drag, zoom click), and if that fails reload the whole attempt
- App chrome carries the same units as your feature. A map scale bar reading `500 km` satisfies a `km` regex. Constrain on content and position. A strict mode violation listing two nodes is the warning, don't silence it with `.first()`
- Inside `run-code` and capture scripts never `waitForLoadState('networkidle')`, an SPA that polls never reaches it. Wait on text or a visible selector
- `<div role="button">`, `<tr role="button">` and `<input type="submit" value="Foo">` all show as `button` in the snapshot. Click the ref or `getByRole('button', { name: 'Foo' })`. A `button` CSS selector misses all three
- A link with a `disabled` class still clicks: exit 0, nothing happens, and the next wait times out pointing at the wrong step. In the snapshot it lacks `[cursor=pointer]`. After a click that should change something, read the thing it changes
- A click that dies after 5s with `<x> intercepts pointer events` names the element to click instead. Click that ancestor's ref (`li` wrapping its own `a`) rather than hiding it
- A modal or drawer swallows later clicks and hovers, 5s each, and the snapshot still lists the controls under it. `press Escape` exits 0 whether or not anything closed, so snapshot the dialog afterwards, then click its own close button. If that fails with `outside of the viewport` (`snapshot "<dialog>" --boxes` shows x at the viewport width), force won't help, use `eval 'el => el.click()' <ref>`. Last resort `eval 'el => el.style.display="none"' "<overlay>"`, never remove the node
- Count with `locator('.res:visible').count()`. Plain `count()`, `querySelectorAll` and even `innerText` all read `display:none` nodes, so a hidden tab, a loading grid or a toast that already left reports ready. The snapshot and `find` show visible nodes only and merge sibling spans, don't count there
- An `aria-label` often bakes in the current value (`Destination London, United Kingdom`). Target it with `[aria-label^='Destination']` or `getByRole('button', { name: /^Destination/ })`. The exact name and the snapshot ref both die the moment the label changes
- SVG `<text>` shows in the snapshot and `getByText` clicks it, but `innerText` is `undefined` on SVG elements, read `textContent`. Text baked into an image or canvas has no DOM, assert on the screenshot
- With no stable selector anywhere (hashed CSS modules, canvas hit areas), click by coordinates, and read the rect and click in the same `run-code`: `const b = await page.locator('svg').nth(0).boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2)`. Coordinates are viewport-relative, a rect read before a scroll misses silently with exit 0
- Hover-revealed actions are absent from the snapshot until you `hover` the card. `hover <card>`, then `click ".act:visible"` or the ref from a new `snapshot`. The hover survives between commands, the ref does not survive hovering elsewhere
- Infinite scroll: one `run-code` loop that sets the container's `scrollTop = scrollHeight`, then `waitForFunction` until `scrollHeight` grows, break on timeout. `mousewheel` scrolls what is under the pointer, `hover` the container first or it moves the document and exits 0
- An auto-dismissing toast is gone before your next command, a `click` alone takes 0.7-1.2s. Click, `waitFor` and read it in one `run-code`, or grep the snapshot file the click printed
- Drive a native `<select>` with `select <target> <value or exact label>`. A near miss costs a 5s timeout with `did not find some options`
- A `window.confirm`, `alert` or `prompt` fails every later command with `does not handle the modal state`. The click that opened it exits 0 and prints `Modal state`, answer with `dialog-accept`, `dialog-accept "text"` for a prompt, or `dialog-dismiss`
- File input: `click` it, then `upload <path>`. An open chooser blocks every command until a file is uploaded, there is no cancel. Hidden input or no chooser wanted: `run-code` with `page.locator('#up').setInputFiles('/abs/path')`
- Inside an iframe use the snapshot ref (`f1e2`) or `frameLocator('iframe').getByRole(...)`. A plain selector says `does not match any elements`, and `eval` with no target runs in the top frame only. Shadow DOM needs nothing, targets pierce it
- Refs change shape after `reload` (`f2e19`), copy them from the newest snapshot. `eval <func> <target>` is strict, a target matching several nodes exits 1, put the `querySelectorAll` inside the function
- Client-side-only search returns nothing for rows not on the loaded page. If typing fires no request (`requests --filter=<api>`), it is client-side: load more or paginate first, then search
- Report template: chips and thumbs both wrap, no horizontal sliders, nothing auto-scrolls the page during playback. Video and stage are decoupled: thumbs/arrows change only the stage, playback moves only the chip highlight, only a chip or "play from here" seeks the video. Keep all of that when extending
