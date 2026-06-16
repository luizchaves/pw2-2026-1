# Product Requirements Document — Invest App Vanilla

## Overview

Invest App Vanilla e uma implementacao em Vite + JavaScript puro do app de controle pessoal de investimentos. O objetivo e manter paridade funcional com a versao Next.js usando apenas APIs da plataforma web, modulos ES e servicos Supabase no browser.

## Stack

Vite, JavaScript, Tailwind CSS, Supabase JS, Zod, Biome, Vitest, Testing Library DOM e Playwright.

## Pages

| Route | Page | Description |
| --- | --- | --- |
| `/` | Landing | Apresenta o produto e CTAs conforme estado de autenticacao. |
| `/login` | Login | Email e senha via Supabase Auth. |
| `/register` | Register | Criacao de conta com nome, email, senha e confirmacao. |
| `/dashboard` | Dashboard | Resumo autenticado da carteira. |
| `/investments` | Investments | Lista, cadastro, edicao e remocao de investimentos. |

## Features

- Autenticacao com Supabase Auth.
- Protecao client-side para paginas autenticadas.
- Toggle global para exibir ou ocultar valores monetarios.
- CRUD de investimentos diretamente no Supabase.
- Validacao de formularios com Zod.
- Estados de loading e erro para sessao e carteira.
- Testes unitarios, de componentes e e2e.

## Data Model

Os modelos seguem a versao React/Next:

| Model | Fields |
| --- | --- |
| `InvestmentType` | `id`, `name`, `category` |
| `Investment` | `id`, `userId`, `name`, `typeId`, `broker`, `amount`, `yield`, `category`, `investedDate`, `dueDate` |

Valores monetarios sao armazenados em centavos. Rendimentos aceitam formatos como `15%`, `IPCA + 5%`, `110% CDI` e `100% Selic`.
RLS esta habilitado nas tabelas Supabase: tipos de investimento sao dados de referencia legiveis publicamente, e investimentos so podem ser selecionados, inseridos, atualizados ou removidos pelo usuario autenticado dono do registro (`auth.uid() = user_id`).

## Boundaries

Esta versao nao possui backend proprio nem API Routes. O cliente usa o Supabase diretamente, portanto as regras de acesso devem ser garantidas por RLS no banco.
