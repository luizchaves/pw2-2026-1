# Invest App

Este diretorio agrupa quatro implementacoes do mesmo produto: um app de controle de carteira de investimentos pessoais. Todas as versoes cobrem o mesmo dominio central: autenticacao, dashboard, cadastro/listagem de investimentos, privacidade de valores e integracao com Supabase.

## Projetos

### Angular

Local: `angular/`

**Stack**

- Angular 22 com componentes standalone
- Angular Router com guards funcionais e rotas lazy
- Signals e servicos Angular para estado de autenticacao, carteira e visibilidade
- Reactive Forms para formularios
- Supabase JS para autenticacao e persistencia
- Vitest, Playwright, Biome e TypeScript 6

**Ponto positivo**

Angular entrega uma arquitetura mais prescritiva e completa para aplicacoes grandes. A combinacao de services, guards, forms e signals deixa responsabilidades bem separadas e facilita padronizar equipes.

**Limitacoes**

Tem mais boilerplate e uma curva inicial maior. Para uma aplicacao pequena, a estrutura pode parecer pesada em comparacao com Vue ou Vite vanilla.

**Exclusivo do Angular usado no projeto**

A versao Angular usa padroes proprios da stack Angular moderna:

- **Standalone components**: componentes sem NgModule.
- **Angular Signals**: estado reativo com `signal` e `computed`.
- **Dependency Injection nativa**: `inject(...)` em services, guards e componentes.
- **Functional guards**: `CanActivateFn` para proteger rotas.
- **Lazy routing com `loadComponent`**: cada pagina vira chunk separado.
- **Reactive Forms**: formulario tipado/controlado por `FormBuilder`, `FormGroup`, `Validators`.
- **TestBed**: ambiente oficial para testes de componentes e servicos Angular.
- **Services como camada de aplicacao**: `AuthService`, `InvestmentService`, `VisibilityService`.

### Next.js

Local: `nextjs/`

**Stack**

- Next.js App Router, React 19 e TypeScript
- API Routes para acesso aos dados
- Tailwind CSS e componentes shadcn/ui com Base UI
- Supabase para autenticacao e persistencia
- TanStack Query para cache de dados
- Zustand para estado global
- React Hook Form, Zod, Vitest, Testing Library, Playwright e Biome

**Ponto positivo**

E a versao mais completa em termos de fronteira web moderna: inclui frontend, rotas de API, validacao server-side e autorizacao por token nas API Routes. Serve bem para discutir separacao entre cliente, servidor e banco.

**Limitacoes**

E a stack com mais pecas moveis. O App Router e o limite entre Server Components, Client Components e API Routes exigem mais disciplina arquitetural.

**Exclusivo do React / Next usado no projeto**

O projeto Next.js tem recursos que nao existem do mesmo jeito nas outras versoes:

- **Next App Router**: rotas por estrutura de pastas em `src/app`.
- **API Routes**: endpoints internos como `/api/investments` e `/api/investment-types`.
- **Server-side modules**: servicos com `server-only`, uteis para proteger logica backend.
- **React Hooks**: `useInvestments`, `useInvestmentActions`, `useAuth`, `useVisibility`.
- **Zustand**: store externo para estado global.
- **TanStack Query**: cache, loading/error state e mutacoes declarativas.
- **React Hook Form + Zod resolver**: validacao schema-first integrada ao formulario.
- **Next Link / navigation**: `Link`, `useRouter`, `router.replace`.

### Vue.js

Local: `vuejs/`

**Stack**

- Vue 3, Vite e TypeScript
- Vue Router para navegacao
- Pinia para estado global
- TanStack Vue Query para cache e mutations
- Zod para validacao
- Supabase JS no browser
- Tailwind CSS v4, Vitest, Vue Test Utils, Playwright e Biome

**Ponto positivo**

Tem boa ergonomia para UI reativa. A Composition API, Pinia e Vue Router formam uma estrutura clara sem exigir tanto boilerplate quanto Angular.

**Limitacoes**

Como Vite nao oferece backend embutido, esta versao usa Supabase diretamente no browser. A seguranca dos dados depende das politicas de RLS no Supabase, enquanto a versao Next.js consegue centralizar regras tambem em API Routes.

**Exclusivo do Vue.js usado no projeto**

A versao Vue adapta a mesma experiencia para convencoes de SPA com Composition API:

- **Single File Components**: UI, script e template em arquivos `.vue`.
- **Composition API**: composables como `useInvestments` e `useInvestmentActions`.
- **Pinia**: stores para auth, visibilidade e toasts.
- **Vue Router**: guards globais com `beforeEach`.
- **TanStack Vue Query**: cache e mutations com integracao reativa.
- **Zod manual**: validacao com `safeParse` sem depender de biblioteca de formulario.
- **Vue Test Utils**: testes de componentes `.vue` em ambiente Vitest/jsdom.

### Vite Vanilla

Local: `vite-vanilla/`

**Stack**

