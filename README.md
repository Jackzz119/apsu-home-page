# Apsu Home Page

Front-end take-home: the Apsu home page (desktop 1440 / mobile 375) implemented as a Next.js App Router page plus a React component library, with Storybook.

**Status:** engineering checks and the initial design audit are complete. Source snapshots, token mappings, and a 14-section UI inventory are documented; the home page remains an empty shell. The sections below distinguish implemented tooling from planned product behavior.

## Getting started

### Requirements

Node 22 LTS (tested on 22.23.1); minimum 20.9. npm 10.x ships with Node 22.

### Run

```bash
npm install
npm run build        # production build
npm run dev          # http://localhost:3000
npm run storybook    # http://localhost:6006
```

Other checks: `npm run lint`, `npm run typecheck`, `npm run format:check`, and `npm test`. Use `npm run format` to apply formatting.

No environment variables are required to run the current scaffold. `.env.example` documents the optional `NEXT_PUBLIC_API_URL` setting for the planned data layer; that integration is not implemented yet.

`npm test` runs Node-based tests once using `vitest.config.mts`. It discovers `*.test.ts` and `*.test.tsx` under `tests/` and `content/`; Storybook and Playwright `*.spec.ts` files are outside this scope. The first smoke test renders the home page and checks that it has one main landmark.
`npm run check:responsive` is a placeholder that reports "not implemented" and exits with code 1 until P6.1.

### Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 · Storybook 10 (Vite builder). All dependency versions are pinned exactly in `package.json`; `package-lock.json` is committed.

## Directory structure

```text
app/                  Next.js routes and the root layout; the home page is currently an empty shell
app/api/home/         Empty directory reserved for the planned mock backend
components/index.ts   Public entry point for the component library; no exports yet
components/ui/        Reusable UI primitives
components/sections/  Home page sections composed from props
content/mocks/        Mock content for the future home page contract
lib/api/              Data access functions
styles/tokens.css     Design token placeholder; semantic tokens are not implemented
public/images/        Exported design assets
docs/                 Deviation logs and responsive evidence
tests/                Automated tests
scripts/              Project utilities, including AI log synchronization
.storybook/           Storybook configuration
ai-logs/              Raw AI session records, session index, and checksum manifest
```

Empty directories contain `.gitkeep` files so they survive a fresh clone. Planning documents (in Chinese) live under `ai/`; `ai/PROJECT.md` is the project spec and `ai/TODO.md` the task list. AI agent protocol files (`CLAUDE.md`, `AGENTS.md`, `.claude/`, `.agents/`) are committed on purpose so the AI-assisted process is fully visible.

## Data layer & API contract

**Planned (P2):** `content/schema.ts` will define the Zod `HomePage` schema and inferred types. `content/mocks/home.ts` will provide content constrained by that type, with a Vitest test validating `HomePage.parse(homeMock)`.

`lib/api/home.ts` will expose the single `getHomePage()` entry point. An empty `NEXT_PUBLIC_API_URL` will use the mock directly without build-time HTTP; setting it in `.env` will fetch `${NEXT_PUBLIC_API_URL}/api/home` and validate the response. `app/api/home/route.ts` will return the same mock as a local backend. Switching to a real backend will require changing only that environment variable, provided the backend follows the contract.

These files and behaviors are not implemented yet. The current [.env.example](.env.example) documents the optional setting only.

## Design decisions

The following decisions are agreed for implementation; this table is not a claim that the planned features already exist.

| Area              | Decision                                                                                       | Reason                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Design tokens     | Semantic CSS variables through Tailwind v4 `@theme`                                            | Theme changes should not require component edits.                                        |
| Images            | Static imports through `next/image`, with `{ src, alt, width, height }` content                | Alternative text belongs to content; dimensions reserve space and prevent layout shifts. |
| Motion            | CSS first; use the installed Motion dependency only where interaction needs justify it         | Keep feedback restrained and avoid unnecessary runtime animation work.                   |
| State             | Local `useState` / `useReducer`; a pure BMI calculation function                               | The home page does not need a global store.                                              |
| Routing           | One `/` route; Weight Loss, Birth Control, and Sleep navigation will scroll to section anchors | Separate product pages are outside the assignment scope.                                 |
| API contract      | A Zod schema with `HomePage` as the root type                                                  | The data contract can be reviewed independently of the UI.                               |
| Data access       | One `getHomePage()` entry point, a Route Handler mock backend, and an optional API base URL    | This preserves an HTTP boundary without running another service.                         |
| Responsive layout | Fluid `clamp()` values, `sm` / `lg` / `xl` layout breakpoints, and a 1440 px container cap     | Interpolation covers intermediate widths; layout changes have explicit thresholds.       |
| Component library | Prop-driven components exported from `components/index.ts`; the page consumes `@/components`   | Components should be reusable outside this page. The entry point is currently empty.     |

