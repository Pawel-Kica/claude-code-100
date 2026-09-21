---
name: implement-ticket
description: Implement one or more tickets. Trigger /implement-ticket.
argument-hint: "<ticket number(s) or slug> [spec name]"
---

Implement one or more tickets, end to end, as uncommitted work on the current branch.

## Artifacts location:
- spec: `~/.claude/specs/<name>/spec.md` or in repo `docs/specs/<name>.md`
- all tickets: `~/.claude/specs/<name>/tickets/<NN>-<slug>.md`
- already implemented tickets: repo `docs/specs/<name>/tickets/<NN>-<slug>.md`

## Steps:
0. If it's first ticket, copy also the spec to repo `docs/specs/<name>.md` (if not already there)

1. Copy the ticket(s) to repo `docs/specs/<name>/tickets/`.

2. Read the ticket(s) + the spec sections they touch.

3. Check **Blocked by** - numbering is dependency order, so ticket 03 means 01 and 02 are done. Blocker missing from the code -> say so, stop.

4. Read repo `CLAUDE.md`, follow it.

5. Implement, ticket by ticket in numbering order. Tick the acceptance criteria in each repo ticket file.

6. Recap what changed, plus anything unplanned. Add a `NOTE:` to related tickets if needed.

## Rules: 
- current branch only - no checkout, no new branch
- no external actions - no commit, no push, no PR
- dirty tree is fine, possible other agents' WIP
