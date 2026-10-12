# Architecture

## Application shell

`src/main.tsx` loads the global stylesheet and mounts `src/app/App.tsx`.
`App` renders the React Router provider configured in `src/app/router.tsx`.
Route elements are lazy-loaded and nested under `RootLayout`; the layout owns
the Skip-to-content link, `Header`, `<main id="main">`, `Footer`, and scroll
restoration. The wildcard route renders the app-level Not Found placeholder.

## Responsibilities

- `src/app/`: application entry, router, provider boundary, root layout, and
  smooth-scroll provider.
- `src/components/ui/`: generated shadcn/ui primitives — **do not edit**.
- `src/components/reactbits/`: unmodified vendored component files (currently
  `StaggeredMenu.tsx`) — **do not edit**.
- `src/components/common/`: reusable design-system primitives built on top of
  the token system: `Button` (primary / secondary, polymorphic Link support,
  trailing arrow), `Container`, `Eyebrow`, `Pill`.
- `src/components/layout/`: full layout implementation — `Header`, `Footer`,
  `LogoGroup`, and `MenuWrapper`.
- `src/features/`: one route placeholder per product area; contact schema and
  API modules are reserved for the later form phase.
- `src/data/`: typed, static site metadata and placeholder ideas, projects, and
  team records.
- `src/lib/`: Zod-validated Vite environment values, the shared `cn` utility,
  and centralized GSAP plugin registration.
- `src/styles/`: Tailwind CSS v4 entry point, design tokens (`@theme`), base
  styles, and utility classes.
- `src/assets/`: brand logos and imagery. Currently holds four placeholder SVGs
  `logo-1.svg … logo-4.svg`.
- `src/types/`: shared domain data contracts.
- `tests/e2e/`: route smoke coverage, axe accessibility checks, header/menu
  interaction tests, footer checks, and baseline screenshot capture.

## Smooth scroll provider (`src/app/SmoothScrollProvider.tsx`)

Creates a single `Lenis` instance on mount, drives it via `gsap.ticker.add`
(passes `time * 1000` to `lenis.raf`), calls `gsap.ticker.lagSmoothing(0)`,
and keeps `ScrollTrigger` in sync via `lenis.on('scroll', ScrollTrigger.update)`.
The instance is exposed through `SmoothScrollContext` and a `useLenis()` hook
(defined in `src/app/smoothScroll.ts`).

**Reduced-motion**: if `prefers-reduced-motion: reduce` is set at mount time,
the provider returns early without creating Lenis. `useLenis()` returns `null`.

**Route scroll**: `RootLayout` consumes `useLenis()` and scrolls to the top on
every route change, or to a hash element when `location.hash` is present.

## Header (`src/components/layout/Header.tsx`)

Fixed, full-width, transparent, `z-40`. Contains `LogoGroup` on the left and
`MenuWrapper` on the right. Both children are `pointer-events-auto` islands
inside a `pointer-events-none` container.

**Logo hide/show**: a passive native `window` scroll listener tracks
`lastScrollY`. When the user scrolls **down past 70 % of `innerHeight`** the
logo wrapper fades to opacity 0 and translates up 12 px via GSAP (immediate
inline style set in reduced-motion mode). It reappears on any upward scroll.
A native `scroll` listener is used rather than Lenis or ScrollTrigger so the
behaviour works in headless test environments where the GSAP RAF ticker does
not run.

## LogoGroup (`src/components/layout/LogoGroup.tsx`)

Renders the `site.logos` array (four entries currently using placeholder SVGs).
Each logo is 36 px tall, grayscale, with a 16 px gap. Optional `href` wraps the
`<img>` in an anchor with `target="_blank" rel="noopener noreferrer"`.

## MenuWrapper (`src/components/layout/MenuWrapper.tsx`)

Wraps the vendored `StaggeredMenu` component. Responsibilities handled entirely
through React DOM effects and event delegation (no changes to the vendored
source):

- Feeds `site.navItems` and `site.socials` as `items` / `socialItems` props.
- Suppresses the vendored logo element via CSS (`display: none`).
- Demotes the vendored `<header class="staggered-menu-header">` to
  `role="none"` to prevent a duplicate banner landmark.
- Intercepts `click` events on `<a>` tags inside the panel and calls React
  Router's `navigate()` for internal paths, preventing full-page reloads.
- Handles Escape key to close and return focus to the toggle button.

## Hero section (`src/features/landing/hero/`)

- `Hero.tsx`: Main hero layout shell (`min-h-[100svh]`, `container-site`, left-aligned typography). Owns the GSAP entrance timeline (`useGSAP` with scope ref) for eyebrow, two-line masked heading reveal, paragraph, buttons, and HeroLine SVG path drawing.
- `HeroBackground.tsx`: Background layer hosting `DotGrid` with lazy loading, CSS gradient mask fading toward the bottom, and off-screen pause via `IntersectionObserver`. Falls back to a static CSS radial dot pattern under reduced motion, coarse pointer (touch), or viewport width < 768px.
- `HeroLine.tsx`: Decorative SVG displaying the ghost flow path (`--color-blue-ghost`) and drawn segment (`--color-blue`, first ~15%). Positioned behind text and scaled down on mobile viewports.
- `src/data/flowPath.ts`: Exports the shared flow-line SVG path string defined in `COMPONENT.md` section 3.2.

