# AI session logs

Raw, unedited session records for this project, as required by the assignment (§6).
`claude-code/` holds Claude Code transcripts (`<session-id>.jsonl`, plus a same-named directory for sub-agent logs when present); `codex/` holds Codex CLI rollouts whose `cwd` is this repository. `MANIFEST.sha256` lists the checksum of every raw file as copied and is regenerated on each sync by `npm run sync:ai-logs` (`scripts/sync-ai-logs.sh`). Readable exports, when provided, live in `readable/` and are derived; the raw files are authoritative.

| Session | Date(s) | Tool | What this session did | Commit range |
|---|---|---|---|---|
| `b88f38d4-6900-41d6-855b-a41a6443cbce` | 2026-09-16 → 2026-09-17 | Claude Code (desktop) | AI-workflow bootstrap (shelf init, protocol files, `ai/` docs), Next.js 16 / Storybook 10 scaffold with pinned deps, assignment translation and requirement registry, Figma MCP setup and board discovery, ai-logs sync script | `703255b` initial commit → (ongoing) |
