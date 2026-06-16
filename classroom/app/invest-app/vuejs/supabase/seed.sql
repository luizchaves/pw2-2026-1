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
