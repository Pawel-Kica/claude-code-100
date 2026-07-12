# claude code 100

Extremely useful prompts and skills for Claude Code.

## Install

Paste this into Claude Code:

```
Clone https://github.com/Pawel-Kica/claude-code-100.

Then copy every skill folder in skills/*/*/ into ~/.claude/skills/, keeping its own name. 
The whole folder, not just the SKILL.md: html ships an examples/ it links to.

If I already have a skill by that name, stop and ask before touching it.

When you're done, list what you installed and tell me to reload.
```

Prompts you just copy and paste. Nothing to install.

## Prompts

| | |
|---|---|
| [grill-me-plan](prompts/grill-me-plan.md) | Questions first, then a plan, then work. |
| [grill-me-relentlessly](prompts/grill-me-relentlessly.md) | Grill when you don't know where you'll land. |
| [grill-me-one-question](prompts/grill-me-one-question.md) | Grill one question at a time. |
| [clean-the-codebase](prompts/clean-the-codebase.md) | Dead code and duplication refactor. |
| [make-it-human](prompts/make-it-human.md) | Removes agent slop. |
| [read-only](prompts/read-only.md) | Answer the question, don't change anything. |

## Skills

### thinking

| | |
|---|---|
| [grill-me](skills/thinking/grill-me/SKILL.md) | Interviews you until the plan holds up. |
| [rubber-duck](skills/thinking/rubber-duck/SKILL.md) | Asks instead of answers, until you spot it yourself. |
| [second-opinion](skills/thinking/second-opinion/SKILL.md) | The strongest honest case against your plan. |
| [problem-first](skills/thinking/problem-first/SKILL.md) | Define the real problem before any solution. |
| [inversion-thinking](skills/thinking/inversion-thinking/SKILL.md) | Munger: don't ask how to win, ask how you'd lose. |
| [asymmetric-leverage](skills/thinking/asymmetric-leverage/SKILL.md) | 80/20: the vital few inputs, and what to cut. |

### engineering

| | |
|---|---|
| [afk-mode](skills/engineering/afk-mode/SKILL.md) | Takes the task end to end. No questions. Leaves a report. |
| [scope](skills/engineering/scope/SKILL.md) | Fuzzy idea into an implement-ready PRD. Research, grill, prototype, write. |
| [research](skills/engineering/research/SKILL.md) | Web, codebase, past sessions. Light to ultra depth. |
| [to-prd](skills/engineering/to-prd/SKILL.md) | Writes the decided context into a PRD. |
| [prd-implement](skills/engineering/prd-implement/SKILL.md) | Builds the PRD. Smoke test, review, recap. Never commits. |
| [prototype](skills/engineering/prototype/SKILL.md) | Throwaway code that answers a design question. |
| [throwaway-prototype](skills/engineering/throwaway-prototype/SKILL.md) | One standalone HTML page, variants on a query param. |
| [simple-code-review](skills/engineering/simple-code-review/SKILL.md) | Fresh eyes on the diff after you implement. |
| [thermo-nuclear-code-quality-review](skills/engineering/thermo-nuclear-code-quality-review/SKILL.md) | Harsh audit: abstractions, file size, spaghetti. |
| [ponytail-review](skills/engineering/ponytail-review/SKILL.md) | Over-engineering only. What to delete, what stdlib already does. |
| [super-code-review](skills/engineering/super-code-review/SKILL.md) | Runs the three reviewers in parallel, merges into one HTML verdict. |

The scope pipeline writes PRDs to `~/.claude/prds/`, never into your repo. `prd-implement` copies the one you name into `AI/prds/` and builds it.

### productivity

| | |
|---|---|
| [caveman](skills/productivity/caveman/SKILL.md) | Cuts the fluff, keeps the substance. |
| [html](skills/productivity/html/SKILL.md) | Renders an answer as a page and opens it. For things markdown ruins. |
| [clipboard-copy](skills/productivity/clipboard-copy/SKILL.md) | Pulls one piece of the last reply to your clipboard. |
| [past-conversations](skills/productivity/past-conversations/SKILL.md) | Search or resume past Claude Code chats by topic. |

## What works

- Say what "done" looks like. Let it find the path.
- Say when to stop, or when to come back and ask.
- Keep it short. Every word is context you pay for, every time.

## What doesn't

- Forty-step mega-prompts. It has read more code than you.
- Guardrails for things that were never going to happen.
- Styling instructions, tone notes, "please" and "thank you".

## Credit

`grilling`, `grill-me` and `prototype` are Matt Pocock's, copied as-is from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, Copyright (c) Matt Pocock).

## License

MIT
