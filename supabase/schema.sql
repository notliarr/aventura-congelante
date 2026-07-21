create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  birthday_person_name text not null check (char_length(birthday_person_name) between 1 and 80),
  age smallint not null check (age between 1 and 120),
  welcome_message text not null check (char_length(welcome_message) between 10 and 500),
  cover_image_url text not null default '',
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  gallery_enabled boolean not null default true,
  gallery_moderation_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.frames (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  preview_url text not null,
  storage_path text not null,
  aspect_ratio text not null check (aspect_ratio in ('4:5','1:1','9:16')),
  display_order integer not null default 0 check (display_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  frame_id uuid references public.frames(id) on delete set null,
  storage_path text not null unique,
  public_url text not null,
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending','approved','hidden')),
  width integer not null check (width between 320 and 2160),
  height integer not null check (height between 320 and 2160),
  file_size bigint not null check (file_size > 0 and file_size <= 12582912),
  mime_type text not null check (mime_type in ('image/jpeg','image/webp'))
);

create index if not exists frames_event_active_order_idx on public.frames(event_id, is_active, display_order);
create index if not exists photos_event_status_created_idx on public.photos(event_id, status, created_at desc);
create index if not exists photos_frame_idx on public.photos(frame_id);

alter table public.events enable row level security;
alter table public.frames enable row level security;
alter table public.photos enable row level security;

drop policy if exists "public reads event presentation" on public.events;
create policy "public reads event presentation" on public.events for select to anon, authenticated using (true);
drop policy if exists "public reads active frames" on public.frames;
create policy "public reads active frames" on public.frames for select to anon, authenticated using (is_active = true);
drop policy if exists "public reads approved photos" on public.photos;
create policy "public reads approved photos" on public.photos for select to anon, authenticated using (status = 'approved');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-photos','event-photos',true,12582912,array['image/jpeg','image/webp'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-frames','event-frames',true,8388608,array['image/png'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "public reads event photos" on storage.objects;
create policy "public reads event photos" on storage.objects for select to anon, authenticated using (bucket_id = 'event-photos');
drop policy if exists "public reads event frames" on storage.objects;
create policy "public reads event frames" on storage.objects for select to anon, authenticated using (bucket_id = 'event-frames');

insert into public.events (id,name,birthday_person_name,age,welcome_message,cover_image_url,slug,gallery_enabled,gallery_moderation_enabled)
values ('00000000-0000-4000-8000-000000000001','Uma Aventura Congelante da Liz','Liz',4,'Bem-vindo à nossa aventura congelante! Escolha sua moldura, registre este momento especial e compartilhe sua foto.','/placeholders/ice-castle.svg','aventura-congelante',true,true)
on conflict (id) do nothing;

insert into public.frames (id,event_id,name,preview_url,storage_path,aspect_ratio,display_order,is_active) values
('10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','Neve Encantada','/frames/neve-encantada.svg','demo/neve-encantada.svg','4:5',0,true),
('10000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Cristais de Gelo','/frames/cristais-de-gelo.svg','demo/cristais-de-gelo.svg','1:1',1,true),
('10000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000001','Aurora Azul','/frames/aurora-azul.svg','demo/aurora-azul.svg','9:16',2,true),
('10000000-0000-4000-8000-000000000004','00000000-0000-4000-8000-000000000001','Princesa do Inverno','/frames/princesa-do-inverno.svg','demo/princesa-do-inverno.svg','4:5',3,true)
on conflict (id) do nothing;
