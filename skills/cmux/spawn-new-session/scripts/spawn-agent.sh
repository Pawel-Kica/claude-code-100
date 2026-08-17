#!/usr/bin/env bash
# spawn-agent.sh - launch a real Claude agent in a new cmux tab/pane.
#
# cmux only: exits 3 if the cmux socket is unreachable.
# Creates the tab, then sends `cd <cwd> && claude "<prompt>"` into its interactive
# shell (so zsh config/aliases resolve and the agent keeps the tab after it exits).
#
# Usage:
#   spawn-agent.sh --brief <path> [--cwd <dir>] [--label <name>] [--focus true|false]
#                  [--split] [--prompt <text>] [--dry-run]
#
# Prints one machine-readable line on success:
#   SPAWNED <tool> <ref> <brief>
set -uo pipefail

CMUX_BIN="${CMUX_BUNDLED_CLI_PATH:-/Applications/cmux.app/Contents/Resources/bin/cmux}"
[ -x "$CMUX_BIN" ] || CMUX_BIN="$(command -v cmux 2>/dev/null || true)"

BRIEF=""; CWD="$PWD"; LABEL="agent"; FOCUS="false"; SPLIT=0; DRY=0; PROMPT_OVERRIDE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --brief) BRIEF="$2"; shift 2;;
    --cwd) CWD="$2"; shift 2;;
    --label) LABEL="$2"; shift 2;;
    --focus) FOCUS="$2"; shift 2;;
    --split) SPLIT=1; shift;;
    --prompt) PROMPT_OVERRIDE="$2"; shift 2;;
    --dry-run) DRY=1; shift;;
    *) echo "unknown arg: $1" >&2; exit 2;;
  esac
done

[ -n "$BRIEF" ] || { echo "error: --brief is required" >&2; exit 2; }
[ -f "$BRIEF" ] || { echo "error: brief not found: $BRIEF" >&2; exit 2; }
[ -d "$CWD" ] || { echo "error: cwd not found: $CWD" >&2; exit 2; }

PROMPT="Read your brief at ${BRIEF} and execute it end to end. Follow its Done-when criteria. Work autonomously; only stop for input if genuinely blocked."
[ -n "$PROMPT_OVERRIDE" ] && PROMPT="$PROMPT_OVERRIDE"
CMD="cd ${CWD} && claude \"${PROMPT}\""

if [ "$DRY" = 1 ]; then echo "DRYRUN $CMD"; exit 0; fi

# --- cmux ---------------------------------------------------------------
if [ -z "$CMUX_BIN" ] || ! "$CMUX_BIN" ping >/dev/null 2>&1; then
  echo "error: cmux not reachable (binary missing or socket down)" >&2
  exit 3
fi

REF=""
for attempt in 1 2 3; do
  if [ "$SPLIT" = 1 ]; then
    OUT=$("$CMUX_BIN" new-pane --direction right --focus "$FOCUS" 2>&1)
    REF=$(printf '%s\n' "$OUT" | grep -m1 -o 'surface:[0-9]*')
    [ -n "$REF" ] || REF=$(printf '%s\n' "$OUT" | grep -m1 -o 'pane:[0-9]*')
  else
    OUT=$("$CMUX_BIN" new-surface --working-directory "$CWD" --focus "$FOCUS" 2>&1)
    REF=$(printf '%s\n' "$OUT" | grep -m1 -o 'surface:[0-9]*')
  fi
  [ -n "$REF" ] && break
  sleep 0.3
done
[ -n "$REF" ] || { echo "error: cmux could not create a surface: $OUT" >&2; exit 1; }

sleep 0.4
SENT=0
for attempt in 1 2 3; do
  SEND=$("$CMUX_BIN" send --surface "$REF" "$CMD"$'\n' 2>&1)
  if [ $? -eq 0 ] && ! printf '%s' "$SEND" | grep -qiE 'error|broken pipe'; then SENT=1; break; fi
  sleep 0.3
done
[ "$SENT" = 1 ] || { echo "error: cmux send failed for $REF: $SEND" >&2; exit 1; }

# Claude asks to trust an unfamiliar workspace on first launch there, which stalls the
# agent forever. Auto-confirm only inside the user's own roots; otherwise hand it back.
sleep 5
SCREEN=$("$CMUX_BIN" read-screen --surface "$REF" --lines 40 2>/dev/null)
if printf '%s' "$SCREEN" | grep -q "trust this folder"; then
  case "$CWD" in
    "$HOME"/Desktop*|"$HOME"/Work*|"$HOME"/claude-projects*|/tmp*|/private/tmp*)
      "$CMUX_BIN" send-key --surface "$REF" enter >/dev/null 2>&1; sleep 2;;
    *)
      echo "NEEDS-TRUST cmux $REF $BRIEF"
      echo "note: $REF is waiting on the folder-trust prompt for $CWD; press Enter there" >&2
      exit 0;;
  esac
fi
echo "SPAWNED cmux $REF $BRIEF"; exit 0
