---
name: scope
description: "Plan change end-to-end into spec. No repo write. Trigger /scope, 'scope feature'."
---

Turn a fuzzy idea into a sharp, implement-ready spec. 
This is where all the questions live. Once the spec is done it should need no more decisions.

Run in order:

1. `/research` - research the related modules and files to gather context before grill
2. `/grilling` - interview until reached shared understanding, don't stop early, be relentless.
3. *(optional)* `/throwaway-prototype` - build a throwaway prototype before the spec, then keep grilling or move to spec.
4. `/to-spec` - write the spec folder.

Adapt depth to how well user knows the feature:

- new feature -> harder grilling
- known feature -> less grilling

Research depth depends on complexity of the feature. Don't ask stupid / obvious questions.

Then print the spec path and copy it to the clipboard.
Never write into a repo. Specs live only in `~/.claude/specs/`.
