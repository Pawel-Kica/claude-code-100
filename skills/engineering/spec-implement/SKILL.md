---
name: spec-implement
description: "Build a spec. Trigger /spec-implement, 'spec implement', or 'implement spec'."
argument-hint: "[which spec]"
---

Implement the work described in the spec.

## Start
1. List `~/.claude/specs/`. Match arg against folder names + `spec.md`. One → use. Many → list, ask. None → stop.
2. Copy ONLY `spec.md` -> repo `docs/specs/<name>.md`.

## Build
- Stay on `main`. Dirty tree OK - other agents' WIP lives here too, no new branch.
- Follow repo `CLAUDE.md` conventions rigorously before first edit.
- Use subagents where needed for context efficiency.
- Always proceed. Stop only on a huge blocker (rare).

## Finish
1. Verify via `/e2e` if possible. Skip only if the change has nothing to drive.
2. Run `/simple-code-review`.
3. Recap 2-4 lines: what changed.

## Hard limit
Local only on `main`. No commit, push, PR. Changes sit uncommitted. The user reviews in their editor, then ships.
