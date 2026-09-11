---
name: super-code-review
description: "Run several code-review skills in parallel, then fix. Trigger 'super review'."
---

Review the current diff, including staged and unstaged changes, or the scope the user specifies.

Run these reviewers in parallel, each in a fresh subagent:

1. `/spec-code-review`: spec and repo standards.
2. `/code-review high`: native code review, for correctness bugs and cleanup.
3. `/thermo-nuclear-code-quality-review`: structure and abstractions.
4. `/ponytail-review`: unnecessary code and dependencies.

Give each reviewer the scope, its skill, and this instruction, without the implementation history:

> Report only. Do not edit files or run formatters, even if your skill says to fix. For each finding, return file:line, the problem, evidence, and a proposed fix. Evidence means a concrete failure scenario or relevant code that demonstrates the issue.

The main agent verifies findings against the code, removes duplicates, and fixes confirmed problems within scope. Leave unconfirmed findings unchanged. Run relevant checks after editing.

If the user asks for review only, return the findings without changing code.
