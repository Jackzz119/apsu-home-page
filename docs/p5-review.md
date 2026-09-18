# P5 page acceptance

2026-09-17. Scope: fourteen homepage sections and their integration. Source: saved 1440px / 375px Figma boards, menu frame, XML and node contexts in `ai/design_system/figma/`. Approved corrections follow [the deviation tracker](deviations.md). These are local implementation checks, not final delivery or independent certification.

## Visual evidence

[375px page](p5-review-375.webp) · [1440px page](p5-review-1440.webp) · [11-width geometry report](responsive-report.md) · [asset provenance](assets.md)

The implementing agent inspected source and runtime sections under the UI Tailor / Monet / Emil roles. There was no external reviewer. Font metrics, surfaces, reading order, responsive crops, labels and control placement were inspected; no exact pixel-diff threshold is claimed.

| Section        | Source alignment / implemented acceptance                                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header         | Source logo and pill bar; desktop navigation remains on one line at 1024px. Mobile modal follows the separate menu frame.                                                                       |
| Hero           | Work Sans hierarchy, accented title runs and separate desktop/mobile copy. Approved darker benefit text passes 5.61:1 on white. Language rows remain informational.                             |
| ServiceCards   | Three source pastel surfaces and source copy. Matching Birth Control/Sleep portraits replace incorrectly reused vial artwork under C-09.                                                        |
| TrustMarquee   | Source dark strip and benefits; corrected Insurance copy, persistent pause control.                                                                                                             |
| HowItWorks     | Two tall source role cards, pale decorative 01/02 ornaments, checklists and closing statement. The SVG ornaments are hidden from assistive technology; role headings convey the actual meaning. |
| WeightLoss     | Original title preserved. Source portrait, two prices and CTAs retained; mobile compact comparison approved under C-01. Semaglutide lacks matching artwork: C-12 Pending.                       |
| BmiCalculator  | Source background and desktop form/result composition. Mobile disclosure approved under C-01; no source mock score presented as a result.                                                       |
| BirthControl   | Source pink treatment panel, portrait, benefits, price and CTA; matching mobile stacking.                                                                                                       |
| Sleep          | Source cyan panel, seated portrait and two static profile cards; no invented avatar or live patient data.                                                                                       |
| OnlineCare     | Source phone/chat illustration and three image cards; manual carousel, distinct accessible label and range status.                                                                              |
| SuccessStories | Source quotation/photo order, stars and decorative social artwork; three columns desktop, stacked mobile.                                                                                       |
| Faq            | Native details; first answer open. Original first answer and the three approved short answers retained.                                                                                         |
| FinalCta       | Inset source gradient, ghost logo and CTA; centered mobile title, horizontal desktop placement.                                                                                                 |
| Footer         | Source inverse logo, three link groups, legal copy, decorative wordmark and demo social controls. Company spelling corrected.                                                                   |

At 375px, the complete Weight Loss introduction, compact plans and collapsed BMI occupy **1407.7px**, including the 56px gap. The source off-board groups total 2305px before a working BMI form; the implementation saves approximately 897px while preserving both offers. This is a measurement, not a fixed CSS height. The expanded calculator retains all input and results when collapsed.

## Interaction and accessibility evidence

- 91 Node tests: strict content/API contracts, tokens/motion, 17 BMI cases and 25 decoded asset-dimension cases.
- 32 Playwright cases: 18 existing primitive cases and 14 page cases across 375/1440. Menu focus loop/Escape/anchor/resize, BMI validation/units/editing, demo controls without navigation/requests, pause/reduced content, FAQ and carousel keyboard paths pass.
- All 104 stories passed at 375/1440: **208 axe/overflow checks**. Section stories were rescanned after the final landmark-label correction. No axe rule is disabled.
- Page axe checks cover default and expanded BMI, normal and reduced motion. A duplicate region name was fixed by labelling the nested care carousel independently.
- Production build and Storybook build pass. Typecheck, lint and token guard pass. Eleven responsive widths pass on the production build. Additional expanded-BMI checks at 320/640/768/1024/1280 have no page overflow.
- Runtime image decoding passes for every homepage image; no homepage request uses the transparent placeholder.

## Animation review

