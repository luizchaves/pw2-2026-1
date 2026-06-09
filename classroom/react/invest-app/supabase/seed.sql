insert into public.investment_types (id, name, category) values
  ('acoes', 'Ações', 'Variable Income'),
  ('cdb', 'CDB', 'Fixed Income'),
  ('fii', 'FII', 'Variable Income'),
  ('renda-fixa', 'Renda Fixa', 'Fixed Income'),
  ('tesouro-ipca', 'Tesouro IPCA+', 'Fixed Income'),
  ('tesouro-prefixado', 'Tesouro Prefixado', 'Fixed Income'),
  ('tesouro-reserva', 'Tesouro Reserva', 'Fixed Income'),
  ('tesouro-selic', 'Tesouro Selic', 'Fixed Income')
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category;

insert into public.investments (
  id,
  name,
  type_id,
  broker,
  amount_cents,
  yield,
  invested_date,
  due_date
) values
  (
    'aetg9941v91allu57kwa8miu',
    'Tesouro IPCA+ 2045',
    'tesouro-ipca',
    'Corretora Y',
    15200,
    'IPCA + 5%',
    '2023-05-14',
    '2045-08-15'
  ),
  (
    'asbaa15dtm2uwvw7qs4fczvq',
    'CDB Banco X',
    'cdb',
    'Corretora Y',
    45300,
    '110% CDI',
    '2024-01-02',
    '2027-01-02'
  )
on conflict (id) do update set
  name = excluded.name,
  type_id = excluded.type_id,
  broker = excluded.broker,
  amount_cents = excluded.amount_cents,
  yield = excluded.yield,
  invested_date = excluded.invested_date,
  due_date = excluded.due_date;
