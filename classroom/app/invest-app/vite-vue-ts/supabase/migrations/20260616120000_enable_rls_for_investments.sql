alter table public.investment_types enable row level security;

drop policy if exists "Investment types are readable" on public.investment_types;

create policy "Investment types are readable"
on public.investment_types
for select
to anon, authenticated
using (true);

alter table public.investments enable row level security;

drop policy if exists "Users can read own investments" on public.investments;
drop policy if exists "Users can create own investments" on public.investments;
drop policy if exists "Users can update own investments" on public.investments;
drop policy if exists "Users can delete own investments" on public.investments;

create policy "Users can read own investments"
on public.investments
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create own investments"
on public.investments
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own investments"
on public.investments
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete own investments"
on public.investments
for delete
to authenticated
using ((select auth.uid()) = user_id);
