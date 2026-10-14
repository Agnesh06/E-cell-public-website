# Checklist

## Phase 1 – Scaffold ✅

- [x] Vite + React + TypeScript project created
- [x] Tailwind CSS v4 configured with `@tailwindcss/vite`
- [x] shadcn/ui initialised; primitive components added (Button, Input, etc.)
- [x] React Router v7 browser router with lazy-loaded route placeholders
- [x] GSAP, Lenis, @gsap/react, Motion installed; centralized via `src/lib/gsap.ts`
- [x] React Hook Form + Zod scaffold for contact form (schema + API stub)
- [x] Environment validation via `src/lib/env.ts`
- [x] Vitest unit test (cn utility)
- [x] Playwright e2e smoke tests across mobile / tablet / desktop / wide
- [x] axe-core accessibility baseline on all routes
- [x] Typed site data, ideas, projects, team modules in `src/data/`
- [x] `src/types/` shared domain contracts
- [x] `docs/` directory with DESIGN.md, ARCHITECTURE.md, PLAN.md, CHECKLIST.md, COMPONENT.md

## Phase 2 – Foundations and Layout Shell ✅

### 1. Tokens and global styles
- [x] `@theme` block in `src/styles/index.css` with colours, fonts, type scale, radii, shadow, breakpoints (TODO markers on placeholder values)
- [x] Base styles: body background/ink, antialiasing, font families, headings weight 300 + tight tracking
- [x] `::selection` in blue-ghost; `:focus-visible` ring (2 px blue, 2 px offset)
- [x] `@utility` rules: `.eyebrow`, `.pill`, `.container-site`, `.glass-card`, `.hairline`, `.sr-only`
- [x] `prefers-reduced-motion` global suppression (scroll-behavior, animation, transition)

### 2. Shared primitives (`src/components/common/`)
- [x] `Button` — primary + secondary variants, polymorphic `to` router link, trailing nudging arrow
- [x] `Container` — max-width 1280, responsive gutters
- [x] `Eyebrow` — mono, uppercase, blue
- [x] `Pill` — mono, bordered, uppercase
- [x] Barrel `index.ts`
- [x] Folder documented in ARCHITECTURE.md and AGENTS.md

### 3. Smooth scroll (`src/app/SmoothScrollProvider.tsx`)
- [x] Lenis instance driven by `gsap.ticker` (`lenis.raf(time * 1000)`)
- [x] `gsap.ticker.lagSmoothing(0)` called
- [x] `ScrollTrigger` synced via `lenis.on('scroll', ScrollTrigger.update)`
- [x] Context + `useLenis()` hook exposed via `src/app/smoothScroll.ts`
- [x] Disabled when `prefers-reduced-motion: reduce`
- [x] Scroll-to-top on route change; hash-link navigation (fails silently if element absent)
- [x] Cleanup on unmount

### 4. Header and logos
- [x] Four placeholder SVGs `logo-1.svg … logo-4.svg` in `src/assets/logos/`
- [x] `LogoGroup.tsx` — 4 grayscale logos with responsive 22/28/36 px heights and 8/12/16 px gaps
- [x] `Header.tsx` — fixed, transparent, full-width, z-40, safe-area padding
- [x] LogoGroup fades + slides up 12 px past 70 % vh scroll-down; returns on scroll-up
- [x] Reduced motion: instant opacity toggle, no animation
- [x] Native `window` scroll listener (works in headless test environments)

### 5. StaggeredMenu (React Bits)
- [x] Installed into `src/components/reactbits/StaggeredMenu.tsx` (unmodified)
- [x] ESLint ignore rules added for reactbits directory
- [x] `MenuWrapper.tsx` created with nav items + social items from `site.ts`
- [x] Item numbering enabled; blue toggle / white panel / blue accent via props
- [x] Vendored logo suppressed via CSS (`display: none`)
- [x] Internal nested `<header>` demoted to `role="none"` (no duplicate banner landmark)
- [x] Client-side navigation via event delegation + React Router `navigate()`
- [x] Escape closes + returns focus to toggle
- [x] Hash-link handling (`/#about`) via Lenis / native scroll

### 6. Footer
- [x] 4-column desktop layout, stacked mobile
- [x] Brand + tagline "Ideate. Collaborate. Build."
- [x] Quick-links nav (`aria-label="Footer"`)
- [x] Contact block with placeholder email + PSG address
- [x] CSEA link from `VITE_CSEA_URL` env (fallback `https://csea.psgtech.ac.in`), `target="_blank"`, accessible label
- [x] Social icons via lucide-react
- [x] Copyright: `© {new Date().getFullYear()} CSEA E-Cell, PSG College of Technology, Coimbatore`
- [x] Semantic `<footer>` + `<nav aria-label="Footer">`

