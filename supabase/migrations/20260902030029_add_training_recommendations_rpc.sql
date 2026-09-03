
create function public.get_training_recommendations(
  p_focus_keys text[],
  p_character_id uuid default null,
  p_opponent_character_id uuid default null,
  p_limit integer default 3
)
returns table (
  focus_key text,
  focus_label text,
  training_id uuid,
  training_name text,
  training_type text,
  purpose text,
  level text,
  duration_minutes integer,
  player_character_id uuid,
  dummy_character_id uuid,
  method text,
  success_criteria text,
  recommended_reps integer,
  next_step text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    r.focus_key,
    r.label,
    t.id,
    t.name,
    t.training_type,
    t.purpose,
    t.level,
    t.duration_minutes,
    t.player_character_id,
    t.dummy_character_id,
    t.method,
    t.success_criteria,
    t.recommended_reps,
    t.next_step
  from public.diagnosis_focus_rules r
  join public.trainings t
    on t.training_type = any(r.training_types)
  where r.status = 'published'
    and coalesce(cardinality(p_focus_keys), 0) between 1 and 3
    and r.focus_key = any(p_focus_keys)
    and (
      t.player_character_id is null
      or t.player_character_id = p_character_id
    )
    and (
      t.dummy_character_id is null
      or t.dummy_character_id = p_opponent_character_id
    )
  order by
    array_position(p_focus_keys, r.focus_key),
    case when t.player_character_id = p_character_id then 0 else 1 end,
    case when t.dummy_character_id = p_opponent_character_id then 0 else 1 end,
    array_position(r.training_types, t.training_type),
    t.created_at,
    t.id
  limit least(greatest(coalesce(p_limit, 3), 1), 12)
$$;

revoke all on function public.get_training_recommendations(text[], uuid, uuid, integer) from public;
grant execute on function public.get_training_recommendations(text[], uuid, uuid, integer) to anon, authenticated;
