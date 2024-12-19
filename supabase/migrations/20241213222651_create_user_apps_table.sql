create table
  public.user_apps (
    id uuid not null default gen_random_uuid (),
    app_id uuid not null default gen_random_uuid (),
    installed_at timestamp with time zone null default now(),
    constraint user_apps_pkey primary key (id),
    constraint user_apps_id_fkey foreign key (id) references profiles (id) on delete cascade,
    constraint user_apps_app_id_fkey foreign key (app_id) references installable_apps (id) on delete cascade
  ) tablespace pg_default;