### 7. RootLayout
- [x] Skip-to-content link as first focusable element
- [x] `Header` + `<main id="main">` + `Footer` wired
- [x] Home placeholder has `<h1>Home</h1>` and marked temporary 250 vh spacer (TODO remove in phase 3)

### 8. Tests
- [x] `header-menu.spec.ts`: 4 logos, scroll hide/show, reduced-motion toggle, menu open/close/items, Escape + focus return, SPA navigation without reload
- [x] `footer.spec.ts`: tagline, copyright, CSEA link href + `target="_blank"`
- [x] `a11y.spec.ts`: axe passes on /, /projects, /team, /contact (menu closed) and / (menu open)
- [x] `screenshots.spec.ts`: header-closed, menu-open, and footer baselines at all nine responsive viewports
- [x] All earlier smoke tests remain green
- [x] 0 console errors in tests

### 9. Docs
- [x] `docs/ARCHITECTURE.md` updated with Phase 2 sections
- [x] `docs/CHECKLIST.md` Phase 2 section added (this file)
- [x] `docs/PLAN.md` Phase 1 + Phase 2 marked done
- [x] `AGENTS.md` folder map updated

## Phase 2 Fix Pass ✅

### 1. Menu toggle position
- [x] Toggle renders at **top-right** with site gutter (24 px mobile / 40 px desktop)
- [x] Vendored logo kept in layout with `visibility: hidden` + `aria-hidden="true"` so `justify-content: space-between` pushes toggle right
- [x] Four-logo group is centred independently of the toggle with a three-column `1fr auto 1fr` header row
- [x] Vendored `staggered-menu-header` uses the shared 84 px header row and responsive 24 px / 40 px gutters
- [x] Toggle is a labelled 44 × 44 px icon-only target below 480 px
- [x] Did **not** modify `src/components/reactbits/StaggeredMenu.tsx`

### 2. Toggle styling
- [x] Closed state: "Menu" label + **blue** (`--color-blue`) plus icon, ~16 px medium weight
- [x] Open state: "Close" label + ink X icon
- [x] Plus → X animated via CSS `rotate` + `opacity` transition
- [x] Focus ring uses `--color-blue`

### 3. Menu item sizing
- [x] Item font-size: `clamp(2rem, min(3.6vw, 7.5vh), 3.75rem)`; "Contact Us" stays on one line at ≥1024 px
- [x] Panel width: `clamp(360px, 32vw, 520px)` on desktop and 100vw below 640 px
- [x] Panel content scrolls vertically on short viewports; socials remain below items with at least 32 px padding
- [x] Blue superscript numbers and Socials row preserved

### 4. Header alignment
- [x] Logo group is centred against `document.documentElement.clientWidth` and shrinks without horizontal overflow
- [x] Logo and toggle centres align within 4 px; toggle remains within 48 px of the right edge
- [x] Scroll-hide behavior is separate from the 150 ms menu-open fade (instant with reduced motion)

### 5. Tests
- [x] `tests/e2e/header-responsive.spec.ts` — closed/open layout checks at all nine requested viewports
- [x] Resize while open: 1280×720 → 375×667 → 1280×500; short mobile checks at 320×480 and 375×568
- [x] `tests/e2e/screenshots.spec.ts` — closed, open, and footer baselines refreshed at all nine requested viewports

### 6. Boundaries respected
- [x] `src/components/reactbits` — **not modified**
- [x] `src/components/ui` — **not modified**
- [x] `src/lib/gsap.ts` — **not modified**
- [x] No new npm dependencies added
- [x] No git commits made

## Phase 3 – Hero Section ✅

### 1. Structure
- [x] `src/features/landing/index.tsx` composes `<Hero />` and temporary placeholder `<section id="about">` (min-height 100svh, labelled "Idea steps - Phase 4")
- [x] `src/features/landing/hero/Hero.tsx` created
- [x] `src/features/landing/hero/HeroBackground.tsx` created
- [x] `src/features/landing/hero/HeroLine.tsx` created
- [x] `src/data/flowPath.ts` exports shared `FLOW_PATH` from COMPONENT.md section 3.2

### 2. Background (`HeroBackground.tsx`)
- [x] DotGrid fills hero (`absolute inset-0 z-0 overflow-hidden`), scrolls away with hero
- [x] `--color-dot: #CBD5FF` token added to `@theme` and `:root` in `src/styles/index.css`
- [x] Tokens resolved at mount via `getComputedStyle`
- [x] DotGrid masked toward bottom: `mask-image: linear-gradient(to bottom, black 55%, transparent 100%)`
- [x] Lazy-loaded via `React.lazy`
- [x] `IntersectionObserver` pauses animation when hero is off-screen
- [x] Device pixel ratio capped at 2 (`Math.min(window.devicePixelRatio || 1, 2)`)
- [x] Static CSS radial dot pattern fallback on `prefers-reduced-motion`, `pointer: coarse`, and `< 768px` (no canvas mounted)
- [x] `HeroLine.tsx`: SVG with ghost path (`--color-blue-ghost`), drawn path (`--color-blue`, first ~15%), `vector-effect: non-scaling-stroke`, `aria-hidden="true"`, scaled and positioned lower on mobile

