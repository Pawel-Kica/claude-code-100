# claude code 100

Extremely useful prompts and skills for Claude Code.

## Install

Paste this into Claude Code:

```
Clone https://github.com/Pawel-Kica/claude-code-100.

Then copy every skill folder in skills/*/*/ into ~/.claude/skills/, keeping its own name. 
The whole folder, not just the SKILL.md: html ships an examples/ it links to, tdd ships reference files, the e2e skills ship report templates.

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
| [grill-me-or-proceed](prompts/grill-me-or-proceed.md) | Questions if it has any, otherwise straight to work. |
| [clean-the-codebase](prompts/clean-the-codebase.md) | Dead code and duplication refactor. |
| [short-and-human](prompts/short-and-human.md) | Kills agent slop. Short and human, every reply. |
| [read-only](prompts/read-only.md) | Answer the question, don't change anything. |

## Skills

### thinking

| | |
|---|---|
| [grill-me](skills/thinking/grill-me/SKILL.md) | Interviews you until the plan holds up. |
| [grilling](skills/thinking/grilling/SKILL.md) | The same interview as a design tree, when you don't know where you'll land. |
| [rubber-duck](skills/thinking/rubber-duck/SKILL.md) | Asks instead of answers, until you spot it yourself. |
| [second-opinion](skills/thinking/second-opinion/SKILL.md) | The strongest honest case against your plan. |
| [problem-first](skills/thinking/problem-first/SKILL.md) | Define the real problem before any solution. |
| [inversion-thinking](skills/thinking/inversion-thinking/SKILL.md) | Munger: don't ask how to win, ask how you'd lose. |
| [monkey-first](skills/thinking/monkey-first/SKILL.md) | Google X: train the monkey, don't build the pedestal. |
| [asymmetric-leverage](skills/thinking/asymmetric-leverage/SKILL.md) | 80/20: the vital few inputs, and what to cut. |

### engineering

| | |
|---|---|
| [afk-mode](skills/engineering/afk-mode/SKILL.md) | Takes the task end to end. No questions. Leaves a report. |
| [scope](skills/engineering/scope/SKILL.md) | Fuzzy idea into an implement-ready spec. Research, grill, prototype, write. |
| [research](skills/engineering/research/SKILL.md) | Web, codebase, past sessions. Light to ultra depth. |
| [to-spec](skills/engineering/to-spec/SKILL.md) | Writes the decided context into a spec. |
| [to-local-tickets](skills/engineering/to-local-tickets/SKILL.md) | Splits a spec into tracer-bullet tickets, each declaring what blocks it. |
| [tdd](skills/engineering/tdd/SKILL.md) | Red-green loop, and what makes a test worth keeping. Seams, anti-patterns, rules. |
| [spec-review](skills/engineering/spec-review/SKILL.md) | Two agents review the finished spec. Fixes blockers, asks the open decisions. |
| [implement-spec](skills/engineering/implement-spec/SKILL.md) | Builds the spec. Works the tickets as a task graph, E2E verify, review, recap. Never commits. |
| [implement-ticket](skills/engineering/implement-ticket/SKILL.md) | Builds one ticket. Checks its blockers, ticks the acceptance criteria, reviews. Never commits. |
| [e2e](skills/engineering/e2e/SKILL.md) | Drives the real app until the change provably works. Fixes what breaks. |
| [e2e-codex](skills/engineering/e2e-codex/SKILL.md) | Same, for Codex Desktop Browser. Ships a report builder. |
| [prototype](skills/engineering/prototype/SKILL.md) | Throwaway code that answers a design question. |
| [throwaway-prototype](skills/engineering/throwaway-prototype/SKILL.md) | One standalone HTML page, variants on a query param. |
| [single-prototype](skills/engineering/single-prototype/SKILL.md) | The same page, one version only: the thing you'd actually build. |
| [html-planning](skills/engineering/html-planning/SKILL.md) | Grilling, but the interview lives on an HTML page instead of the terminal. |
| [spec-code-review](skills/engineering/spec-code-review/SKILL.md) | Two-axis review of the uncommitted changes: repo standards, and faithfulness to the spec. |
| [thermo-nuclear-code-quality-review](skills/engineering/thermo-nuclear-code-quality-review/SKILL.md) | Harsh audit: abstractions, file size, spaghetti. |
| [ponytail-review](skills/engineering/ponytail-review/SKILL.md) | Over-engineering only. What to delete, what stdlib already does. |
| [super-code-review](skills/engineering/super-code-review/SKILL.md) | Runs four reviewers in parallel, verifies findings, then fixes. |
| [fix-code-conventions](skills/engineering/fix-code-conventions/SKILL.md) | Fixes your diff against the repo's `docs/agents/code-conventions.md` and adds your feedback to it as examples. |

The scope pipeline writes specs to `~/.claude/specs/`, never into your repo. `scope` chains the whole thing: research, grill, optionally `tdd`, `to-spec`, then `spec-review`. `implement-spec` copies the one you name into `docs/specs/` and builds it.

### productivity

| | |
|---|---|
| [caveman](skills/productivity/caveman/SKILL.md) | Cuts the fluff, keeps the substance. |
| [html](skills/productivity/html/SKILL.md) | Renders an answer as a page and opens it. For things markdown ruins. |
| [variants](skills/productivity/variants/SKILL.md) | 3-5 real variants of anything on one tabbed page. You pick instead of explaining. |
| [copy](skills/productivity/copy/SKILL.md) | Pulls one piece of the last reply to your clipboard. |
| [past-conversations](skills/productivity/past-conversations/SKILL.md) | Search or resume past Claude Code chats by topic. |
| [improve-writing](skills/productivity/improve-writing/SKILL.md) | Drafts and polishes any text in your plain voice. Learns from your feedback. |
| [unslop](skills/productivity/unslop/SKILL.md) | Cuts AI tells from any writing. `improve-writing` runs it. |
| [show-diff](skills/productivity/show-diff/SKILL.md) | Shows the edit as a diff and waits for your yes. |
| [prompt-helper](skills/productivity/prompt-helper/SKILL.md) | Turns a rough idea into a short, direct prompt for an agent. |
| [say-it-simply](skills/productivity/say-it-simply/SKILL.md) | Re-says the last answer short and human, when it came out as slop. |
| [simple-skill](skills/productivity/simple-skill/SKILL.md) | Turns one sentence into a short, goal-oriented skill. |
| [handoff](skills/productivity/handoff/SKILL.md) | Compacts the conversation into a doc a fresh agent can resume from. |
| [handoff-implement](skills/productivity/handoff-implement/SKILL.md) | Finds a handoff from a loose description and just continues the work. |

`handoff` writes to `~/.claude/handoffs/`, `handoff-implement` reads from it. Run `handoff` before you hit the context wall, not after.

### cmux

For the [cmux](https://cmux.com) terminal only. Each skill drives real tabs over its control CLI.

| | |
|---|---|
| [spawn-new-session](skills/cmux/spawn-new-session/SKILL.md) | Hands work to real Claude agents in their own tabs, brief per agent. |
| [close-cmux-tab](skills/cmux/close-cmux-tab/SKILL.md) | Closes the tab the session is running in. One action, no questions. |
| [replace-current-session](skills/cmux/replace-current-session/SKILL.md) | Handoff, fresh session in a new tab, closes itself. For when context runs deep. |

`replace-current-session` chains `handoff` and `spawn-new-session`, so install all three.

### t3code

For the [T3 Code](https://github.com/pingdotgg/t3code) app only, Claude threads.

| | |
|---|---|
| [t3-new-session](skills/t3code/t3-new-session/SKILL.md) | Hands work to a fresh Claude thread in the running app. |
| [t3-settle](skills/t3code/t3-settle/SKILL.md) | Moves the thread to Settled once the turn ends. Add `$t3-settle` to any prompt. |
| [t3-replace-session](skills/t3code/t3-replace-session/SKILL.md) | Handoff, fresh thread continues the work, this one settles. For when context runs deep. |

`t3-replace-session` chains `handoff`, `t3-new-session` and `t3-settle`, so install all four.


## What works

- Say what "done" looks like. Let it find the path.
- Say when to stop, or when to come back and ask.
- Keep it short. Every word is context you pay for, every time.

## What doesn't

- Forty-step mega-prompts. It has read more code than you.
- Guardrails for things that were never going to happen.
- Styling instructions, tone notes, "please" and "thank you".

## Credit

`grilling`, `grill-me`, `prototype`, `tdd`, `to-spec`, `to-local-tickets`, `handoff` and `spec-code-review` are Matt Pocock's, from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, Copyright (c) Matt Pocock). `grill-me` and `tdd` are copied as-is; `grilling`, `prototype`, `to-spec`, `to-local-tickets`, `handoff` and `spec-code-review` carry my own edits on top (`grilling` never uses the question popup and puts each option on its own line; `prototype` defaults to 5 UI variants instead of 3 and has a shorter description; `to-local-tickets` is upstream's `to-tickets`, publishing tickets as local files instead of a tracker; `spec-code-review` is upstream's `code-review`, renamed to avoid colliding with Claude Code's built-in `/code-review`, it takes the spec path from you instead of looking it up on an issue tracker, and it reviews uncommitted changes instead of a branch diff).

`implement-spec` is a rewrite of his `skills/in-progress/implement-spec`, copied at `5b15a47` and reworked to produce uncommitted work on the current branch instead of a worktree, a branch and a PR. His structure stayed: spec plus tickets as a task graph with a frontier, sparse subagent comms through context pointers, implementer subagents working the frontier.

`unslop` is Lauren Tan's, from pstack in [cursor/plugins](https://github.com/cursor/plugins/tree/main/pstack) (MIT, Copyright (c) 2026 Lauren Tan). Its rules go back to [blader/humanizer](https://github.com/blader/humanizer) (MIT), built on Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing). My copy puts back the humanizer rules pstack dropped and adds a section on giving text a voice.

## License

MIT
