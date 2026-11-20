-- Security P0 (③ Round16): device-preview RPCs read sources only through the public source RPC.
-- get_phase39_content_detail_preview / get_phase42_counter_detail_preview / get_phase44_move_detail_preview
-- are SECURITY INVOKER and read public.entity_sources/public.sources inline. After the anon REVOKE in
-- 20261120120000 those subqueries would fail with 42501 for anon (today RLS already returns 0 source rows).
-- Fix: replace ONLY the 'sources' subqueries with public.get_public_entity_sources(...) (SECURITY DEFINER,
-- returns only publicly allowed sources). Unchanged: SECURITY INVOKER, search_path, preview-token check
-- (private.is_phase23_device_preview), all other output keys, signatures and EXECUTE grants.
-- Sorts before 20261120120000 so the REVOKE never lands while these functions still read the tables.
BEGIN;
SET LOCAL lock_timeout = '5s';

-- Preflight: replace only the exact Production-live definitions (read-only check, 2026-11-20).
DO $preflight$
BEGIN
  IF EXISTS (
    SELECT 1 FROM (VALUES
      ('public.get_phase39_content_detail_preview(text,text,text)', '1d87abdea8b7fffa5675c87c68e03691'),
      ('public.get_phase42_counter_detail_preview(text,text)', '00f3ce03bb11714c466b8b1f805d138b'),
      ('public.get_phase44_move_detail_preview(text,text)', 'f6dd13ccb2ea08e96fa49633567bbd03'),
      ('public.get_public_entity_sources(text[],uuid[])', '47c8f71ddf4331ab28827e1ab11626b1')
    ) AS e(sig, md5_expected)
    LEFT JOIN pg_catalog.pg_proc p ON p.oid = pg_catalog.to_regprocedure(e.sig)
    WHERE p.oid IS NULL
       OR pg_catalog.md5(pg_catalog.replace(pg_catalog.pg_get_functiondef(p.oid), pg_catalog.chr(13), '')) IS DISTINCT FROM e.md5_expected
  ) THEN
    RAISE EXCEPTION 'preview_rpc_definitions_differ_from_production_live: abort';
  END IF;
END;
$preflight$;

