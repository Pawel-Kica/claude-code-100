---
name: replace-current-session
description: "Hand off to a fresh Claude session in a new cmux tab, then close this one"
argument-hint: "[what the successor should focus on]"
disable-model-invocation: true
---

Swap this session for a fresh one. Deterministic: the same three steps every run, no branching on what the conversation produced.

Abort rule: any step fails → report it and keep this session alive. Never close without a live successor.

1. **Handoff** — run the `/handoff` skill, passing the args as the successor's focus. It writes the doc to `~/.claude/handoffs/`. A spec, plan, or PR already on disk gets referenced by path inside the handoff, not duplicated (handoff's own rule) — if the next move is implementing it, the handoff says so.
2. **Spawn** — successor in the same cwd, focused:
   ```bash
   ~/.claude/skills/spawn-new-session/scripts/spawn-agent.sh \
     --brief <handoff-path> --cwd "$PWD" --label <slug> --focus true \
     --prompt "Read the handoff at <handoff-path> and continue the work."
   ```
3. **Verify, then die** — `cmux read-screen --surface <ref> --lines 30`, expect the Claude TUI. Then, as the final tool call of the turn, `cmux close-surface --surface "$CMUX_SURFACE_ID"`. Say goodbye before the close, not after — nothing after it survives.
