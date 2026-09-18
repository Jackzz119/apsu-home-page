# Apsu Home Page

[![CI](https://github.com/Jackzz119/apsu-home-page/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Jackzz119/apsu-home-page/actions/workflows/ci.yml)

The Apsu home page (desktop 1440 / mobile 375) built as a Next.js 16 App Router page on top of a small React component library, with Storybook, a mock backend behind a real HTTP boundary, and an AI-assisted workflow whose every session is on record. Live: [home page](https://apsu-home.vercel.app) · [Storybook](https://apsu-home-storybook.vercel.app), both redeployed from `main` on every push.

中文版说明见 [README.zh-CN.md](README.zh-CN.md)。

## Getting started

Four commands cover everything the client needs; nothing else has to be installed or configured. Node 22 LTS is the tested version (minimum 20.9), and the lockfile pins every dependency exactly so `npm install` reproduces the same tree.

```bash
npm install
npm run build        # production build
npm run dev          # http://localhost:3000
npm run storybook    # http://localhost:6006
```

- `npm test` runs 110 Node tests (contracts, tokens, BMI math, assets and the delivery acceptance checks) in under a second — fast enough to run before every commit.
- `npm run test:ui` runs 48 Chromium cases against Storybook and the page at 375 and 1440 — real keyboard, pointer and reduced-motion behaviour, not snapshots.
- `npm run check:responsive` measures the page at eleven widths from 320 to 1920 and rewrites the [responsive report](docs/responsive-report.md).
- `npm run lint`, `typecheck`, `format:check` and `check:tokens` are the static gates; `check:tokens` refuses any literal colour or length outside the token file.

No environment variables are required. Everything above also runs in [CI](#continuous-integration) on Linux, so the four commands are known to work outside the machine they were written on.

## Directory structure

The tree is organised by responsibility rather than by file type: routes are thin, components are a library, content is data, and everything about the AI process is committed next to the code. The client can read the contract, the library and the page in that order and understand the whole product.

```text
app/                  Routes: root layout, the one-page home, GET /api/home (mock backend)
components/index.ts   Public entry point of the component library
components/ui/        11 reusable primitives (Button, Chip, Card, Accordion, Carousel, Marquee, …)
components/sections/  14 home-page sections composed from props only
content/schema.ts     Zod contract for the page = the future API contract
content/mocks/        Source-copy fixture, asset registry and Storybook labels
lib/                  Data access, BMI math, motion tokens, input-modality and motion hooks
styles/tokens.css     Design tokens: colour, type scale, spacing, radius, shadow, motion
public/images/        Design exports with real intrinsic dimensions
tests/                Node tests, browser specs and the assignment acceptance checks
scripts/              Token guard, eleven-width scan, AI-log sync and readable export
docs/                 Deviation log, responsive evidence, asset provenance, review notes
ai/                   Planning docs, feature specs, design system, skills (Chinese)
ai-logs/              Raw AI transcripts, checksum manifest, session index, readable views
.github/workflows/    CI
```

- Sections never import mock data — the page fetches once and passes props down, so any section can be reused with other content.
- `components/index.ts` is the only import path the page uses — the page is just another consumer of the library.
- `ai/` and `ai-logs/` are committed on purpose — the assignment asks for the AI process to be reviewable, so the planning and the transcripts live beside the code they produced.

The result is a repository where adding a section means one component, one story and one schema field, and where nothing about how the code was made is hidden. The same layout scales to more pages by adding routes under `app/` without touching the library.

## Data layer & API contract

There is no backend yet, so the shape of the data is the contract. It is written once as a Zod schema, inferred into TypeScript types, validated at every boundary, and served by a Route Handler that behaves like the future API. Switching to a real backend is a configuration change, not a code change.

- [content/schema.ts](content/schema.ts) defines `HomePage` in reading order, fourteen sections deep — every type is `z.infer`, so there is exactly one source of truth and no hand-written interfaces to drift.
- Strict objects, integer cents, local image paths with real dimensions and discriminated unions (quote/photo stories, chat/image cards, metric/imperial units) — invalid or unexpected data fails loudly instead of rendering something half right.
- Actions are `anchor`, `external` or `demo` — controls that have no destination in the design (Login, Contact, social icons) are declared as demos and can never navigate or make requests by accident.
- [lib/api/home.ts](lib/api/home.ts) is the single `getHomePage()` entry — with no URL it imports and parses the mock (no HTTP during build); with `NEXT_PUBLIC_API_URL` set it fetches `${url}/api/home`, checks the status and parses the response with the same schema.
- [app/api/home/route.ts](app/api/home/route.ts) serves that same validated mock — the HTTP boundary exists today, so wiring a real service later changes one environment variable and nothing else.

```bash
curl --fail http://localhost:3000/api/home                 # the mock backend
NEXT_PUBLIC_API_URL=https://api.example.com npm run dev    # point the page at a real one
```

Because validation runs on both sides of the wire, a backend that breaks the contract is caught at the edge with a readable error rather than deep inside a component. The schema is also the natural place to grow the product: a new section is a new field, and the types, tests and mock follow from it.

## Design decisions

The assignment left several choices open. Each was decided once, written down, and applied everywhere; the table is the same list the code follows.

| Area              | Decision                                                                       | Why                                                                                |
| ----------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Design tokens     | Semantic CSS variables via Tailwind v4 `@theme`, guarded by `check:tokens`     | Re-theming touches one file; no literal values can leak into components            |
| Images            | Local exports through `next/image` with `{ src, alt, width, height }` in data  | Alt text is content; known dimensions prevent layout shifts                        |
| State             | Local `useState`/`useReducer`; BMI is a pure function in `lib/bmi.ts`          | A one-page site does not need a store; pure math is trivially testable             |
| Routing           | One `/` route; product links scroll to section anchors                         | Product pages are out of scope; empty placeholder routes would be noise            |
| Motion            | CSS first with shared tokens; the Motion package only where it earns its place | Restraint and consistency over quantity; one budget in CSS and JS                  |
| Responsive        | Fluid `clamp()` values, three layout breakpoints, 1440 px container cap        | Continuous sizing between the two boards; explicit thresholds where layout changes |
| Component library | Prop-driven components exported from one index; the page is a consumer         | Components are reusable without page data or providers                             |

Writing the decisions down before building meant no section had to re-litigate them, and the same table answers most "why did you…" questions in review. New decisions go into the same table, which keeps the rationale as reviewable as the code.

## Responsive strategy

Two boards were given (375 and 1440); the page has to be complete at every width from 320 to 1920. Values are fluid between the boards, layout changes only at three explicit breakpoints, and the claim is measured rather than asserted.

- `clamp()` for type, spacing and component sizes — the boards are the two ends of each range, so intermediate widths interpolate instead of jumping.
- Breakpoints `sm` 640 / `lg` 1024 / `xl` 1280 and a 1440 px container cap — the only places where layout actually changes (stacking, columns, the desktop header), so behaviour between them is predictable.
- [scripts/check-responsive.ts](scripts/check-responsive.ts) loads the page at eleven widths and asserts no horizontal overflow, single-line navigation and text staying inside its section — the [report](docs/responsive-report.md) is regenerated on each run and committed.
- One composite image of all eleven widths, left to right — the evidence the client can take in at a glance.

![Eleven-width homepage composite](docs/responsive-report.png)

- The BMI calculator's error and result states are additionally checked at all eleven widths, so validation never moves the form or the page.

The approach keeps the two boards pixel-faithful where they exist and degrades smoothly where they do not. Because the scan runs in CI, a future layout change that breaks a width fails the build instead of reaching the client.

## Interaction states & motion

Every interactive element answers hover, focus and press, and every transition uses the same small set of durations and curves. The rules come from the motion guidance of Emil Kowalski, adapted to this design, and a browser test forces every pseudo-state on every visible control to prove the rule holds.

- Motion tokens live once in [styles/tokens.css](styles/tokens.css) and once in [lib/motion.ts](lib/motion.ts), with a test that keeps them equal — 160 ms fast, 100 ms release, 200 ms base, 250 ms slow, one ease-out and one ease-in-out.
- Hover is colour-first and only for fine pointers; press is a 0.97 scale; focus-visible is an immediate 2 px ring with no animation — keyboard users never wait for feedback.
- Reduced motion removes movement, scaling and marquee scrolling but keeps short colour and opacity changes — content stays readable, nothing is stuck mid-animation.
- Native elements first — `<details>` for the FAQ (with a measured, reversible height transition), `<dialog>` for the mobile menu, scroll-snap for the carousel, real radios for the segmented control.
- The two marquees pause on hover, focus and with a persistent Pause button; the pointer-only duplicates are hidden from assistive technology, and keyboard users get a static list.
- [tests/acceptance/states.spec.ts](tests/acceptance/states.spec.ts) forces `:hover`, `:active` and `:focus-visible` on every visible control (65 at 1440, 69 at 375 including the open menu) and checks that the styles differ and are transitioned.

Consistency here is cheaper than variety: one set of tokens and one set of rules made 14 sections feel like one product, and the acceptance scan means a future control cannot ship without states. The full reasoning behind each state is in the [deviation log](docs/deviations.md) (D-01 to D-04).

## Storybook

Storybook is the client's view of the component library: 111 stories, one per state, with hover, focus and pressed captured through the pseudo-states addon rather than by moving a mouse. The a11y addon treats any violation as an error.

| Primitive        | States covered                                                          | Stories |
| ---------------- | ----------------------------------------------------------------------- | ------- |
| Button           | primary / secondary / outline; Hover / Focus / Pressed / Disabled; link | 10      |
| Chip             | informational, selected, interactive toggle, mixed direction            | 9       |
| Card             | four surfaces; linked Hover / Focus / Pressed                           | 9       |
| Accordion        | collapsed / expanded / Hover / Focus / Pressed / reduced motion         | 9       |
| Carousel         | first / last / keyboard / reduced / single / empty                      | 7       |
| Marquee          | static / running / paused / reduced                                     | 5       |
| NumberField      | Focus / Invalid / external error / Disabled / hint                      | 7       |
| RadioGroup       | Focus / checked / disabled group or option                              | 6       |
| SegmentedControl | Hover / Focus / Pressed / Selected / Disabled                           | 7       |
| Rating           | full / partial / empty                                                  | 4       |
| IconButton       | five interaction states; two variants                                   | 7       |

- Stories sit next to their components and read from the same mock data — no second copy of the copy to drift.
- Section stories cover the interactive islands: open menu, expanded/invalid/calculated BMI, paused marquees, expanded FAQ.
- Two viewport presets (375 × 812, 1440 × 900) mirror the boards; the browser suite audits every primitive story with axe at both.

Because each state is a named story, a design review can point at "Button → Pressed" instead of describing a gesture, and a regression in one state is visible without running the app. Run `npm run build-storybook` for a static export; the hosted copy above is rebuilt on every push.

## Deviation log

The design has real mistakes, and the assignment asks for them to be fixed and recorded. Every departure from the boards is an entry in [docs/deviations.md](docs/deviations.md): what was wrong, what ships instead, why — followed by a tracker with the implementation status of each.

- C entries (12) fix source problems — typos, a contrast failure, a mock BMI score shown before any input, FAQ answers that were all the same, a language chip that fused two languages.
- D entries (4) define behaviour the static design cannot show — hover/focus/press rules, persistent pause for moving strips, demo controls that never navigate, and an owner-approved count-up for the BMI result.
- Nothing was changed before it was logged and approved; the commit that ships a fix references its id.

All sixteen entries are approved and implemented. The log doubles as the review agenda: the client can read it in five minutes and know every place the page differs from the picture, and why.

## Continuous integration

Every push runs the same commands the client would run, on Linux, in two GitHub Actions jobs. Green on `main` is the proof that the repository works on a machine other than the author's, including case-sensitive imports and a clean install.

- `quality` — `npm ci` → format → types → lint → token guard → production build → Storybook build → Node tests.
- `browser` — installs Chromium, builds the app, runs the 48 Playwright cases against Storybook and the production server, then serves the build and runs the eleven-width scan; traces, the report and the screenshots are uploaded as artifacts.
- Seven acceptance tests map the assignment's checkable requirements to code — committed lockfile, schema as the only type source, eleven widths, interaction states, a story per state, README sections and links, raw AI logs with matching checksums.

The workflow is deliberately plain: no caching tricks beyond npm's, no flaky retries, and the two red runs in its history are explained in the planning docs rather than deleted. Adding a check means adding a script and a line.

## AI usage

The AI workflow here is Cheng Zheng's own. Apart from the four vendored Emil Kowalski motion skills, every skill belongs to the developer's ADK (agent development kit), built to fit one person's way of working: skills define what an agent can do and split the roles cleanly; the `ai/` folder governs project context; `ai/features/` cuts that context into modules an agent loads only when needed; `ai/design_system/` keeps the design consistent; and the Claude protocol (`CLAUDE.md`) is the foundation — registering skills and feature specs there is what boots every session. `shelf`, the developer's public npm package, keeps the ADK in the cloud so the same kit travels between projects. Two agents, Claude Code and Codex, worked from that protocol rather than from chat.

- One protocol per agent ([CLAUDE.md](CLAUDE.md), [AGENTS.md](AGENTS.md)) — read at the start of every session; it points to the project spec and task list and forbids the agent from changing the rules itself.
- [ai/PROJECT.md](ai/PROJECT.md) holds the requirement registry (every rule traces to a sentence in the assignment), the decision record and the commit rules; [ai/TODO.md](ai/TODO.md) holds the phased plan P0–P8 with a definition of done per phase.
- Nine domain specs under [ai/features/](ai/features/) (structure, data contract, tokens, responsive, motion, Storybook, accessibility, components, self-check) — each owns one topic, so an agent loads the one it needs instead of the whole history.
- A committed design system snapshot ([ai/design_system/](ai/design_system/)) — Figma node metadata, variables and board screenshots read once through the Figma MCP within a 20-call monthly budget, so later sessions never re-spend the quota.
- Thirteen skills under [ai/jaSkills/](ai/jaSkills/): nine from the ADK (task manager, feature workflow, version control, UI/UX and art roles, skill maintenance, shelf operations) plus Emil Kowalski's four motion skills pinned to a commit — roles are invoked by trigger words, and each carries its own checklist.
- Deviations first, code second; a twelve-point checklist before every commit; commits are split and timed by the owner, never by the agent.
- Two agents in parallel worktrees — Claude Code planned, reviewed and closed phases; Codex implemented most of P0–P6 — with session archives for hand-offs and a raw log of every conversation.

The logs are the evidence. The [session index](ai-logs/README.md) says what each transcript did and which commits it produced; [MANIFEST.sha256](ai-logs/MANIFEST.sha256) fixes the checksum of every raw file, and a test verifies both. Raw transcripts: Claude Code [`b88f38d4…`](ai-logs/claude-code/b88f38d4-6900-41d6-855b-a41a6443cbce.jsonl), [`c1519747…`](ai-logs/claude-code/c1519747-7fbd-43f0-ac55-e03a5ce8c1da.jsonl), [`0ec4e91e…`](ai-logs/claude-code/0ec4e91e-c959-4dc8-9035-54a00263f62b.jsonl); Codex [`01a0b03c…`](ai-logs/codex/rollout-2026-09-17T09-38-57-01a0b03c-4d2e-7732-9d3d-a7e5e637ea96.jsonl) and its two continuations. Readable Markdown views of each transcript are in [ai-logs/readable/](ai-logs/readable/).

What this bought: 96 linear commits in two days with no squashes, every "why" written before the code, and any session able to resume from the documents alone. The same protocol and skills come off the shelf unchanged for the next project; the project-specific part is nine short spec files.

## Known limitations

- Login, Contact, consultation and the footer's social controls are visual demos by owner decision; no backend is connected.
- Semaglutide reuses the Tirzepatide vial artwork (C-12) because no other vial export exists; the label is not product-accurate.
- BMI is a screening number, not a diagnosis; sex is kept as a form option but does not change the calculation.
- Fonts come from `next/font/google`, so a fresh build needs network access.
- CI runs Chromium only; Safari, Firefox, physical phones and screen-reader listening were not tested.
- A reused local dev server for `npm run test:ui` must be started with `--hostname 127.0.0.1`, or point the suite elsewhere with `PLAYWRIGHT_APP_URL`; a plain `npm run dev` binds `localhost` and the tests' `127.0.0.1` page does not hydrate under Next 16's dev-origin check.
- Running `next dev` from inside an AI coding agent lets Next.js 16 append its agent-rules block to `AGENTS.md`; plain terminals are unaffected and the opt-out is `agentRules: false` in `next.config.ts` (owner decision pending).