## Responsive strategy

**Planned (P3/P6):** fluid sizing with `clamp()`, three layout breakpoints (`sm`, `lg`, `xl`), and a container capped at 1440 px. The implementation will be checked across 11 widths from 320 to 1920 px.

The results table will live in `docs/responsive-report.md`, with three assertions per width. A final composite image will live in `docs/responsive-report.png`. Neither artifact exists yet; links and the results table will be added when evidence is available.

`npm run check:responsive` currently fails deliberately with a “not implemented” message. It does not validate layout yet.

## Interaction states & motion

**Planned (P3/P4):** shared motion tokens, consistent hover/focus/pressed/disabled states, and reduced-motion behavior. The token table and links to the D-category interaction entries in the deviation log will be added after implementation.

The adopted workflow follows Emil Kowalski’s motion guidance: use the cheapest suitable tool, starting with CSS; retain the installed `motion` package for interactions that justify it. Reduced motion removes spatial movement while allowing useful opacity and color feedback. Each implemented component will receive motion review and visual verification; no interactive components or motion tokens have shipped yet.

## Deviation log

The delivery will link to `docs/deviations.md` here. That file has not been created yet; approved design corrections and added interaction behavior will be recorded as C- and D-category entries during implementation.

## Storybook

Run `npm run storybook` for the development server at `http://localhost:6006`, or `npm run build-storybook` to generate `storybook-static/`.

Stories are colocated with components and discovered under `components/` and `app/` as `*.stories.ts` or `*.stories.tsx`. The current configuration includes accessibility and pseudo-state addons, with 375 × 812 and 1440 × 900 viewport presets.

**Pending (P4/P5):** there are no component stories yet. A component/state inventory will be added here as stories ship. Configuring the accessibility addon is not evidence that the future components pass accessibility checks.

## AI usage

Claude Code and Codex are used for project setup, implementation, documentation, and verification. The [session index](ai-logs/README.md) identifies each raw transcript and its scope; the [checksum manifest](ai-logs/MANIFEST.sha256) records the copied files. Raw logs are synchronized with `npm run sync:ai-logs` and are not manually edited.

| Tool        | Work represented                                                                                                                                                                                                             | Session record                                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Claude Code | Initial project scaffold, workflow setup, and requirement documentation                                                                                                                                                      | [`b88f38d4-6900-41d6-855b-a41a6443cbce`](ai-logs/claude-code/b88f38d4-6900-41d6-855b-a41a6443cbce.jsonl)                       |
| Codex       | P0.1–P0.5 directory cleanup, npm scripts, test setup, lint rules, environment example, and verification; P0.6 README skeleton; P0 validation and P1 design-source audit, token mapping, UI inventory, and interaction drafts | [`01a0b03c-4d2e-7732-9d3d-a7e5e637ea96`](ai-logs/codex/rollout-2026-09-17T09-38-57-01a0b03c-4d2e-7732-9d3d-a7e5e637ea96.jsonl) |

The design audit is recorded in [the design system](ai/design_system/design-system.md), [UI inventory](ai/design_system/uiux/overview.md), and [interaction draft](ai/design_system/uiux/interactions.md). These internal documents are in Chinese; implementation and public delivery documentation are in English. Design corrections remain candidates awaiting approval.

Four MIT-licensed skills from [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/85e8e2363b713506e1d5b6e07a0eb2da66be1bc3) are vendored at commit `85e8e2363b713506e1d5b6e07a0eb2da66be1bc3`: `emil-design-eng`, `animate`, `review-animations`, and `find-animation-opportunities`. Their original Markdown and licenses live in `ai/jaSkills/`; project adaptations and invocation points are recorded in [the registry](ai/JASKILL.md) and [motion workflow](ai/features/MOTION.md). Codex installed and evaluated them for P1.8 preparation; component reviews will run during P3–P5, and their outcomes are not claimed in advance.

The index also includes an additional Claude Code transcript. Per-component and per-section attribution will be added as those implementations are completed.

## Known limitations

- The home page renders only an empty main landmark; the component export file contains no components.
- The data contract, mock data, API route, semantic design tokens, assets, and product interactions are pending.
- The current test suite contains one rendering smoke test; it does not verify final content, interactions, accessibility, or responsive behavior.
- Responsive validation is a failing placeholder. Responsive evidence, the deviation log, and component stories are not available yet.
- This README is the P0.6 documentation skeleton. Final delivery documentation and acceptance checks remain pending.
