---
name: past-conversations
description: "Search or resume past Claude Code chats by topic or session id. Trigger /past-conversations, 'search past conversations', 'resume where I left off'."
argument-hint: <search | resume> <topic | session-id>
---

Search and resume your own Claude Code chat history. Transcripts: `~/.claude/projects/*/*.jsonl`, skip `subagents/` and `workflows/`.

| Mode | Triggers | Does |
|---|---|---|
| **search** | "what did I land on about X", "find conversation about X" | Find, read, report. Don't continue work. |
| **resume** | "resume X", "pick up where I left off", a session id | Reconstruct state, continue here. |

No request → ask. Unclear → search, offer resume.

## Find candidates

Pass A, titles (`ai-title`, first user turn):

```bash
cd ~/.claude/projects
for f in ./*/*.jsonl; do
  t=$(grep -m1 '"type":"ai-title"' "$f" 2>/dev/null | jq -r '.aiTitle // empty' 2>/dev/null)
  [ -n "$t" ] && printf '%s\t%s\t%s\n' "$(stat -f '%Sm' -t '%Y-%m-%d %H:%M' "$f")" "$t" "$f"
done
```

Filter for query terms, sort date desc. Title hit > body hit > recency. Skip current session. Scope ("in <project>") → filter paths matching that project.

Pass B, full-text fallback: `grep -rl "<term>" ~/.claude/projects --include='*.jsonl'`. Quote globs in zsh.

## Read matches

```bash
jq -rc 'select(.type=="user" or .type=="assistant") |
  (if .message.role=="user" then "U" else "A" end) as $r |
  (.message.content | if type=="string" then . else ([.[]|select(.type=="text")|.text]|join(" ")) end) as $txt |
  select(($txt|length)>0) | select(($txt|startswith("<"))|not) | "\($r): \($txt)"' "<file>"
```

Project: `grep -m1 '"type":"user"' "<file>" | jq -r '.cwd'`. Skip skill-injection / `<local-command` preamble on first turns.

## Respond

Tag each citation `(2026-06-09)`. Session id = `.jsonl` basename.

**Search** - top 1-3 matches, lead with answer: one-line conclusion, then per match Established / Decided / Stopped. 0 hits → say so, suggest broader terms.

**Resume** - one best session, read fully, reconstruct goal / done / pending, continue.

Mirror language of matched chat (en/pl). >30 days old → flag stale before acting.
