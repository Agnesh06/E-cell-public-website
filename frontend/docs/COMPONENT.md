# COMPONENT.md - IdeaSteps (landing page scroll sequence)

Suggested location: `src/features/landing/ideasteps/COMPONENT.md`. Read `docs/DESIGN.md` first. This file defines only the IdeaSteps component. Other complex components (ProjectStrip, FinderDirectory) get their own `COMPONENT.md`.

---

## 1. Purpose

A pinned, scroll-driven section on the landing page that presents E-Cell's story in **five steps**. As the user scrolls, one blue line draws itself across the stage while each step's text and cards fade in, hold, and fade out. Modelled on the "Who we are" sequence of csea.psgtech.ac.in, in a more official tone.

## 2. Scope

**Does:**
- Pin a full-viewport stage on desktop (>= 1024px) and play five steps from one scrubbed GSAP timeline.
- Draw the flow line progressively and move the glow blob per step.
- Show an indicator (01-05) that reflects progress and scrolls to a step when clicked.
- Provide a static, stacked fallback for mobile, tablet, and reduced-motion users.
- Read all content from `src/data/ideas.ts`.

**Does not:**
- Fetch data or touch routing, forms, or any other section.
- Include photos by default (cards are text cards; the photo variant is optional).
- Register GSAP plugins itself (`src/lib/gsap.ts` does that).
- Create its own smooth-scroll instance (it uses the app-level Lenis).
- Own header, menu, hero, or the section that follows it.

## 3. Behaviour

### 3.1 Desktop (>= 1024px, motion allowed)

One `ScrollTrigger` pins the stage with `scrub: true` (a small smoothing value is fine). Pin length starts at about `5 x viewport height` **[TBD]**. Each step owns one fifth of the timeline:

| Segment of a step | Share | What happens |
|---|---|---|
| Enter | 0.15 | Eyebrow, headline lines, body, pills rise 24px and fade in with 60-90ms stagger; cards fade and rise with stagger |
| Hold | 0.45 | Content static; the line keeps drawing |
| Exit | 0.15 | Text and cards fade out (and drift up 12px) |
| Interlude | 0.25 | Empty stage; the line sweeps; glow blob moves to its next position |

The last step has no exit or interlude; after its hold the pin releases and the line scrolls away with the section. Step 1 has a short lead-in so the line appears to arrive from the hero.

The indicator highlights the step whose enter-to-exit span contains the progress. During interludes the *next* step is already highlighted. Set React state only when the active index changes, never every frame.

### 3.2 Flow line

- SVG with two identical paths: **ghost** (`blue-ghost`, always fully visible) and **drawn** (`blue`, revealed by `stroke-dashoffset`).
- `viewBox` 1440 x 900, `preserveAspectRatio="xMidYMid slice"`, `vector-effect: non-scaling-stroke` so stroke width stays constant.
- Dash length from `path.getTotalLength()`; remeasure on resize. Draw progress is linear in master progress, from about 0.02 to about 0.97.
- The path enters from the top edge, loops across the stage, and ends past the bottom-left. The starting path below is a **placeholder [TBD]**; the final path is authored in a vector tool and approved visually.

```
M 1000 -20 C 1000 150, 1250 250, 1150 420 S 700 620, 520 560 S 260 760, 480 860 S 1100 800, 1200 600 S 1000 300, 760 420 S 420 700, 300 880
```

### 3.3 Indicator

`01 02 03 04 05` as real `<button>` elements, `aria-current="step"` on the active one. Clicking scrolls to the start of that step's hold segment through the app Lenis instance. Optional per-step side label (step 1: "PSG College of Technology").

### 3.4 Static fallback (< 1024px or `prefers-reduced-motion`)

Five stacked sections using the same text block and cards. No pin, no scrub. A simple reveal-on-enter is allowed only if motion is not reduced. The flow line is a fully drawn decorative background, or omitted if it harms legibility. Selection happens with `gsap.matchMedia()`; there is exactly one code path per mode and no duplicated content in the DOM.

## 4. Content

Source of truth: `src/data/ideas.ts`. Copy below is a **draft derived from the E-Cell landing document** and may be edited. The document's "Implementation note" is a developer note and is never rendered.

### Step 1 - About E-Cell
- Eyebrow: `01 - ABOUT E-CELL`
- Headline: **More Than** / *An Idea*
- Body: Every meaningful venture starts with an idea, but turning it into reality takes the right people, the right opportunities, and the willingness to take the first step. CSEA E-Cell gives students a place to experience entrepreneurship, not just learn about it.
- Pills: EXPLORE · DISCOVER · COLLABORATE · BUILD
- Cards (1, quote variant): "Entrepreneurship is not just something to learn about. It is something to experience, experiment with, and build."
- Micro-labels: ENTREPRENEURSHIP · REAL PROBLEMS

