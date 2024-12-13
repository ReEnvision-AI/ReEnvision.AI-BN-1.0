create table
  public.profiles (
    id uuid not null,
    first_name text null,
    last_name text null,
    email text null,
    constraint profiles_pkey primary key (id),
    constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade
  ) tablespace pg_default;