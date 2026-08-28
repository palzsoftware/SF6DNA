-- Phase14 Modern Command gap report (read-only)
-- A missing Modern row is an audit candidate, not proof that a Modern input exists.
-- Never use this report to synthesize or auto-publish commands.

with playable as (
  select id, slug, name_ja
  from public.characters
  where status='published' and is_playable=true
),
move_coverage as (
  select
    m.id move_id,
    m.character_id,
    m.slug move_slug,
    m.name_ja move_name,
    m.move_type,
    exists (
      select 1 from public.move_commands c
      where c.move_id=m.id and c.control_scheme='classic'
    ) has_classic,
    exists (
      select 1 from public.move_commands c
      where c.move_id=m.id and c.control_scheme='modern'
    ) has_modern,
    (select count(*) from public.entity_sources es
      where es.entity_type='move' and es.entity_id=m.id) move_sources,
    (select count(*)
      from public.entity_sources es
      join public.sources s on s.id=es.source_id
      where es.entity_type='move' and es.entity_id=m.id
        and s.reliability_level='official') official_move_sources,
    (select count(*)
      from public.move_commands c
      join public.entity_sources es on es.entity_type='move_command' and es.entity_id=c.id
      join public.sources s on s.id=es.source_id
      where c.move_id=m.id and c.control_scheme='classic'
        and s.reliability_level='official') official_classic_command_sources
  from public.moves m
  join playable p on p.id=m.character_id
  where m.status<>'archived'
)
select jsonb_build_object(
  'summary', (select jsonb_build_object(
    'moves', count(*),
    'classic', count(*) filter(where has_classic),
    'modern', count(*) filter(where has_modern),
    'missing_modern', count(*) filter(where not has_modern),
    'missing_modern_with_official_move_source', count(*) filter(where not has_modern and official_move_sources>0),
    'missing_modern_with_official_classic_command_source', count(*) filter(where not has_modern and official_classic_command_sources>0)
  ) from move_coverage),
  'characters', (select jsonb_agg(row_data order by row_data->>'name_ja') from (
    select jsonb_build_object(
      'slug', p.slug,
      'name_ja', p.name_ja,
      'moves', count(mc.*),
      'classic', count(*) filter(where mc.has_classic),
      'modern', count(*) filter(where mc.has_modern),
      'missing_modern', count(*) filter(where not mc.has_modern),
      'coverage_percent', round(100.0*count(*) filter(where mc.has_modern)/nullif(count(mc.*),0),1)
    ) row_data
    from playable p
    left join move_coverage mc on mc.character_id=p.id
    group by p.id,p.slug,p.name_ja
  ) rows),
  'missing_moves', (select jsonb_agg(jsonb_build_object(
    'character_slug', p.slug,
    'character_name', p.name_ja,
    'move_id', mc.move_id,
    'move_slug', mc.move_slug,
    'move_name', mc.move_name,
    'move_type', mc.move_type,
    'move_sources', mc.move_sources,
    'official_move_sources', mc.official_move_sources,
    'official_classic_command_sources', mc.official_classic_command_sources
  ) order by p.name_ja,mc.move_name)
  from move_coverage mc
  join playable p on p.id=mc.character_id
  where not mc.has_modern)
) report;
