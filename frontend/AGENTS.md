# CSEA E-Cell Website

Public marketing website for CSEA E-Cell at PSG College of Technology,
Coimbatore. This repository contains a React + TypeScript single-page
application; the contact form will later use an external API configured through
environment variables.

## Stack

- React, TypeScript, Vite, and React Router
- Tailwind CSS v4 with shadcn/ui
- GSAP, Motion, and Lenis for motion and smooth scroll
- React Hook Form and Zod for later form work
- Vitest, Playwright, and axe-core for testing

## Folder map

- `src/app/` — router, root layout, smooth scroll provider, and app providers
- `src/components/ui/` — generated shadcn/ui components (**do not edit**)
- `src/components/reactbits/` — unmodified vendored components (**do not edit**)
- `src/components/common/` — reusable design-system primitives (Button, Container, Eyebrow, Pill)
- `src/components/layout/` — Header, Footer, LogoGroup, MenuWrapper
- `src/features/` — route-level page modules
- `src/data/` — typed site, idea, project, and team content
- `src/lib/` — environment validation, utilities, and GSAP registration
- `src/styles/` — Tailwind entry point, design tokens, and utility classes
- `src/assets/` — logos and images (currently placeholder SVGs)
- `src/types/` — shared domain types
- `tests/e2e/` — Playwright smoke, accessibility, header/menu, footer, and screenshot tests
- `docs/` — architecture, design, delivery plan, and checklist documents

## Working rules

- Make the smallest focused change that fully addresses the task.
- Never edit files in `src/components/reactbits/` or `src/components/ui/`
  except through their official update flow.
- Ask before adding dependencies.
- Do not add localStorage-dependent logic.
- Respect `prefers-reduced-motion` for every animation.
- Route every GSAP plugin registration through `src/lib/gsap.ts`.
- Do not modify `src/lib/gsap.ts` — import from it only. Stop and ask if a change is needed.
- Update `docs/CHECKLIST.md` when finishing work.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run e2e`
  before reporting work as done.
