create table if not exists public.move_motion_media (
  id uuid primary key default gen_random_uuid(),
  move_id uuid not null references public.moves(id) on delete cascade,
  media_type text not null check (media_type in ('gif', 'video')),
  media_url text not null,
  poster_url text,
  source_url text,
  source_label text,
  status text not null default 'draft' check (status in ('draft', 'reviewed', 'published', 'archived')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (move_id, media_type, media_url)
);

create index if not exists move_motion_media_move_id_idx
  on public.move_motion_media(move_id, display_order);

alter table public.move_motion_media enable row level security;

drop policy if exists move_motion_media_public_read on public.move_motion_media;
create policy move_motion_media_public_read
on public.move_motion_media
for select
to anon, authenticated
using (
  status = 'published'
  and private.is_move_public_ready(move_id)
);

drop policy if exists move_motion_media_admin_manage on public.move_motion_media;
create policy move_motion_media_admin_manage
on public.move_motion_media
for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists phase23_device_preview_move_motion_media on public.move_motion_media;
create policy phase23_device_preview_move_motion_media
on public.move_motion_media
for select
to anon
using (
  private.is_phase23_device_preview()
  and exists (
    select 1
    from public.moves m
    join public.characters c on c.id = m.character_id
    where m.id = move_motion_media.move_id
      and c.slug = 'ryu'
  )
);

grant select on public.move_motion_media to anon, authenticated;

create or replace function public.get_phase23_move_motion_media_preview(
  target_character_id uuid,
  preview_token text
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return '[]'::jsonb;
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = target_character_id
      and c.slug = 'ryu'
  ) then
    return '[]'::jsonb;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', mm.id,
        'moveId', mm.move_id,
        'mediaType', mm.media_type,
        'mediaUrl', mm.media_url,
        'posterUrl', mm.poster_url,
        'sourceUrl', mm.source_url,
        'sourceLabel', mm.source_label,
        'status', mm.status,
        'displayOrder', mm.display_order
      ) order by mm.display_order, mm.created_at
    ),
    '[]'::jsonb
  )
  into result
  from public.move_motion_media mm
  join public.moves m on m.id = mm.move_id
  where m.character_id = target_character_id
    and mm.status <> 'archived';

  return result;
end;
$$;

revoke all on function public.get_phase23_move_motion_media_preview(uuid, text) from public;
grant execute on function public.get_phase23_move_motion_media_preview(uuid, text) to anon, authenticated;
