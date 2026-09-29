---
name: fix-code-conventions
description: "Fix convention violations from docs/agents/code-conventions.md, or record feedback."
argument-hint: "[feedback <what>]"
disable-model-invocation: true
---

Project-agnostic. Rules live in the repo: `docs/agents/code-conventions.md`. Conventions only: naming, style, comments, structure. Bugs -> code review.

Done = every violation in scope fixed, behavior unchanged, checks green.

File missing -> stop, propose creating it.

Review mode (default):
1. Scope: current diff (`git diff HEAD`) unless user said different.
2. Spawn subagent to analyze & fix confirmed violations immediately.
- conventions: `docs/agents/code-conventions.md`
- root/nested `CLAUDE.md` / `AGENTS.md`.
- after: run relevant checks
3. Recap, 2-4 lines.

Feedback mode (`feedback <what>`):
- turn feedback + real code from session into one entry, format below
- same rule already there -> update it
- run `/show-diff` first, append only after user confirms

Entry format:

````md
### <rule title>
<one-line rule>

Bad:
```
<real code>
```

Good:
```
<fix>
```

Why: <one line>
````
