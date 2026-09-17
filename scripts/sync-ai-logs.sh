#!/usr/bin/env bash
# Copy raw AI session logs for THIS project into ai-logs/ byte-for-byte.
# Usage: scripts/sync-ai-logs.sh [--check]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SLUG="$(echo "$ROOT" | sed 's#/#-#g')"
CLAUDE_SRC="$HOME/.claude/projects/$SLUG"
CODEX_SRC="$HOME/.codex/sessions"
DST="$ROOT/ai-logs"

if [[ "${1:-}" == "--check" ]]; then
  [[ -d "$CLAUDE_SRC" ]] && echo "claude: $CLAUDE_SRC ($(ls "$CLAUDE_SRC"/*.jsonl 2>/dev/null | wc -l | tr -d ' ') sessions)" || echo "claude: no logs yet for $SLUG"
  exit 0
fi

mkdir -p "$DST/claude-code" "$DST/codex"
# Claude Code: main transcripts + subagent dirs
if [[ -d "$CLAUDE_SRC" ]]; then
  rsync -a --include='*.jsonl' --include='*/' --exclude='*' "$CLAUDE_SRC/" "$DST/claude-code/"
fi
# Codex: only rollouts whose cwd is this repo
if [[ -d "$CODEX_SRC" ]]; then
  # `|| true`: grep exits 1 when this repo has no Codex sessions yet; with pipefail that would abort before the manifest.
  { grep -rl --include='*.jsonl' "\"cwd\":\"$ROOT\"" "$CODEX_SRC" 2>/dev/null || true; } | while read -r f; do
    cp -p "$f" "$DST/codex/"
  done
fi
# Integrity manifest: sha256 of every raw log as copied. Regenerated each run.
( cd "$DST" && find claude-code codex -type f -name '*.jsonl' -print0 | sort -z | xargs -0 shasum -a 256 ) > "$DST/MANIFEST.sha256"
echo "synced -> $DST"
git -C "$ROOT" status --short ai-logs | head
