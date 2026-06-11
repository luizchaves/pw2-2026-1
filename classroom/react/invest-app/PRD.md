# Product Requirements Document — Invest App

## 1. Overview

**Product name:** Invest App
**Purpose:** A personal investment portfolio tracker that lets users register, visualize, and manage their financial assets in one place.
**Tech stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui with Base UI, Zod, Supabase, Biome

---

## 2. Goals

- Give individual investors a simple interface to track all their assets.
- Provide a quick portfolio summary (total patrimony, number of assets).
- Persist portfolio data in Supabase.
- Support privacy by allowing users to hide monetary values on screen.
- Validate investment data on the client side before submission.
- Restrict portfolio access to authenticated users.

---

## 3. Users

| Persona             | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| Individual investor | A person managing a personal portfolio of Brazilian fixed and variable income assets. |

---

## 4. Pages & Navigation

| Route          | Page        | Description                                                |
| -------------- | ----------- | ---------------------------------------------------------- |
| `/login`       | Login       | Email and password sign-in through Supabase Auth.          |
| `/register`    | Register    | Account creation with name, email, password, and confirmation. |
| `/`            | Landing     | Public landing page explaining the system and CTAs.        |
| `/dashboard`   | Dashboard   | Authenticated portfolio summary and quick-access CTAs.     |
| `/investments` | Investments | Full list of investments with add / edit / delete actions. |

Navigation is handled by a persistent `Navbar` component.
Anonymous users see Login and Register actions in the navbar.
Authenticated users see product links through a shadcn `NavigationMenu` and account actions through a shadcn `DropdownMenu`.
`/dashboard` and `/investments` are only accessible after login.
Routes are organized with App Router route groups: `(auth)` for login/register and `(dashboard)` for authenticated product pages.

---

## 5. Features

### 5.1 Authentication

- Users can create an account with name, email, password, and password confirmation.
- Users can sign in with email and password through Supabase Auth.
- If Supabase requires email confirmation, registration shows a confirmation message before login.
- Authenticated pages redirect anonymous users to `/login`.
- Logged-in users can sign out from the navbar.
- Investment API calls send the current Supabase access token.

### 5.2 Public Landing Page

- Presents the product value proposition for anonymous and authenticated users.
- Shows a visual preview of the investment tracking interface.
- Offers CTAs to create an account, sign in, open the dashboard, or view investments depending on auth state.

### 5.3 Portfolio Summary (Dashboard)

- Displays **total patrimony** (sum of all investment amounts).
- Displays **total number of registered assets**.
- Values are hidden when the privacy toggle is active (shows `••••••••`).
- When no investments exist, shows an empty-state card with a CTA to register the first asset.

### 5.4 Privacy Toggle

- A global toggle (available via `Navbar`) that shows or hides all monetary values across the app.
- The toggle is displayed next to the authenticated account dropdown for quick access.
- State is managed through the `useVisibility` Zustand store and persists for the duration of the session.

### 5.5 Investment List

- Renders one `InvestmentCard` per investment.
- Cards display: name, category badge, yield, invested amount, broker, invested date, and due date.
- Empty state message is shown when no investments are registered.

### 5.6 Investment Card

Each card shows:

| Field           | Notes                                                     |
| --------------- | --------------------------------------------------------- |
| Name            | Main title                                                |
| Category        | Badge: **Renda Fixa** (sky) or **Renda Variável** (amber) |
| Yield           | Displayed in emerald; falls back to "Não informado"       |
| Invested amount | Hidden when privacy toggle is on                          |
| Broker          | Brokerage name                                            |
| Invested date   | Formatted date                                            |
| Due date        | Formatted date or blank                                   |
| Edit button     | Opens edit form in modal                                  |
| Delete button   | Opens delete confirmation modal                           |

### 5.7 Add / Edit Investment (Form)

Opened in a `Modal`. Fields:

| Field          | Type                      | Validation                                               |
| -------------- | ------------------------- | -------------------------------------------------------- |
| Name           | Text                      | Required                                                 |
| Type           | Select (`InvestmentType`) | Required                                                 |
| Broker         | Text                      | Required                                                 |
| Amount (cents) | Number                    | Required, integer, > 0                                   |
| Yield          | Text (optional)           | Must match: `15%`, `IPCA + 5%`, `110% CDI`, `100% Selic` |
| Invested date  | Date                      | Required                                                 |
| Due date       | Date                      | Optional                                                 |

- Validation is performed with **Zod** (`investmentFormSchema`).
- On submit, the investment is added or updated through `useInvestments`, which calls the Next.js API.
- Category is automatically derived from the selected investment type.
- IDs are generated client-side.
- Saved investments are attached to the authenticated Supabase user.

### 5.8 Delete Investment

- Triggered from the trash icon on an `InvestmentCard`.
- A confirmation modal is shown before the deletion is committed.
- On confirm, the investment is removed through `useInvestments`, which calls the Next.js API.

---

## 6. Data Model

### Investment

