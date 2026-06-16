# Invest App Vanilla Agent Guide

Read `PRD.md` before changing behavior. Keep this project aligned with `../nextjs` for product scope while preserving the vanilla JavaScript implementation style.

## Stack

- Vite + JavaScript modules.
- Tailwind CSS utilities.
- Supabase JS in browser services under `src/services/supabase/`.
- Zod schemas under `src/schemas/`.
- Vitest for unit/component tests and Playwright for e2e tests.
- Biome owns formatting and linting.

## Conventions

- Keep `src/main.js` focused on bootstrap and routing.
- Put page templates in `src/pages/`.
- Put reusable UI/template functions in `src/components/`.
- Keep DOM helpers pure in `src/lib/dom.js`.
- Do not reintroduce local mock persistence for production behavior; use Supabase services.
- Update `PRD.md` when routes, features, data fields or testing scope change.

## Validation

Run the smallest relevant check, then full checks before finishing broad changes:

```bash
npm run lint
npm run test:unit
npm run build
npm run test:e2e
```
