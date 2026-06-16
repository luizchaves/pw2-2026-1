create type public.investment_category as enum ('Fixed Income', 'Variable Income');

create table public.investment_types (
  id text primary key,
  name text not null,
  category public.investment_category not null,
  created_at timestamptz not null default now()
);

create table public.investments (
  id text primary key,
  name text not null,
  type_id text not null references public.investment_types(id) on update cascade on delete restrict,
  broker text not null,
  amount_cents integer not null check (amount_cents > 0),
  yield text check (
    yield is null
    or yield ~* '^(\d+(\.\d+)?%|IPCA\s*\+\s*\d+(\.\d+)?%|\d+(\.\d+)?%\s+CDI|\d+(\.\d+)?%\s+Selic)$'
  ),
  invested_date date not null,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index investments_type_id_idx on public.investments(type_id);

create or replace view public.investments_with_types
with (security_invoker = true)
as
select
  i.id,
  i.name,
  i.type_id as type,
  i.broker,
  i.amount_cents as amount,
  i.yield,
  t.category,
  i.invested_date as "investedDate",
  i.due_date as "dueDate",
  t.name as type_name
from public.investments i
join public.investment_types t on t.id = i.type_id;