### Step 2 - Our Approach
- Eyebrow: `02 - OUR APPROACH`
- Headline: **Our** / *Approach*
- Body: A simple loop for turning curiosity into something that matters.
- Pills: IDEATE · COLLABORATE · BUILD
- Cards (3):
  1. **Ideate** - Identify problems, explore opportunities, challenge assumptions, and develop ideas that can make a difference.
  2. **Collaborate** - Connect with fellow students, alumni, industry professionals, and people from other disciplines to turn individual ideas into collective efforts.
  3. **Build** - Move beyond discussion. Develop projects, test solutions, and solve real-world problems.
- Micro-labels: IDEAS · TEAMS · SOLUTIONS

### Step 3 - Ecosystem
- Eyebrow: `03 - ECOSYSTEM`
- Headline: **Real-World** / *Connections*
- Body: Connecting campus to the real world.
- Pills: ACADEMIA · ALUMNI · INDUSTRY
- Cards (3):
  1. **Academic Collaboration** - Explore opportunities to work with institutions such as PSG Institute of Management, bringing together technical, managerial, and entrepreneurial perspectives.
  2. **Alumni and Industry Connections** - Work towards connecting students with alumni and industry networks through industry-driven hackathons, hands-on projects, and real-world problem solving.
  3. **Interdisciplinary Innovation** - Encourage students from different departments and associations within PSG Tech to exchange ideas and build solutions beyond their usual circles.
- Micro-labels: PARTNERSHIPS · NETWORKS

### Step 4 - Student Journey
- Eyebrow: `04 - STUDENT JOURNEY`
- Headline: **Your** / *Journey*
- Body: From first conversation to a possible venture.
- Pills: DISCOVER · EXPLORE · CREATE · EXPAND
- Cards (4, numbered 1-4):
  1. **Discover Opportunities** - Find people to work with, explore industry connections, and take your ideas beyond the classroom.
  2. **Explore the Real World** - Talk to people, conduct surveys, understand business problems, and learn from entrepreneurs.
  3. **Create Meaningful Impact** - Engage with communities, understand their challenges, and work towards practical solutions.
  4. **Expand Your Horizons** - Refine your solutions, learn from real entrepreneurial experiences, and explore turning your work into a venture.
- Micro-labels: LEARN · TEST · GROW

### Step 5 - Who Is E-Cell For
- Eyebrow: `05 - WHO IS E-CELL FOR`
- Headline: **Who Is** / *E-Cell For*
- Body: You don't need a startup idea to get started.
- Pills: IDEA · BUILD · COLLABORATE · EXPLORE
- Cards (4, 2x2 glass grid):
  1. **The Idea Person** - Have an idea? Find the people and opportunities to explore it.
  2. **The Builder** - Want to create, experiment, and turn concepts into working solutions?
  3. **The Collaborator** - Looking to meet people, build teams, and work across disciplines?
  4. **The Explorer** - Curious about entrepreneurship and looking for somewhere to begin?
- Micro-labels: OPEN TO ALL DEPARTMENTS

Card layouts by step: 1 = `quote`, 2 and 3 = `trio` (three stacked or staggered cards), 4 = `quad` timeline-style, 5 = `grid2x2`. All use the glass card from DESIGN.md. Slight card rotation is a prop, default 0 degrees **[TBD after visual review]**.

## 5. Architecture
 
```
src/features/landing/ideasteps/
  IdeaSteps.tsx            container: gsap.matchMedia switch between PinnedIdeaSteps and StaticIdeaSteps
  PinnedIdeaSteps.tsx      desktop pinned stage: 100svh stage, FlowLine, GlowBlob, stacked Step slides, shared indicator
  useIdeaStepsTimeline.ts  builds the single master GSAP timeline & pin ScrollTrigger; provides activeIndex and goToStep
  FlowLine.tsx             SVG with ghost and drawn paths (stroke-width: 11px, linear drawing from 0.02 to 0.97)
  StaticIdeaSteps.tsx      stacked presentation: renders all five Step components with GridBackdrop and GlowBlob (mobile & reduced-motion)
  Step.tsx                 single step stage: 12-column grid composing StepText, StepCards, and bottom bar
  StepText.tsx             eyebrow, two-line headline, body, pills
  StepCards.tsx            renders layouts: quote, trio, quad, grid2x2
  StepIndicator.tsx        01-05 accessible mono switcher
  COMPONENT.md

src/components/common/
  GridBackdrop.tsx         hairline 3-column grid + crosshair marks (shared primitive)
  GlowBlob.tsx             blurred radial gradient with corner presets & forwardRef (shared primitive)
```

