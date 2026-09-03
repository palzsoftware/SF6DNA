-- Phase23 final device acceptance: allow the token-gated Preview RPCs to inspect
-- unpublished data for any currently published/playable character, not only Ryu.
-- This does not change public publication gates; the policies still require
-- private.is_phase23_device_preview(), which is enabled only inside the guarded
-- Preview RPC flow.

alter policy phase23_device_preview_character_guide_sections
on public.character_guide_sections
using (
  private.is_phase23_device_preview()
  and exists (
    select 1 from public.characters c
    where c.id = character_guide_sections.character_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy phase23_device_preview_moves
on public.moves
using (
  private.is_phase23_device_preview()
  and exists (
    select 1 from public.characters c
    where c.id = moves.character_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy phase23_device_preview_move_commands
on public.move_commands
using (
  private.is_phase23_device_preview()
  and exists (
    select 1
    from public.moves m
    join public.characters c on c.id = m.character_id
    where m.id = move_commands.move_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy phase23_device_preview_move_frame_data
on public.move_frame_data
using (
  private.is_phase23_device_preview()
  and exists (
    select 1
    from public.moves m
    join public.characters c on c.id = m.character_id
    where m.id = move_frame_data.move_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy phase23_device_preview_move_motion_media
on public.move_motion_media
using (
  private.is_phase23_device_preview()
  and exists (
    select 1
    from public.moves m
    join public.characters c on c.id = m.character_id
    where m.id = move_motion_media.move_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy phase23_device_preview_combos
on public.combos
using (
  private.is_phase23_device_preview()
  and exists (
    select 1 from public.characters c
    where c.id = combos.character_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy phase23_device_preview_setups
on public.setups
using (
  private.is_phase23_device_preview()
  and exists (
    select 1 from public.characters c
    where c.id = setups.character_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy phase23_device_preview_sequences
on public.sequences
using (
  private.is_phase23_device_preview()
  and exists (
    select 1 from public.characters c
    where c.id = sequences.character_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy phase23_device_preview_counters
on public.counters
using (
  private.is_phase23_device_preview()
  and (
    exists (
      select 1 from public.characters c
      where c.id = counters.defender_character_id
        and c.status = 'published'
        and c.is_playable = true
    )
    or exists (
      select 1 from public.characters c
      where c.id = counters.opponent_character_id
        and c.status = 'published'
        and c.is_playable = true
    )
  )
);

alter policy phase23_device_preview_trainings
on public.trainings
using (
  private.is_phase23_device_preview()
  and (
    exists (
      select 1 from public.characters c
      where c.id = trainings.player_character_id
        and c.status = 'published'
        and c.is_playable = true
    )
    or exists (
      select 1 from public.characters c
      where c.id = trainings.dummy_character_id
        and c.status = 'published'
        and c.is_playable = true
    )
  )
);
