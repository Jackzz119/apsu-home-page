# Apsu Home Page

Front-end take-home: the Apsu home page (desktop 1440 / mobile 375) implemented as a Next.js App Router page plus a React component library, with Storybook.

**Status:** P5 is implemented: fourteen homepage sections, eleven reusable primitives, real source assets, a working BMI calculator and accessible menu/carousel/FAQ/marquees. Storybook contains 104 stories. Local page acceptance passes; CI and final delivery remain P7/P8 work. See [P5 evidence](docs/p5-review.md).

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

`npm test` runs Node-based tests once using `vitest.config.mts`. It discovers `*.test.ts` and `*.test.tsx` under `tests/` and `content/`; Storybook and Playwright `*.spec.ts` files are outside this scope. The suite contains 91 tests covering content/API contracts, motion/token rules, BMI calculations and decoded asset dimensions.
With an app server running, `npm run check:responsive` checks eleven widths and updates the responsive report; set `RESPONSIVE_URL` to target a different origin.

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
scripts/              Project utilities, including AI log synchronization
.storybook/           Storybook configuration and primitive canvas decorator
ai-logs/              Raw AI session records, session index, and checksum manifest
```

Empty directories contain `.gitkeep` files so they survive a fresh clone. Planning documents (in Chinese) live under `ai/`; `ai/PROJECT.md` is the project spec and `ai/TODO.md` the task list. AI agent protocol files (`CLAUDE.md`, `AGENTS.md`, `.claude/`, `.agents/`) are committed on purpose so the AI-assisted process is fully visible.

Tailwind scans only `app/`, `components/`, and `.storybook/` through explicit sources in `app/globals.css`; design snapshots, skills, and AI logs do not contribute utility classes. Register any future UI source directory there.

## Data layer & API contract

**Implemented (P2):** [content/schema.ts](content/schema.ts) defines `HomePage` in fourteen-section reading order, with section schemas and types inferred through `z.infer`. Prices use integer USD cents; images require a local asset path, alt text, and positive intrinsic dimensions. Discriminated unions distinguish quote/photo stories, chat/image service cards, measurement systems, and action destinations. Strict objects reject unknown fields rather than silently discarding them.

Actions distinguish real section anchors, external URLs, and owner-approved `demo` controls. Login, Contact, consultation and other destination-free controls demonstrate visual states only; they do not navigate, make requests or simulate business success. The strict demo variant cannot contain an href or target. Live calculator input and results are not part of the page-content response. `sourcePreview` preserves the artwork’s inconsistent zero inputs / score of 56 as strings, explicitly separate from calculation state.

[content/mocks/home.ts](content/mocks/home.ts) supplies all fourteen sections with `satisfies HomePage`; tests validate the complete response. Approved copy corrections are applied; the original Weight Loss title, first FAQ answer and board-specific differences are preserved. Original FAQ wording and implementation status remain in the [deviation record](docs/deviations.md). Local image references use source exports with real intrinsic dimensions; [asset provenance](docs/assets.md) records every file. A missing Semaglutide image is explicit `null` (C-12), rather than a wrongly labelled vial. `content/presentation.ts` supplies control/a11y labels and shared decorative artwork through props.

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

Fluid sizing uses `clamp()`, three layout breakpoints (`sm` 640, `lg` 1024, `xl` 1280), and a 1440px container cap. The real Header remains on one line at 1024px. The production page passed the three geometry assertions below; [the generated report](docs/responsive-report.md) explains exclusions and limits. Review the actual [375px](docs/p5-review-375.webp) and [1440px](docs/p5-review-1440.webp) pages; the final eleven-width composite is scheduled for P8.

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

The adopted workflow follows Emil Kowalski’s motion guidance: use the cheapest suitable tool, starting with CSS; retain the installed `motion` package for interactions that justify it. Reduced motion removes spatial movement while allowing useful opacity and color feedback. P4 primitives received motion review and actual 375/1440 visual verification, performed by the same agent under the Emil, UI Tailor, and Monet roles. The static Foundations story, informational Card/Chip/Rating, numeric editing, and native radio selection need no decorative animation. P5 integrates and verifies D-01–D-03. The native dialog uses reversible CSS transitions; both language rows share one pause control. The full-page motion audit recommends no additional effects: no hero stagger, card translation, BMI count-up, form height tween or simulated chat typing. No Motion runtime is imported. [Review and interruption evidence](docs/p5-review.md) records the decisions.

## Deviation log

[Design deviations and approved decisions](docs/deviations.md) explains the source problem, approved solution and rationale for each entry, followed by a separate three-state execution tracker. All fourteen approved entries are implemented and verified. One new item is Pending: C-12, a missing accurately labelled Semaglutide image. No unapproved substitute is introduced.

## Storybook

Run `npm run storybook` for the development server at `http://localhost:6006`, or `npm run build-storybook` to generate `storybook-static/`. A hosted build is available at [apsu-home-storybook.vercel.app](https://apsu-home-storybook.vercel.app); Vercel rebuilds it from `main` on every push using the same `build-storybook` script.

