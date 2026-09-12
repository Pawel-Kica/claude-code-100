---
name: implement-ticket
description: Implement one ticket. Trigger /implement-ticket.
argument-hint: "<ticket number or slug> [spec name]"
---

Implement a single ticket, end to end, as uncommitted work on the current branch.

## Artifacts location:
- spec: `~/.claude/specs/<name>/spec.md` or in repo `docs/specs/<name>.md`
- all tickets: `~/.claude/specs/<name>/tickets/<NN>-<slug>.md`
- already implemented tickets: repo `docs/specs/<name>/tickets/<NN>-<slug>.md`

## Steps:
1. Copy the ticket to repo `docs/specs/<name>/tickets/`.

2. Read the ticket + the spec sections it touches.

3. Check **Blocked by** - numbering is dependency order, so ticket 03 means 01 and 02 are done. Blocker missing from the code -> say so, stop.

4. Read repo `CLAUDE.md`, follow it.

5. Implement. Tick the acceptance criteria in the repo ticket file.

6. Run `/spec-code-review`, fix what it raises.

## Rules: 
- current branch only - no checkout, no new branch
- no external actions - no commit, no push, no PR
- dirty tree is fine, possible other agents' WIP
