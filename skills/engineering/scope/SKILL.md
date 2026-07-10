---
name: scope
description: "Plan change end-to-end into PRD. No repo write. Trigger /scope, 'scope feature'."
---

Turn a fuzzy idea into a sharp, implement-ready PRD. 
This is where all the questions live. Once the PRD is done it should need no more decisions.

Run in order:

1. `/research` - research the related modules and files to gather context before grill
2. `/grilling` - interview until reached shared understanding, don't stop early, be relentless.
3. *(optional)* `/throwaway-prototype` - build a throwaway prototype before the PRD, then keep grilling or move to PRD.
4. `/to-prd` - write the PRD folder.

Adapt depth to how well user knows the feature:

- new feature -> harder grilling
- known feature -> less grilling

Research depth depends on complexity of the feature. Don't ask stupid / obvious questions.

Then print the PRD path and copy it to the clipboard.
Never write into a repo. PRDs live only in `~/.claude/prds/`.