```ts
{
  id: string;             // UUID identifier
  userId?: string | null; // references Supabase auth.users.id
  name: string;           // human-readable label
  typeId: string;         // references InvestmentType.id
  broker: string;
  amount: Cents;          // branded integer (e.g. 100_000 = R$ 1.000,00)
  yield?: string;         // e.g. "110% CDI", "IPCA + 5%"
  category: 'Fixed Income' | 'Variable Income';
  investedDate: string;   // ISO date string YYYY-MM-DD
  dueDate: string | null;
}
```

`Cents` is a branded `number` type (`number & { __brand: 'Cents' }`) exported from `src/schemas/investment.ts`. Use `toCents(n)` to cast plain numbers.

### InvestmentType

```ts
{
  id: string;
  name: string;
  category: 'Fixed Income' | 'Variable Income';
}
```

### Supabase tables

| Table                      | Purpose                                                       |
| -------------------------- | ------------------------------------------------------------- |
| `public.investment_types`  | Stores supported investment types and their categories.       |
| `public.investments`       | Stores portfolio assets and references `investment_types.id` and `auth.users.id`. |
| `public.investments_with_types` | View used by the app to read investments with category and owner data. |

The database schema is versioned in `supabase/migrations/`, and the initial seed data is stored in `supabase/seed.sql`.

### Supported investment types

| id                  | Name              | Category        |
| ------------------- | ----------------- | --------------- |
| `acoes`             | Ações             | Variable Income |
| `cdb`               | CDB               | Fixed Income    |
| `fii`               | FII               | Variable Income |
| `renda-fixa`        | Renda Fixa        | Fixed Income    |
| `tesouro-ipca`      | Tesouro IPCA+     | Fixed Income    |
| `tesouro-prefixado` | Tesouro Prefixado | Fixed Income    |
| `tesouro-reserva`   | Tesouro Reserva   | Fixed Income    |
| `tesouro-selic`     | Tesouro Selic     | Fixed Income    |

---

## 7. State Management

| Store / Hook          | Responsibility                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `useAuth`             | Zustand store for Supabase Auth session state and login, register, and logout actions.                                  |
| `useVisibility`       | Zustand store for the `showValues` boolean and `handleToggleShowValues` action.                                         |
| `useToast`            | Zustand store for transient toast notifications shown after mutations succeed.                                           |
| `useInvestments`      | TanStack Query hook for investment data and mutations backed by the query cache.                                         |

TanStack Query manages client-side fetch, loading, error, and mutation cache state for investment data.
`src/lib/query-keys.ts` centralises all TanStack Query cache keys.
`src/hooks/` contains custom hooks that extract UI-level logic from page components (e.g. `useInvestmentActions`).
`src/stores/` contains Zustand stores for app-wide client state.
`src/services/api/` contains client-side fetch wrappers for the app API routes.
`src/services/supabase/` owns Supabase persistence/auth helpers and maps database rows to the app's TypeScript models.
`src/lib/supabase.ts` owns the shared Supabase publishable client used by browser and server code.

## 8. API Routes

| Route                         | Methods | Responsibility                                           |
| ----------------------------- | ------- | -------------------------------------------------------- |
| `/api/investment-types`       | `GET`   | Returns supported investment types from Supabase.        |
| `/api/investments`            | `GET`   | Returns portfolio investments for the authenticated user. |
| `/api/investments`            | `POST`  | Validates and upserts an investment for the authenticated user. |
| `/api/investments/[id]`       | `DELETE` | Validates the investment ID and removes it for the authenticated user. |

The API routes delegate Supabase auth and persistence to `src/services/supabase/`.
Investment routes require a valid Supabase bearer token.

---

## 9. Validation Rules

Yield field accepted formats (case-insensitive):

| Format       | Example      |
| ------------ | ------------ |
| Percentage   | `15%`        |
| IPCA-linked  | `IPCA + 5%`  |
| CDI-linked   | `110% CDI`   |
| Selic-linked | `100% Selic` |

---

## 10. Non-Functional Requirements

| Requirement    | Detail                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------ |
| Responsiveness | Layout adapts from mobile to desktop using Tailwind responsive prefixes.                         |
| Accessibility  | Semantic HTML (`<article>`, `<header>`, `<section>`); buttons have visible hover states.         |
| Type safety    | End-to-end TypeScript with Zod-inferred types.                                                   |
| Performance    | Next.js App Router; only client components that require interactivity are marked `'use client'`. |
| Data access    | Client components call Next.js API routes instead of importing the Supabase client directly.      |
| Client cache    | TanStack Query manages investment fetches and mutation cache updates.                             |
| Authentication | Supabase Auth controls account registration, login, logout, and API authorization.                |
| UI system      | Shared UI primitives use shadcn/ui generated components backed by Base UI; toast notifications use Sonner. |
| Typography     | App typography uses Geist Sans for both body and headings.                                        |
| Code quality   | Biome handles linting and formatting through `npm run lint` and `npm run format`.                 |
| Test coverage  | Unit and component tests use Vitest + Testing Library under `tests/unit`; e2e tests use Playwright under `tests/e2e`. |

Zod schemas in `src/schemas/` are the source of truth for runtime validation and TypeScript types.

---

## 11. Out of Scope (current version)

- Portfolio charts and performance analytics.
- Import from broker APIs or CSV files.
- Currency conversion or multi-currency support.
- Notifications for upcoming due dates.
