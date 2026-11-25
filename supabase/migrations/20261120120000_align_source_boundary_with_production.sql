-- CANDIDATE (Claude Code③ + ①), 2026-11-20, unified in ① Round13 (preflight added). NOT applied to Dev/Prod. NOT committed.
-- Purpose: bring the Git migration chain to Production's live Source boundary and close the
-- Supabase default-privilege gap, so a rebuild from Git cannot regress the public boundary.
--  1) private.is_public_source_target / public.get_public_entity_sources:
--     exact bodies of Prod migration 20260916060806_fix_public_source_boundary (absent from Git).
--  2) public.list_public_sources: exact LIVE Prod body (adds the entity_sources/is_public_source_target
--     filter that Prod received outside any recorded migration).
--  3) ① PROD_SOURCE_GRANT_ALIGN: Supabase default privileges grant anon/authenticated ALL on new
--     public tables; repo never revoked them on sources/entity_sources.
-- Idempotent: CREATE OR REPLACE + REVOKE. On Production it is a no-op for the functions
-- (identical MD5) and only tightens table grants. Does not re-apply any older migration.
-- Postconditions abort the transaction if the result differs from Production's live MD5s.
BEGIN;
SET LOCAL lock_timeout = '5s';

-- Preflight (added on integration): only run on a chain whose source boundary is the known
-- repo baseline or a Production state. Dev has its own narrower list_public_sources and must
-- not be widened by this migration, so any other definition aborts.
DO $preflight$
BEGIN
  IF pg_catalog.md5(pg_catalog.replace(pg_catalog.pg_get_functiondef('public.list_public_sources()'::pg_catalog.regprocedure), pg_catalog.chr(13), ''))
     NOT IN ('e2b75ff97258beda9d5381cfa80f6d78', '76d54f0a4859a2741ac842ab6bc09000', 'fed3d8a2932bb6320ef47734d2f87d6a') THEN
    RAISE EXCEPTION 'source_boundary_baseline_unknown (Dev or manual change): abort';
  END IF;
END;
$preflight$;

