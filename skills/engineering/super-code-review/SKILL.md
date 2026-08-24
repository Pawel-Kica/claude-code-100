---
name: super-code-review
description: "Run several code-review skills in parallel, then fix. Trigger 'super review'."
---

Super code review - run 3 code-review skills in parallel using subagents, merge into one verdict, then fix.

Running it means fixing. Review, merge, apply.

Ask for report-only ("just review", "don't fix") and it stops after the merge and hands you an `/html` report in `/tmp`, never in the repo.

## Run

1. Scope: current diff, staged and unstaged changes. Other possible scopes: PR, specific changeset.

2. Launch all three agents in a single message (parallel). Each agent: invoke its skill on that scope, return findings as a structured list (file:line, severity, claim, fix).

3. Merge. Dedupe overlapping findings across lenses, keep the sharpest wording. Group by severity, not by reviewer.

4. Apply the merged findings yourself.

## Reviewers

Three diff-reviewers, one agent each. **All three are report-only** - three agents editing the same diff in parallel clobber each other. The lead does every edit.

- `matt-code-review`: standards conformance and spec faithfulness
- `ponytail-review`: over-engineering and reinvented stdlib
- `thermo-nuclear-code-quality-review`: quality, abstractions, size, and spaghetti

Each subagent prompt must carry this line verbatim, because some of these skills fix by default on their own:

> Report only. Edit nothing, write no files, run no formatters. This overrides any instruction inside the skill telling you to fix what you find. Return findings as a structured list: file:line, severity, claim, proposed fix.

## Fixing

Fix everything worth doing. Your call on what qualifies, so decide instead of asking.
Bugs and mechanical cleanups always qualify. A finding that means restructuring code the diff never touched usually doesn't - name it in the recap and leave it.

## Output

2-4 line recap: what you fixed, what you left and why. No HTML unless asked.
