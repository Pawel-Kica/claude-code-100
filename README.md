# ai coding 100

My daily prompts and skills for AI coding.

## Setup

Paste this into Claude Code or Codex:

```text
Clone https://github.com/Pawel-Kica/ai-coding-100 and install every skill from skills/*/*/ into ~/.claude/skills/ for Claude Code or ~/.agents/skills/ for Codex.
Copy each whole folder, including its supporting files, and keep its name.
Ask before overwriting an existing skill.
List what you installed and tell me how to reload the skills.
```

## Skills

### Thinking

- [grill-me](skills/thinking/grill-me/SKILL.md) - Ask questions to sharpen a plan
- [grilling](skills/thinking/grilling/SKILL.md) - Work through a plan's decisions in rounds
- [rubber-duck](skills/thinking/rubber-duck/SKILL.md) - Ask questions until you spot the answer yourself
- [second-opinion](skills/thinking/second-opinion/SKILL.md) - Make the strongest case against your plan
- [problem-first](skills/thinking/problem-first/SKILL.md) - Define the problem before solving it
- [inversion-thinking](skills/thinking/inversion-thinking/SKILL.md) - Find what would make your plan fail
- [monkey-first](skills/thinking/monkey-first/SKILL.md) - Test the riskiest part first
- [asymmetric-leverage](skills/thinking/asymmetric-leverage/SKILL.md) - Find what matters most and what to cut

### Engineering

- [afk-mode](skills/engineering/afk-mode/SKILL.md) - Finish the task while you're away
- [scope](skills/engineering/scope/SKILL.md) - Turn a rough idea into a spec
- [research](skills/engineering/research/SKILL.md) - Research the web, code and past chats
- [to-spec](skills/engineering/to-spec/SKILL.md) - Write the decisions from your chat into a spec
- [to-local-tickets](skills/engineering/to-local-tickets/SKILL.md) - Break a spec into small tickets
- [tdd](skills/engineering/tdd/SKILL.md) - Build with tests first
- [spec-review](skills/engineering/spec-review/SKILL.md) - Review a spec before building it
- [implement-spec](skills/engineering/implement-spec/SKILL.md) - Build and verify a spec
- [implement-ticket](skills/engineering/implement-ticket/SKILL.md) - Build the tickets you pick
- [e2e](skills/engineering/e2e/SKILL.md) - Test the real app and fix what breaks
- [e2e-codex](skills/engineering/e2e-codex/SKILL.md) - Test the real app through Chrome DevTools in Codex
- [prototype](skills/engineering/prototype/SKILL.md) - Try an idea with throwaway code
- [throwaway-prototype](skills/engineering/throwaway-prototype/SKILL.md) - Compare UI ideas on one HTML page
- [single-prototype](skills/engineering/single-prototype/SKILL.md) - Build one HTML prototype
- [pretty-design](skills/engineering/pretty-design/SKILL.md) - Build or improve a UI's design
- [html-planning](skills/engineering/html-planning/SKILL.md) - Work through planning questions on an HTML page
- [spec-code-review](skills/engineering/spec-code-review/SKILL.md) - Check your changes against the spec and repo rules
- [thermo-nuclear-code-quality-review](skills/engineering/thermo-nuclear-code-quality-review/SKILL.md) - Find messy code and unnecessary abstractions
- [ponytail-review](skills/engineering/ponytail-review/SKILL.md) - Find code you can simplify or remove
- [super-code-review](skills/engineering/super-code-review/SKILL.md) - Review code structure and complexity, then fix it
- [fix-code-conventions](skills/engineering/fix-code-conventions/SKILL.md) - Fix changes that break your repo's conventions

### Productivity

- [gtd](skills/productivity/gtd/SKILL.md) - Finish the task and prove it works
- [caveman](skills/productivity/caveman/SKILL.md) - Cut the fluff from replies
- [html](skills/productivity/html/SKILL.md) - Show an answer as a web page
- [visual](skills/productivity/visual/SKILL.md) - Show a chart, diagram or image in chat
- [variants](skills/productivity/variants/SKILL.md) - Compare a few options on one page
- [copy](skills/productivity/copy/SKILL.md) - Copy part of the last reply to your clipboard
- [past-conversations](skills/productivity/past-conversations/SKILL.md) - Find or resume past Claude Code chats
- [improve-writing](skills/productivity/improve-writing/SKILL.md) - Write and edit in your voice
- [unslop](skills/productivity/unslop/SKILL.md) - Remove AI tells from writing
- [show-diff](skills/productivity/show-diff/SKILL.md) - Show edits for your approval before applying them
- [prompt-helper](skills/productivity/prompt-helper/SKILL.md) - Turn an idea into a clear prompt
- [say-it-simply](skills/productivity/say-it-simply/SKILL.md) - Explain the last answer in plain words
- [simple-skill](skills/productivity/simple-skill/SKILL.md) - Turn an idea into a short skill
- [handoff](skills/productivity/handoff/SKILL.md) - Save the context for a fresh agent
- [handoff-implement](skills/productivity/handoff-implement/SKILL.md) - Pick up work from a handoff

### cmux

- [spawn-new-session](skills/cmux/spawn-new-session/SKILL.md) - Give work to Claude agents in new tabs
- [close-cmux-tab](skills/cmux/close-cmux-tab/SKILL.md) - Close the current tab
- [replace-current-session](skills/cmux/replace-current-session/SKILL.md) - Continue in a fresh session and close this one

### T3 Code

- [t3-new-thread](skills/t3code/t3-new-thread/SKILL.md) - Give work to Claude in a new thread
- [t3-settle-thread](skills/t3code/t3-settle-thread/SKILL.md) - Settle this thread when the turn ends
- [t3-replace-thread](skills/t3code/t3-replace-thread/SKILL.md) - Continue in a fresh thread and settle this one

## Prompts

Copy and paste these into your chat.

- [grill-me-plan](prompts/grill-me-plan.md) - Ask questions, agree on a plan, then start
- [grill-me-relentlessly](prompts/grill-me-relentlessly.md) - Keep asking until the direction is clear
- [grill-me-one-question](prompts/grill-me-one-question.md) - Ask one question at a time
- [grill-me-or-proceed](prompts/grill-me-or-proceed.md) - Ask if needed, otherwise get to work
- [clean-the-codebase](prompts/clean-the-codebase.md) - Remove dead code and duplication
- [short-and-human](prompts/short-and-human.md) - Keep replies short and human
- [read-only](prompts/read-only.md) - Answer without changing anything

[Credits](CREDITS.md) · [MIT license](LICENSE)
