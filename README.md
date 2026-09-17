# Apsu Home Page

Front-end take-home: the Apsu home page (desktop 1440 / mobile 375) implemented as a Next.js App Router page plus a React component library, with Storybook.

**Status:** directory skeleton and empty home page shell are ready. No sections or components yet.

## Requirements

Node 22 LTS (tested on 22.23.1); minimum 20.9. npm 10.x ships with Node 22.

## Run

```bash
npm install
npm run build        # production build
npm run dev          # http://localhost:3000
npm run storybook    # http://localhost:6006
```

Other scripts: `npm run lint`, `npm run typecheck`, `npm run build-storybook`.

No environment variables are required to run the current scaffold. `.env.example` documents the optional `NEXT_PUBLIC_API_URL` setting for the planned data layer; that integration is not implemented yet.

`npm test` runs Node-based tests once using `vitest.config.mts`. It discovers `*.test.ts` and `*.test.tsx` under `tests/` and `content/`; Storybook and Playwright `*.spec.ts` files are outside this scope. The first smoke test renders the home page and checks that it has one main landmark.
`npm run check:responsive` is a placeholder that reports "not implemented" and exits with code 1 until P6.1.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 · Storybook 10 (Vite builder). All dependency versions are pinned exactly in `package.json`; `package-lock.json` is committed.

## Repository layout

```text
app/                  Next.js routes and the root layout; the home page is currently an empty shell
components/index.ts   Public entry point for the component library; no exports yet
components/ui/        Reusable UI primitives
components/sections/  Home page sections composed from props
content/mocks/        Mock content for the future home page contract
lib/api/              Data access functions
styles/tokens.css     Design token placeholder, pending the Figma audit
public/images/        Exported design assets
docs/                 Deviation logs and responsive evidence
tests/                Automated tests
scripts/              Project utilities, including AI log synchronization
.storybook/           Storybook configuration
```

Empty directories contain `.gitkeep` files so they survive a fresh clone. Planning documents (in Chinese) live under `ai/`; `ai/PROJECT.md` is the project spec and `ai/TODO.md` the task list. AI agent protocol files (`CLAUDE.md`, `AGENTS.md`, `.claude/`, `.agents/`) are committed on purpose so the AI-assisted process is fully visible.

## AI usage

This project uses Claude Code and Codex. Codex added the P0.1 directory skeleton and removed the starter page and SVG assets. Complete, unedited session logs will be committed under `ai-logs/` (see `ai/PROJECT.md` §8). A per-section breakdown with session references will be added here.

## Deviation log

See `docs/deviations.md` (to be created with the first design fix).
