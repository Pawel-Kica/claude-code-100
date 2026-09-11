---
name: implement-spec
description: "Build a spec. Trigger 'implement spec'."
argument-hint: "[which spec]"
---

You have been provided a spec. It may or may not have tickets beside it.

The goal is uncommitted work on the current branch that implements the entire spec.

## Mode

- No `tickets/` -> implement the spec yourself, here. Big spec -> hand chunks to implementer subagents to keep this context lean.
- `tickets/` -> work the task graph below.

The tickets are not a list of steps. They are a task graph with blocking relationships between them. This means there is always a frontier of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through context pointers: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

Implementer subagents should be run in the background where possible for maximum concurrency.

## Steps

1. Read the spec, and the tickets if any. Read enough to understand the task graph.

2. Copy:
- spec: `spec.md` -> repo `docs/specs/<name>.md`
- tickets (if any): `~/.claude/specs/<name>/tickets/` -> repo `docs/specs/<name>/tickets/`

3. (optional) Use an **exploration subagent** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Ensure the exploration subagent can save files - it should save its markdown notes in a directory outside the repo, accessible by all future subagents. This lets **implementer subagents** focus on implementation rather than exploration.

4. Tickets: use **implementer subagents** to implement each ticket. Each implementer works on the current branch in this checkout, no worktree, no new branch.

5. Tickets: if that changes the **frontier**, kick off the next **implementer subagent**.

6. Once the work is complete, run /spec-code-review skill. Fix all issues raised by the code review in a single **implementer subagent**.

7. Verify via `/e2e` if possible. Skip only if the change has nothing to drive.

8. Recap 2-4 lines: what changed. Stop. The user reviews in their editor, then ships.

### Internal Instructions

- Dirty tree OK - other agents' WIP lives here too.
- Stay on the current branch, never checkout, never create one. 
- Local only on the current branch. No commit, push, PR.
- Follow repo `CLAUDE.md` conventions rigorously before first edit.
- Always proceed. Stop only on a huge blocker (rare).
