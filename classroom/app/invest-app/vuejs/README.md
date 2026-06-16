# Invest App Vue

Versao Vue 3 do Invest App, recriada a partir do projeto Next.js em `classroom/app/invest-app/nextjs`.

## Stack

- Vue 3 + Vite + TypeScript
- Vue Router para navegacao
- Pinia para estado global de autenticacao, privacidade e toasts
- TanStack Vue Query para cache de investimentos e mutations
- Zod para validacao de formularios e modelos
- Supabase Auth e tabelas `investment_types`, `investments`, `investments_with_types`
- Tailwind CSS v4 para estilos utilitarios

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

Configure as variaveis em `.env.local`:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Como Vite nao oferece API Routes como o Next.js, esta versao usa o cliente Supabase no browser. A protecao de dados depende das politicas de RLS do Supabase.
