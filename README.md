# Apsu Home Page

Front-end take-home: the Apsu home page (desktop 1440 / mobile 375) implemented as a Next.js App Router page plus a React component library, with Storybook.

**Status:** P2 data delivery and P3 design foundations are implemented. The fourteen-section source mock, validated API boundary, fonts, semantic tokens, motion tokens, token guard, and Foundations story are available. Product primitives and homepage sections remain P4/P5 work; `/` currently loads content into an otherwise empty main landmark.

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

Other checks: `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run check:tokens`, and `npm test`. Use `npm run format` to apply formatting.

No environment variables are required. Leave `NEXT_PUBLIC_API_URL` empty to import the local mock directly, or set it to an HTTP(S) backend base URL; see [.env.example](.env.example).

`npm test` runs Node-based tests once using `vitest.config.mts`. It discovers `*.test.ts` and `*.test.tsx` under `tests/` and `content/`; Storybook and Playwright `*.spec.ts` files are outside this scope. The suite contains 48 tests covering the page landmark, strict schema boundaries, complete source fixture, API branches and failures, motion parity, and token-guard behavior.
`npm run check:responsive` is a placeholder that reports "not implemented" and exits with code 1 until P6.1.

### Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 · Storybook 10 (Vite builder). All dependency versions are pinned exactly in `package.json`; `package-lock.json` is committed.

## Directory structure

```text
app/                  Next.js routes and the root layout; the home page is currently an empty shell
app/api/home/         GET handler serving the validated local mock
components/index.ts   Public entry point for the component library; no exports yet
components/ui/        Reusable UI primitives
components/sections/  Home page sections composed from props
content/schema.ts     Zod homepage contract, section schemas, and inferred types
content/mocks/        Complete source-copy fixture, constrained by HomePage
lib/api/              Data access functions
styles/tokens.css     Source typography, palette, spacing, shape and motion tokens
public/images/        Exported design assets
docs/                 Deviation logs and responsive evidence
tests/                Automated tests
scripts/              Project utilities, including AI log synchronization
.storybook/           Storybook configuration
ai-logs/              Raw AI session records, session index, and checksum manifest
```

Empty directories contain `.gitkeep` files so they survive a fresh clone. Planning documents (in Chinese) live under `ai/`; `ai/PROJECT.md` is the project spec and `ai/TODO.md` the task list. AI agent protocol files (`CLAUDE.md`, `AGENTS.md`, `.claude/`, `.agents/`) are committed on purpose so the AI-assisted process is fully visible.

Tailwind scans only `app/`, `components/`, and `.storybook/` through explicit sources in `app/globals.css`; design snapshots, skills, and AI logs do not contribute utility classes. Register any future UI source directory there.

## Data layer & API contract

**Implemented (P2):** [content/schema.ts](content/schema.ts) defines `HomePage` in fourteen-section reading order, with section schemas and types inferred through `z.infer`. Prices use integer USD cents; images require a local asset path, alt text, and positive intrinsic dimensions. Discriminated unions distinguish quote/photo stories, chat/image service cards, measurement systems, and action destinations. Strict objects reject unknown fields rather than silently discarding them.

Actions with missing destinations are explicitly `unresolved` authoring data; this does not approve a disabled button or placeholder link. They must be resolved before UI delivery. Live calculator input and results are not part of the page-content response. `sourcePreview` preserves the artwork’s inconsistent zero inputs / score of 56 as strings, explicitly separate from calculation state.

[content/mocks/home.ts](content/mocks/home.ts) supplies all fourteen sections with `satisfies HomePage`; tests validate the complete response. Source mistakes and board-specific copy are preserved pending the consolidated [deviation review](docs/deviations.md). Local image references currently point to a real 1 × 1 transparent SVG; P5 will replace paths and dimensions with source exports.

[lib/api/home.ts](lib/api/home.ts) exposes the single `getHomePage()` entry point. With no API URL it imports and parses the mock without homepage HTTP, including during static generation. With `NEXT_PUBLIC_API_URL` configured, it fetches `${NEXT_PUBLIC_API_URL}/api/home` with no-store and a 10-second timeout, checks HTTP status, and parses the response. Transport, JSON, and schema failures are surfaced, never silently replaced by mock data. Base URLs may include a path but not credentials, query, or fragment.

Switch to a conforming backend by changing only `NEXT_PUBLIC_API_URL`. The local route always serves the same mock independently of that setting. Verify it after starting the app:

```bash
curl --fail http://localhost:3000/api/home
```

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

**Implemented foundations (P3):** fluid sizing with `clamp()`, three breakpoints (`sm` 640, `lg` 1024, `xl` 1280), and a container capped at 1440 px. The Foundations story was measured in Chromium: 375/1440 gutters are 20/60 px; hero text is 36/72 px, section text 32/52 px, and body text 16/20 px. At 1920, the container stays 1440 px. The complete product page still requires the P6 scan across 11 widths.

The results table will live in `docs/responsive-report.md`, with three assertions per width. A final composite image will live in `docs/responsive-report.png`. Neither artifact exists yet; links and the results table will be added when evidence is available.

`npm run check:responsive` currently fails deliberately with a “not implemented” message. It does not validate layout yet.

## Interaction states & motion

