-- Phase14 public data quality report (read-only)
-- Safe to run against SF6DNAPro: SELECT statements only.
-- Release Ready never changes status or verification_status.

with current_patch as (
  select id, version_label
  from public.patches
  where is_current = true
  order by released_at desc nulls last
  limit 1
),
source_links as (
  select entity_type, entity_id, count(*)::integer as source_count
  from public.entity_sources
  group by entity_type, entity_id
),
move_rollup as (
  select
    m.id,
    m.character_id,
    m.status,
    exists (select 1 from public.move_frame_data f where f.move_id = m.id) as has_frame,
    exists (
      select 1 from public.move_frame_data f
      where f.move_id = m.id and f.verification_status = 'verified'
    ) as has_verified_frame,
    exists (
      select 1 from public.move_frame_data f cross join current_patch cp
      where f.move_id = m.id
        and f.verification_status = 'verified'
        and f.valid_from_patch_id = cp.id
        and f.valid_to_patch_id is null
    ) as has_current_verified_frame,
    exists (select 1 from public.move_commands c where c.move_id = m.id and c.control_scheme = 'classic') as has_classic,
    exists (select 1 from public.move_commands c where c.move_id = m.id and c.control_scheme = 'modern') as has_modern,
    coalesce((select source_count from source_links s where s.entity_type = 'move' and s.entity_id = m.id), 0) > 0 as has_source
  from public.moves m
),
strategy_rollup as (
  select 'combo'::text entity_type, id, character_id, status, verification_status,
    valid_from_patch_id, valid_to_patch_id,
    coalesce((select source_count from source_links s where s.entity_type='combo' and s.entity_id=combos.id),0) source_count
  from public.combos
  union all
  select 'setup', id, character_id, status, verification_status,
    valid_from_patch_id, valid_to_patch_id,
    coalesce((select source_count from source_links s where s.entity_type='setup' and s.entity_id=setups.id),0)
  from public.setups
  union all
  select 'sequence', id, character_id, status, verification_status,
    valid_from_patch_id, valid_to_patch_id,
    coalesce((select source_count from source_links s where s.entity_type='sequence' and s.entity_id=sequences.id),0)
  from public.sequences
  union all
  select 'counter', id, coalesce(defender_character_id, opponent_character_id), status, verification_status,
    valid_from_patch_id, valid_to_patch_id,
    coalesce((select source_count from source_links s where s.entity_type='counter' and s.entity_id=counters.id),0)
  from public.counters
  union all
  select 'training', id, coalesce(player_character_id, dummy_character_id), status, verification_status,
    valid_from_patch_id, valid_to_patch_id,
    coalesce((select source_count from source_links s where s.entity_type='training' and s.entity_id=trainings.id),0)
  from public.trainings
),
strategy_character_links as (
  select 'combo'::text entity_type, id entity_id, character_id from public.combos
  union all select 'setup', id, character_id from public.setups
  union all select 'sequence', id, character_id from public.sequences
  union all select 'counter', id, defender_character_id from public.counters where defender_character_id is not null
  union select 'counter', id, opponent_character_id from public.counters where opponent_character_id is not null
  union all select 'training', id, player_character_id from public.trainings where player_character_id is not null
  union select 'training', id, dummy_character_id from public.trainings where dummy_character_id is not null
),
strategy_summary as (
  select
    entity_type,
    count(*)::integer total,
    count(*) filter (where status='draft')::integer draft,
    count(*) filter (where verification_status='reviewed')::integer reviewed,
    count(*) filter (where verification_status='verified')::integer verified,
    count(*) filter (where status='published')::integer published,
    count(*) filter (where status='published' and verification_status='verified')::integer published_verified,
    count(*) filter (where source_count > 0)::integer sourced,
    count(*) filter (
      where valid_from_patch_id=(select id from current_patch) and valid_to_patch_id is null
    )::integer current_patch,
    count(*) filter (
      where status='published'
        and verification_status='verified'
        and source_count > 0
        and valid_from_patch_id=(select id from current_patch)
        and valid_to_patch_id is null
    )::integer release_ready
  from strategy_rollup
  group by entity_type
),
character_coverage as (
  select
    c.id,
    c.slug,
    c.name_ja,
    count(distinct m.id)::integer moves,
    count(distinct m.id) filter (where m.has_frame)::integer frames,
    count(distinct m.id) filter (where m.has_classic)::integer classic,
    count(distinct m.id) filter (where m.has_modern)::integer modern,
    count(distinct s.id) filter (where s.entity_type='combo')::integer combos,
    count(distinct s.id) filter (where s.entity_type='setup')::integer setups,
    count(distinct s.id) filter (where s.entity_type='sequence')::integer sequences,
    count(distinct s.id) filter (where s.entity_type='counter')::integer counters,
    count(distinct s.id) filter (where s.entity_type='training')::integer trainings,
    (select count(distinct pc.player_id)::integer from public.player_characters pc where pc.character_id=c.id) players,
    (select count(distinct ev.video_id)::integer from public.entity_videos ev where ev.entity_type='character' and ev.entity_id=c.id) videos,
    (select count(*)::integer from public.character_trait_scores ts where ts.character_id=c.id) trait_scores,
    count(distinct m.id) filter (
      where m.status='published' and m.has_current_verified_frame and m.has_classic and m.has_source
    )::integer release_ready_moves,
    count(distinct s.id) filter (
      where s.status='published' and s.verification_status='verified' and s.source_count > 0
        and s.valid_from_patch_id=(select id from current_patch) and s.valid_to_patch_id is null
    )::integer release_ready_strategies
  from public.characters c
  left join move_rollup m on m.character_id=c.id
  left join strategy_character_links scl on scl.character_id=c.id
  left join strategy_rollup s on s.entity_type=scl.entity_type and s.id=scl.entity_id
  where c.status='published' and c.is_playable=true
  group by c.id, c.slug, c.name_ja
),
summary as (
  select jsonb_build_object(
    'current_patch', (select version_label from current_patch),
    'characters', (select jsonb_build_object(
      'playable_published', count(*) filter(where status='published' and is_playable),
      'draft_non_playable', count(*) filter(where status='draft' and not is_playable)
    ) from public.characters),
    'moves', (select jsonb_build_object(
      'total', count(*),
      'published', count(*) filter(where status='published'),
      'draft', count(*) filter(where status='draft'),
      'with_frame', count(*) filter(where has_frame),
      'with_verified_frame', count(*) filter(where has_verified_frame),
      'with_source', count(*) filter(where has_source),
      'with_classic', count(*) filter(where has_classic),
      'with_modern', count(*) filter(where has_modern),
      'release_ready', count(*) filter(where status='published' and has_current_verified_frame and has_source and has_classic)
    ) from move_rollup),
    'strategies', (select jsonb_agg(to_jsonb(strategy_summary) order by entity_type) from strategy_summary),
    'trait_scores', (select jsonb_build_object(
      'total', count(*),
      'reviewed', count(*) filter(where verification_status='reviewed'),
      'verified', count(*) filter(where verification_status='verified'),
      'published', count(*) filter(where status='published'),
      'published_verified', count(*) filter(where status='published' and verification_status='verified'),
      'sourced', count(*) filter(where source_id is not null or exists(
        select 1 from source_links s where s.entity_type='character_trait_score' and s.entity_id=ts.id
      )),
      'release_ready', count(*) filter(where status='published' and verification_status='verified' and (
        source_id is not null or exists(select 1 from source_links s where s.entity_type='character_trait_score' and s.entity_id=ts.id)
      ))
    ) from public.character_trait_scores ts),
    'players', (select jsonb_build_object(
      'published', count(*) filter(where status='published'),
      'draft', count(*) filter(where status='draft'),
      'sourced', count(*) filter(where exists(select 1 from source_links s where s.entity_type='player' and s.entity_id=p.id))
    ) from public.players p),
    'videos', (select jsonb_build_object(
      'published', count(*) filter(where status='published'),
      'draft', count(*) filter(where status='draft'),
      'with_character_relation', count(*) filter(where exists(
        select 1 from public.entity_videos ev where ev.video_id=v.id and ev.entity_type='character'
      )),
      'with_source_relation', count(*) filter(where exists(select 1 from source_links s where s.entity_type='video' and s.entity_id=v.id))
    ) from public.videos v),
    'recommendation_ready_candidates', (select count(*) from (
      select character_id
      from public.character_trait_scores ts
      where status='published' and verification_status='verified'
        and (source_id is not null or exists(select 1 from source_links s where s.entity_type='character_trait_score' and s.entity_id=ts.id))
      group by character_id
      having count(distinct trait_id) >= ceil((select count(*) from public.character_traits where status='published') * 0.75)
    ) ready),
    'ai_coach_source_evidence_entities', (select count(distinct (entity_type, entity_id)) from source_links),
    'rls', (select jsonb_build_object(
      'tables', count(*), 'enabled', count(*) filter(where cls.relrowsecurity)
    ) from pg_class cls join pg_namespace ns on ns.oid=cls.relnamespace where ns.nspname='public' and cls.relkind='r')
  ) value
)
select jsonb_build_object(
  'summary', (select value from summary),
  'character_coverage', (select jsonb_agg(to_jsonb(character_coverage) order by name_ja) from character_coverage)
) as phase14_public_readiness;
