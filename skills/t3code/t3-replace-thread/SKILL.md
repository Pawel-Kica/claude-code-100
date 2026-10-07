---
name: t3-replace-thread
description: "Hand off to a fresh T3 Code thread that continues the work, settle this one. Trigger 'replace this thread'."
argument-hint: "[what the successor should focus on]"
---

Swap this thread for a fresh one. Any step fails → report, don't settle.

1. `/handoff`, args = successor's focus.
2. `node ~/.claude/skills/t3-new-thread/scripts/new-thread.mjs --prompt "Read <handoff-path> and continue"`
3. Last act: `node ~/.claude/skills/t3-settle-thread/scripts/settle.mjs`. Reply with the new thread ID, one line.
