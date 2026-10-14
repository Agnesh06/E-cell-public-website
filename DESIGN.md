# My Framer Site

## Overview

**Product:** My Framer Site
**URL:** https://teamwall.framer.website/
**Surface type:** marketing
**Audience:** Business decision-makers and potential customers
**Brand character:** Conversion-focused marketing presence with a rich, diverse color palette and 4 typefaces.

> **Note:** Surface detection confidence is low. Verify the inferred audience and brand context before relying on this file.

### Design Principles

- Consistency over novelty — reuse existing patterns before inventing new ones.
- Token-driven — every visual decision references a token, not a magic number.
- Accessible by default — compliance is a baseline, not a feature.

## Colors

| Token | Value | Role |
|-------|-------|------|
| color-1 | `#141414` | Text Primary |
| color-2 | `#0000EE` | Text Primary |
| color-3 | `#8C8B86` | Text Secondary |
| color-4 | `#F4F3EF` | Text Light |
| color-5 | `#FFFFFF` | Text Light |

## Typography

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

## Spacing

**Base unit:** 4px

`space-1: 3px` · `space-2: 5px` · `space-3: 6px` · `space-4: 7px` · `space-5: 8px` · `space-6: 10px` · `space-7: 12px` · `space-8: 13px` · `space-9: 14px` · `space-10: 55px`

## Shapes

**Border radius:** `radius-sm: 11px` · `radius-md: 99px`

## Elevation

- **shadow-sm:** `rgb(0, 0, 0) 0px 0px 0px 1px inset`

## Motion

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

## Components

- **Buttons:** 19 detected
- **Links:** 1 detected
- **Lists:** 1 detected
- **Images:** 14 detected

## Do's and Don'ts

### Do

- Reference tokens by name, not raw values — agents and developers should use `color.text.primary`, not `#171717`.
- Define all interactive states: default, hover, focus-visible, active, disabled.
- Use the spacing scale for all padding, margin, and gap values.
- Write content in sentence case. Reserve ALL CAPS for acronyms only.
- Test every component at the smallest and largest breakpoint before shipping.

### Don't

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not mix border-radius values. Pin to the detected set (11px, 99px).
- Do not use full-uppercase text for body or paragraph content.
- Do not nest interactive elements (e.g. buttons inside links).
- Do not ship components without defining hover, focus-visible, and disabled states.

## Writing Tone

Concise, confident, implementation-focused. Avoid filler preambles.

## Authoring Workflow

When creating or updating a component guideline for this system, follow this sequence:

1. **State the intent** — one sentence on what the component does and why it exists.
2. **Map tokens** — list every color, spacing, typography, and radius token the component uses. No raw values.
3. **Define anatomy** — break the component into named parts (container, label, icon, etc.) with their token assignments.
4. **Specify states** — document every state: default, hover, focus-visible, active, disabled, loading, error, empty.
5. **Describe interactions** — keyboard, pointer, and touch behavior, including edge cases (long content, overflow, truncation).
6. **Add accessibility criteria** — write testable pass/fail checks (e.g. "focus ring must be visible at 3:1 contrast").
7. **List anti-patterns** — concrete examples of misuse with a brief explanation of why each is wrong.
8. **Close with a QA checklist** — a mechanical list of verifiable items (see Definition of Done below).

## Required Output Structure

Every component guideline produced from this system must contain these sections, in order:

1. Overview — purpose, when to use, when not to use.
2. Tokens and foundations — all referenced tokens from the tables above.
3. Anatomy and variants — named parts, variant matrix, responsive behavior.
4. States and interactions — full state table, keyboard/pointer/touch behavior.
5. Accessibility — ARIA attributes, contrast requirements, focus management, screen reader behavior.
6. Content guidelines — copy length, tone, capitalisation, placeholder text rules.
7. Anti-patterns — explicit examples of what not to build, with reasoning.

## Component Requirements

Every component built against this system must:

- Reference only tokens defined in the tables above — no hardcoded hex, px, or font values.
- Define all interactive states: default, hover, focus-visible, active, disabled, loading, error.
- Specify responsive behavior at the smallest and largest supported breakpoint.
- Handle edge cases: empty state, overflow / truncation, maximum content length.
- Include keyboard navigation (Tab, Enter, Escape, Arrow keys where applicable).
- Document ARIA roles, labels, and live-region behavior where relevant.
- Include known page component density: - **Buttons:** 19 detected
- **Links:** 1 detected
- **Lists:** 1 detected
- **Images:** 14 detected

## Definition of Done

A component is not complete until every item below is checked:

- Renders correctly in its default state (smoke test).
- All states documented and visually verified (hover, focus, disabled, loading, error, empty).
- All visual values use design tokens — zero hardcoded values.
- Keyboard navigation works without a pointer.
- No critical accessibility violations (contrast, ARIA, focus order).
- Tested at smallest and largest breakpoint.
- Anti-patterns section lists at least one concrete misuse example.
- Documentation covers purpose, usage, props/API, and limitations.
