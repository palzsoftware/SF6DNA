-- Phase42: token-gated Counter detail Preview with natural Japanese display support.
-- The RPC is read-only, uses caller privileges, and leaves public release gates unchanged.

create or replace function public.get_phase42_counter_detail_preview(
  target_counter_slug text,
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
        'id', s.id,
        'title', s.title,
        'url', s.url,
        'publisher', s.publisher,
        'sourceType', s.source_type,
        'relationship', es.relationship
      ) order by s.title, s.id)
      from public.entity_sources es
      join public.sources s on s.id = es.source_id
      where es.entity_type = 'counter'
        and es.entity_id = x.id
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

revoke all on function public.get_phase42_counter_detail_preview(text, text) from public;
revoke all on function public.get_phase42_counter_detail_preview(text, text) from authenticated;
grant execute on function public.get_phase42_counter_detail_preview(text, text) to anon;
