---
name: pretty-design
description: Pretty UI via a subagent using the Taste + Anthropic frontend-design skills. New or existing design. Trigger 'make it pretty'.
argument-hint: "[what to design or improve]"
---

Hand the design work to one subagent. Done = UI built or improved, screenshot proves it.

Tell the subagent to read and follow all three:
- taste: `~/.claude/skills/pretty-design/resources/taste.md`
- design: `~/.claude/skills/pretty-design/resources/frontend-design.md`
- my-guidelines: `~/.claude/skills/pretty-design/resources/my-guidelines.md` (wins on conflicts)

Pass to it info about what the user asked for, with any file paths or URLs.

If UI exists, improve it in place and keep content, routes and behavior. If nothing exists yet, build it new.
Check it in a headless browser, screenshot it, fix what looks off.

After you're done, send screenshots in a chat.