# DESIGN.md - CSEA E-Cell Public Website

Visual direction for the public site. Read this before touching any UI. Component-specific behaviour lives in each component's own `COMPONENT.md`.

Status legend: **[LOCKED]** decided, do not change without asking. **[TBD]** placeholder, to be replaced after visual comparison with the reference.

---

## 1. Purpose and tone

The public face of CSEA E-Cell, PSG College of Technology. Audience: students, faculty, alumni, and companies considering a collaboration.

- **Official, calm, confident.** It should feel like an institution's site, not a student fest page.
- **White and blue**, generous whitespace, thin hairlines, large light-weight type.
- **One motion idea**: a single blue line that draws itself across the page. Everything else stays restrained.
- Copy is plain and professional. No emoji, no slang, no winking text.

## 2. References

Place these in `docs/references/` and compare against them during visual review.

| File | Use it for |
|---|---|
| `ref-step-01.png` ... `ref-step-05.png` | Layout, type, line, cards and indicator of the five-step sequence |
| `ref-scroll-recording.mp4` | Transition behaviour (fade out, line sweep, fade in), glow movement |
| Reference site: csea.psgtech.ac.in | Overall palette, hairline grid, "Menu +" control |

**Take from the reference:** the pinned five-step structure, the flowing blue line over a pale ghost copy, two-line headlines with a blue second line, eyebrow + pill tags, step indicator, glass cards, hairline grid with tiny crosshair marks, soft glow blob, the "Menu +" toggle.

**Do NOT copy [LOCKED]:** polaroid photo scatter, hand-drawn annotations, stickers, "we are CSEA ;)" style copy, the expanding group-photo intro, tilted collage photos as the default. E-Cell is more official.

## 3. Principles

1. Content first. Motion supports reading and never delays it.
2. One accent colour (blue). Everything else is ink, white, or hairline grey.
3. Big type, few elements per screen, lots of air.
4. Every animation has a reduced-motion equivalent and a mobile equivalent.
5. Consistency over novelty: the same pill, eyebrow, card and button styles everywhere.

## 4. Colour tokens

Defined in `src/styles/index.css` inside `@theme`. All values are **[TBD]**: eyeballed from screenshots, replace with computed styles from the reference site.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#FAFAFD` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, menu panel |
| `--color-ink` | `#0B0B0F` | Headlines, body |
| `--color-ink-muted` | `rgb(11 11 15 / 0.62)` | Secondary text |
| `--color-ink-faint` | `rgb(11 11 15 / 0.42)` | Micro-labels, indicator inactive |
| `--color-blue` | `#2340FF` | Accent, line, links, primary button |
| `--color-blue-ghost` | `#E6EBFF` | Ghost line, glows, soft fills |
| `--color-hairline` | `#E6E8F0` | Grid lines, card borders, dividers |
| `--color-error` | `#C62828` | Form errors |

Contrast: the placeholder blue on white is roughly 6.5:1 (computed). Re-verify after final values. Ghost blue and hairline are decorative only and never carry text.

## 5. Typography

Fonts matched from reference site (`http://localhost:5174`): display and headings `Plus Jakarta Sans`, body `Inter`, labels/mono `Geist Mono` / `Geist`.

| Role | Size (desktop) | Weight | Tracking | Notes |
|---|---|---|---|---|
| Display (hero) | `clamp(3rem, 7vw, 6.5rem)` | 300 | -0.03em | line-height 0.95 |
| Step headline | `clamp(2.75rem, 5.5vw, 5rem)` | 300 | -0.03em | Two lines; line 2 in blue |
| Section heading | `clamp(2rem, 4vw, 3.25rem)` | 300 | -0.02em | |
| Body | 1.125rem / 1.6 | 400 | 0 | `ink-muted`; max 52ch |
| Eyebrow | 0.75rem mono | 500 | 0.22em, uppercase | Blue. Format: `01 - ABOUT E-CELL` |
| Pill tag | 0.6875rem mono | 500 | 0.18em, uppercase | Hairline border, full radius |
| Micro-label | 0.625rem mono | 400 | 0.2em, uppercase | `ink-faint` |

Mobile: scale with the clamps; never below 2.25rem for headlines or 1rem for body.

## 6. Layout, spacing, breakpoints

