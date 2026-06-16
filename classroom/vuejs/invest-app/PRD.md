# Product Requirements Document — Invest App Vue

## Overview

Invest App Vue e uma recriacao em Vue.js do app React/Next original para controle pessoal de investimentos.

## Stack

Vue 3, Vite, TypeScript, Vue Router, Pinia, TanStack Vue Query, Zod, Supabase e Tailwind CSS.

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

## Data Model

Os modelos `Investment`, `InvestmentType` e validacoes de rendimento seguem a versao React, com valores monetarios armazenados em centavos.
