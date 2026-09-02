-- Phase48: reserve managed Storage for future Move GIF / short-video assets.
-- Downloads are public because only published media URLs are rendered publicly;
-- upload, replacement, and deletion remain admin-only.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'move-motion-media',
  'move-motion-media',
  true,
  26214400,
  array['image/gif', 'video/mp4', 'video/webm']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

alter table public.move_motion_media
  add column if not exists storage_path text;

comment on column public.move_motion_media.storage_path is
  'Object path in the move-motion-media bucket. NULL for externally hosted legacy media.';

drop policy if exists "Admin uploads Move motion media" on storage.objects;
create policy "Admin uploads Move motion media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'move-motion-media'
  and (select private.is_admin())
);

drop policy if exists "Admin updates Move motion media" on storage.objects;
create policy "Admin updates Move motion media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'move-motion-media'
  and (select private.is_admin())
)
with check (
  bucket_id = 'move-motion-media'
  and (select private.is_admin())
);

drop policy if exists "Admin deletes Move motion media" on storage.objects;
create policy "Admin deletes Move motion media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'move-motion-media'
  and (select private.is_admin())
);

drop policy if exists "Admin lists Move motion media" on storage.objects;
create policy "Admin lists Move motion media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'move-motion-media'
  and (select private.is_admin())
);
