
alter policy "public read release-ready moves"
on public.moves
using (
  case
    when status = 'published'
    then private.is_move_public_ready(id)
    else false
  end
);

alter policy "public read release-ready combos"
on public.combos
using (
  case
    when status = 'published'
     and verification_status = 'verified'
     and valid_to_patch_id is null
    then private.is_combo_public_ready(id)
    else false
  end
);

alter policy "public read release-ready counters"
on public.counters
using (
  case
    when status = 'published'
     and verification_status = 'verified'
     and valid_to_patch_id is null
    then private.is_counter_public_ready(id)
    else false
  end
);

alter policy "public read release-ready setups"
on public.setups
using (
  case
    when status = 'published'
     and verification_status = 'verified'
     and valid_to_patch_id is null
    then private.is_setup_public_ready(id)
    else false
  end
);

alter policy "public read release-ready sequences"
on public.sequences
using (
  case
    when status = 'published'
     and verification_status = 'verified'
     and valid_to_patch_id is null
    then private.is_sequence_public_ready(id)
    else false
  end
);

alter policy "phase23_device_preview_moves"
on public.moves
using (
  (select private.is_phase23_device_preview())
  and exists (
    select 1
    from public.characters c
    where c.id = moves.character_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy "phase23_device_preview_combos"
on public.combos
using (
  (select private.is_phase23_device_preview())
  and exists (
    select 1
    from public.characters c
    where c.id = combos.character_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy "phase23_device_preview_counters"
on public.counters
using (
  (select private.is_phase23_device_preview())
  and (
    exists (
      select 1
      from public.characters c
      where c.id = counters.defender_character_id
        and c.status = 'published'
        and c.is_playable = true
    )
    or exists (
      select 1
      from public.characters c
      where c.id = counters.opponent_character_id
        and c.status = 'published'
        and c.is_playable = true
    )
  )
);

alter policy "phase23_device_preview_setups"
on public.setups
using (
  (select private.is_phase23_device_preview())
  and exists (
    select 1
    from public.characters c
    where c.id = setups.character_id
      and c.status = 'published'
      and c.is_playable = true
  )
);

alter policy "phase23_device_preview_sequences"
on public.sequences
using (
  (select private.is_phase23_device_preview())
  and exists (
    select 1
    from public.characters c
    where c.id = sequences.character_id
      and c.status = 'published'
      and c.is_playable = true
  )
);
