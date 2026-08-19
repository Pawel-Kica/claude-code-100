---
name: super-code-review
description: "Super code review, run multiple code-review skills in parallel. Trigger /super-code-review, 'super review'."
---

Super code review - run 3 code-review skills in parallel using subagents, then merge into one verdict.

## Modes

**check** (default) - report only, change nothing. Output is a visually easy to review `/html` report, saved in `/tmp`, never in the repo.

**fix** - apply the findings. Triggered by intent, not a keyword: "fix it", "implement", "and fix the bugs" all mean fix. No confirmation gate, the ask is the go.

## Run

1. Scope: current diff, staged and unstaged changes. Other possible scopes: PR, specific changeset.

2. Launch all three agents in a single message (parallel). Each agent: invoke its skill on that scope, return findings as structured list (file:line, severity, claim, fix).

3. Merge. Dedupe overlapping findings across lenses, keep the sharpest wording. Group by severity, not by reviewer.

4. In fix mode only: apply the merged findings yourself, after step 3.

## Reviewers

Three read-only diff-reviewers, one agent each. Read-only in every mode, including fix mode - three agents editing the same diff in parallel clobber each other. The lead does the fixing.

- `simple-code-review` (check mode): obvious bugs and simple verdict
- `thermo-nuclear-code-quality-review`: quality, abstractions, size, and spaghetti
- `ponytail-review`: over-engineering and reinvented stdlib

## Fixing

Fix everything worth doing. Your call on what qualifies, so decide instead of asking.

Bugs and mechanical cleanups always qualify. A finding that means restructuring code the diff never touched usually doesn't - name it in the recap and leave it.

## Output

**check** - the HTML report, nothing else.

**fix** - 2-4 line recap: what you fixed, what you left and why. No HTML unless asked.
