---
name: variants
description: 3-5 variants of anything as a tabbed HTML page. Trigger /variants.
argument-hint: "what to make variants of [how many]"
---

Make variants of `$ARGUMENTS`, show them in one HTML page, user picks.

- count: 3-5 by default, pick what fits. User names a number -> use it.
- variants differ for real: angle, tone, structure, style. Not rewordings of one idea.
- no descriptions, no labels, no recommendation. Just the variants.

Page:
- one standalone `.html`, CSS + JS inline, no build
- tabs: `Variant A`, `Variant B`, ..., last tab `All` (every variant side by side)
- keys `1`-`9` switch tabs, `?variant=` query param keeps the tab on refresh
- each variant has a copy button when it's text
- render each variant as close to its real form as possible (LinkedIn post -> looks like a LinkedIn post, image -> the image)
- style per `/html`

Save to `~/.claude/variants/<slug>.html`. Copy the path per `/clipboard-copy`.

Basic check it loads, nothing more: from `/tmp`, `playwright-cli -s=<slug> open file://<path>`, then `console error`, `screenshot`, `close`. Broken -> fix.

First generation -> `open -a "Google Chrome" <path>`. Later iterations -> don't open, user refreshes.

Reply: path, one line.
