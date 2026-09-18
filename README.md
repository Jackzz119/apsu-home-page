# Apsu Home Page

[![CI](https://github.com/Jackzz119/apsu-home-page/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Jackzz119/apsu-home-page/actions/workflows/ci.yml)

Front-end take-home: the Apsu home page (desktop 1440 / mobile 375) implemented as a Next.js App Router page plus a React component library, with Storybook.

**Status:** Implementation complete: fourteen homepage sections, eleven reusable primitives, real source assets, a working BMI calculator and accessible menu/carousel/FAQ/marquees. Storybook contains 111 stories. Every push runs the quality gates, the browser acceptance suite and the eleven-width scan on Linux through [GitHub Actions](#continuous-integration); [P5 evidence](docs/p5-review.md) records the design review.

**Live:** [Home page](https://apsu-home.vercel.app) · [Storybook](https://apsu-home-storybook.vercel.app). Both are Vercel projects on this repository and redeploy automatically on every push to `main`.

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

Other checks: `npm run test:ui`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run check:tokens`, and `npm test`. Use `npm run format` to apply formatting.

No environment variables are required. Leave `NEXT_PUBLIC_API_URL` empty to import the local mock directly, or set it to an HTTP(S) backend base URL; see [.env.example](.env.example).

`npm test` runs Node-based tests once using `vitest.config.mts`. It discovers `*.test.ts` and `*.test.tsx` under `tests/` and `content/`; Storybook and Playwright `*.spec.ts` files are outside this scope. The suite contains 110 tests covering content/API contracts, motion/token rules, BMI calculations, decoded asset dimensions and the delivery acceptance checks in `tests/acceptance/`: the committed lockfile with exact pins, a colocated story per state, the README sections and links, and the raw AI-log checksums and session index.
With an app server running, `npm run check:responsive` checks eleven widths and updates the responsive report; set `RESPONSIVE_URL` to target a different origin.

### Continuous integration

[GitHub Actions](.github/workflows/ci.yml) runs on every push to `main` and on pull requests, on `ubuntu-latest` with the Node version from `.nvmrc`. The `quality` job runs `npm ci`, `format:check`, `typecheck`, `lint`, `check:tokens`, `build`, `build-storybook` and `test`. The `browser` job installs Chromium, builds the app, runs the Playwright suite against Storybook and the production server, then serves the build for the eleven-width `check:responsive` scan; traces, the regenerated report and the screenshots are uploaded as artifacts. A green Linux run also proves case-sensitive imports and the clean-install path that macOS development cannot.

### Acceptance tests

Each machine-checkable assignment requirement has a dedicated check; pixel fidelity and design judgement stay with the review documents and the deviation log.

| Assignment                | Check                                                                                                                                                       | Where                                        |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| §1 commit the lockfile    | Tracked, exactly pinned, mirrors `package.json`; `npm ci` runs in CI                                                                                        | `tests/acceptance/lockfile.test.ts`          |
| §3 types as the contract  | Every exported type is inferred from its zod schema; the full mock parses                                                                                   | `tests/schema.test.ts`, `tests/data.test.ts` |
| §4B 320–1920 completeness | No page overflow, single-line navigation, section and text bounds at eleven widths                                                                          | `scripts/check-responsive.ts`                |
| §4D interaction states    | Hover, focus-visible and pressed forced on every visible control (a field's spin buttons count as part of the field), with a transition on pointer feedback | `tests/acceptance/states.spec.ts`            |
| §4E Storybook             | A colocated stories file per primitive and client section; state names and counts match the inventory                                                       | `tests/acceptance/stories.test.ts`           |
| §5 README                 | Ten delivery sections, the four reviewer commands, AI-usage and deviation links that resolve                                                                | `tests/acceptance/readme.test.ts`            |
| §6 AI logs                | Raw transcripts per tool, checksums that match the manifest, every session indexed                                                                          | `tests/acceptance/ai-logs.test.ts`           |

### Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 · Storybook 10 (Vite builder). All dependency versions are pinned exactly in `package.json`; `package-lock.json` is committed.

## Directory structure

```text
app/                  Next.js routes, root layout and the fourteen-section homepage
app/api/home/         GET handler serving the validated local mock
components/index.ts   Public entry point for primitives, sections and their props
components/ui/        Reusable UI primitives
components/sections/  Home page sections composed from props
content/schema.ts     Zod homepage contract, section schemas, and inferred types
content/mocks/        Source-copy HomePage fixture, local assets and primitive labels
lib/api/              Data access functions
styles/tokens.css     Source typography, palette, spacing, shape and motion tokens
public/images/        Exported design assets
docs/                 Deviation logs and responsive evidence
tests/                Node, Storybook primitive and integrated-page browser tests
scripts/              Project utilities: token guard, responsive scan, AI log sync and readable export
.storybook/           Storybook configuration and primitive canvas decorator
ai-logs/              Raw AI session records, session index, checksum manifest and derived readable views
```

Empty directories contain `.gitkeep` files so they survive a fresh clone. Planning documents (in Chinese) live under `ai/`; `ai/PROJECT.md` is the project spec and `ai/TODO.md` the task list. AI agent protocol files (`CLAUDE.md`, `AGENTS.md`, `.claude/`, `.agents/`) are committed on purpose so the AI-assisted process is fully visible.

Tailwind scans only `app/`, `components/`, and `.storybook/` through explicit sources in `app/globals.css`; design snapshots, skills, and AI logs do not contribute utility classes. Register any future UI source directory there.

## Data layer & API contract

**Implemented (P2):** [content/schema.ts](content/schema.ts) defines `HomePage` in fourteen-section reading order, with section schemas and types inferred through `z.infer`. Prices use integer USD cents; images require a local asset path, alt text, and positive intrinsic dimensions. Discriminated unions distinguish quote/photo stories, chat/image service cards, measurement systems, and action destinations. Strict objects reject unknown fields rather than silently discarding them.

Actions distinguish real section anchors, external URLs, and owner-approved `demo` controls. Login, Contact, consultation and other destination-free controls demonstrate visual states only; they do not navigate, make requests or simulate business success. The strict demo variant cannot contain an href or target. Live calculator input and results are not part of the page-content response. `sourcePreview` preserves the artwork’s inconsistent zero inputs / score of 56 as strings, explicitly separate from calculation state.

[content/mocks/home.ts](content/mocks/home.ts) supplies all fourteen sections with `satisfies HomePage`; tests validate the complete response. Approved copy corrections are applied; the original Weight Loss title, first FAQ answer and board-specific differences are preserved. Original FAQ wording and implementation status remain in the [deviation record](docs/deviations.md). Local image references use source exports with real intrinsic dimensions; [asset provenance](docs/assets.md) records every file. Semaglutide reuses the available Tirzepatide vial artwork by owner approval (C-12); the packaging label mismatch is documented as a visual-demo limitation. `content/presentation.ts` supplies control/a11y labels and shared decorative artwork through props.

[lib/api/home.ts](lib/api/home.ts) exposes the single `getHomePage()` entry point. With no API URL it imports and parses the mock without homepage HTTP, including during static generation. With `NEXT_PUBLIC_API_URL` configured, it fetches `${NEXT_PUBLIC_API_URL}/api/home` with no-store and a 10-second timeout, checks HTTP status, and parses the response. Transport, JSON, and schema failures are surfaced, never silently replaced by mock data. Base URLs may include a path but not credentials, query, or fragment.

Switch to a conforming backend by changing only `NEXT_PUBLIC_API_URL`. The local route always serves the same mock independently of that setting. Verify it after starting the app:

```bash
curl --fail http://localhost:3000/api/home
```

## Design decisions

The following decisions are implemented in the P5 page. Business destinations remain visual demos by owner agreement.

| Area              | Decision                                                                                     | Reason                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Design tokens     | Semantic CSS variables through Tailwind v4 `@theme`                                          | Theme changes should not require component edits.                                                |
| Images            | Local exports through `next/image`, with `{ src, alt, width, height }` content               | Alternative text belongs to content; dimensions reserve space and prevent layout shifts.         |
| Motion            | CSS first; use the installed Motion dependency only where interaction needs justify it       | Keep feedback restrained and avoid unnecessary runtime animation work.                           |
| State             | Local `useState` / `useReducer`; a pure BMI calculation function                             | The home page does not need a global store.                                                      |
| Routing           | One `/` route; Weight Loss, Birth Control, and Sleep navigation scrolls to section anchors   | Separate product pages are outside the assignment scope.                                         |
| API contract      | A Zod schema with `HomePage` as the root type                                                | The data contract can be reviewed independently of the UI.                                       |
| Data access       | One `getHomePage()` entry point, a Route Handler mock backend, and an optional API base URL  | This preserves an HTTP boundary without running another service.                                 |
| Responsive layout | Fluid `clamp()` values, `sm` / `lg` / `xl` layout breakpoints, and a 1440 px container cap   | Interpolation covers intermediate widths; layout changes have explicit thresholds.               |
| Component library | Prop-driven components exported from `components/index.ts`; the page consumes `@/components` | Components are reusable without page data imports or a provider; eleven primitives are exported. |

## Responsive strategy

Fluid sizing uses `clamp()`, three layout breakpoints (`sm` 640, `lg` 1024, `xl` 1280), and a 1440px container cap; the real Header remains on one line at 1024px. The [production report](docs/responsive-report.md) records all eleven widths and explains the geometry checks and exclusions. The composite below shows those widths in ascending order, from 320px on the left to 1920px on the right.

![Eleven-width homepage composite](docs/responsive-report.png)

| Widths (px)                                                | No page overflow | Single-line navigation | Section/text bounds |
| ---------------------------------------------------------- | ---------------- | ---------------------- | ------------------- |
| 320, 360, 375, 414, 640, 768, 1024, 1280, 1440, 1600, 1920 | Pass             | Pass                   | Pass                |

Run against a running dev or production server:

```bash
npm run check:responsive
# Optional custom preview origin:
RESPONSIVE_URL=http://127.0.0.1:3001 npm run check:responsive
```

## Interaction states & motion

**Implemented tokens (P3):** CSS budgets in `styles/tokens.css` and seconds-based values in `lib/motion.ts` are parity-tested. Fast/release/base/slow/stagger are 160/100/200/250/50 ms; ease-out is `cubic-bezier(0.23, 1, 0.32, 1)`, ease-in-out is `(0.77, 0, 0.175, 1)`, and drawer is `(0.32, 0.72, 0, 1)`. `fine-hover:` requires a fine pointer with hover capability. Reduced motion sets spatial duration and stagger to zero, press scale to 1, and shift to zero while retaining short color/opacity budgets. Consumers must select spatial tokens for spatial effects; the shared durations alone do not disable animation.

The adopted workflow follows Emil Kowalski’s motion guidance: use the cheapest suitable tool, starting with CSS; retain the installed `motion` package for interactions that justify it. Reduced motion removes spatial movement while allowing useful opacity and color feedback. P4 primitives received motion review and actual 375/1440 visual verification, performed by the same agent under the Emil, UI Tailor, and Monet roles. The static Foundations story, informational Card/Chip/Rating, numeric editing, and native radio selection need no decorative animation. P5 integrates and verifies D-01–D-03. The native dialog uses reversible CSS transitions; both language rows share one pause control. The P5 audit rejected hero stagger, card translation, form height tween and simulated chat typing. Its original decision to omit BMI count-up was superseded by owner-approved D-04: the existing Motion package now supplies only a 250ms numeric tween with the shared ease-out curve. The final score is announced immediately; keyboard/reduced-motion submissions are instant. Validation and result content reserve space so state changes do not move the form or page. [Review and interruption evidence](docs/p5-review.md) records the decisions. The P7 acceptance scan closed the remaining D-03 gap: the header logo link now shares the hover/pressed feedback and transitions of every other control. The number field's spin buttons keep native-spinner behaviour by owner decision: they show focus-visible but add no hover or pressed styling of their own.

## Deviation log

[Design deviations and approved decisions](docs/deviations.md) explains the source problem, approved solution and rationale for each entry, followed by a separate three-state execution tracker. All sixteen decisions are approved. C-12 authorizes the available Tirzepatide artwork in missing medication illustration slots for this demonstration; the execution tracker records verification status.

## Storybook

Run `npm run storybook` for the development server at `http://localhost:6006`, or `npm run build-storybook` to generate `storybook-static/`. A hosted build is available at [apsu-home-storybook.vercel.app](https://apsu-home-storybook.vercel.app); Vercel rebuilds it from `main` on every push using the same `build-storybook` script.

Stories are colocated with components and discovered under `components/` and `app/` as `*.stories.ts` or `*.stories.tsx`. The current configuration includes accessibility and pseudo-state addons, with 375 × 812 and 1440 × 900 viewport presets.

**Available:** `Foundations/Design tokens → Source Baseline`, using the same next/font Work Sans 400/500 and Syne 400/500 configuration as the app. Font loading, five type anchors, source surfaces, gutters, and the container cap have been verified in Chromium at 375/1440/1920. This is a token specimen, not the homepage design. The primitive/state inventory is below. The current inventory is one foundation, 81 primitive and 29 section stories, including weight-only error and keyboard BMI result states. The P5 baseline of 104 stories passed axe and overflow checks at 375/1440; the P6 follow-up checked 14 affected stories at both widths (28 checks), with no violations.

`npm run check:tokens` scans application styling sources for literal colors, arbitrary length utilities, nonstandard breakpoint variants, and common nonsemantic palette classes. `styles/tokens.css` is the source-value exception. The guard ignores comments and JSX URL attributes; it complements code and visual review rather than proving all CSS semantics.

## Component library (P4)

Import components and props from `@/components`. The library uses the project's token stylesheet, fonts, and shared motion-preference helper; no provider or UI library is required. Interactive primitives own their client boundary; Card and Rating remain state-free. Content, labels, destinations, and action handlers come from the caller. Stories use `homeMock`; development-only labels live in `content/mocks/primitives.ts`.

| Primitive        | Variants and key states                                                                                   | Stories |
| ---------------- | --------------------------------------------------------------------------------------------------------- | ------- |
| Button           | primary / secondary / outline; sm / md; Hover / Focus / Pressed / Disabled; native link and disabled link | 10      |
| Chip             | informational by default; selected / interactive toggle / mixed direction; sm / md                        | 9       |
| Card             | surface / mint / purple / cyan; sm / md; linked Hover / Focus / Pressed                                   | 9       |
| Accordion        | native details; expanded / collapsed / Hover / Focus / Pressed / reduced; sm / md                         | 8       |
| Carousel         | manual single / peek; first / last / keyboard / reduced / empty                                           | 7       |
| Marquee          | static default / opt-in running / paused / reduced; sm / md                                               | 5       |
| NumberField      | native number input; Focus / Invalid / ExternalError / Disabled / hint; sm / md                           | 7       |
| RadioGroup       | native fieldset / radios; checked / focused / disabled group or option; sm / md                           | 6       |
| SegmentedControl | native radio semantics; Hover / Focus / Pressed / Selected / Disabled; sm / md                            | 7       |
| Rating           | read-only full / partial / empty rating; sm / md                                                          | 4       |
| IconButton       | required accessible label; primary / outline; sm / md; five interaction states                            | 7       |

`Primitives/Overview → Default` combines all eleven for review: [375 px](docs/primitive-review-375.png), [1440 px](docs/primitive-review-1440.png). These are library specimens, not homepage replacements. Button actions use native `type="button"` unless a caller requests submit/reset; destinations render anchors. Do not nest interactive controls in a linked Card. Marquee items may be informational or explicitly interactive. Interactive items supply pointer-only `duplicateContent` with `tabIndex=-1` and no DOM IDs; copies mirror the original state and remain hidden from assistive technology. Keyboard interaction exposes the original items as a static wrapping list.

Pointer press feedback uses scale .97 for 160ms, releasing in 100ms. Focus and keyboard operations are immediate. Accordion measures actual height for a reversible 200ms transition; height is the documented recipe exception. Carousel uses native scroll-snap with no autoplay; keyboard/reduced-motion movement is immediate, and completely offscreen slides are inert. Marquee starts static; `autoPlay` opts into a 30-second linear loop with user, fine-hover, keyboard-focus, and background-tab pause, and a wrapping reduced-motion fallback. Pause/Resume changes the action label without `aria-pressed`, consistent with the [W3C button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).

Run the browser gate after installing Chromium once:

```bash
npx playwright install chromium
npm run test:ui
```

Playwright starts or reuses Storybook at port 6006 and Next.js at port 3000. All 48 current browser cases pass across the two viewport projects; BMI geometry additionally covers eleven widths from 320 to 1920. The interaction-state acceptance scan in `tests/acceptance/states.spec.ts` forces hover, focus-visible and pressed on every visible control through the DevTools protocol and compares the settled subtree styles: 65 controls at 1440 and 69 at 375 including the open menu, each pointer control with a transition. They cover native keyboard and disabled semantics, interruptions, reduced motion, emulated coarse touch, carousel bounds, menu focus/resize, BMI calculations/units and demo-action boundaries. The original P5 primitive audit recorded 160 axe/overflow checks, and its full Storybook audit covered 104 stories (208 checks); those are historical counts, not a claim of a fresh full-inventory audit. Accordion also passes four-times slow motion with four-times CPU throttling. The test runner isolates its axe instance from the a11y addon's concurrent scan; neither scan nor any rule is disabled. Reports, traces on failure, and generated overview screenshots go to ignored `test-results/`. The separate responsive command covers eleven complete-page widths.

## AI usage

Claude Code and Codex are used for project setup, implementation, documentation, and verification. The [session index](ai-logs/README.md) identifies each raw transcript and its scope; the [checksum manifest](ai-logs/MANIFEST.sha256) records the copied files. Raw logs are synchronized with `npm run sync:ai-logs` and are not manually edited. `npm run readable:ai-logs` derives Markdown views in [`ai-logs/readable/`](ai-logs/readable/) for sampling a session without parsing JSONL: user prompts, assistant replies and one-line tool-call summaries, each file naming the raw transcript and checksum it came from.

| Tool        | Work represented                                                                                                                                                                                                                                                                                                                                                               | Session record                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Claude Code | Initial project scaffold, workflow setup, and requirement documentation                                                                                                                                                                                                                                                                                                        | [`b88f38d4-6900-41d6-855b-a41a6443cbce`](ai-logs/claude-code/b88f38d4-6900-41d6-855b-a41a6443cbce.jsonl)                       |
| Claude Code | Bootstrap continuation: Figma MCP project configuration and design-copy access; moving stack, structure, self-check, component, Storybook and motion rules into feature documents; the per-commit checklist and formatting rule; the responsive-evidence decision; the hand-off archive before Codex implementation                                                            | [`c1519747-7fbd-43f0-ac55-e03a5ce8c1da`](ai-logs/claude-code/c1519747-7fbd-43f0-ac55-e03a5ce8c1da.jsonl)                       |
| Claude Code | Vercel deployment of the page and Storybook with automatic redeploys from `main` and the live links; the How-it-works card spacing fix; P7 acceptance tests, the interaction-state scan and GitHub Actions; P8 delivery: readable log exports, lockfile normalization, clean-clone verification and the closing documentation                                                  | [`0ec4e91e-c959-4dc8-9035-54a00263f62b`](ai-logs/claude-code/0ec4e91e-c959-4dc8-9035-54a00263f62b.jsonl)                       |
| Codex       | P0.1–P0.5 directory cleanup, npm scripts, test setup, lint rules, environment example, and verification; P0.6 README skeleton; P0 validation and P1 design-source audit, token mapping, UI inventory, and interaction drafts; P1.8 motion preparation; P2 schema/mock/API and source-copy preservation; P3 fonts, tokens, motion policy, guard, story and browser verification | [`01a0b03c-4d2e-7732-9d3d-a7e5e637ea96`](ai-logs/codex/rollout-2026-09-17T09-38-57-01a0b03c-4d2e-7732-9d3d-a7e5e637ea96.jsonl) |

The design audit is recorded in [the design system](ai/design_system/design-system.md), [UI inventory](ai/design_system/uiux/overview.md), and [interaction draft](ai/design_system/uiux/interactions.md). These internal documents are in Chinese; implementation and public delivery documentation are in English. Only new deviation proposals remain Pending; the approved corrections are implemented.

Four MIT-licensed skills from [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/85e8e2363b713506e1d5b6e07a0eb2da66be1bc3) are vendored at commit `85e8e2363b713506e1d5b6e07a0eb2da66be1bc3`: `emil-design-eng`, `animate`, `review-animations`, and `find-animation-opportunities`. Their original Markdown and licenses live in `ai/jaSkills/`; project adaptations and invocation points are recorded in [the registry](ai/JASKILL.md) and [motion workflow](ai/features/MOTION.md). Codex installed and evaluated them for P1.8 preparation; P4 reviews are recorded in [COMPONENTS](ai/features/COMPONENTS.md); P5 section and full-page reviews are recorded in [P5 evidence](docs/p5-review.md).

The continuation transcript `01a0b177-a7b3-7770-bb84-af67c9b1bfcc` records the prior-turn audit, approved P2/P3 push, and all P4 primitive code, stories, browser tests, motion/visual checks, and documentation. The audit found Astra turn metadata and an interruption before tools ran; it found no Luna implementation segment. The continuation `01a0b1fd-a999-7ba2-8f33-137a508c9974` also records the deviation implementation and P5 page work; see the index for raw-log provenance.

## Known limitations

- C-12: Semaglutide intentionally uses the available Tirzepatide vial artwork for this visual demonstration. The packaging label is not product-accurate; product names, prices and source files remain unchanged.
- Login, Contact, consultation and destination-free footer actions demonstrate visual states only; no business backend is connected.
- BMI is a screening measure, not diagnosis or medication eligibility. Sex is preserved as a source form option and does not alter the calculation. Category boundaries use the unrounded result, with a rounding explanation beside the displayed number.
- next/font/google needs network access during a fresh build; Storybook's adapter also loads Google fonts.
- Physical phones, Safari/Firefox and screen-reader listening were not tested. CPU throttling is not a frame-rate guarantee; source comparison is same-agent visual review, not a certified pixel diff.
- Delivery was verified on a clean clone with Node 22.23.1 and npm 10.9.8: `npm install` (about five seconds from the local cache), `npm run build`, `npm run dev` (page and `/api/home` answer 200) and `npm run storybook` (111 stories) all succeed, and the working tree stays clean afterwards. GitHub Actions repeats the same commands plus the browser suites on Linux; only Chromium is exercised.
- Running `next dev` from inside an AI coding agent lets Next.js 16 append its managed `nextjs-agent-rules` block to `AGENTS.md`; a plain terminal does not trigger it. Whether to commit that block or opt out with `agentRules: false` in `next.config.ts` is an open owner decision (P0.7).

The owner-approved language chips demonstrate local selection with `aria-pressed`; they do not translate the page. Missing business destinations do not prevent appropriate local interaction feedback. Resume now continues on pointer exit without blurring the control, including a keyboard-to-pointer switch. This follow-up passed ten targeted browser cases and forty affected-story viewport checks; the original P5 full-audit numbers above remain historical.

Page anchors use native smooth scrolling for pointer input; keyboard navigation and reduced motion stay instant. Mobile menu links close the dialog and focus their destination without a second scroll. The browser owns scroll duration and interruption; no scrolling library is added.

BMI unit switches retain a full native radio hit area while pressed, including after invalid submission. Large scores keep the normal score font and weight and fit the available width; sizing uses the final value before count-up and updates when the container or font metrics change.
