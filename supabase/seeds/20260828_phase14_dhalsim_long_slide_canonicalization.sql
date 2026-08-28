-- Phase14 P2-01: consolidate the duplicate Dhalsim Long Slide move entity.
-- The duplicate row is archived, never deleted. No status is promoted and no
-- verification_status is changed. Existing Frame / Classic / Source history is
-- retained on the archived row for auditability.

begin;

do $canonicalize$
declare
  canonical_move_id constant uuid := '7ab03e6f-a949-4953-b7f0-3e76828b6645';
  duplicate_move_id constant uuid := '7fd07bc7-bfa9-49dd-aafd-4d40613bdc5c';
  modern_command_id constant uuid := 'fb8ddb5f-b466-438a-834d-3f24ba20fa51';
  canonical_status text;
  duplicate_status text;
begin
  select status into strict canonical_status
  from public.moves
  where id = canonical_move_id
    and slug = 'dhalsim-crouching-hk'
    and name_ja = 'しゃがみ強K（ロングスライディング）';

  select status into strict duplicate_status
  from public.moves
  where id = duplicate_move_id
    and slug = 'dhalsim-capcom-frame-031'
    and name_ja = 'ロングスライディング';

  if canonical_status <> 'draft' or duplicate_status not in ('draft', 'archived') then
    raise exception 'Dhalsim Long Slide status drift: canonical=%, duplicate=%',
      canonical_status, duplicate_status;
  end if;

  if exists (
    select 1
    from public.combo_moves
    where move_id = duplicate_move_id
    union all
    select 1
    from public.setup_moves
    where move_id = duplicate_move_id
    union all
    select 1
    from public.entity_videos
    where entity_id = duplicate_move_id
    union all
    select 1
    from public.favorites
    where entity_id = duplicate_move_id
  ) then
    raise exception 'Dhalsim duplicate Move gained a user/content relation; aborting';
  end if;

  if duplicate_status = 'draft' then
    if (select count(*) from public.move_commands where move_id = canonical_move_id and control_scheme = 'modern') <> 0
      or (select count(*) from public.move_commands where id = modern_command_id and move_id = duplicate_move_id
            and control_scheme = 'modern' and numeric_notation = '3+H') <> 1 then
      raise exception 'Dhalsim Modern command state drift; aborting';
    end if;

    if not exists (
      select 1
      from public.entity_sources es
      join public.sources s on s.id = es.source_id
      where es.entity_type = 'move_command'
        and es.entity_id = modern_command_id
        and es.relationship = 'official'
        and s.reliability_level = 'official'
    ) then
      raise exception 'Dhalsim Modern command has no official Source; aborting';
    end if;

    update public.move_commands
    set move_id = canonical_move_id
    where id = modern_command_id
      and move_id = duplicate_move_id;

    update public.moves
    set status = 'archived', updated_at = now()
    where id = duplicate_move_id
      and status = 'draft';
  else
    if (select count(*) from public.move_commands where id = modern_command_id
          and move_id = canonical_move_id and control_scheme = 'modern' and numeric_notation = '3+H') <> 1 then
      raise exception 'Archived Dhalsim duplicate is not linked to the canonical Modern command';
    end if;
  end if;

  insert into public.move_aliases (move_id, alias, normalized_alias, alias_type)
  values (canonical_move_id, 'ロングスライディング', 'ロングスライディング', 'name')
  on conflict (move_id, normalized_alias) do nothing;
end
$canonicalize$;

commit;
