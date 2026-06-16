# Product Requirements Document — Invest App Vite Vue TS

## Overview

Invest App Vite Vue TS e uma recriacao em Vue.js do app React/Next original para controle pessoal de investimentos.

## Stack

Vue 3, Vite, TypeScript, Vue Router, Pinia, TanStack Vue Query, Zod, Supabase, Tailwind CSS, Vitest, Vue Test Utils e Playwright.

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
- Guarda de rotas no Vue Router para paginas autenticadas.
- Toggle global para exibir ou ocultar valores monetarios.
- Cache de server state com TanStack Vue Query.
- Validacao de formularios com Zod.
- Persistencia direta no Supabase client-side, assumindo RLS configurado no banco.
- Testes unitarios, de componentes e e2e.

## Data Model

Os modelos `Investment`, `InvestmentType` e validacoes de rendimento seguem a versao React, com valores monetarios armazenados em centavos.

## Boundaries

Esta versao nao possui backend proprio nem API Routes. O cliente usa o Supabase diretamente, portanto as regras de acesso devem ser garantidas por RLS no banco.
