---
name: design-system-my-framer-site
description: >
  Apply the My Framer Site design system when building or updating UI.
  Use when creating components, choosing colors or typography,
  or reviewing designs for marketing interfaces.
---

# My Framer Site — Design System Skill

## When to Use

- Building new UI components for My Framer Site.
- Reviewing or updating existing component styles.
- Choosing colors, typography, or spacing for marketing pages.
- Checking designs against the extracted token set.

## Context

- **Product:** My Framer Site — https://teamwall.framer.website/
- **Surface:** marketing
- **Audience:** Business decision-makers and potential customers
- **Character:** Conversion-focused marketing presence with a rich, diverse color palette and 4 typefaces.

## Tokens

### Colors

| Token | Value | Role |
|-------|-------|------|
| color-1 | `#141414` | Text Primary |
| color-2 | `#0000EE` | Text Primary |
| color-3 | `#8C8B86` | Text Secondary |
| color-4 | `#F4F3EF` | Text Light |
| color-5 | `#FFFFFF` | Text Light |

### Typography

**Font stack:** Inter, sans-serif, Times New Roman, ui-sans-serif

| Level | Size | Usage |
|-------|------|-------|
| text-xs | 10px | Captions, metadata |
| text-sm | 12px | Labels, secondary text |
| text-base | 14px | Body text (default) |
| text-lg | 16px | Subheadings, emphasis |
| text-xl | 34px | Section headings |
| text-2xl | 89px | Section headings |

**Weight scale:** 400
**Line heights:** 81.6788px · 19.6px · 38.4755px · 16.8px · 14.112px

### Spacing

**Base unit:** 4px

`space-1: 3px` · `space-2: 5px` · `space-3: 6px` · `space-4: 7px` · `space-5: 8px` · `space-6: 10px` · `space-7: 12px` · `space-8: 13px` · `space-9: 14px` · `space-10: 55px`

### Shapes

**Border radius:** `radius-sm: 11px` · `radius-md: 99px`

### Elevation

- **shadow-sm:** `rgb(0, 0, 0) 0px 0px 0px 1px inset`

### Motion

- **duration-fast:** `all`
- **duration-fast:** `none`
- **duration-slow:** `color 0.4s`
- **duration-slow:** `background-color 0.45s cubic-bezier(0.16, 1, 0.3, 1), color 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.45s`
- **duration-slow:** `color 0.5s`
- **duration-slow:** `color 0.5s cubic-bezier(0.16, 1, 0.3, 1)`
- **duration-slow:** `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)`
- **duration-slow:** `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)`
- **duration-slow:** `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.014s`
- **duration-slow:** `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.028s`
- **duration-slow:** `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.042s`
- **duration-slow:** `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.056s`
- **duration-slow:** `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.07s`
- **duration-slow:** `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.084s`
- **duration-slow:** `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.098s`
- **duration-slow:** `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.126s`
- **duration-slow:** `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.112s`

## Component Inventory

- **Buttons:** 19 detected
- **Links:** 1 detected
- **Lists:** 1 detected
- **Images:** 14 detected

## Constraints

### Always

- Use tokens from the tables above — do not introduce new values.
- Include hover, focus-visible, and disabled states for interactive elements.
- Follow the 4px spacing grid.
- Meet WCAG 2.2 AA contrast minimums.

### Never

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not mix border-radius values. Pin to the detected set (11px, 99px).
- Do not use full-uppercase text for body or paragraph content.
- Do not nest interactive elements (e.g. buttons inside links).
- Do not ship components without defining hover, focus-visible, and disabled states.

## Tone

Concise, confident, implementation-focused. Avoid filler preambles.

## Authoring Workflow

When creating or documenting a component for this system:

1. State intent — one sentence on purpose.
2. Map tokens — list every token the component uses.
3. Define anatomy — named parts with token assignments.
4. Specify states — default, hover, focus-visible, active, disabled, loading, error, empty.
5. Describe interactions — keyboard, pointer, touch, edge cases.
6. Add a11y criteria — testable pass/fail checks.
7. List anti-patterns — concrete misuse examples.
8. Close with the Definition of Done checklist.

## Output Structure

Component guidelines must contain, in order:

1. Overview (purpose, when to use, when not to use)
2. Tokens and foundations
3. Anatomy, variants, responsive behavior
4. States and interactions
5. Accessibility (ARIA, contrast, focus, screen reader)
6. Content guidelines (copy rules, tone)
7. Anti-patterns with reasoning

## Component Requirements

- Reference only tokens from the tables above.
- Define all states: default, hover, focus-visible, active, disabled, loading, error.
- Handle edge cases: empty, overflow, truncation, max content.
- Include keyboard navigation behavior.
- Document ARIA roles and labels.

## Definition of Done

- Default state renders (smoke test).
- All states visually verified.
- Zero hardcoded visual values — tokens only.
- Keyboard navigation works without pointer.
- No critical a11y violations.
- Tested at min and max breakpoint.
- At least one anti-pattern documented.
- Purpose, usage, and limitations documented.
