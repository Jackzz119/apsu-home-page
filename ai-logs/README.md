# AI session logs

Raw, unedited session records for this project, as required by the assignment (§6).
`claude-code/` holds Claude Code transcripts (`<session-id>.jsonl`, plus a same-named directory for sub-agent logs when present); `codex/` holds Codex CLI rollouts whose `cwd` is this repository. `MANIFEST.sha256` lists the checksum of every raw file as copied and is regenerated on each sync by `npm run sync:ai-logs` (`scripts/sync-ai-logs.sh`). Readable exports, when provided, live in `readable/` and are derived; the raw files are authoritative.

| Session | Date(s) | Tool | What this session did | Commit range |
|---|---|---|---|---|
| `b88f38d4-6900-41d6-855b-a41a6443cbce` | 2026-09-16 → 2026-09-17 | Claude Code (desktop) | AI-workflow bootstrap (shelf init, protocol files, `ai/` docs), Next.js 16 / Storybook 10 scaffold with pinned deps, assignment translation and requirement registry, Figma MCP setup and board discovery, ai-logs sync script | `703255b` initial commit → (ongoing) |
| `c1519747-7fbd-43f0-ac55-e03a5ce8c1da` | 2026-09-17 | Claude Code | Existing project transcript refreshed by the standard synchronization script, without editing its contents | Through the P0.1 log sync |
| `01a0b03c-4d2e-7732-9d3d-a7e5e637ea96` | 2026-09-17 | Codex | P0.1 directory skeleton, starter asset removal, repository documentation, and P1.1 variable snapshot | `1bb885c` + accompanying log sync |
