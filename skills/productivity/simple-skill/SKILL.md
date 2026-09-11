---
name: simple-skill
description: Create a short, goal-oriented skill from one sentence. Trigger /simple-skill.
argument-hint: "what the skill should do"
---

Turn `$ARGUMENTS` into a skill. 

Ask one question only if you can't tell what "done" looks like. Otherwise don't ask, write.

Write `~/.claude/skills/<name>/SKILL.md`:
- frontmatter:
  - `name`
  - `description`: what it does plus trigger phrase, under 50 tokens
  - `argument-hint` if it takes input
- body: 
  - the goal and what done looks like
  - numbered steps only when order matters

Before saving, delete:
- lines that don't change behavior: "be thorough", "make it readable", "high quality", "carefully"
- explanations of why
- tables, headers, constants the agent can look up itself
- anything the agent already knows how to do

Target shape.

### grill-me

```md
---
description: A relentless interview to sharpen a plan or design.
---

Run a `/grilling` session.
```

### second-opinion

```md
---
description: "Strongest case against a plan, then what to actually pick."
---

Before I commit to this, argue against it.

Give me the real case for doing it a different way, the one a smart skeptic would make.

Make it as strong as you honestly can, not a weak version I can wave off. Then tell me which you'd actually pick, and why.

If my plan is genuinely fine, just say so. Don't invent objections.
```
