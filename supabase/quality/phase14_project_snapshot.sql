-- SF6DNA Phase14 project quality snapshot
-- Read-only. Supabase実DBを正本としてDashboard再計算時に使用する。

with metrics(metric, value) as (
  select 'characters_playable_published', count(*)::text from public.characters where status='published' and is_playable=true
  union all select 'characters_draft', count(*)::text from public.characters where status='draft'
  union all select 'moves_total', count(*)::text from public.moves where status<>'archived'
  union all select 'moves_published', count(*)::text from public.moves where status='published'
  union all select 'moves_draft', count(*)::text from public.moves where status='draft'
  union all select 'current_frames_total', count(*)::text from public.move_frame_data f join public.moves m on m.id=f.move_id where m.status<>'archived' and f.valid_to_patch_id is null
  union all select 'current_frames_verified', count(*)::text from public.move_frame_data f join public.moves m on m.id=f.move_id where m.status<>'archived' and f.valid_to_patch_id is null and f.verification_status='verified'
  union all select 'current_frames_reviewed', count(*)::text from public.move_frame_data f join public.moves m on m.id=f.move_id where m.status<>'archived' and f.valid_to_patch_id is null and f.verification_status='reviewed'
  union all select 'current_frames_unverified', count(*)::text from public.move_frame_data f join public.moves m on m.id=f.move_id where m.status<>'archived' and f.valid_to_patch_id is null and f.verification_status='unverified'
  union all select 'classic_command_moves', count(distinct c.move_id)::text from public.move_commands c join public.moves m on m.id=c.move_id where m.status<>'archived' and c.control_scheme='classic'
  union all select 'modern_command_moves', count(distinct c.move_id)::text from public.move_commands c join public.moves m on m.id=c.move_id where m.status<>'archived' and c.control_scheme='modern'
  union all select 'move_aliases', count(*)::text from public.move_aliases a join public.moves m on m.id=a.move_id where m.status<>'archived'
  union all select 'combos_total', count(*)::text from public.combos
  union all select 'combos_published_verified', count(*)::text from public.combos where status='published' and verification_status='verified'
  union all select 'setups_total', count(*)::text from public.setups
  union all select 'setups_published_verified', count(*)::text from public.setups where status='published' and verification_status='verified'
  union all select 'sequences_total', count(*)::text from public.sequences
  union all select 'sequences_published_verified', count(*)::text from public.sequences where status='published' and verification_status='verified'
  union all select 'counters_total', count(*)::text from public.counters
  union all select 'counters_published_verified', count(*)::text from public.counters where status='published' and verification_status='verified'
  union all select 'trainings_total', count(*)::text from public.trainings
  union all select 'trainings_published_verified', count(*)::text from public.trainings where status='published' and verification_status='verified'
  union all select 'trait_scores_total', count(*)::text from public.character_trait_scores
  union all select 'trait_scores_published_verified', count(*)::text from public.character_trait_scores where status='published' and verification_status='verified'
  union all select 'trait_score_source_links', count(*)::text from public.entity_sources where entity_type='character_trait_score'
  union all select 'players_published', count(*)::text from public.players where status='published'
  union all select 'players_draft', count(*)::text from public.players where status='draft'
  union all select 'player_source_links', count(*)::text from public.entity_sources where entity_type='player'
  union all select 'videos_published', count(*)::text from public.videos where status='published'
  union all select 'videos_draft', count(*)::text from public.videos where status='draft'
  union all select 'video_source_links', count(*)::text from public.entity_sources where entity_type='video'
  union all select 'diagnoses_published', count(*)::text from public.diagnoses where status='published'
  union all select 'diagnosis_questions_published', count(*)::text from public.diagnosis_questions where status='published'
  union all select 'sources_total', count(*)::text from public.sources
  union all select 'entity_sources_total', count(*)::text from public.entity_sources
  union all select 'public_tables_total', count(*)::text from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r'
  union all select 'public_tables_rls_enabled', count(*)::text from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and c.relrowsecurity
  union all select 'current_patch', coalesce((select version_label from public.patches where is_current=true order by released_at desc nulls last limit 1), 'NONE')
)
select metric, value
from metrics
order by metric;