### 3. Content
- [x] Eyebrow: `CSEA E-CELL - PSG COLLEGE OF TECHNOLOGY` (mono, blue, uppercase)
- [x] Two-line `h1`: "Ideas are just" / "the beginning." with single accessible text "Ideas are just the beginning."
- [x] Paragraph: exact copy, max-52ch
- [x] Buttons: primary "Get Involved" (`/contact`, SPA link), secondary "Explore Our Vision" (scrolls to `#about`)
- [x] Bottom-left mono label "SCROLL" with subtle pulsing vertical line
- [x] Bottom-right mono label "IDEATE · COLLABORATE · BUILD"

### 4. Layout
- [x] `min-height: 100svh`, `container-site`, left-aligned typography
- [x] Text column max ~62% on desktop, full width on mobile
- [x] Top padding clears fixed header at all viewports (`pt-28 md:pt-36`)
- [x] Display type token `clamp(3rem, 7vw, 6.5rem)`, buttons stack below 480px
- [x] Zero horizontal overflow at 320px

### 5. Motion
- [x] GSAP load timeline (`useGSAP` with scope ref, ~1.4s total, `power3.out`): eyebrow reveal, two-line masked heading reveal, paragraph & buttons stagger
- [x] HeroLine 15% drawn segment draws over 1.6s (`power2.inOut`) while ghost fades in
- [x] Set from-states in `useGSAP`, no flash of hidden content
- [x] Reduced motion: final state applied immediately, no animations or pulse

### 6. Tests & Docs
- [x] `tests/e2e/hero.spec.ts` covering heading hierarchy, content, SPA navigation, vision scroll, responsive bounds, and reduced motion
- [x] `tests/e2e/dot-grid.spec.ts` updated for desktop interactivity and static fallback verification
- [x] `DESIGN.md`, `ARCHITECTURE.md`, `PLAN.md`, `CHECKLIST.md` updated
- [x] Baseline screenshots at 1920×1080, 1280×720, 768×1024, 375×667 captured

## Phase 4A – IdeaSteps: Content, Data, and Static Layout ✅

### 1. Data
- [x] `IdeaCard` and `IdeaStep` types extended in `src/types/index.ts` (`layout`, `pills`, `cards`, `microLabels`, `sideLabel`)
- [x] All five steps populated in `src/data/ideas.ts` with exact copy from `COMPONENT.md` section 4
- [x] Step 1 uses layout `quote` with `sideLabel: 'PSG College of Technology'`
- [x] Steps 2 & 3 use layout `trio`
- [x] Step 4 uses layout `quad`
- [x] Step 5 uses layout `grid2x2`
- [x] Zero "Implementation note" text rendered

### 2. Shared primitives (`src/components/common/`)
- [x] `GridBackdrop.tsx` created: 3-column hairline grid (`1px`, `--color-hairline`), crosshair marks at intersections, faint horizontal rules, `aria-hidden`
- [x] `GlowBlob.tsx` created: blurred radial gradient (`--color-blue-ghost` to transparent, ~40-45vw) with corner presets (`bottom-left`, `top-right`, `bottom-right`, `top-left`), `aria-hidden`
- [x] Primitives exported from `src/components/common/index.ts`

### 3. IdeaSteps components (`src/features/landing/ideasteps/`)
- [x] `StepText.tsx`: eyebrow, two-line `h3` headline (`headlineTop` in ink, `headlineAccent` in blue), body copy (max-46ch), pill tags with dash prefix
- [x] `StepCards.tsx`: four layouts (`quote` with large blue-ghost `“` mark and italic copy; `trio` with staggered offsets; `quad` timeline with rail and numbered nodes; `grid2x2` with 2×2 glass cards)
- [x] `StepIndicator.tsx`: accessible mono switcher (`01`–`05`), `aria-current="step"`, `aria-label="Steps"`, WCAG AA-compliant contrast
- [x] `Step.tsx`: full stage layout (`min-h-[100svh]`, `container-site`, 12-column grid), text on cols 1-5, cards on cols 7-12, bottom bar with indicator, sideLabel, and microLabel; no animation logic
- [x] `StaticIdeaSteps.tsx`: stacked rendering of all five steps with `GridBackdrop`, `GlowBlob` per step, and smooth scrolling on indicator click
- [x] `IdeaSteps.tsx`: `<section id="about" aria-labelledby="about-section-heading">` with `sr-only` `h2` ("About CSEA E-Cell")
- [x] `src/features/landing/index.tsx`: mounts `<IdeaSteps />` directly after `<Hero />`

