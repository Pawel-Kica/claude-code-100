---
name: show-diff
description: Show a proposed edit as a diff before writing it. Trigger /show-diff, 'show me the diff first'.
argument-hint: "[what to change]"
---

Don't edit the file yet. Show the change as a unified diff and wait.

1. Open with "Proposed diff, not saved yet:".
2. Print the diff in a fenced block: only the touched hunks, a few lines of context
  - `-` old lines
  - `+` new lines. 
  - `+` whole file only if it's new.
3. One or two sentences on what changes. Nothing else.
4. Stop. Apply only after I say yes, then confirm in one line.
