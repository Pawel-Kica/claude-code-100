---
name: scope
description: "Plan change end-to-end into spec. No repo write. Trigger /scope, 'scope feature'."
---

Turn a fuzzy idea into a sharp, implement-ready spec.
This is where all the questions live. Once the spec is done it should need no more decisions.

Run in order:

1. `/research` - research the related modules and files to gather context before grill
2. `/grilling` - interview until reached shared understanding, don't stop early, be relentless.
3. _(optional)_ `/throwaway-prototype` - build a throwaway prototype before the spec, then keep grilling or move to spec.
4. _(optional)_ `/tdd` - design the tests, plan red-green. Take your time, red-green is the core.
5. `/to-spec` - write the spec folder. TDD step ran -> seams + Testing Decisions land in the spec.
6. `/spec-review` - two agents review the written spec, fix blockers, surface open decisions.

Adapt depth to how well user knows the feature:

- new feature -> harder grilling
- known feature -> less grilling

Research depth depends on complexity of the feature. Don't ask stupid / obvious questions.

Then print the spec path and copy it to the clipboard.
Never write into a repo. Specs live only in `~/.claude/specs/`.
