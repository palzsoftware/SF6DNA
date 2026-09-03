create or replace function private.is_move_motion_media_public_ready(target_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private, pg_temp
as $$
  select exists (
    select 1
    from public.move_motion_media mm
    where mm.id = target_id
      and mm.status = 'published'
      and nullif(btrim(mm.media_url), '') is not null
      and nullif(btrim(mm.source_url), '') is not null
      and nullif(btrim(mm.source_label), '') is not null
      and private.is_move_public_ready(mm.move_id)
  );
$$;

revoke all on function private.is_move_motion_media_public_ready(uuid) from public;

alter table public.move_motion_media
  drop constraint if exists move_motion_media_published_source_check;

alter table public.move_motion_media
  add constraint move_motion_media_published_source_check
  check (
    status <> 'published'
    or (
      nullif(btrim(media_url), '') is not null
      and nullif(btrim(source_url), '') is not null
      and nullif(btrim(source_label), '') is not null
    )
  );

drop policy if exists move_motion_media_public_read on public.move_motion_media;
create policy move_motion_media_public_read
on public.move_motion_media
for select
to anon, authenticated
using (private.is_move_motion_media_public_ready(id));
