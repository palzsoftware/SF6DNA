create table if not exists public.entity_videos (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  video_id uuid not null references public.videos(id) on delete cascade,
  relationship text not null default 'related',
  display_order integer not null default 0,
  note text,
  created_at timestamptz not null default now(),
  unique(entity_type, entity_id, video_id, relationship)
);

create index if not exists entity_videos_entity_idx on public.entity_videos(entity_type, entity_id, display_order);
create index if not exists entity_videos_video_id_idx on public.entity_videos(video_id);

alter table public.entity_videos enable row level security;

create policy "public read published entity videos" on public.entity_videos
for select using (
  exists (select 1 from public.videos v where v.id = video_id and v.status = 'published')
);

create policy "admin manage entity videos" on public.entity_videos
for all using (private.is_admin()) with check (private.is_admin());
