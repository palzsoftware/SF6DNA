
alter policy "phase23_device_preview_character_guide_sections"
on public.character_guide_sections
using (
  (select private.is_phase23_device_preview())
  and exists (
    select 1
    from public.characters c
    where c.id = character_guide_sections.character_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy "phase23_device_preview_move_commands"
on public.move_commands
using (
  (select private.is_phase23_device_preview())
  and exists (
    select 1
    from public.moves m
    join public.characters c on c.id = m.character_id
    where m.id = move_commands.move_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy "phase23_device_preview_move_frame_data"
on public.move_frame_data
using (
  (select private.is_phase23_device_preview())
  and exists (
    select 1
    from public.moves m
    join public.characters c on c.id = m.character_id
    where m.id = move_frame_data.move_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy "phase23_device_preview_move_motion_media"
on public.move_motion_media
using (
  (select private.is_phase23_device_preview())
  and exists (
    select 1
    from public.moves m
    join public.characters c on c.id = m.character_id
    where m.id = move_motion_media.move_id
      and c.status = 'published'
      and c.is_playable = true
  )
);
