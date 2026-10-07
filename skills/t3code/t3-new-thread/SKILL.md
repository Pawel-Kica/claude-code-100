---
name: t3-new-thread
description: "Hand work to a Claude session in a new T3 Code thread. Trigger 'spawn a thread'."
argument-hint: "[task]"
---

Start a fresh thread in the running T3 Code app. It knows nothing from this chat → prompt carries goal + needed context.

`node ~/.claude/skills/t3-new-thread/scripts/new-thread.mjs --prompt "<goal + context>" [--cwd <project dir>] [--image <path>]...`
- big context → `/handoff` first, prompt: `Read <path> and continue`
- cwd must already be a T3 project
- `$skill-name` in the prompt → runs that skill in the new thread

Report the thread ID. Stop.
