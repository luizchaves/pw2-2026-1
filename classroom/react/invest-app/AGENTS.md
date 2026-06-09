<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

## Project

This is **Invest App** — a personal investment portfolio tracker built with Next.js (App Router), React, TypeScript, Tailwind CSS, and Zod.

Read `PRD.md` before making any changes. It is the source of truth for features, data models, and scope.

---

## Workflow

Follow these steps for every task:

1. **Read** — Read `PRD.md` and all files you will touch before writing any code.
2. **Plan** — Identify the minimal set of changes needed. Do not add unrequested features.
3. **Implement** — Make the changes. Follow the conventions in the codebase (see below).
4. **Validate** — Run `npm run build` (or `npm run lint`) and confirm there are no errors.
5. **Update PRD** — Reflect the new or changed feature in `PRD.md` (data model, feature list, out-of-scope section, etc.).
6. **Commit** — Stage all changed files and commit with a short, imperative message describing what was done (e.g. `feat: add due-date filter to investments page`).

Never skip steps 5 or 6.

---

## Commit conventions

- Use [Conventional Commits](https://www.conventionalcommits.org/) prefixes: `feat`, `fix`, `refactor`, `chore`, `docs`.
- Write the message in English, in the imperative mood, ≤ 72 characters.
- Include `PRD.md` in the same commit as the code change that motivated the update.
- Do not amend or force-push commits that have already been pushed.

---

## Code conventions

- **Language:** TypeScript everywhere. No plain `.js` files.
- **Styling:** Tailwind CSS utility classes only — no inline styles, no CSS modules.
- **Validation:** Use Zod for all schema definitions. Infer TypeScript types from schemas (`z.infer<typeof schema>`).
- **State:** Use React Context for cross-component state. Keep `useState` local when the state is not shared.
- **Client components:** Mark a file `'use client'` only when it uses hooks or browser APIs. Prefer Server Components by default.
- **Naming:** PascalCase for components and types; camelCase for variables, functions, and hooks; kebab-case for file names under `app/`.
- **Formatting:** Prettier is configured. Run `npm run format` if available, otherwise ensure consistent indentation (2 spaces).

---

## Project structure

```
src/
  app/          # Next.js App Router pages and layouts
  components/   # Shared React components
    ui/         # Generic, stateless UI primitives (Modal, etc.)
  contexts/     # App-owned React Context providers and hooks
  data/         # Static seed data
  lib/          # Pure utility functions
  providers/    # Third-party or infrastructure providers
  schemas/      # Zod schemas (source of truth for types)
  services/     # API fetch wrappers and Supabase integrations
```

Do not create new top-level directories under `src/` without a clear reason.

---

## PRD update rules

When a feature is added or changed, update `PRD.md` as follows:

- **New page:** add a row to the Pages & Navigation table.
- **New feature:** add a subsection under Features (section 5).
- **New data field:** update the Data Model section (section 6).
- **Removed limitation:** move the item from "Out of Scope" to the relevant feature section.
- Keep the document concise — prefer tables and bullet points over prose.