CREATE OR REPLACE FUNCTION public.get_phase39_content_detail_preview(target_entity_type text, target_entity_slug text, preview_token text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  if target_entity_type not in ('combo', 'setup', 'sequence', 'training') then
    return null;
  end if;

  if target_entity_type = 'combo' then
    select jsonb_build_object(
      'entityType', 'combo',
      'record', to_jsonb(x),
      'characterName', c.name_ja,
      'patchLabel', (
        select concat_ws(' / ', p.version_label, nullif(p.name, ''))
        from public.patches p
        where p.id = x.valid_from_patch_id
      ),
      'sources', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ps.source_id,
          'title', ps.title,
          'url', ps.url,
          'publisher', ps.publisher,
          'sourceType', ps.source_type,
          'relationship', ps.relationship
        ) order by ps.title, ps.source_id)
        -- Public source boundary: only sources the public RPC exposes (no direct source-table read).
        from public.get_public_entity_sources(array['combo'], array[x.id]) ps
        where ps.entity_type = 'combo'
          and ps.entity_id = x.id
      ), '[]'::jsonb)
    )
    into result
    from public.combos x
    join public.characters c on c.id = x.character_id
    where x.slug = target_entity_slug
      and x.status <> 'archived'
      and c.status = 'published'
      and c.is_playable = true
    limit 1;
  elsif target_entity_type = 'setup' then
    select jsonb_build_object(
      'entityType', 'setup',
      'record', to_jsonb(x),
      'characterName', c.name_ja,
      'patchLabel', (
        select concat_ws(' / ', p.version_label, nullif(p.name, ''))
        from public.patches p
        where p.id = x.valid_from_patch_id
      ),
      'sources', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ps.source_id,
          'title', ps.title,
          'url', ps.url,
          'publisher', ps.publisher,
          'sourceType', ps.source_type,
          'relationship', ps.relationship
        ) order by ps.title, ps.source_id)
        -- Public source boundary: only sources the public RPC exposes (no direct source-table read).
        from public.get_public_entity_sources(array['setup'], array[x.id]) ps
        where ps.entity_type = 'setup'
          and ps.entity_id = x.id
      ), '[]'::jsonb)
    )
    into result
    from public.setups x
    join public.characters c on c.id = x.character_id
    where x.slug = target_entity_slug
      and x.status <> 'archived'
      and c.status = 'published'
      and c.is_playable = true
    limit 1;
  elsif target_entity_type = 'sequence' then
    select jsonb_build_object(
      'entityType', 'sequence',
      'record', to_jsonb(x),
      'characterName', c.name_ja,
      'patchLabel', (
        select concat_ws(' / ', p.version_label, nullif(p.name, ''))
        from public.patches p
        where p.id = x.valid_from_patch_id
      ),
      'sources', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ps.source_id,
          'title', ps.title,
          'url', ps.url,
          'publisher', ps.publisher,
          'sourceType', ps.source_type,
          'relationship', ps.relationship
        ) order by ps.title, ps.source_id)
        -- Public source boundary: only sources the public RPC exposes (no direct source-table read).
        from public.get_public_entity_sources(array['sequence'], array[x.id]) ps
        where ps.entity_type = 'sequence'
          and ps.entity_id = x.id
      ), '[]'::jsonb)
    )
    into result
    from public.sequences x
    join public.characters c on c.id = x.character_id
    where x.slug = target_entity_slug
      and x.status <> 'archived'
      and c.status = 'published'
      and c.is_playable = true
    limit 1;
  else
    select jsonb_build_object(
      'entityType', 'training',
      'record', to_jsonb(x),
      'characterName', pc.name_ja,
      'dummyCharacterName', dc.name_ja,
      'patchLabel', (
        select concat_ws(' / ', p.version_label, nullif(p.name, ''))
        from public.patches p
        where p.id = x.valid_from_patch_id
      ),
      'sources', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ps.source_id,
          'title', ps.title,
          'url', ps.url,
          'publisher', ps.publisher,
          'sourceType', ps.source_type,
          'relationship', ps.relationship
        ) order by ps.title, ps.source_id)
        -- Public source boundary: only sources the public RPC exposes (no direct source-table read).
        from public.get_public_entity_sources(array['training'], array[x.id]) ps
        where ps.entity_type = 'training'
          and ps.entity_id = x.id
      ), '[]'::jsonb)
    )
    into result
    from public.trainings x
    left join public.characters pc on pc.id = x.player_character_id
    left join public.characters dc on dc.id = x.dummy_character_id
    where x.slug = target_entity_slug
      and x.status <> 'archived'
      and (
        (pc.status = 'published' and pc.is_playable = true)
        or (dc.status = 'published' and dc.is_playable = true)
      )
    limit 1;
  end if;

  return result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_phase42_counter_detail_preview(target_counter_slug text, preview_token text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  select jsonb_build_object(
    'entityType', 'counter',
    'record', to_jsonb(x),
    'characterName', dc.name_ja,
    'opponentCharacterName', oc.name_ja,
    'patchLabel', (
      select concat_ws(' / ', p.version_label, nullif(p.name, ''))
      from public.patches p
      where p.id = x.valid_from_patch_id
    ),
    'moveGlossary', coalesce((
      with raw_terms as (
        select
          regexp_replace(m.name_en, '<br.*$', '', 'i') as english,
          m.name_ja as japanese
        from public.moves m
        where m.character_id in (x.defender_character_id, x.opponent_character_id)
          and m.status <> 'archived'
          and nullif(m.name_en, '') is not null
          and nullif(m.name_ja, '') is not null

        union

        select
          a.alias as english,
          m.name_ja as japanese
        from public.moves m
        join public.move_aliases a on a.move_id = m.id
        where m.character_id in (x.defender_character_id, x.opponent_character_id)
          and m.status <> 'archived'
          and nullif(a.alias, '') is not null
          and nullif(m.name_ja, '') is not null
          and a.alias ~ '[A-Za-z]'
      ), unique_terms as (
        select english, min(japanese) as japanese
        from raw_terms
        where nullif(english, '') is not null
          and nullif(japanese, '') is not null
        group by english
        having count(distinct japanese) = 1
      )
      select jsonb_agg(
        jsonb_build_object('english', english, 'japanese', japanese)
        order by length(english) desc, english, japanese
      )
      from unique_terms
    ), '[]'::jsonb),
    'sources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ps.source_id,
        'title', ps.title,
        'url', ps.url,
        'publisher', ps.publisher,
        'sourceType', ps.source_type,
        'relationship', ps.relationship
      ) order by ps.title, ps.source_id)
      -- Public source boundary: only sources the public RPC exposes (no direct source-table read).
      from public.get_public_entity_sources(array['counter'], array[x.id]) ps
      where ps.entity_type = 'counter'
        and ps.entity_id = x.id
    ), '[]'::jsonb)
  )
  into result
  from public.counters x
  left join public.characters dc on dc.id = x.defender_character_id
  left join public.characters oc on oc.id = x.opponent_character_id
  where x.slug = target_counter_slug
    and x.status <> 'archived'
    and (dc.id is not null or oc.id is not null)
    and (dc.id is null or (dc.status = 'published' and dc.is_playable = true))
    and (oc.id is null or (oc.status = 'published' and oc.is_playable = true))
  limit 1;

  return result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_phase44_move_detail_preview(target_move_slug text, preview_token text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  select jsonb_build_object(
    'entityType', 'move',
    'record', to_jsonb(m),
    'characterName', c.name_ja,
    'patchLabel', (
      select concat_ws(' / ', p.version_label, nullif(p.name, ''))
      from public.patches p
      where p.id = f.valid_from_patch_id
    ),
    'commands', coalesce((
      select jsonb_agg(jsonb_build_object(
        'scheme', mc.control_scheme,
        'commandText', mc.command_text,
        'numericNotation', mc.numeric_notation,
        'buttonNotation', mc.button_notation,
        'conditionText', mc.condition_text,
        'sortOrder', mc.sort_order
      ) order by mc.sort_order, mc.id)
      from public.move_commands mc
      where mc.move_id = m.id
    ), '[]'::jsonb),
    'frame', case when f.id is null then null else to_jsonb(f) end,
    'sources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ps.source_id,
        'title', ps.title,
        'url', ps.url,
        'publisher', ps.publisher,
        'sourceType', ps.source_type,
        'relationship', ps.relationship
      ) order by ps.title, ps.source_id)
      -- Public source boundary: only sources the public RPC exposes (no direct source-table read).
      from public.get_public_entity_sources(array['move', 'frame', 'move_frame_data'], array_remove(array[m.id, f.id], null)) ps
      where (ps.entity_type = 'move' and ps.entity_id = m.id)
         or (f.id is not null and ps.entity_type in ('frame', 'move_frame_data') and ps.entity_id = f.id)
    ), '[]'::jsonb)
  )
  into result
  from public.moves m
  join public.characters c on c.id = m.character_id
  left join lateral (
    select mf.*
    from public.move_frame_data mf
    where mf.move_id = m.id
      and mf.valid_to_patch_id is null
    order by case mf.verification_status
      when 'verified' then 1
      when 'reviewed' then 2
      else 3
    end, mf.updated_at desc
    limit 1
  ) f on true
  where m.slug = target_move_slug
    and m.status <> 'archived'
    and c.status = 'published'
    and c.is_playable = true
  limit 1;

  return result;
end;
$function$;

DO $postcondition$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_proc p
    WHERE p.oid IN ('public.get_phase39_content_detail_preview(text,text,text)'::regprocedure,
                    'public.get_phase42_counter_detail_preview(text,text)'::regprocedure,
                    'public.get_phase44_move_detail_preview(text,text)'::regprocedure)
      AND (p.prosecdef
        OR pg_catalog.pg_get_functiondef(p.oid) ~ '(public\.entity_sources|public\.sources)([^_a-z]|$)'
        OR pg_catalog.pg_get_functiondef(p.oid) !~ 'private\.is_phase23_device_preview\(\)'
        OR pg_catalog.has_function_privilege('authenticated', p.oid, 'EXECUTE')
        OR NOT pg_catalog.has_function_privilege('anon', p.oid, 'EXECUTE'))
  ) THEN
    RAISE EXCEPTION 'preview_rpc_source_boundary_not_applied: rollback';
  END IF;
END;
$postcondition$;
COMMIT;
