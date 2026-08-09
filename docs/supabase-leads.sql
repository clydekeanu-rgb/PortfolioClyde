-- Run once in Supabase SQL editor.
-- Stores Leave a message + discovery call leads.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('message', 'discovery')),
  name text not null,
  email text not null,
  message text,
  preferred_date text,
  preferred_time text,
  timezone text,
  user_agent text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;
-- No public policies: only the service role (API) can write/read.
