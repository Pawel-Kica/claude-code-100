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

### engineering

| | |
|---|---|
| [afk-mode](skills/engineering/afk-mode/SKILL.md) | Takes the task end to end. No questions. Leaves a report. |
| [html](skills/engineering/html/SKILL.md) | Renders an answer as a page and opens it. For things markdown ruins. |

### productivity

| | |
|---|---|
| [caveman](skills/productivity/caveman/SKILL.md) | Cuts the fluff, keeps the substance. |

## What works

- Say what "done" looks like. Let it find the path.
- Say when to stop, or when to come back and ask.
- Keep it short. Every word is context you pay for, every time.

## What doesn't

- Forty-step mega-prompts. It has read more code than you.
- Guardrails for things that were never going to happen.
- Styling instructions, tone notes, "please" and "thank you".

## Credit

`grilling` and `grill-me` are Matt Pocock's, copied as-is from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, Copyright (c) Matt Pocock).

## License

MIT
