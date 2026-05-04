-- =====================================================================
-- Startup Tracker — initial schema
-- Run in: Supabase SQL Editor → New Query → paste → Run
-- Idempotent: safe to re-run (uses IF NOT EXISTS / OR REPLACE).
-- =====================================================================

-- Tables -------------------------------------------------------------

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  created_at  timestamptz not null default now()
);

create table if not exists public.startups (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  segment         text not null,
  phase           text not null check (phase in ('ideation','validation','traction','scale')),
  risk_level      text not null default 'green' check (risk_level in ('green','yellow','red')),
  responsible_id  uuid references public.profiles(id),
  description     text default '',
  founded_at      date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.startup_updates (
  id           uuid primary key default gen_random_uuid(),
  startup_id   uuid not null references public.startups(id) on delete cascade,
  author_id    uuid not null references public.profiles(id),
  content      text not null,
  blockers     text default '',
  next_steps   text default '',
  risk_level   text not null check (risk_level in ('green','yellow','red')),
  created_at   timestamptz not null default now()
);

create index if not exists startup_updates_startup_id_idx
  on public.startup_updates(startup_id, created_at desc);

create index if not exists startups_updated_at_idx
  on public.startups(updated_at desc);

-- Auto-create profile on auth signup ---------------------------------

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security -------------------------------------------------

alter table public.profiles        enable row level security;
alter table public.startups        enable row level security;
alter table public.startup_updates enable row level security;

-- profiles: anyone authenticated can read; users can update only themselves
drop policy if exists "auth read profiles"      on public.profiles;
drop policy if exists "self update profile"     on public.profiles;
create policy "auth read profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');
create policy "self update profile"
  on public.profiles for update
  using (auth.uid() = id);

-- startups: any authenticated user can read/write
drop policy if exists "auth read startups"  on public.startups;
drop policy if exists "auth write startups" on public.startups;
create policy "auth read startups"
  on public.startups for select
  using (auth.role() = 'authenticated');
create policy "auth write startups"
  on public.startups for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- startup_updates: any auth user reads; only own author_id can insert
drop policy if exists "auth read updates"   on public.startup_updates;
drop policy if exists "auth insert updates" on public.startup_updates;
create policy "auth read updates"
  on public.startup_updates for select
  using (auth.role() = 'authenticated');
create policy "auth insert updates"
  on public.startup_updates for insert
  with check (auth.uid() = author_id);
