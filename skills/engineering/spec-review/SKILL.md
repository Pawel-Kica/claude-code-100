---
name: spec-review
description: Two-agent review of a finished spec against the codebase. Trigger 'review the spec'.
---

Review a finished spec for blockers only. Target the spec just written, or the name/path given.

1. Dispatch two read-only sub-agents in parallel, both on `spec.md`, both checking the spec against the codebase: 
- names
- endpoints
- models
- flows it assumes exist
- approaches the code makes impossible

Give each subagent:
- different perspective (so they are not just repeating each other)
- the bar: a finding is something that stops implementation, significant ambiguity, contradiction, blocker etc.

Important: spec with nothing blocking, just returns nothing - that's fine.

2. Verify every finding yourself before acting:
- reopen the spec or the cited file
- keep the ones that genuinely block.

3. Act on what survived:
- The answer is already determined (one side of a contradiction is right, the codebase settles a name) → edit the spec.
- Fixing it means choosing → leave the spec alone and ask the user to choose (first explain it clearly, then ask the question).

4. Report, then stop:
- Fixed: one line each.
- Open decisions: numbered list of questions, that user answers next turn, and you fold the answers into the spec.
- Nothing survived: `Spec review: clean.`