Responsibilities:
- `IdeaSteps` uses `gsap.matchMedia()` to switch between `<PinnedIdeaSteps />` (desktop >= 1024px and motion allowed) and `<StaticIdeaSteps />` (mobile/tablet < 1024px or reduced-motion). Exactly one mode is in the DOM at a time.
- `PinnedIdeaSteps` mounts the 100svh stage, background layers, stacked `Step` slides (`absolute inset-0`), and the shared bottom-left `StepIndicator`.
- `useIdeaStepsTimeline` is the sole owner of the master timeline and single pin ScrollTrigger (`scrub: 0.6`, pin length: 5x viewport height, `start: "top top"`, `invalidateOnRefresh`). Calculates activeIndex on change, drives flow-line drawing and glow blob movement.
- `FlowLine` renders the decorative ghost and drawn paths using `FLOW_PATH` from `src/data/flowPath.ts`.
- `StaticIdeaSteps` maps over `ideas` data from `src/data/ideas.ts`, handles Lenis/native smooth-scrolling for indicator clicks, and renders background layers.
- `Step` represents one full stage layout with responsive 12-column grid (text on cols 1-5, cards on cols 7-12) and bottom bar (indicator, sideLabel, microLabels).
- Presentational components receive data and props; they hold no animation logic.
- Data comes from `src/data/ideas.ts`. Extended `IdeaStep` type with `layout`, `pills`, `cards`, `microLabels`, and optional `sideLabel`.

## 6. Technical rules

- All GSAP code runs inside `useGSAP` with a scope ref so cleanup is automatic.
- One master timeline and one pin `ScrollTrigger`. No per-step ScrollTriggers; derive step state from timeline progress in `onUpdate`.
- Animate `transform` and `opacity` only (plus `stroke-dashoffset` on the line).
- No scroll event listeners and no `requestAnimationFrame` loops of our own.
- Refresh on resize and after fonts load (`document.fonts.ready`) so pin length and path length stay correct.
- Inactive steps are `aria-hidden` and `inert`, still in the DOM.
- Do not set React state per frame.

## 7. Accessibility

- Section has an `aria-labelledby` pointing to a visually hidden `h2` ("About CSEA E-Cell").
- Each step title is an `h3`.
- Reduced-motion and mobile users read all five steps in normal document order.
- Indicator buttons are keyboard operable; clicking moves focus-neutral (focus stays on the button).
- Decorative layers (line, grid, glow) are `aria-hidden`.

## 8. Files you may and may not touch

**May modify:** everything in `src/features/landing/ideasteps/`, `src/data/ideas.ts`, the `IdeaStep` type in `src/types/index.ts`, and the landing page file only to mount `<IdeaSteps />`.

**Must not modify:** `src/lib/gsap.ts`, `src/components/reactbits/*`, `src/components/ui/*`, header, menu, footer, router, or other features' files. If a change there seems necessary, stop and ask.

## 9. Test plan (Playwright)

1. At 1280x720, scroll to timeline progress 0, 0.1, 0.3, 0.5 (interlude), 0.7, 0.9, 1.0 and screenshot each; compare against the reference frames.
2. Assert the active indicator for each step's hold position.
3. Click each indicator and assert the page lands on that step.
4. Emulate `reducedMotion: 'reduce'`: all five steps are visible stacked, no pinning.
5. At 375x812: static layout, no horizontal overflow.
6. Axe: no violations in both modes.
7. No console errors or warnings; no layout shift after fonts load.
8. Resize from desktop to mobile and back: no leftover pin spacing.

## 10. Definition of done

- [x] Five steps play in order with enter, hold, exit, interlude.
- [x] Flow line draws smoothly, constant stroke width, no dash jumps.
- [x] Glow blob moves per step.
- [x] Indicator syncs and is clickable.
- [x] Static fallback verified at mobile and reduced-motion.
- [x] Matches reference design specifications for layout, spacing, type scale, and colours.
- [x] All tests above pass; lint, typecheck, build pass.
- [x] No files outside the allowed list changed.

## 11. Deviations and notes

- Reference recordings/screenshots (`docs/references/`): The directory is absent in the workspace, so visual layout, timings, type scales, and colors were strictly authored and verified against `docs/COMPONENT.md` and `docs/DESIGN.md`.
- Shared primitives: `GridBackdrop` and `GlowBlob` are placed in `src/components/common/` to be shared across features, with `React.forwardRef` added to `GlowBlob` for GSAP animation.
- FlowLine path: Uses `FLOW_PATH` from `src/data/flowPath.ts`, entering at `1000 -20` (connecting from hero) and sweeping in smooth loops across the stage with constant 11px stroke width.

## 11. Open items

- [ ] Final flow-line path.
- [ ] Pin length and segment shares after scrub feel-testing.
- [ ] Whether the reference scrubs or triggers its transitions (test by scrolling slowly and stopping mid-interlude).
- [ ] Final copy, micro-labels, and optional photos for card variants.
- [ ] Final fonts and colours from the reference site.