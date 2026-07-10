# claude code 100

The prompts and skills I actually run with Claude Code.

A prompt sets a goal and lets the agent find the path. A skill is a path I've already walked and want to repeat. Otherwise they're the same thing: text you hand an agent.

## Install

Paste [`setup.md`](setup.md) into Claude Code and it does it for you. Or by hand:

```bash
git clone https://github.com/Pawel-Kica/claude-code-100.git
cd claude-code-100

mkdir -p ~/.claude/skills
for s in skills/*/*/; do
  ln -sfn "$PWD/${s%/}" ~/.claude/skills/"$(basename "$s")"
done
```

Reload Claude Code and type `/`. The folders are for reading, not for loading: Claude Code sees skills flat, by name.

Prompts you just copy and paste. Nothing to install.

## Prompts

| | |
|---|---|
| [ask-first](prompts/ask-first.md) | Questions first, then a plan, then work. |
| [clean-the-codebase](prompts/clean-the-codebase.md) | Dead code and duplication, gone. Behavior unchanged. Runs alone. |
| [make-it-human](prompts/make-it-human.md) | Cuts the padding out of anything it wrote. |
| [read-only](prompts/read-only.md) | Answer the question. Change nothing. |

## Skills

**thinking**

| | |
|---|---|
| [grill-me](skills/thinking/grill-me/SKILL.md) | Interviews you until the plan holds up. |
| [rubber-duck](skills/thinking/rubber-duck/SKILL.md) | Asks instead of answers, until you spot it yourself. |
| [second-opinion](skills/thinking/second-opinion/SKILL.md) | The strongest honest case against your plan. |
| [problem-first](skills/thinking/problem-first/SKILL.md) | Define the real problem before any solution. |
| [inversion-thinking](skills/thinking/inversion-thinking/SKILL.md) | Munger: don't ask how to win, ask how you'd lose. |

**engineering**

| | |
|---|---|
| [afk-mode](skills/engineering/afk-mode/SKILL.md) | Takes the task end to end. No questions. Leaves a report. |
| [html](skills/engineering/html/SKILL.md) | Renders an answer as a page and opens it. For things markdown ruins. |

**productivity**

| | |
|---|---|
| [caveman](skills/productivity/caveman/SKILL.md) | Cuts the fluff, keeps the substance. |

## What works

- Say what "done" looks like. Let it find the path.
- Only the guardrails that matter. "Zero behavior change, don't commit" earns its place.
- Say when to stop, or when to come back and ask.
- Keep it short. Every word is context you pay for, every time.
- Be clear about when to use it. A vague description means it never fires.

## What doesn't

- Forty-step mega-prompts. It has read more code than you.
- Guardrails for things that were never going to happen.
- Polish. Long and polished loses to short and plain.
- Styling instructions, tone notes, "please" and "thank you".
- Leaving it to guess when it should have asked.

## Credit

`grilling` and `grill-me` are Matt Pocock's, copied as-is from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, Copyright (c) Matt Pocock). Worth reading the rest of them.

## License

MIT
