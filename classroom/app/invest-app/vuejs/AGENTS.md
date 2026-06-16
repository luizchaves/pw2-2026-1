# Invest App Vue Agent Guide

Read `PRD.md` before changing behavior. Keep this project aligned with `../nextjs` for product scope while preserving Vue conventions.

## Stack

- Vue 3 + Vite + TypeScript.
- Vue Router for pages and guards.
- Pinia for auth, visibility and toast state.
- TanStack Vue Query for investment server state.
- Supabase JS in browser services under `src/services/supabase/`.
- Zod schemas under `src/schemas/`.
- Vitest + Vue Test Utils for unit/component tests and Playwright for e2e tests.
- Biome owns formatting and linting.

## Conventions

- Prefer Single File Components and Composition API.
- Keep reusable workflows in `src/composables/`.
- Keep app-wide state in Pinia stores under `src/stores/`.
- Do not bypass Supabase services from components when a service/composable already owns the workflow.
- Update `PRD.md` when routes, features, data fields or testing scope change.

## Validation

Run the smallest relevant check, then full checks before finishing broad changes:

```bash
pnpm lint
pnpm test:unit
pnpm build
pnpm test:e2e
```