**Implemented tokens (P3):** CSS budgets in `styles/tokens.css` and seconds-based values in `lib/motion.ts` are parity-tested. Fast/release/base/slow/stagger are 160/100/200/250/50 ms; ease-out is `cubic-bezier(0.23, 1, 0.32, 1)`, ease-in-out is `(0.77, 0, 0.175, 1)`, and drawer is `(0.32, 0.72, 0, 1)`. `fine-hover:` requires a fine pointer with hover capability. Reduced motion sets spatial duration and stagger to zero, press scale to 1, and shift to zero while retaining short color/opacity budgets. Consumers must select spatial tokens for spatial effects; the shared durations alone do not disable animation.

The adopted workflow follows Emil Kowalski’s motion guidance: use the cheapest suitable tool, starting with CSS; retain the installed `motion` package for interactions that justify it. Reduced motion removes spatial movement while allowing useful opacity and color feedback. Each implemented component will receive motion review and visual verification; no product interactions are implemented yet. The static Foundations story needs no animation. Proposed behavior is queued as D-01–D-03 for review, with no Motion runtime imported.

## Deviation log

[Design deviations and review queue](docs/deviations.md) contains C-category source defects and D-category proposed interactions. Every current entry is Pending: this baseline preserves source copy and colors until the owner reviews the complete set.

## Storybook

Run `npm run storybook` for the development server at `http://localhost:6006`, or `npm run build-storybook` to generate `storybook-static/`.

Stories are colocated with components and discovered under `components/` and `app/` as `*.stories.ts` or `*.stories.tsx`. The current configuration includes accessibility and pseudo-state addons, with 375 × 812 and 1440 × 900 viewport presets.

**Available:** `Foundations/Design tokens → Source Baseline`, using the same next/font Work Sans 400/500 and Syne 400/500 configuration as the app. Font loading, five type anchors, source surfaces, gutters, and the container cap have been verified in Chromium at 375/1440/1920. This is a token specimen, not the homepage design. Component/state stories and product accessibility checks remain P4/P5.

`npm run check:tokens` scans application styling sources for literal colors, arbitrary length utilities, nonstandard breakpoint variants, and common nonsemantic palette classes. `styles/tokens.css` is the source-value exception. The guard ignores comments and JSX URL attributes; it complements code and visual review rather than proving all CSS semantics.

## AI usage

Claude Code and Codex are used for project setup, implementation, documentation, and verification. The [session index](ai-logs/README.md) identifies each raw transcript and its scope; the [checksum manifest](ai-logs/MANIFEST.sha256) records the copied files. Raw logs are synchronized with `npm run sync:ai-logs` and are not manually edited.

| Tool        | Work represented                                                                                                                                                                                                                                                                                                                                                               | Session record                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Claude Code | Initial project scaffold, workflow setup, and requirement documentation                                                                                                                                                                                                                                                                                                        | [`b88f38d4-6900-41d6-855b-a41a6443cbce`](ai-logs/claude-code/b88f38d4-6900-41d6-855b-a41a6443cbce.jsonl)                       |
| Codex       | P0.1–P0.5 directory cleanup, npm scripts, test setup, lint rules, environment example, and verification; P0.6 README skeleton; P0 validation and P1 design-source audit, token mapping, UI inventory, and interaction drafts; P1.8 motion preparation; P2 schema/mock/API and source-copy preservation; P3 fonts, tokens, motion policy, guard, story and browser verification | [`01a0b03c-4d2e-7732-9d3d-a7e5e637ea96`](ai-logs/codex/rollout-2026-09-17T09-38-57-01a0b03c-4d2e-7732-9d3d-a7e5e637ea96.jsonl) |

The design audit is recorded in [the design system](ai/design_system/design-system.md), [UI inventory](ai/design_system/uiux/overview.md), and [interaction draft](ai/design_system/uiux/interactions.md). These internal documents are in Chinese; implementation and public delivery documentation are in English. Design corrections remain candidates awaiting approval.

Four MIT-licensed skills from [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/85e8e2363b713506e1d5b6e07a0eb2da66be1bc3) are vendored at commit `85e8e2363b713506e1d5b6e07a0eb2da66be1bc3`: `emil-design-eng`, `animate`, `review-animations`, and `find-animation-opportunities`. Their original Markdown and licenses live in `ai/jaSkills/`; project adaptations and invocation points are recorded in [the registry](ai/JASKILL.md) and [motion workflow](ai/features/MOTION.md). Codex installed and evaluated them for P1.8 preparation; component reviews will run during P3–P5, and their outcomes are not claimed in advance.

The index also includes an additional Claude Code transcript. Per-component and per-section attribution will be added as those implementations are completed.

## Known limitations

- Homepage sections and the reusable product component exports remain P4/P5 work. The Foundations story is not a finished homepage.
- Images are transparent local fixtures until P5 source exports; unresolved action destinations remain explicit authoring data.
- Source copy, repeated FAQ answers, and bright-accent contrast defects are intentionally preserved pending the consolidated deviation review.
- Tests cover data and foundations, not product interactions or full-page accessibility. Responsive validation remains a failing P6 placeholder; no complete-page responsive report is claimed.
- next/font/google requires network access during a fresh build; this project accepts that constraint. Storybook’s adapter also loads Google fonts.
- Header breakpoint validation, component motion/visual reviews, final assets, and final delivery acceptance remain outstanding.
