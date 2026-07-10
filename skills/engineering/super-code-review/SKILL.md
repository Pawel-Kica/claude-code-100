---
name: super-code-review
description: "Super code review, run multiple code-review skills in parallel. Trigger /super-code-review, 'super review'." 
---

Super code review - run 3 code-review skills in parallel using subagents, then merge into one verdict. 
Don't implement, just product visually easy to review `/html` report, save it in `/tmp` directory, not in repo.

## Run
1. Scope: current diff, staged and unstaged changes. Other possible scopes: PR, specific changeset.

2. Launch all three agents in a single message (parallel). Each agent: invoke its skill on that scope, return findings as structured list (file:line, severity, claim, fix).

3. Merge. Dedupe overlapping findings across lenses, keep the sharpest wording. Group by severity, not by reviewer.

## Reviewers

Three pure read-only diff-reviewers, one agent each:
- `simple-code-review` (check mode, read-only): obvious bugs and simple verdict
- `thermo-nuclear-code-quality-review`: quality, abstractions, size, and spaghetti
- `ponytail-review`: over-engineering and reinvented stdlib