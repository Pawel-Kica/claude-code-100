---
name: simple-code-review
description: "Fresh-eyes review after you implement. Trigger /simple-code-review, 'code review', 'review this'."
---

Fresh eyes on the diff before sloppy agent code piles up. This is a goal, not a script.

## Scope

Review `git diff main...HEAD` plus working changes, or the path/PR the user names. 
Read the surrounding code, not just the diff. Skip trivial or generated files and say why.

Code is the source of truth. Never flag PRD files. 
Glance at the matching one in `AI/prds/` for intent only, since PRDs drift after they're written. 

## Run

Lead on Opus, reviewers on Sonnet.
Spawn one to three reviewers in parallel, however many the diff warrants.
Each holds the code to repo conventions (the changed dir's `CLAUDE.md` plus always-on rules) and hunts for:

- **Bugs** - broken contracts, dumb agent mistakes, any `CLAUDE.md` antipattern.
- **Duplication** - logic repeated 2+ times an existing util covers. Reuse, don't re-add.
- **Cruft** - dead code, vague names, deep nesting, a function doing two jobs.
- **Bad comments** - slop restating code, line narration, debug leftovers, `TODO`/`FIXME`, ticket refs.

## Modes

**fix** (default) - fix confident bugs inline, flag judgment calls instead of guessing them.
**check** (read-only) - report every finding, change nothing. `/super-code-review` always calls this mode.

## Output

No severity buckets. Every finding is a thing to fix.
Rank by blast radius and how badly it breaks repo convention.

Each finding is one line of what and where (`file:line`), then the fix.
No PR comments unless asked.

Default output is HTML.
Fill `templates/findings.html` with the real findings, write it to `/tmp/claude-html/<slug>.html`, and open in Chrome.
Then stop and wait for "go" before touching code.
