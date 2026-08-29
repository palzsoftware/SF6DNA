create or replace function private.is_phase23_device_preview()
returns boolean
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select
    current_timestamp <= timestamptz '2026-09-06 23:59:59+09'
    and md5(coalesce(current_setting('sf6dna.preview_token', true), '')) = '48c9102d99b9dc573446cfd6ac847aec';
$$;

revoke all on function private.is_phase23_device_preview() from public;
grant execute on function private.is_phase23_device_preview() to anon;

alter function public.get_phase23_character_preview(uuid, text) security invoker;

create or replace function public.get_phase23_character_preview(
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
    return null;
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = target_character_id
      and c.slug = 'ryu'
  ) then
    return null;
  end if;

  select jsonb_build_object(
    'guideSections', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'sectionType', s.section_type,
          'title', s.title,
          'body', s.body,
          'summary', s.summary,
          'displayOrder', s.display_order,
          'status', s.status,
          'verificationStatus', s.verification_status
        ) order by s.display_order, s.created_at
      )
      from public.character_guide_sections s
      where s.character_id = target_character_id
        and s.status <> 'archived'
    ), '[]'::jsonb),
    'moves', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'slug', m.slug,
          'name', m.name_ja,
          'moveType', m.move_type,
          'usageSummary', m.usage_summary,
          'status', m.status,
          'frame', (
            select jsonb_build_object(
              'startup', f.startup,
              'onBlock', f.on_block,
              'damage', f.damage,
              'verificationStatus', f.verification_status
            )
            from public.move_frame_data f
            where f.move_id = m.id
              and f.valid_to_patch_id is null
            order by case f.verification_status
              when 'verified' then 1
              when 'reviewed' then 2
              else 3
            end, f.updated_at desc
            limit 1
          )
        ) order by m.display_order, m.name_ja
      )
      from public.moves m
      where m.character_id = target_character_id
        and m.status <> 'archived'
    ), '[]'::jsonb),
    'combos', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', x.id,
          'slug', x.slug,
          'name', x.name,
          'purpose', x.purpose,
          'damage', x.damage,
          'driveCost', x.drive_cost,
          'saCost', x.sa_cost,
          'difficulty', x.difficulty,
          'status', x.status,
          'verificationStatus', x.verification_status
        ) order by x.created_at
      )
      from public.combos x
      where x.character_id = target_character_id
        and x.status <> 'archived'
    ), '[]'::jsonb),
    'setups', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', x.id,
          'slug', x.slug,
          'name', x.name,
          'setupType', x.setup_type,
          'description', x.description,
          'frameAdvantage', x.frame_advantage,
          'position', x.position,
          'status', x.status,
          'verificationStatus', x.verification_status
        ) order by x.created_at
      )
      from public.setups x
      where x.character_id = target_character_id
        and x.status <> 'archived'
    ), '[]'::jsonb),
    'sequences', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', x.id,
          'slug', x.slug,
          'name', x.name,
          'sequenceType', x.sequence_type,
          'sequenceText', x.sequence_text,
          'notes', x.notes,
          'status', x.status,
          'verificationStatus', x.verification_status
        ) order by x.created_at
      )
      from public.sequences x
      where x.character_id = target_character_id
        and x.status <> 'archived'
    ), '[]'::jsonb),
    'matchups', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', x.id,
          'slug', x.slug,
          'title', x.title,
          'summary', x.summary,
          'counterType', x.counter_type,
          'difficulty', x.difficulty,
          'defenderCharacterId', x.defender_character_id,
          'opponentCharacterId', x.opponent_character_id,
          'status', x.status,
          'verificationStatus', x.verification_status
        ) order by x.created_at
      )
      from public.counters x
      where (x.defender_character_id = target_character_id or x.opponent_character_id = target_character_id)
        and x.status <> 'archived'
    ), '[]'::jsonb),
    'training', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', x.id,
          'slug', x.slug,
          'name', x.name,
          'purpose', x.purpose,
          'trainingType', x.training_type,
          'level', x.level,
          'durationMinutes', x.duration_minutes,
          'playerCharacterId', x.player_character_id,
          'dummyCharacterId', x.dummy_character_id,
          'status', x.status,
          'verificationStatus', x.verification_status
        ) order by x.created_at
      )
      from public.trainings x
      where (x.player_character_id = target_character_id or x.dummy_character_id = target_character_id)
        and x.status <> 'archived'
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.get_phase23_character_preview(uuid, text) from public;
revoke all on function public.get_phase23_character_preview(uuid, text) from authenticated;
grant execute on function public.get_phase23_character_preview(uuid, text) to anon;

drop policy if exists phase23_device_preview_character_guide_sections on public.character_guide_sections;
create policy phase23_device_preview_character_guide_sections
on public.character_guide_sections
for select
to anon
using (
  private.is_phase23_device_preview()
  and character_id = (select id from public.characters where slug = 'ryu' limit 1)
);

drop policy if exists phase23_device_preview_moves on public.moves;
create policy phase23_device_preview_moves
on public.moves
for select
to anon
using (
  private.is_phase23_device_preview()
  and character_id = (select id from public.characters where slug = 'ryu' limit 1)
);

drop policy if exists phase23_device_preview_move_frame_data on public.move_frame_data;
create policy phase23_device_preview_move_frame_data
on public.move_frame_data
for select
to anon
using (
  private.is_phase23_device_preview()
  and exists (
    select 1
    from public.moves m
    where m.id = move_frame_data.move_id
      and m.character_id = (select id from public.characters where slug = 'ryu' limit 1)
  )
);

drop policy if exists phase23_device_preview_combos on public.combos;
create policy phase23_device_preview_combos
on public.combos
for select
to anon
using (
  private.is_phase23_device_preview()
  and character_id = (select id from public.characters where slug = 'ryu' limit 1)
);

drop policy if exists phase23_device_preview_setups on public.setups;
create policy phase23_device_preview_setups
on public.setups
for select
to anon
using (
  private.is_phase23_device_preview()
  and character_id = (select id from public.characters where slug = 'ryu' limit 1)
);

drop policy if exists phase23_device_preview_sequences on public.sequences;
create policy phase23_device_preview_sequences
on public.sequences
for select
to anon
using (
  private.is_phase23_device_preview()
  and character_id = (select id from public.characters where slug = 'ryu' limit 1)
);

drop policy if exists phase23_device_preview_counters on public.counters;
create policy phase23_device_preview_counters
on public.counters
for select
to anon
using (
  private.is_phase23_device_preview()
  and (
    defender_character_id = (select id from public.characters where slug = 'ryu' limit 1)
    or opponent_character_id = (select id from public.characters where slug = 'ryu' limit 1)
  )
);

drop policy if exists phase23_device_preview_trainings on public.trainings;
create policy phase23_device_preview_trainings
on public.trainings
for select
to anon
using (
  private.is_phase23_device_preview()
  and (
    player_character_id = (select id from public.characters where slug = 'ryu' limit 1)
    or dummy_character_id = (select id from public.characters where slug = 'ryu' limit 1)
  )
);
