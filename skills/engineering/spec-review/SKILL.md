---
name: spec-review
description: "Three-agent review of a finished spec. Trigger 'review the spec'."
---

Review a finished spec for blockers only. Target the spec just written, or the name/path given.

1. Dispatch three read-only sub-agents in parallel, both on `spec.md`:
   - **self** — the spec against itself: internal contradictions, decisions the spec needs and never makes.
   - **code 1** — the spec against the codebase: names, endpoints, models, flows it assumes exist; approaches the code makes impossible.
   - **code 2** — same as code 1, but with a different perspective

Give both the bar: a finding is something that stops implementation, named at the spec line it lives on. 
A spec with nothing blocking returns nothing.

2. Verify every finding yourself before acting — reopen the spec or the cited file. Keep the ones that genuinely block. Style, structure, extra ideas, and anything under Out of Scope are not blockers.

3. Act on what survived:
   - The answer is already determined (one side of a contradiction is right, the codebase settles a name) → edit the spec.
   - Fixing it means choosing → leave the spec alone and ask the user to choose (first explain it clearly, then ask the question).

4. Report, then stop:
   - Fixed: one line each.
   - Open decisions: a plain numbered list of questions. The user answers next turn, and you fold the answers into the spec.
   - Nothing survived: `Spec review: clean.`
