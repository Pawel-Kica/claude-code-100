---
name: spawn-new-session
description: "Hand work to real Claude agents running in their own cmux tabs"
argument-hint: "[task, or several tasks to split across agents]"
disable-model-invocation: true
---

Peer agents, not subagents: full Claude sessions in their own cmux tabs, each with its own context and permissions, user watching.

## Run

1. Write a brief per agent to `~/.claude/spawns/<YYYY-MM-DD-HHMM>-<slug>.md`. It is the whole handoff — the tab inherits nothing from this conversation.
2. `~/.claude/skills/spawn-new-session/scripts/spawn-agent.sh --brief <path> --cwd <dir> --label <slug>`. `--cwd` = current working dir unless the task clearly belongs elsewhere. Always spawn in background — never pass `--focus true`, even if the user says they will watch; they switch tabs themselves. `--split` for a pane, `--prompt <text>` to override the default kickoff prompt. cmux only — exits 3 if the cmux socket is unreachable.
3. `cmux read-screen --surface <ref> --lines 30` — expect the Claude TUI.
4. Report a table: Task | Tab | Brief. Then stop — the tabs own that work now.

## Brief

```markdown
# <title>
## Objective — done, in a line
## Context — decisions already made and why, constraints, gotchas; specs/PRs by path or URL
## Where — cwd, key files
## Do — ordered steps
## Goal / Done When — checkable criteria
## Suggested skills — /<skill>, why
```

A brief that ends in `git commit`/`push` says in writing that user approves first.