- Vite
- JavaScript moderno sem framework
- Tailwind CSS
- Supabase JS no browser
- Zod para validacao
- Vitest, Testing Library DOM, Playwright e Biome
- Modulos simples em `src/`

**Ponto positivo**

E a versao mais direta para estudar fundamentos de DOM, eventos, modulos, estado local e build com Vite sem abstracoes de framework.

**Limitacoes**

Nao oferece uma arquitetura robusta por padrao para estado, rotas ou formularios complexos. Escalar a aplicacao exige criar convencoes manualmente, como a separacao atual em `pages`, `components`, `lib`, `schemas` e `services`.

**Exclusivo do Vite Vanilla usado no projeto**

A versao vanilla prioriza fundamentos da plataforma web:

- **DOM API direta**: eventos, renderizacao e updates sem framework.
- **Modulos ES**: separacao simples entre paginas, componentes, store e services.
- **Supabase client-side**: autenticacao e persistencia sem API Routes.
- **Testing Library DOM**: testes de componentes renderizados como HTML/template string.
- **Baixo acoplamento**: poucas dependencias e fluxo de build minimo.

## Comparativo

| Area | React / Next | Angular | Vue.js | Vite Vanilla |
| --- | --- | --- | --- | --- |
| Framework principal | Next.js 16 + React 19 | Angular 22 | Vue 3 + Vite | Vite sem framework |
| Tipo de app | Full-stack Next App Router | SPA Angular | SPA Vue | SPA JavaScript simples |
| Linguagem | TypeScript | TypeScript | TypeScript | JavaScript |
| Renderizacao | Client components + API Routes no mesmo projeto | Client-side app com rotas Angular | Client-side app com Vite | Client-side DOM rendering |
| Roteamento | File-based routing do Next em `src/app` | `@angular/router` com `Routes` e `loadComponent` | `vue-router` com `createRouter` | Navegacao controlada por DOM/estado local |
| Estado | Zustand + TanStack Query | Signals + services Angular | Pinia + TanStack Vue Query | Store JS modular + localStorage para preferencias |
| Formularios | React Hook Form | Reactive Forms | Estado reativo + Zod manual | DOM events + Zod |
| Validacao | Zod + resolver do React Hook Form | Validators do Angular + validators customizados | Zod com `safeParse` | Zod com `safeParse` |
| Dados | Fetch para API Routes Next | Supabase client direto nos services | Supabase client direto nos services | Supabase client direto nos services |
| Auth | Supabase Auth no client + token nas API Routes | Supabase Auth no service Angular | Supabase Auth no store Pinia | Supabase Auth no store JS |
| UI | shadcn/base-ui style + Tailwind CSS | Componentes standalone + CSS global proprio | Componentes Vue + Tailwind CSS | Template strings, HTML, CSS e DOM API |
| Icones | `lucide-react` | `@lucide/angular` | `lucide-vue-next` | SVGs inline em modulo de icones |
| Testes unit/component | Vitest + Testing Library React | Angular unit test builder + Vitest + TestBed | Vitest + Vue Test Utils | Vitest + Testing Library DOM |
| E2E | Playwright | Playwright | Playwright | Playwright |
| Melhor uso didatico | Full-stack React e fronteira cliente/servidor | Arquitetura corporativa e aplicacoes estruturadas | SPA moderna com ergonomia e reatividade | Fundamentos de web e JavaScript |
| Complexidade | Alta | Alta | Media | Baixa |

## Principal diferenca arquitetural

No React / Next, o app e **full-stack com Next**: o frontend chama API Routes internas, e essas rotas falam com Supabase.

No Angular, Vue.js e Vite Vanilla, o app ficou como **SPA pura**: nao ha backend embutido. Por isso, a logica das API Routes foi adaptada para services/stores que chamam o Supabase diretamente pelo client.

No Vite Vanilla, o app e uma **SPA didatica sem framework**: ha autenticacao e persistencia remota via Supabase, mas roteamento, renderizacao, eventos e convencoes de componentes foram criados manualmente com JavaScript.

## Tradeoff

React / Next oferece uma fronteira backend/frontend mais natural dentro do mesmo projeto. Isso ajuda a centralizar validacao server-side e esconder parte da logica de persistencia.

Angular entrega uma arquitetura frontend mais explicita e organizada por DI, services, guards e forms. Para ter a mesma separacao backend do Next, o ideal seria adicionar uma API separada, por exemplo NestJS, Express, Supabase Edge Functions ou outro backend.

Vue.js equilibra ergonomia e organizacao com menos boilerplate. Em troca, a separacao backend precisa vir de outro servico, porque Vite nao inclui API Routes.

Vite Vanilla e o caminho mais simples para entender os fundamentos, mas exige criar manualmente as convencoes que frameworks ja entregam.

## Comandos

Cada implementacao possui seus proprios scripts. Entre no diretorio da stack desejada e rode os comandos do respectivo `package.json`.

Exemplo:

```bash
cd classroom/app/invest-app/vuejs
pnpm install
pnpm dev
```
