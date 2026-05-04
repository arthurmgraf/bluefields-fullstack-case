-- =====================================================================
-- Seed data — realistic Brazilian-style startup names (fictional).
-- Run AFTER 001_initial_schema.sql AND after at least one user has signed up
-- (so we have a profile to attribute updates to).
--
-- Usage: replace <YOUR_USER_ID> with the uuid of your seeded auth user
--        (find it in Supabase → Authentication → Users).
-- =====================================================================

-- ---- Replace this with your auth user's UUID ----
-- e.g. select id from auth.users limit 1;
-- DO NOT commit a real UUID; this is a template.

with author as (
  select id from public.profiles order by created_at limit 1
),
inserted as (
  insert into public.startups (name, segment, phase, risk_level, responsible_id, description, founded_at)
  select * from (values
    ('AgroPulse',     'Agtech',      'traction',   'green',  (select id from author), 'Plataforma SaaS de monitoramento agrícola via satélite para pequenos produtores.', '2023-03-10'::date),
    ('CuidaJá',       'Healthtech',  'validation', 'yellow', (select id from author), 'Marketplace de cuidadores domiciliares com triagem clínica integrada.',         '2024-01-22'::date),
    ('Trilha',        'Edtech',      'traction',   'green',  (select id from author), 'Plataforma adaptativa de preparação para o ENEM em vídeo curto.',                '2022-11-05'::date),
    ('Bagagem Limpa', 'Foodtech',    'ideation',   'red',    (select id from author), 'Logística reversa de embalagens de delivery em São Paulo.',                     '2025-02-14'::date),
    ('Fluxo Caixa',   'Fintech',     'scale',      'green',  (select id from author), 'ERP financeiro para microempresas brasileiras com conciliação automática.',     '2021-06-18'::date),
    ('Morada+',       'Proptech',    'validation', 'yellow', (select id from author), 'Aluguel sem fiador com seguro embutido para classes C/D.',                      '2024-04-30'::date),
    ('SeguraBem',     'Insurtech',   'ideation',   'green',  (select id from author), 'Microsseguros parametrizados para autônomos de aplicativos.',                   '2025-01-08'::date),
    ('LogTech BR',    'Logtech',     'traction',   'red',    (select id from author), 'Roteirização de last-mile usando ML para transportadoras regionais.',           '2023-09-12'::date)
  ) as t(name, segment, phase, risk_level, responsible_id, description, founded_at)
  returning id, name, risk_level
)
insert into public.startup_updates (startup_id, author_id, content, blockers, next_steps, risk_level)
select
  i.id,
  (select id from author),
  case i.name
    when 'AgroPulse'     then 'Fechamos contrato com cooperativa em GO. Receita recorrente cresceu 40% MoM.'
    when 'CuidaJá'       then 'PMF inicial em SP — 18 cuidadoras ativas. Churn alto após primeiro mês.'
    when 'Trilha'        then 'Lançamento da v2 com IA de revisão. NPS subiu de 42 para 67.'
    when 'Bagagem Limpa' then 'Custo logístico maior que receita. Avaliando pivô para B2B com restaurantes.'
    when 'Fluxo Caixa'   then '50k microempresas ativas. Series A liderada por fundo regional fechado.'
    when 'Morada+'       then 'Parceria com seguradora travou na compliance. Buscando alternativa.'
    when 'SeguraBem'     then 'Validação inicial promissora — 200 entregadores em waitlist.'
    when 'LogTech BR'    then 'Cliente âncora cancelou. Runway de 3 meses. Em conversa com investidor-anjo.'
  end,
  case i.risk_level
    when 'red'    then 'Caixa apertado / pivô em discussão'
    when 'yellow' then 'Tração lenta / contratação travada'
    else ''
  end,
  case i.risk_level
    when 'red'    then 'Decisão sobre pivô em 14 dias; conversar com 3 investidores'
    when 'yellow' then 'Repensar funil; rever ICP'
    else 'Manter execução; próximo ritual mensal'
  end,
  i.risk_level
from inserted i;
