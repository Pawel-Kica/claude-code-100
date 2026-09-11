---
name: project-name-code-conventions
description: "Fix project-name convention violations, or record feedback as a reusable example."
argument-hint: "[feedback <what>] | [scope]"
---

Check naming, style, comments, structure, and documented repo rules. Leave correctness bugs to code review.

With `feedback <what>`, turn the user's feedback and real code from the session into one rule with a Bad/Good example. Show it for approval, then add it below. Update an existing example if it covers the same rule.

Otherwise, read the root and applicable nested `CLAUDE.md` and `AGENTS.md` files, plus the examples below. Review staged and unstaged changes, or the supplied scope. Fix confirmed convention violations immediately, preserving behavior. Run relevant checks after editing.

## Examples

Add approved examples here using this format:

### <Rule title>
<One-line rule>

Bad:
```
<Actual code>
```

Good:
```
<Corrected code>
```

Why: <One-line reason>
