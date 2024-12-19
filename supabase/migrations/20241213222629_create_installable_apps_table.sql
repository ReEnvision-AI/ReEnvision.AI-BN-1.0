create table
  public.installable_apps (
    id uuid not null default gen_random_uuid (),
    name text not null,
    icon text not null,
    preferred_width integer null default 600,
    preferred_height integer null default 800,
    min_width integer null default 300,
    min_height integer null default 400,
    created_at timestamp with time zone null default now(),
    url text not null,
    constraint installable_apps_pkey primary key (id)
  ) tablespace pg_default;