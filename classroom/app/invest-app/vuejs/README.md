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
- Vitest, Vue Test Utils e Playwright para testes

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test:unit
pnpm test:e2e
pnpm test
```

Configure as variaveis em `.env.local`:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Como Vite nao oferece API Routes como o Next.js, esta versao usa o cliente Supabase no browser. A protecao de dados depende das politicas de RLS do Supabase.

O schema do banco fica em `supabase/migrations/`, e os dados iniciais ficam em `supabase/seed.sql`.

## Organizacao

```text
src/
  components/   # componentes Vue compartilhados
  composables/   # fluxos de dados e acoes de tela
  lib/          # utilitarios puros
  pages/        # paginas roteadas
  router/       # Vue Router e guards
  schemas/      # schemas Zod e tipos derivados
  services/     # integracao com Supabase
  stores/       # stores Pinia

tests/
  unit/         # Vitest + Vue Test Utils
  e2e/          # Playwright
  fixtures/     # dados compartilhados de teste
  setup/        # configuracao dos runners
```
