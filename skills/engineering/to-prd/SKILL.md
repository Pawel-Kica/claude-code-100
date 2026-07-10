---
name: to-prd
description: "Write current context to PRD ~/.claude/prds/. Trigger /to-prd, 'to prd'."
---

Synthesize conversation + codebase into a PRD. No interview - that happened in scope/grill. Write what's decided. Project's domain vocabulary, caveman voice.

Always write the PRD in English even when the chat is another language - durable team-facing artifact, stays English like the code. Chat reply stays in the conversation language.

## Write

Folder `~/.claude/prds/<name>/`:

- `prd.md` - the doc (template below).
- `artifacts/` - only if a prototype is built; HTML only.

Never write into a repo.

## HTML output

Only when the user asks ("as /html", "give me HTML too"). Then generate both: `prd.md` as usual + `artifacts/<name>.html` via `/html`. Default markdown only.

## prd.md template

```markdown
# <name>

## Summary

- **Problem** - one line.
- **Solution** - bullets.
- **Architecture** - the part the user scans first:
  - DB / migrations: new tables, fields, what's written vs read.
  - Models / serializers touched.
  - API endpoints added/changed.
  - Frontend: WHERE it lands (route, screen, component), not how it looks.

## User stories

Numbered, extensive. `As an <actor>, I want <feature>, so that <benefit>`.

## Decisions

Architectural + technical decisions made. Schema, contracts, interactions. No file paths, no code snippets (they rot). Exception: a prototype snippet that pins a decision (state machine, schema, type) - inline the decision-rich bit only.

## Out of scope

What this PRD does not cover.

## Notes

Anything else.
```
