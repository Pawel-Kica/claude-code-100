---
name: handoff
description: Compact the current conversation into a handoff doc a fresh agent can resume from.
argument-hint: "What will the next session focus on?"
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save it to `~/.claude/handoffs/` (the global `.claude`, not the workspace).

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

After saving, copy the path to the clipboard (`printf '%s' <path> | pbcopy` on macOS), then confirm the path.