Stories are colocated with components and discovered under `components/` and `app/` as `*.stories.ts` or `*.stories.tsx`. The current configuration includes accessibility and pseudo-state addons, with 375 × 812 and 1440 × 900 viewport presets.

**Available:** `Foundations/Design tokens → Source Baseline`, using the same next/font Work Sans 400/500 and Syne 400/500 configuration as the app. Font loading, five type anchors, source surfaces, gutters, and the container cap have been verified in Chromium at 375/1440/1920. This is a token specimen, not the homepage design. The primitive/state inventory is below. Sections add 23 stories, including open menu, expanded/invalid/calculated BMI, paused strips and expanded FAQ; all 104 stories passed axe and overflow checks at 375/1440.

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
| NumberField      | native number input; Focus / Invalid / Disabled / hint; sm / md                                           | 6       |
| RadioGroup       | native fieldset / radios; checked / focused / disabled group or option; sm / md                           | 6       |
| SegmentedControl | native radio semantics; Hover / Focus / Pressed / Selected / Disabled; sm / md                            | 7       |
| Rating           | read-only full / partial / empty rating; sm / md                                                          | 4       |
| IconButton       | required accessible label; primary / outline; sm / md; five interaction states                            | 7       |

`Primitives/Overview → Default` combines all eleven for review: [375 px](docs/primitive-review-375.png), [1440 px](docs/primitive-review-1440.png). These are library specimens, not homepage replacements. Button actions use native `type="button"` unless a caller requests submit/reset; destinations render anchors. Do not nest interactive controls in a linked Card. Marquee items are informational and must not contain controls or DOM IDs, because its second track repeats them.

Pointer press feedback uses scale .97 for 160ms, releasing in 100ms. Focus and keyboard operations are immediate. Accordion measures actual height for a reversible 200ms transition; height is the documented recipe exception. Carousel uses native scroll-snap with no autoplay; keyboard/reduced-motion movement is immediate, and completely offscreen slides are inert. Marquee starts static; `autoPlay` opts into a 30-second linear loop with user, hover, focus, and background-tab pause, and a wrapping reduced-motion fallback. Pause/Resume changes the action label without `aria-pressed`, consistent with the [W3C button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).

Run the browser gate after installing Chromium once:

```bash
npx playwright install chromium
npm run test:ui
```

Playwright starts or reuses Storybook at port 6006 and Next.js at port 3000. The 32 cases comprise 18 primitive cases and 14 page cases at 375/1440. They cover native keyboard and disabled semantics, interruptions, reduced motion, emulated coarse touch, carousel bounds, menu focus/resize, BMI calculations/units and demo-action boundaries. The primitive audit includes 160 axe/overflow checks; the additional full Storybook audit includes all 104 stories (208 checks). Accordion also passes four-times slow motion with four-times CPU throttling. The test runner isolates its axe instance from the a11y addon's concurrent scan; neither scan nor any rule is disabled. Reports, traces on failure, and generated overview screenshots go to ignored `test-results/`. The separate responsive command covers eleven complete-page widths.

