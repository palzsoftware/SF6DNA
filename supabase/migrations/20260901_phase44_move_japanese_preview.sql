-- Phase44: token-gated Move detail review for unpublished frame data.
-- The function is read-only, runs as the caller, and reuses the existing
-- Preview token/RLS boundary. Public Move release gates are unchanged.

create or replace function public.get_phase44_move_detail_preview(
  target_move_slug text,
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
        'id', s.id,
        'title', s.title,
        'url', s.url,
        'publisher', s.publisher,
        'sourceType', s.source_type,
        'relationship', es.relationship
      ) order by s.title, s.id)
      from public.entity_sources es
      join public.sources s on s.id = es.source_id
      where (es.entity_type = 'move' and es.entity_id = m.id)
         or (f.id is not null and es.entity_type in ('frame', 'move_frame_data') and es.entity_id = f.id)
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

revoke all on function public.get_phase44_move_detail_preview(text, text) from public;
revoke all on function public.get_phase44_move_detail_preview(text, text) from authenticated;
grant execute on function public.get_phase44_move_detail_preview(text, text) to anon;
