drop view public.investments_with_types;

alter table public.investments
  add column user_id uuid references auth.users(id) on update cascade on delete cascade;

create index investments_user_id_idx on public.investments(user_id);

create or replace view public.investments_with_types
with (security_invoker = true)
as
select
  i.id,
  i.user_id as "userId",
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
