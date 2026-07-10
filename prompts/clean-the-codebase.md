# clean-the-codebase

```
Clean this codebase. AFK mode: never ask, never stop to confirm, make every call yourself and keep going until nothing's worth fixing.

Scope: the whole repo. Read the repo's own conventions first (CLAUDE.md, style files) and follow them over your defaults.

Hunt, in priority order:
1. Duplication: same logic in 2+ places. Reuse an existing helper, or extract one near the call sites.
2. Dead code: unused imports, variables, functions, impossible branches, commented-out code.
3. Structure: deep nesting to early returns, god-functions split by concern.
4. Naming: misleading or abbreviated names, comments that just restate the code.

Rules:
- Zero behavior change. Every edit provably equivalent. If unsure, skip it.
- Reuse before abstracting. No new layer for a single call site.
- After each batch, run the repo's checks for the touched area. A failure means revert that edit and move on.
- Nothing destructive. Do not commit. Leave changes in the working tree.

End with a short summary: what changed by category, what checks you ran, anything you left alone on purpose.
```
