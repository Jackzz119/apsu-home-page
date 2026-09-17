# Apsu Home Page

Front-end take-home: the Apsu home page (desktop 1440 / mobile 375) implemented as a Next.js App Router page plus a React component library, with Storybook.

**Status:** scaffold only. No sections or components yet.

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

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 · Storybook 10 (Vite builder). All dependency versions are pinned exactly in `package.json`; `package-lock.json` is committed.

## Repository layout

To be documented as the codebase grows. Planning documents (in Chinese) live under `ai/`; `ai/PROJECT.md` is the project spec and `ai/TODO.md` the task list. AI agent protocol files (`CLAUDE.md`, `AGENTS.md`, `.claude/`, `.agents/`) are committed on purpose so the AI-assisted process is fully visible.

## AI usage

This project is built with Claude Code. Complete, unedited session logs will be committed under `ai-logs/` (see `ai/PROJECT.md` §8). A per-section breakdown of what the AI wrote will be added here.

## Deviation log

See `docs/deviations.md` (to be created with the first design fix).