## AI usage

Claude Code and Codex are used for project setup, implementation, documentation, and verification. The [session index](ai-logs/README.md) identifies each raw transcript and its scope; the [checksum manifest](ai-logs/MANIFEST.sha256) records the copied files. Raw logs are synchronized with `npm run sync:ai-logs` and are not manually edited.

| Tool        | Work represented                                                                                                                                                                                                                                                                                                                                                               | Session record                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Claude Code | Initial project scaffold, workflow setup, and requirement documentation                                                                                                                                                                                                                                                                                                        | [`b88f38d4-6900-41d6-855b-a41a6443cbce`](ai-logs/claude-code/b88f38d4-6900-41d6-855b-a41a6443cbce.jsonl)                       |
| Codex       | P0.1–P0.5 directory cleanup, npm scripts, test setup, lint rules, environment example, and verification; P0.6 README skeleton; P0 validation and P1 design-source audit, token mapping, UI inventory, and interaction drafts; P1.8 motion preparation; P2 schema/mock/API and source-copy preservation; P3 fonts, tokens, motion policy, guard, story and browser verification | [`01a0b03c-4d2e-7732-9d3d-a7e5e637ea96`](ai-logs/codex/rollout-2026-09-17T09-38-57-01a0b03c-4d2e-7732-9d3d-a7e5e637ea96.jsonl) |

The design audit is recorded in [the design system](ai/design_system/design-system.md), [UI inventory](ai/design_system/uiux/overview.md), and [interaction draft](ai/design_system/uiux/interactions.md). These internal documents are in Chinese; implementation and public delivery documentation are in English. Only new deviation proposals remain Pending; the approved corrections are implemented.

Four MIT-licensed skills from [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/85e8e2363b713506e1d5b6e07a0eb2da66be1bc3) are vendored at commit `85e8e2363b713506e1d5b6e07a0eb2da66be1bc3`: `emil-design-eng`, `animate`, `review-animations`, and `find-animation-opportunities`. Their original Markdown and licenses live in `ai/jaSkills/`; project adaptations and invocation points are recorded in [the registry](ai/JASKILL.md) and [motion workflow](ai/features/MOTION.md). Codex installed and evaluated them for P1.8 preparation; P4 reviews are recorded in [COMPONENTS](ai/features/COMPONENTS.md); P5 section and full-page reviews are recorded in [P5 evidence](docs/p5-review.md).

The continuation transcript `01a0b177-a7b3-7770-bb84-af67c9b1bfcc` records the prior-turn audit, approved P2/P3 push, and all P4 primitive code, stories, browser tests, motion/visual checks, and documentation. The audit found Astra turn metadata and an interruption before tools ran; it found no Luna implementation segment. The index also includes an additional Claude Code transcript. The continuation `01a0b1fd-a999-7ba2-8f33-137a508c9974` also records the deviation implementation and P5 page work; see the index for raw-log provenance.

## Known limitations

- C-12: Semaglutide needs a correctly labelled source image or an approved text-only treatment. Its name, price and CTA are present; a Tirzepatide bottle is not reused.
- Login, Contact, consultation and destination-free footer actions demonstrate visual states only; no business backend is connected.
- BMI is a screening measure, not diagnosis or medication eligibility. Sex is preserved as a source form option and does not alter the calculation. Category boundaries use the unrounded result, with a rounding explanation beside the displayed number.
- next/font/google needs network access during a fresh build; Storybook's adapter also loads Google fonts.
- Physical phones, Safari/Firefox and screen-reader listening were not tested. CPU throttling is not a frame-rate guarantee; source comparison is same-agent visual review, not a certified pixel diff.
- P7 CI/final acceptance and P8 clean-clone checks, readable-log export and final eleven-width composite remain pending.