### 4. Tests & Verification
- [x] `tests/e2e/ideasteps.spec.ts`: section structure, heading hierarchy, 5 step headlines in order, pills per step, card titles, no "Implementation note", axe WCAG AA compliance, Hero "Explore Our Vision" scroll-to-about, horizontal overflow checks at 6 widths, zero console errors
- [x] Per-step baseline screenshots captured at 1280×720 and 375×667 for all 5 steps
- [x] `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and full e2e suite all passing

## Phase 4B – IdeaSteps: Pinned Scroll Sequence (Desktop) ✅

### 1. Mode switch
- [x] `IdeaSteps.tsx` uses `gsap.matchMedia()`: pinned mode only when `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`
- [x] Exactly one mode rendered in the DOM at a time (`<PinnedIdeaSteps />` or `<StaticIdeaSteps />`)
- [x] Resize across 1024px breakpoint cleanly cleans up (no leftover pin spacers, no stuck inline styles) and rebuilds

### 2. Pinned stage (`PinnedIdeaSteps.tsx`)
- [x] 100svh pinned stage with `GridBackdrop`, `GlowBlob`, `StarField`, and the five `<Step />` elements stacked absolutely (`inset 0`)
- [x] Single shared `StepIndicator` at bottom-left replaces per-step indicators in pinned mode
- [x] Step slides use `aria-hidden={!isActive}` and `inert={!isActive}`
- [x] Section exposes `data-active-step`, `data-active-index`, and throttled `data-progress`

### 3. Timeline & ScrollTrigger (`useIdeaStepsTimeline.ts`)
- [x] Single pin `ScrollTrigger`: `scrub: 0.6`, pin distance `5 * window.innerHeight`, `start: "top top"`, `invalidateOnRefresh: true`
- [x] Scoped with `useGSAP` for automatic cleanup
- [x] Step timings: Enter (0.15), Hold (0.55), Exit (0.15), Interlude (0.15); last step holds through pin release with no exit
- [x] Active index updates only on step change in `onUpdate`
- [x] Indicator click smoothly scrolls to the start of that step's hold segment via Lenis / native fallback

### 4. StarField (`StarField.tsx`)
- [x] One `<canvas>` background, `aria-hidden="true"`, pointer-events none, z-index 0 behind cards
- [x] Sized with `ResizeObserver`, DPR capped at 2, pre-rendered offscreen radial gradient glow sprite
- [x] 14 initial stars, straight-line motion, edge bounce with up to 10° angle change
- [x] Merging logic (parents fade out 500ms, 3 children spawn with 120° offsets, 800ms grace period, expanding shockwave ring)
- [x] Population cap: max 24 alive stars, oldest non-merging star fades out if cap exceeded
- [x] Exponential scroll speed factor (1x up to 4x) sampled via `window.scrollY`
- [x] IntersectionObserver & visibilitychange pause RAF; disabled under `prefers-reduced-motion`

### 5. GlowBlob animation
- [x] Animated between corner presets during interludes (`xPercent`, `yPercent`, opacity 0.6–0.85)
- [x] Pure GPU transform/opacity animation, zero layout recalculation

### 6. Tests & Verification
- [x] `tests/e2e/ideasteps-pinned.spec.ts` (18/18 passing):
  - Progress points 0.0, 0.1, 0.3, 0.5 (interlude), 0.7, 0.9, 1.0 verified with content visibility checks and screenshots
  - Indicator click navigation for all 5 steps
  - Keyboard navigation (Tab + Enter)
  - Resize 1280 -> 800 -> 1280 switches to static and rebuilds pinned cleanly
  - Reduced-motion renders static stacked layout with no pin
  - Mobile 375x812 renders static layout with zero horizontal overflow
  - axe-core accessibility passes with 0 violations
- [x] Progress screenshots captured at 0.0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0

## Visual design

- [x] Landing hero headline, supporting copy, and Get Involved CTA replace the temporary spacer
- [x] Decorative DotGrid canvas responds to pointer proximity, fast movement, and clicks
- [x] DotGrid is aria-hidden, resizes with its hero, and honors reduced-motion preferences
- [x] Five IdeaSteps stages rendered with custom cards (quote, trio, quad timeline, 2x2 grid)
- [x] Pinned scroll sequence with smooth scrubbed timeline, dynamic star-field canvas, moving glow, and interlude stage clears

## Content and data

- [x] IdeaSteps content and types populated from COMPONENT.md spec
- [ ] Projects, team, leadership data (Phases 5-7)

## Accessibility and performance

_(Phase 9)_

## Deployment

_(Phase 10)_
