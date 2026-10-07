---
name: t3-replace-thread
description: "Hand off to a fresh T3 Code thread that continues the work, settle this one. Trigger 'replace this thread'."
argument-hint: "[successor's task, e.g. '$gtd implement spec X']"
---

Swap this thread for a fresh one. Any step fails → report, don't settle. Args are always given: the successor's task.

1. `/handoff`, args = the task. Run it when asked ("handoff and ..."), or when the task leans on context that lives only in this chat. Skip it when the args plus existing artifacts (spec, plan) carry everything.

2. Create new thread: `node ~/.claude/skills/t3-new-thread/scripts/new-thread.mjs --prompt "<prompt>"`. Prompt = the args written as a self-contained task (guidelines, `$skill-name` to run a skill), plus "Context: read <handoff-path>" if step 1 ran.

3. Settle current thread: `node ~/.claude/skills/t3-settle-thread/scripts/settle.mjs`