## IdeaSteps section (`src/features/landing/ideasteps/`)

- `IdeaSteps.tsx`: Mounts `<section id="about" aria-labelledby="about-section-heading">` with `sr-only` accessible `h2` ("About CSEA E-Cell"). Uses `gsap.matchMedia()` to conditionally render `<PinnedIdeaSteps />` on desktop (`min-width: 1024px` and motion allowed) or `<StaticIdeaSteps />` on mobile/tablet/reduced-motion. Exactly one mode is in the DOM at a time.
- `PinnedIdeaSteps.tsx`: 100svh pinned stage hosting `GridBackdrop`, `GlowBlob`, `FlowLine`, the five stacked `<Step />` elements (`absolute inset-0`, with `hideIndicator={true}`), and one shared bottom-left `StepIndicator`.
- `useIdeaStepsTimeline.ts`: The sole owner of the master GSAP timeline and single pin `ScrollTrigger` (`scrub: 0.6`, pin length: `5 * window.innerHeight`, `start: "top top"`, `invalidateOnRefresh`). Drives enter/hold/exit segments per step, interlude stage clearing, linear flow-line drawing (0.02 to 0.97), and GPU-accelerated glow blob movement. Sets `data-progress` and updates `data-active-step` only on step changes.
- `FlowLine.tsx`: Decorative SVG (`aria-hidden="true"`, `viewBox="0 0 1440 900"`, `preserveAspectRatio="xMidYMid slice"`) with ghost path (`--color-blue-ghost`) and dynamically drawn path (`--color-blue`, stroke-width: 11px, round caps). Re-measures length on resize and `document.fonts.ready`.
- `StaticIdeaSteps.tsx`: Stacked fallback presentation rendering all five steps in document order, backed by `GridBackdrop` and corner-preset `GlowBlob` elements. Indicator clicks smoothly scroll to `#step-${id}` via `useLenis()`.
- `Step.tsx`: Full-stage presentation component (`min-h-[100svh]`, `container-site`, 12-column grid) with cols 1-5 for `StepText`, col 6 spacer, and cols 7-12 for `StepCards`. Bottom bar provides `StepIndicator` (or spacer if `hideIndicator={true}`), sideLabel (desktop), and first microLabel. Contains no animation logic.
- `StepText.tsx`: Renders step eyebrow, two-line `h3` headline (`headlineTop` in ink, `headlineAccent` in blue), body copy (max-46ch), and pill tags.
- `StepCards.tsx`: Renders the four layout variants (`quote`, `trio`, `quad`, `grid2x2`) using glass-card styling and optional tilt rotation.
- `StepIndicator.tsx`: Accessible step switcher (`01`–`05`) with `aria-current="step"`, `aria-label="Steps"`, and WCAG AA-compliant colors.

## Footer (`src/components/layout/Footer.tsx`)

Semantic `<footer>` with four columns on desktop (brand + tagline; quick-links
nav with `aria-label="Footer"`; contact block; connect/social block) and a
bottom bar with the copyright year computed at runtime via
`new Date().getFullYear()`. The CSEA link reads `VITE_CSEA_URL` from env with
a fallback.

## Common primitives (`src/components/common/`)

| Component      | Description |
|----------------|-------------|
| `Button`       | Primary (filled blue) and secondary (ghost) variants. Renders a React Router `<Link>` when given a `to` prop, otherwise a `<button>`. Optional trailing arrow icon that nudges 4 px right on hover. |
| `Container`    | Wrapper for `max-w-[1280px]` centred content with responsive horizontal padding (24 px → 40 px). |
| `Eyebrow`      | Mono-spaced, uppercase, blue label above section headings. |
| `Pill`         | Bordered, mono-spaced, uppercase tag used for tech or status labels. |
| `GridBackdrop` | Hairline 3-column grid backdrop (`1px`, `--color-hairline`) with intersection crosshair marks and subtle horizontal rules. |
| `GlowBlob`     | Blurred radial gradient glow blob (`--color-blue-ghost` to transparent) with corner presets (`bottom-left`, `top-right`, `bottom-right`, `top-left`). |

## Data flow

Static metadata is exported from typed modules in `src/data/`. The site
configuration reads validated `VITE_CSEA_URL` from `src/lib/env.ts`. The
external contact endpoint is represented by `VITE_API_URL`; no backend or
request behavior is implemented in this foundation phase.
Live projects and team records are fetched via quote-aware CSV parsing (`src/lib/sheets.ts`) with a 4s timeout and session caching via `useSheetData`.
Consumers preserve section heights during loading to eliminate layout shifts, rendering live records upon completion.
Network failures, timeouts, or unconfigured sheets gracefully fall back to static fixtures, while cost metrics are eliminated in favor of a 3-card facts grid.

## Styling and tooling

Tailwind CSS v4 is integrated through `@tailwindcss/vite` and `src/styles/index.css`.
Design tokens live inside `@theme`; utility classes (`.eyebrow`, `.pill`,
`.container-site`, `.glass-card`, `.hairline`, `.sr-only`) are defined with
`@utility`. Vite and TypeScript resolve `@` to `src`. Vitest runs unit test
files under `src/`; Playwright runs browser tests from `tests/e2e/` using the
Vite dev server on port 4173.