Skills: `emil-design-eng`, `animate`, `review-animations` (including STANDARDS) and `find-animation-opportunities`, pinned upstream revision `85e8e2363b713506e1d5b6e07a0eb2da66be1bc3`.

| Location                                  | Before                                                                   | After                                                                                                                                                                       | Why                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `Header.tsx` / `sections.module.css` menu | Static design does not specify transitions, cancellation or focus.       | Native dialog; transform/opacity 250ms entry and 200ms exit, discrete display/overlay; immediate keyboard feedback, reduced spatial motion, focus loop and restored scroll. | Clarify occasional navigation state while keeping interruption and focus reliable.           |
| `Header.tsx` onClose                      | Queued close events could incorrectly clear React state after reopening. | Derive state from the dialog's actual open property.                                                                                                                        | Rapid reversal must not unlock the body while the menu is open.                              |
| `LanguageMarquee.tsx` / `Marquee.tsx`     | Independent row controls would make a two-row strip cumbersome.          | Two rows share one persistent Pause/Resume; existing primitive remains independently usable.                                                                                | One control pauses all language movement; focus and fine-hover add temporary pause.          |
| `sections.module.css` text actions        | Static text controls had no explicit press/release budget.               | Named color/transform transitions, 160ms press / 100ms release, instant focus; no coarse-hover effect.                                                                      | Preserve the reviewed primitive feedback without adding ornamental motion.                   |
| `Faq.tsx` / `Accordion.tsx`               | Source defines only open/closed frames.                                  | Reuse measured-height/opacity transition at 200ms; keyboard/reduce immediate.                                                                                               | The documented height exception explains answer disclosure without an auto-height animation. |
| `OnlineCare.tsx` / `Carousel.tsx`         | Source provides cards and arrows.                                        | Reuse native scroll-snap; manual navigation, immediate keyboard/reduced movement.                                                                                           | Keep exploration under user control, with no autoplay or unnecessary library.                |

**Verdict: Approve for P5.** No Motion runtime import. Static sections and numeric editing have no new animation and are N/A for transition review.

The menu was checked with 4× duration and 4× CPU throttling: entry had active transform/opacity transitions; closing and reopening reached an open, fully opaque state with focus inside and body locked. Escape ended closed with scrolling restored. Reduced motion produced `transform: none`. Coarse-touch emulation opened/closed successfully and did not match the fine-hover query. The existing Accordion slow-motion/interruption regression also passed. These are functional/perceptual checks, not frame-time certification.

## Read-only animation opportunity audit

No new animation is recommended. Existing interactions already explain state changes. These five candidates were actually considered and rejected; they are decisions, not an unimplemented animation backlog.

| Location                       | Frequency / purpose gate                                                           | Decision                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `Hero.tsx`                     | Initial visit; proposed stagger offers delight without clarifying state.           | Reject: delays immediate reading and the primary CTA.                            |
| `ServiceCards.tsx`             | Frequent pointer traversal; cards are informational containers with their own CTA. | Reject: card translation implies that the entire surface is clickable.           |
| `BmiCalculator.tsx` result     | Repeated calculations; count-up does not explain how the result was obtained.      | Reject: present the actual number and category immediately.                      |
| `BmiCalculator.tsx` disclosure | Occasional form expansion; a long height tween changes scroll geometry.            | Reject: immediate reveal preserves predictable editing and keyboard positioning. |
| `OnlineCare.tsx` chat          | Static source illustration; simulated typing adds no real feedback.                | Reject: would imply a live medical conversation.                                 |

## Remaining limits

C-12 requires an accurate Semaglutide export or explicit approval for a text-only card. Login, Contact, consultation and destination-free footer controls remain visual demos by owner decision. Physical devices, Safari/Firefox and screen-reader listening were not tested. Google font downloads need network access during a fresh build. P7 CI/final acceptance and P8 clean-clone, readable-log export and final eleven-width composite remain pending.

## Subsequent owner decision

This report preserves the P5 review as performed. The owner subsequently approved BMI count-up under D-04, superseding the rejection above. Current behavior uses the existing Motion package for a 250ms numeric tween only; keyboard/reduced motion and the accessible result remain immediate. Validation and result geometry are reserved to prevent layout shifts. See the current [deviation tracker](deviations.md).
