-- Phase39: token-gated detail pages for unpublished strategy/training review.
-- Public release gates remain unchanged. This RPC is read-only, runs as the
-- caller, and can only see rows allowed by the existing Phase23 preview RLS.

create or replace function private.is_phase23_device_preview()
returns boolean
language sql
stable
security invoker
set search_path = pg_catalog, public
as $function$
  select
    current_timestamp <= timestamptz '2026-09-06 23:59:59+09'
    and md5(coalesce(current_setting('sf6dna.preview_token', true), '')) in (
      '48c9102d99b9dc573446cfd6ac847aec',
      '9f2e065005e5a1ebc6957b27a1f54285'
    );
$function$;

revoke all on function private.is_phase23_device_preview() from public;
grant execute on function private.is_phase23_device_preview() to anon;

create or replace function public.get_phase39_content_detail_preview(
  target_entity_type text,
  target_entity_slug text,
  preview_token text
)
returns jsonb
language plpgsql
security invoker
set search_path = 'public', 'pg_temp'
as $function$
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
          'id', s.id,
          'title', s.title,
          'url', s.url,
          'publisher', s.publisher,
          'sourceType', s.source_type,
          'relationship', es.relationship
        ) order by s.title, s.id)
        from public.entity_sources es
        join public.sources s on s.id = es.source_id
        where es.entity_type = 'combo'
          and es.entity_id = x.id
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
          'id', s.id,
          'title', s.title,
          'url', s.url,
          'publisher', s.publisher,
          'sourceType', s.source_type,
          'relationship', es.relationship
        ) order by s.title, s.id)
        from public.entity_sources es
        join public.sources s on s.id = es.source_id
        where es.entity_type = 'setup'
          and es.entity_id = x.id
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
          'id', s.id,
          'title', s.title,
          'url', s.url,
          'publisher', s.publisher,
          'sourceType', s.source_type,
          'relationship', es.relationship
        ) order by s.title, s.id)
        from public.entity_sources es
        join public.sources s on s.id = es.source_id
        where es.entity_type = 'sequence'
          and es.entity_id = x.id
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
          'id', s.id,
          'title', s.title,
          'url', s.url,
          'publisher', s.publisher,
          'sourceType', s.source_type,
          'relationship', es.relationship
        ) order by s.title, s.id)
        from public.entity_sources es
        join public.sources s on s.id = es.source_id
        where es.entity_type = 'training'
          and es.entity_id = x.id
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

revoke all on function public.get_phase39_content_detail_preview(text, text, text) from public;
revoke all on function public.get_phase39_content_detail_preview(text, text, text) from authenticated;
grant execute on function public.get_phase39_content_detail_preview(text, text, text) to anon;
