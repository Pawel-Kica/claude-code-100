---
name: prd-implement
description: "Build PRD. trigger /prd-implement, 'prd implement', or 'implement PRD'."
argument-hint: "[which PRD]"
---

Implement the work described in the PRD.

## Start
1. List `~/.claude/prds/`. Match arg against folder names + `prd.md`. One → use. Many → list, ask. None → stop.
2. Copy ONLY `prd.md` -> repo `AI/prds/<name>.md`.

## Build
- Stay on `main`. Dirty tree OK - other agents' WIP lives here too, no new branch.
- Follow repo `CLAUDE.md` conventions rigorously before first edit.
- Use subagents where needed for context efficiency.
- Always proceed. Stop only on a huge blocker (rare).

## Finish
1. Smoke test it with Chrome DevTools MCP if the change has a UI surface. Skip if it isn't smokeable.
2. Run `/simple-code-review`.
3. Recap 2-4 lines: what changed.

## Hard limit
Local only on `main`. No commit, push, PR. Changes sit uncommitted. You review in your editor, then ship.
