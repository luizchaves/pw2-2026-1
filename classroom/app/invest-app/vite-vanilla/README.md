# Invest App Vanilla

Versao Vite + JavaScript vanilla do Invest App, mantendo as mesmas funcionalidades centrais do projeto Next.js em `../nextjs`.

## Funcionalidades

- Cadastro e login de usuarios com Supabase Auth.
- Landing page publica com CTAs para cadastro, login e areas autenticadas.
- Dashboard autenticado com patrimonio total e quantidade de ativos.
- Cadastro, edicao e remocao de investimentos.
- Lista de investimentos com tipo, categoria, corretora, rendimento, valor aplicado e datas.
- Alternancia global para mostrar ou ocultar valores monetarios.
- Rotas client-side protegidas para `/dashboard` e `/investments`.
- Validacao com Zod em formularios de auth e investimentos.

## Stack

- Vite e JavaScript moderno sem framework.
- Tailwind CSS v4 para estilos utilitarios.
- Supabase JS para autenticacao e persistencia.
- Zod para validacao.
- Biome para lint e formatacao.
- Vitest, Testing Library DOM e Playwright para testes.

## Configuracao

Instale as dependencias:

```bash
npm install
```

Crie `.env.local` a partir de `.env.example`:

```bash
VITE_SUPABASE_URL=https://ualrrhtrkwgsqszqkiwt.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

O schema do banco fica em `supabase/migrations/`, e os dados iniciais ficam em `supabase/seed.sql`.

## Desenvolvimento

```bash
npm run dev
```

Rotas principais:

| Rota | Descricao |
| --- | --- |
| `/` | Landing page publica |
| `/login` | Login |
| `/register` | Cadastro |
| `/dashboard` | Resumo autenticado da carteira |
| `/investments` | Lista e formulario de investimentos |

## Scripts

```bash
npm run dev        # inicia o servidor de desenvolvimento
npm run build      # gera a build de producao
npm run preview    # serve a build de producao localmente
npm run lint       # executa Biome em modo de verificacao
npm run format     # formata arquivos com Biome
npm run test:unit  # executa testes unitarios e de componentes
npm run test:e2e   # executa testes end-to-end com Playwright
npm run test       # executa a suite completa
```

## Organizacao

```text
src/
  components/   # componentes renderizados por template string e helpers de UI
  lib/          # utilitarios puros, categorias, storage e store da aplicacao
  pages/        # paginas client-side
  schemas/      # schemas Zod
  services/     # integracao com Supabase

tests/
  unit/         # Vitest + Testing Library DOM
  e2e/          # Playwright
  fixtures/     # dados compartilhados de teste
  setup/        # configuracao dos runners
```

Como Vite nao oferece API Routes como o Next.js, esta versao usa Supabase diretamente no browser. A protecao efetiva dos dados depende das politicas de RLS configuradas no Supabase.
