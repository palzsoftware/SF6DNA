
alter policy "admin manage entity sources"
on public.entity_sources
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

alter policy "admin manage trainings"
on public.trainings
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

alter policy "phase23_device_preview_trainings"
on public.trainings
using (
  (select private.is_phase23_device_preview())
  and (
    exists (
      select 1
      from public.characters c
      where c.id = trainings.player_character_id
        and c.status = 'published'
        and c.is_playable = true
    )
    or exists (
      select 1
      from public.characters c
      where c.id = trainings.dummy_character_id
        and c.status = 'published'
        and c.is_playable = true
    )
  )
);

alter policy "public read release-ready trainings"
on public.trainings
using (
  status = 'published'
  and verification_status = 'verified'
  and valid_to_patch_id is null
  and private.is_training_public_ready(id)
);