CREATE OR REPLACE FUNCTION private.is_public_source_target(target_entity_type text, target_entity_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'private'
AS $function$
begin
  case target_entity_type

    when 'character' then
      return exists (
        select 1
        from public.characters c
        where c.id = target_entity_id
          and c.status = 'published'
          and c.is_playable = true
      );

    when 'character_trait_score' then
      return private.is_character_trait_score_public_ready(target_entity_id);

    when 'move' then
      return exists (
        select 1
        from public.moves m
        where m.id = target_entity_id
          and m.status = 'published'
          and private.is_move_public_ready(m.id)
      );

    when 'move_command' then
      return exists (
        select 1
        from public.move_commands mc
        join public.moves m on m.id = mc.move_id
        where mc.id = target_entity_id
          and m.status = 'published'
          and private.is_move_public_ready(m.id)
      );

    when 'frame' then
      return exists (
        select 1
        from public.move_frame_data mfd
        join public.moves m on m.id = mfd.move_id
        where mfd.id = target_entity_id
          and mfd.verification_status = 'verified'
          and mfd.valid_to_patch_id is null
          and m.status = 'published'
          and private.is_move_public_ready(m.id)
      );

    when 'move_frame_data' then
      return exists (
        select 1
        from public.move_frame_data mfd
        join public.moves m on m.id = mfd.move_id
        where mfd.id = target_entity_id
          and mfd.verification_status = 'verified'
          and mfd.valid_to_patch_id is null
          and m.status = 'published'
          and private.is_move_public_ready(m.id)
      );

    when 'combo' then
      return private.is_combo_public_ready(target_entity_id);

    when 'setup' then
      return private.is_setup_public_ready(target_entity_id);

    when 'sequence' then
      return private.is_sequence_public_ready(target_entity_id);

    when 'counter' then
      return private.is_counter_public_ready(target_entity_id);

    when 'training' then
      return private.is_training_public_ready(target_entity_id);

    when 'player' then
      return exists (
        select 1
        from public.players p
        where p.id = target_entity_id
          and p.status = 'published'
      );

    when 'video' then
      return exists (
        select 1
        from public.videos v
        where v.id = target_entity_id
          and v.status = 'published'
      );

    else
      -- Unknown polymorphic entity types are private by default.
      return false;
  end case;
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_public_entity_sources(target_entity_types text[] DEFAULT NULL::text[], target_entity_ids uuid[] DEFAULT NULL::uuid[])
 RETURNS TABLE(entity_type text, entity_id uuid, source_id uuid, relationship text, title text, url text, source_type text, publisher text, published_at timestamp with time zone, accessed_at timestamp with time zone, reliability_level text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'private'
AS $function$
  select
    es.entity_type,
    es.entity_id,
    es.source_id,
    es.relationship,
    s.title,
    s.url,
    s.source_type,
    s.publisher,
    s.published_at,
    s.accessed_at,
    s.reliability_level
  from public.entity_sources es
  join public.sources s
    on s.id = es.source_id
  where
    (
      target_entity_types is null
      or es.entity_type = any(target_entity_types)
    )
    and (
      target_entity_ids is null
      or es.entity_id = any(target_entity_ids)
    )
    and s.reliability_level in ('official', 'primary', 'secondary', 'community')
    and s.source_type in (
      'article', 'character_guide', 'community',
      'community_aggregator', 'community_article', 'community_combo_database',
      'community_discussion', 'community_frame_database', 'community_guide',
      'community_structured_data', 'community_video', 'community_wiki',
      'frame_data', 'frame_database', 'guide',
      'official', 'official_esports_release', 'official_frame_data',
      'official_movelist', 'official_patch', 'official_patch_notes',
      'official_store', 'official_store_news', 'official_video',
      'player_database', 'player_reference', 'social_post',
      'strategy', 'strategy_guide', 'structured_dataset',
      'tournament_report', 'video', 'video_guide',
      'video_playlist'
    )
    and private.is_public_source_target(es.entity_type, es.entity_id);
$function$;

CREATE OR REPLACE FUNCTION public.list_public_sources()
 RETURNS TABLE(id uuid, title text, url text, source_type text, publisher text, published_at timestamp with time zone, accessed_at timestamp with time zone, reliability_level text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'private'
AS $function$
  select
    s.id, s.title, s.url, s.source_type, s.publisher,
    s.published_at, s.accessed_at, s.reliability_level
  from public.sources s
  where s.reliability_level in ('official', 'primary', 'secondary', 'community')
    and s.source_type in (
      'article', 'character_guide', 'community',
      'community_aggregator', 'community_article', 'community_combo_database',
      'community_discussion', 'community_frame_database', 'community_guide',
      'community_structured_data', 'community_video', 'community_wiki',
      'frame_data', 'frame_database', 'guide',
      'official', 'official_esports_release', 'official_frame_data',
      'official_movelist', 'official_patch', 'official_patch_notes',
      'official_store', 'official_store_news', 'official_video',
      'player_database', 'player_reference', 'social_post',
      'strategy', 'strategy_guide', 'structured_dataset',
      'tournament_report', 'video', 'video_guide', 'video_playlist'
    )
    and exists (
      select 1 from public.entity_sources es
      where es.source_id = s.id
        and private.is_public_source_target(es.entity_type, es.entity_id)
    );
$function$;

-- ③ Round16 safety precondition: never revoke while a policy still reads the source tables as the caller
-- (20261120115000 / 20261120116000 must have moved move_commands and the 3 preview RPCs off direct source reads).
DO $policy_precondition$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p
    WHERE p.polrelid = 'public.move_commands'::regclass
      AND pg_catalog.pg_get_expr(p.polqual, p.polrelid) ~ '(^|[^_a-z])(entity_sources|sources)([^_a-z]|$)'
  ) THEN
    RAISE EXCEPTION 'move_commands_policy_reads_source_tables_inline: apply 20261120115000 first';
  END IF;
  -- 2026-11-25: any other public policy reading the source tables as the caller (combos, setups, sequences,
  -- counters, trainings were missed before) would make anonymous /search fail after the REVOKE below.
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p
    JOIN pg_catalog.pg_class c ON c.oid = p.polrelid
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND pg_catalog.pg_get_expr(p.polqual, p.polrelid) ~ '(^|[^_a-z])(entity_sources|sources)([^_a-z]|$)'
  ) THEN
    RAISE EXCEPTION 'public_policy_reads_source_tables_inline: apply 20261120117000 first';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_proc p
    WHERE p.oid IN (pg_catalog.to_regprocedure('public.get_phase39_content_detail_preview(text,text,text)'),
                    pg_catalog.to_regprocedure('public.get_phase42_counter_detail_preview(text,text)'),
                    pg_catalog.to_regprocedure('public.get_phase44_move_detail_preview(text,text)'))
      AND NOT p.prosecdef
      AND pg_catalog.pg_get_functiondef(p.oid) ~ '(public\.entity_sources|public\.sources)([^_a-z]|$)'
  ) THEN
    RAISE EXCEPTION 'preview_rpcs_read_source_tables_inline: apply 20261120116000 first';
  END IF;
END;
$policy_precondition$;

-- ① Round10 PROD_SOURCE_GRANT_ALIGN (verbatim intent): table access only via the RPCs above.
REVOKE ALL ON TABLE public.sources, public.entity_sources FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON TABLE public.sources, public.entity_sources FROM authenticated;

DO $postcondition$
BEGIN
  IF EXISTS (
    SELECT 1 FROM (VALUES
      ('private.is_public_source_target(text,uuid)', '6d0e1941a49a84495d1b43ef4b728f06'),
      ('public.get_public_entity_sources(text[],uuid[])', '47c8f71ddf4331ab28827e1ab11626b1'),
      ('public.list_public_sources()', 'fed3d8a2932bb6320ef47734d2f87d6a')
    ) AS e(sig, md5_expected)
    LEFT JOIN pg_catalog.pg_proc p ON p.oid = pg_catalog.to_regprocedure(e.sig)
    WHERE p.oid IS NULL
       OR pg_catalog.md5(pg_catalog.replace(pg_catalog.pg_get_functiondef(p.oid), pg_catalog.chr(13), '')) IS DISTINCT FROM e.md5_expected
       OR p.prosecdef IS DISTINCT FROM true
  ) THEN
    RAISE EXCEPTION 'source_boundary_not_equal_to_production_live: rollback';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.role_table_grants
    WHERE table_schema = 'public' AND table_name IN ('sources','entity_sources') AND grantee = 'anon'
  ) THEN
    RAISE EXCEPTION 'source_tables_still_granted_to_anon: rollback';
  END IF;
END;
$postcondition$;

COMMIT;
