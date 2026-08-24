---
name: html-planning
description: "Plan something by interviewing the user through an HTML page instead of the terminal. Trigger /html-planning, 'plan it in html'."
---

Run `/grilling` and follow all of it. Already grilling → just keep going. This only changes where the questions land.

## The one override

The whole frontier ships as one HTML page instead of one question at a time in the terminal. The page is the workspace and the input surface, the terminal carries one line per round.

Don't invent questions to fill a page. The frontier decides how many there are.

## The file

`~/.claude/html-planning/<topic-slug>.html`, one file per topic, same path for the whole plan.

File already exists → read it first. Its `DECIDED` and `HISTORY` consts are the source of truth: rebuild the tree from them and resume. Never re-ask what `HISTORY` already answers.

## A round

1. Copy [`template.html`](template.html) to the file. Fill `TOPIC`, `DECIDED`, `HISTORY`, `Q`. Leave the machinery below them untouched.
2. Round 1 only: `open -a "Google Chrome" "file://<path>"`. The plan page is the only thing you ever open. Nothing else gets a tab.
3. Later rounds: rewrite the file, print one line ("round 3, 6 questions, refresh"). The tab is already open.
4. The user hits Copy Answers and pastes the markdown back. Move that round into `HISTORY`, promote what is settled into `DECIDED`, recompute the frontier, regenerate.

## Writing the questions

- Exactly one `rec: true` per question. That is grilling's `➡️` on the page.
- Wireframe cards (`cards: true`) when the options differ in shape and words cannot carry it. Otherwise plain text options.
- Every question takes free text on top of its options, so options are a starting point, not a cage.
- Sections group a long round.

## Artifacts

Some questions need a look, a feel, a motion, a layout. Build the thing and put it *inside* the plan page, as part of the question.

- Never open an artifact in its own tab, window or preview. The user asked for a plan, not a demo. A stray tab is an interruption.
- Keep it beside the plan as `~/.claude/html-planning/<topic-slug>-<what>.html` and embed it: `n:` renders raw HTML, so `<iframe src="<topic-slug>-<what>.html" style="width:100%;height:760px;border:1px solid var(--line);border-radius:10px">` drops a live, playable artifact straight into the question.
- Interactive goes in as an iframe. A static comparison can go in as `<img>`.
- `/throwaway-prototype` builds one fast, with two overrides. Save it beside the plan as above, and skip its "open in Chrome once" step. It gets embedded, not opened.
- One artifact per question. Variants belong to a switcher inside the artifact, not to four separate files.

## The end

Frontier empty → regenerate once more: questions out, the plan itself in, free-form per `/html` with the same palette and fonts. Then stop editing the file, and say so in the terminal.
Called from a spec flow → the user approves the plan page before any spec gets written.
