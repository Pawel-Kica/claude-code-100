---
name: scope
description: "Plan a change end to end into a spec, no repo writes. Trigger 'scope feature'."
---

Turn a fuzzy idea into a sharp, implement-ready spec.
This is where all the questions live. Once the spec is done it should need no more decisions.

First pick the spec slug (`~/.claude/specs/<name>/`) and use it for every artifact below (prototype html, spec, tickets).

Run in order each skill, invoke them/read content:

1. Skill `/research` - research the related modules and files to gather context before grill

2. Skill `/grilling` - interview until reached shared understanding, don't stop early, be relentless.

3. _(optional)_ Skill `/throwaway-prototype` - build a throwaway prototype before the spec, then keep grilling or move to spec.

4. _(optional)_ Skill `/tdd` - design the tests, plan red-green. Take your time, red-green is the core.

5. Before writing the spec, ask the user in 1 question, to review "shared understanding" and confirm all decisions made. If yes, proceed with spec next step, if no, go back to grilling/research until shared understanding is reached.

6. Skill `/to-spec` - create spec, follow all instructions (to-spec, spec-review)

Adapt depth to how well user knows the feature:

- new feature / "grill hard" -> harder grilling
- known feature / "grill easy" -> less grilling

Research depth depends on complexity of the feature. Don't ask stupid or obvious questions.