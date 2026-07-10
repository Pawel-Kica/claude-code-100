---
name: clipboard-copy
description: Copy a piece of the last response to the clipboard (macOS).
argument-hint: "what to copy - e.g. curl command, the JSON, second code block. Empty = whole last code block"
---

Copy a piece of the previous assistant message to clipboard via `pbcopy`.

**What:** arg given → extract that piece. Empty → last fenced code block; no block → main answer minus filler. Raw content, no fences or preamble.

**How:** heredoc into `pbcopy`, sentinel `PCOPY_EOF` (change if payload contains it).

**After:** one line `Copied <what> (<N> chars).` No match → say so, do nothing.
