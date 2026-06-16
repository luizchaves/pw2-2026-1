# Invest App

Aplicacao web para controle de carteira de investimentos pessoais. O app permite criar uma conta,
registrar ativos, acompanhar patrimonio total, listar investimentos por categoria e ocultar valores
financeiros quando necessario.

Este projeto faz parte dos exemplos da disciplina **Programacao para Web 2**.

## Funcionalidades

- Cadastro e login de usuarios com Supabase Auth.
- Landing page publica com chamadas para cadastro, login e areas autenticadas.
- Dashboard autenticado com patrimonio total e quantidade de ativos.
- Cadastro, edicao e remocao de investimentos.
- Lista de investimentos com tipo, categoria, corretora, rendimento, valor aplicado e datas.
- Alternancia global para mostrar ou ocultar valores monetarios.
- Navegacao autenticada protegida no cliente pelo `AppShell`.
- API Routes do Next.js autorizadas por token do Supabase.

## Stack

- Next.js App Router, React 19 e TypeScript.
- Tailwind CSS e componentes shadcn/ui com Base UI.
- Supabase para autenticacao e persistencia.
- TanStack Query para cache de dados do servidor.
- Zustand para estado global do cliente.
- React Hook Form e Zod para formularios e validacao.
- Biome para lint e formatacao.
- Vitest, Testing Library e Playwright para testes.

## Requisitos

- Node.js compativel com o projeto.
- pnpm 10.32.1 ou superior.
- Projeto Supabase com o schema de `supabase/migrations/`.

## Configuracao

Instale as dependencias:

```bash
pnpm install
```

Crie `.env.local` a partir das variaveis abaixo:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ualrrhtrkwgsqszqkiwt.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

O schema do banco fica em `supabase/migrations/`, e os dados iniciais ficam em `supabase/seed.sql`.

## Desenvolvimento

Execute o servidor local:

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Rotas principais:

| Rota | Descricao |
| --- | --- |
| `/` | Landing page publica |
| `/login` | Login |
| `/register` | Cadastro |
| `/dashboard` | Resumo autenticado da carteira |
| `/investments` | Lista e formulario de investimentos |

As rotas autenticadas sao redirecionadas no cliente pelo `AppShell`, o que atende a proposta
didatica do projeto. A protecao efetiva dos dados fica nas API Routes, que exigem um token valido
do Supabase. Em um cenario de producao mais rigoroso, essa verificacao de acesso tambem deveria ser
avaliada em middleware ou componentes/rotas server-side.

## Scripts

```bash
pnpm dev        # inicia o servidor de desenvolvimento
pnpm build      # gera a build de producao
pnpm start      # inicia a build de producao
pnpm lint       # executa Biome em modo de verificacao
pnpm format     # formata arquivos com Biome
pnpm test:unit  # executa testes unitarios e de componentes
pnpm test:e2e   # executa testes end-to-end com Playwright
pnpm test       # executa a suite completa
```

Husky instala hooks pelo script `prepare`: o pre-commit roda `lint-staged` com Biome, e o pre-push
roda `pnpm test`.

## Organizacao

```text
src/
  app/          # App Router, paginas e API Routes
  components/   # componentes compartilhados e primitives de UI
  hooks/        # hooks de tela e dados
  lib/          # utilitarios puros
  providers/    # providers de infraestrutura
  schemas/      # schemas Zod e tipos derivados
  services/     # wrappers de API e integracao com Supabase
  stores/       # stores Zustand

tests/
  unit/         # Vitest + Testing Library
  e2e/          # Playwright
  fixtures/     # dados compartilhados de teste
  setup/        # configuracao dos runners
```

Consulte `PRD.md` para detalhes de escopo, modelo de dados, rotas de API e regras de negocio.
