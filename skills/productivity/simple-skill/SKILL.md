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
  - caveman voice: imperative fragments, arrows, no filler verbs. `- all tickets: <path>`, never "all tickets live in <path>"

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

### implement-ticket

```md
---
description: Implement one ticket. Trigger /implement-ticket.
argument-hint: "<ticket number or slug> [spec name]"
---

Implement a single ticket, end to end, as uncommitted work on the current branch.

Artifacts location:
- spec: `~/.claude/specs/<name>/spec.md` or in repo `docs/specs/<name>.md`
- all tickets: `~/.claude/specs/<name>/tickets/<NN>-<slug>.md`

Steps:
1. Copy the ticket to repo `docs/specs/<name>/tickets/`.
2. Read the ticket + the spec sections it touches.
3. Check **Blocked by**. Blocker missing from the code -> say so, stop.
4. Read repo `CLAUDE.md`, follow it.
5. Implement. Tick the acceptance criteria in the repo ticket file.
6. Run `/spec-code-review`, fix what it raises.
7. Recap, 2-4 lines.

Current branch only. No checkout, no new branch, no commit, no push, no PR.
```
