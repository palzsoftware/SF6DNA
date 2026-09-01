-- Phase43: expose a token-gated, read-only character Move glossary so
-- Training list/detail previews can render stored English move names in Japanese.

create or replace function public.get_phase43_character_move_glossary_preview(
  target_character_id uuid,
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
    from public.characters c
    where c.id = target_character_id
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
    from public.moves m
    where m.character_id = target_character_id
      and m.status <> 'archived'
      and nullif(m.name_en, '') is not null
      and nullif(m.name_ja, '') is not null

    union

    select distinct
      a.alias as english,
      m.name_ja as japanese
    from public.moves m
    join public.move_aliases a on a.move_id = m.id
    where m.character_id = target_character_id
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

revoke all on function public.get_phase43_character_move_glossary_preview(uuid, text) from public;
revoke all on function public.get_phase43_character_move_glossary_preview(uuid, text) from authenticated;
grant execute on function public.get_phase43_character_move_glossary_preview(uuid, text) to anon;
