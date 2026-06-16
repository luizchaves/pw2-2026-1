create extension if not exists pgcrypto with schema extensions;

drop view public.investments_with_types;

alter table public.investments
  alter column id type uuid using gen_random_uuid(),
  alter column id set default gen_random_uuid();

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
