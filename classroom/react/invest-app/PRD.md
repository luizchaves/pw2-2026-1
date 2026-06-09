# Product Requirements Document — Invest App

## 1. Overview

**Product name:** Invest App
**Purpose:** A personal investment portfolio tracker that lets users register, visualize, and manage their financial assets in one place.
**Tech stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, Zod, Supabase

---

## 2. Goals

- Give individual investors a simple interface to track all their assets.
- Provide a quick portfolio summary (total patrimony, number of assets).
- Persist portfolio data in Supabase.
- Support privacy by allowing users to hide monetary values on screen.
- Validate investment data on the client side before submission.

---

## 3. Users

| Persona             | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| Individual investor | A person managing a personal portfolio of Brazilian fixed and variable income assets. |

---

## 4. Pages & Navigation

| Route          | Page        | Description                                                |
| -------------- | ----------- | ---------------------------------------------------------- |
| `/`            | Home        | Landing page with portfolio summary and quick-access CTAs. |
| `/investments` | Investments | Full list of investments with add / edit / delete actions. |

Navigation is handled by a persistent `Navbar` component present on all pages.

---

## 5. Features

### 5.1 Portfolio Summary (Home)

- Displays **total patrimony** (sum of all investment amounts).
- Displays **total number of registered assets**.
- Values are hidden when the privacy toggle is active (shows `••••••••`).
- When no investments exist, shows an empty-state card with a CTA to register the first asset.

### 5.2 Privacy Toggle

- A global toggle (available via `Navbar`) that shows or hides all monetary values across the app.
- State is managed through `VisibilityContext` and persists for the duration of the session.

### 5.3 Investment List

- Renders one `InvestmentCard` per investment.
- Cards display: name, category badge, yield, invested amount, broker, invested date, and due date.
- Empty state message is shown when no investments are registered.

### 5.4 Investment Card

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

### 5.5 Add / Edit Investment (Form)

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
- On submit, the investment is added or updated in Supabase through `InvestmentsContext`.
- Category is automatically derived from the selected investment type.
- IDs are generated client-side.

### 5.6 Delete Investment

- Triggered from the trash icon on an `InvestmentCard`.
- A confirmation modal is shown before the deletion is committed.
- On confirm, the investment is removed from Supabase through `InvestmentsContext`.

---

## 6. Data Model

### Investment

```ts
{
  id: string;             // UUID identifier
  name: string;           // human-readable label
  type: string;           // references InvestmentType.id
  broker: string;
  amount: number;         // stored in cents (integer)
  yield?: string;         // e.g. "110% CDI", "IPCA + 5%"
  category: 'Fixed Income' | 'Variable Income';
  investedDate: string;   // ISO date string YYYY-MM-DD
  dueDate: string | null;
}
```

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
| `public.investments`       | Stores portfolio assets and references `investment_types.id`. |
| `public.investments_with_types` | View used by the app to read investments with category data. |

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

| Context              | Responsibility                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `InvestmentsContext` | Loads investment types and investments from Supabase; provides save and delete operations for portfolio assets. |
| `VisibilityContext`  | Holds the `showValues` boolean and `handleToggleShowValues` function.                                                   |

`src/service/storage.ts` owns the Supabase client and maps database rows to the app's TypeScript models.

---

## 8. Validation Rules

Yield field accepted formats (case-insensitive):

| Format       | Example      |
| ------------ | ------------ |
| Percentage   | `15%`        |
| IPCA-linked  | `IPCA + 5%`  |
| CDI-linked   | `110% CDI`   |
| Selic-linked | `100% Selic` |

---

## 9. Non-Functional Requirements

| Requirement    | Detail                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------ |
| Responsiveness | Layout adapts from mobile to desktop using Tailwind responsive prefixes.                         |
| Accessibility  | Semantic HTML (`<article>`, `<header>`, `<section>`); buttons have visible hover states.         |
| Type safety    | End-to-end TypeScript with Zod-inferred types.                                                   |
| Performance    | Next.js App Router; only client components that require interactivity are marked `'use client'`. |

---

## 10. Out of Scope (current version)

- User authentication and multi-user support.
- Portfolio charts and performance analytics.
- Import from broker APIs or CSV files.
- Currency conversion or multi-currency support.
- Notifications for upcoming due dates.
