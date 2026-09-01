-- Phase40: provide the Preview server with character-scoped English-to-Japanese
-- Move terms so Combo descriptions can be localized without rewriting source data.

create or replace function public.get_phase40_combo_move_glossary_preview(
  target_combo_slug text,
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

  if not exists (
    select 1
    from public.combos x
    join public.characters c on c.id = x.character_id
    where x.slug = target_combo_slug
      and x.status <> 'archived'
      and c.status = 'published'
      and c.is_playable = true
  ) then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object('english', terms.english, 'japanese', terms.japanese)
      order by length(terms.english) desc, terms.english, terms.japanese
    ),
    '[]'::jsonb
  )
  into result
  from (
    select distinct
      regexp_replace(m.name_en, '<br.*$', '', 'i') as english,
      m.name_ja as japanese
    from public.combos x
    join public.moves m on m.character_id = x.character_id
    where x.slug = target_combo_slug
      and x.status <> 'archived'
      and m.status <> 'archived'
      and nullif(m.name_en, '') is not null
      and nullif(m.name_ja, '') is not null

    union

    select distinct
      a.alias as english,
      m.name_ja as japanese
    from public.combos x
    join public.moves m on m.character_id = x.character_id
    join public.move_aliases a on a.move_id = m.id
    where x.slug = target_combo_slug
      and x.status <> 'archived'
      and m.status <> 'archived'
      and nullif(a.alias, '') is not null
      and nullif(m.name_ja, '') is not null
      and a.alias ~ '[A-Za-z]'
  ) terms
  where nullif(terms.english, '') is not null
    and nullif(terms.japanese, '') is not null;

  return result;
end;
$function$;

revoke all on function public.get_phase40_combo_move_glossary_preview(text, text) from public;
revoke all on function public.get_phase40_combo_move_glossary_preview(text, text) from authenticated;
grant execute on function public.get_phase40_combo_move_glossary_preview(text, text) to anon;
