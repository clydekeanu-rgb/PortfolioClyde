-- Run once in Supabase SQL editor.
-- Stores CTA clicks and lead-submit conversion events.

create table if not exists public.cta_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visitor_id text not null,
  event_name text not null,
  path text not null,
  target text not null,
  meta jsonb
);

create index if not exists cta_events_created_at_idx on public.cta_events (created_at desc);
create index if not exists cta_events_event_name_idx on public.cta_events (event_name);
create index if not exists cta_events_path_idx on public.cta_events (path);

alter table public.cta_events enable row level security;
-- No public policies: only the service role (API) can write/read.
