-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)

create table if not exists page_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  path text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists section_views (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  path text not null,
  section_id text not null,
  duration_ms integer not null,
  created_at timestamptz not null default now()
);

create index if not exists page_visits_created_at_idx on page_visits (created_at desc);
create index if not exists page_visits_path_idx on page_visits (path);
create index if not exists section_views_section_idx on section_views (section_id);
create index if not exists section_views_created_at_idx on section_views (created_at desc);

-- RLS is enabled but no policies are added on purpose: all reads/writes go
-- through the service role key on the server (API routes + admin dashboard),
-- never directly from the browser. This keeps the tables unreadable/unwritable
-- to anon/public keys even if someone finds the table names.
alter table page_visits enable row level security;
alter table section_views enable row level security;
