# Invest App Angular

Port em Angular do projeto `classroom/react/invest-app`.

## Stack

- Angular 22 com componentes standalone
- Rotas lazy com guards funcionais
- Signals para estado de autenticacao, carteira e visibilidade de valores
- Reactive Forms para login, cadastro e formulario de investimento
- Supabase JS para autenticacao e persistencia
- `@lucide/angular` para iconografia
- Vitest via builder de testes do Angular

## Rodando

```bash
pnpm install
pnpm start
```

O app usa as credenciais publicas do mesmo Supabase do projeto React em
`src/environments/environment.ts`.

## Comandos

```bash
pnpm run build
pnpm ng test --watch=false
```

## Organizacao

- `src/app/core`: servicos compartilhados, Supabase e guards
- `src/app/features`: paginas por rota
- `src/app/shared`: componentes reutilizaveis, modelos e utilitarios