- Base unit 8px. Section vertical padding `clamp(5rem, 10vw, 9rem)`.
- Container: max-width 1280px, gutters 24px (mobile) / 40px (desktop).
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`. The pinned scroll sequence is **desktop only (>= lg)**.
- Radius: cards 16px, buttons and pills full, inputs 10px.
- Elevation: one soft shadow for cards, `0 20px 50px -20px rgb(35 64 255 / 0.18)`. No hard shadows.

## 7. Signature elements

**Star field.** A responsive canvas background inside the pinned stage featuring drifting blue stars with straight-line motion, edge bouncing, merging mechanics capped at 24 alive stars, and an exponential scroll-velocity response (1x to 4x). Renders behind the cards and disables under `prefers-reduced-motion` and on mobile.

**Hairline grid.** Three columns of 1px `hairline` lines with tiny crosshair marks at intersections, behind the content in the pinned section and hero. Very low contrast.

**Glow blob.** A blurred radial gradient of `blue-ghost` to transparent, about 40vw wide. Moves between corners per step.

**Eyebrow + two-line headline + body + pill tags** is the standard text block for any "feature" section.

**Glass card.** White at ~70% opacity, 1px hairline border, 16px radius, soft shadow, backdrop blur 8px. Contains a mono index, a title, and one or two lines of text.

**Step indicator.** `01 02 03 04 05` in mono, active item blue with a 1px underline.

## 8. Component styling

**Buttons.** Primary: solid blue, white text, full radius, height 48px, horizontal padding 28px, trailing arrow that nudges 4px on hover. Secondary: transparent, 1px hairline border, ink text, same size. Focus ring: 2px blue with 2px offset.

**Header.** Transparent over content, fixed. The four-logo group is horizontally centred in the viewport; the React Bits StaggeredMenu toggle stays at the right gutter. Logos use a 36px height and 16px gap at ≥1024px, 28px and 12px from 640–1023px, and 22px and 8px below 640px. The toggle is icon-only below 480px while retaining its accessible name. The logos fade out while the menu is open; on scroll down past 70% of the viewport they also hide and slide up, returning on scroll up. Menu panel: white, large ink items with mono index numbers, blue hover, stagger layers in `blue-ghost` then `blue`, social links at the bottom.
A fixed "Contact Us" button sits directly before the Menu toggle (12px gap), remaining visible across scroll states and fading out when the menu or contact popup is open.
Clicking it opens a responsive modal dialog with validation for Name, Phone, and Email, sliding up as a bottom sheet on mobile and displaying as a centered card on desktop.

**Hero.** Text-led, no photos. Eyebrow "CSEA E-CELL - PSG COLLEGE OF TECHNOLOGY", display headline "Ideas are just the beginning.", supporting paragraph, primary "Get Involved" button to `/contact`, and secondary "Explore Our Vision" button scrolling to `#about`. Background is an interactive, subtle DotGrid canvas (small dots, pale blue tint `--color-dot`, active glow in `--color-blue`, masked toward bottom) with static CSS dot pattern fallback on reduced motion, touch devices, and mobile (<768px), plus the SVG flow line featuring the ghost path (`--color-blue-ghost`) and drawn segment (`--color-blue`). The background and line layers are `aria-hidden` and decorative to assistive technology.

**Idea steps.** See `src/features/landing/ideasteps/COMPONENT.md`.

**Projects preview and list.** Expanding strip: one wide active card, the rest narrow vertical strips with rotated titles. Active card: image or tinted placeholder, tag chip, title, one-line summary, "View Project" button. Landing: four items, hover or tap to expand, no scroll hijack. `/projects`: same component, scroll-driven, with tag filters. Mobile: stacked cards.

**Leadership.** Two cards side by side: portrait photo 4:5 with 16px radius, name, role (Director / Co-Director), department. Below, a secondary button "View Full Team Directory".

**Final call to action.** Large two-line headline "Your idea deserves a first step.", one paragraph, a primary "Get Involved" button to `/contact`.

**Footer.** Four columns: brand and tagline "Ideate. Collaborate. Build."; quick links; contact (email, address: PSG College of Technology, Coimbatore); CSEA website link and social icons. Bottom bar: "(c) 2026 CSEA E-Cell, PSG College of Technology, Coimbatore". Light background with a top hairline.

**Contact form.** Four-step stepper across the top (Company, Contact, Collaboration, Commercial), single column of fields, labels above inputs, inline errors in `error` with an icon, file drop zone for the brief, two consent checkboxes, clear success panel. Same card and button styles as the rest of the site.

**Team directory.** Finder-style window on `>= md` (column view: wings, members, info panel), tabbed wing grid on mobile. Window chrome muted, no photorealistic macOS imitation. Full spec in its own `COMPONENT.md`.

## 9. Motion

- Animate only `transform` and `opacity`. Never animate layout properties.
- Smooth scroll via Lenis, wired to the GSAP ticker.
- Starting values **[TBD]** (tune visually):

| Token | Value |
|---|---|
| Fast (hover, focus) | 180ms, `power2.out` |
| Base (reveals) | 600ms, `power3.out` |
| Slow (strip expand, menu) | 700ms, `power3.inOut` |
| Stagger | 60-90ms |
| Reveal offset | 24px up |

- Scroll-linked animation is scrubbed (progress-driven), not time-triggered.
- `prefers-reduced-motion: reduce`: no pinning, no scrub, no parallax. Content appears statically, in order. The flow line is shown fully drawn and static, or omitted.
- Do not run more than one pinned section at a time. Do not nest ScrollTriggers.

## 10. Imagery

- No polaroid frames, stickers, or collage layouts.
- Photos: WebP, fixed aspect ratios (4:5 portraits, 16:10 landscape), 16px radius, `loading="lazy"` except above the fold.
- Until real photos exist, use tinted blue placeholders with a mono caption. Never use stock photos of people.
- Logos: SVG preferred, each in a consistent 36px-high box.

## 11. Accessibility

- Text contrast at least 4.5:1, large text at least 3:1.
- Visible focus on every interactive element. Touch targets at least 44px.
- Semantic landmarks (`header`, `main`, `nav`, `footer`), one `h1` per page, logical heading order.
- All animated content must exist in the DOM in reading order; inactive steps are `aria-hidden` and `inert`, never removed.
- Menu: focus trapped when open, Escape closes, focus returns to the toggle.
- Forms: associated labels, error text linked with `aria-describedby`, errors announced politely.
- Alt text for every meaningful image; decorative SVG and grid layers are `aria-hidden`.

## 12. Do not

- Add colours outside the token list.
- Use gradients other than the soft glow blob.
- Add emoji, stickers, or playful illustration.
- Put text over busy imagery without a solid or blurred scrim.
- Hijack scroll anywhere except the one pinned sequence (and the `/projects` list on desktop).

## 13. Open items

- [x] Replace placeholder fonts with reference values (`Plus Jakarta Sans` and `Inter` from `localhost:5174`).
- [ ] Replace placeholder colours with reference values.
- [ ] Author the final flow-line path.
- [ ] Final motion timings after visual comparison.
- [ ] Final copy for micro-labels and any step body edits.
- [ ] Real photos, logos, and leadership portraits.