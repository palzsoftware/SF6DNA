
create function public.save_diagnosis_result_with_answers(
  p_diagnosis_id uuid,
  p_result_payload jsonb,
  p_answers jsonb
)
returns uuid
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_expected_count integer;
  v_answer_count integer;
  v_valid_count integer;
  v_result_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  if jsonb_typeof(p_answers) <> 'array' then
    raise exception 'answers_must_be_array';
  end if;

  select count(*)
    into v_expected_count
  from public.diagnosis_questions q
  where q.diagnosis_id = p_diagnosis_id
    and q.status = 'published';

  if v_expected_count = 0 then
    raise exception 'diagnosis_not_available';
  end if;

  select count(*)
    into v_answer_count
  from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid);

  if v_answer_count <> v_expected_count then
    raise exception 'answer_count_mismatch';
  end if;

  select count(*)
    into v_valid_count
  from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid)
  join public.diagnosis_questions q
    on q.id = a.question_id
   and q.diagnosis_id = p_diagnosis_id
   and q.status = 'published'
  join public.diagnosis_options o
    on o.id = a.option_id
   and o.question_id = a.question_id;

  if v_valid_count <> v_expected_count then
    raise exception 'invalid_question_or_option';
  end if;

  if (
    select count(distinct a.question_id)
    from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid)
  ) <> v_expected_count then
    raise exception 'duplicate_question_answer';
  end if;

  insert into public.diagnosis_results(user_id, diagnosis_id, result_payload)
  values (v_user_id, p_diagnosis_id, coalesce(p_result_payload, '{}'::jsonb))
  returning id into v_result_id;

  insert into public.diagnosis_answers(
    diagnosis_result_id,
    diagnosis_id,
    question_id,
    option_id
  )
  select
    v_result_id,
    p_diagnosis_id,
    a.question_id,
    a.option_id
  from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid);

  return v_result_id;
end;
$$;

revoke all on function public.save_diagnosis_result_with_answers(uuid, jsonb, jsonb) from public;
grant execute on function public.save_diagnosis_result_with_answers(uuid, jsonb, jsonb) to authenticated;

create function public.get_improvement_priorities(
  p_diagnosis_result_id uuid,
  p_limit integer default 3
)
returns table (
  priority_order bigint,
  focus_key text,
  focus_label text,
  score integer
)
language sql
stable
security invoker
set search_path = ''
as $$
  with scores as (
    select
      e.key as focus_key,
      sum((e.value #>> '{}')::integer)::integer as score
    from public.diagnosis_results r
    join public.diagnoses d
      on d.id = r.diagnosis_id
     and d.diagnosis_type = 'improvement'
    join public.diagnosis_answers a
      on a.diagnosis_result_id = r.id
    join public.diagnosis_options o
      on o.id = a.option_id
    cross join lateral jsonb_each(o.score_payload) e
    where r.id = p_diagnosis_result_id
    group by e.key
  ),
  ranked as (
    select
      row_number() over(order by score desc, focus_key) as priority_order,
      focus_key,
      case focus_key
        when 'anti_air' then '対空'
        when 'drive_rush_defense' then 'ドライブラッシュへの対応'
        when 'impact_response' then 'ドライブインパクトへの対応'
        when 'punish' then '確定反撃'
        when 'defense' then '防御の使い分け'
        when 'offense' then '攻めの組み立て'
        when 'meter' then 'ゲージ管理'
        when 'matchup' then 'キャラクター対策'
        when 'execution' then 'コンボと操作の安定'
        when 'neutral' then '中距離と差し合い'
        when 'corner_defense' then '画面端からの脱出'
        when 'decision' then '観察と判断'
        else focus_key
      end as focus_label,
      score
    from scores
  )
  select priority_order, focus_key, focus_label, score
  from ranked
  order by priority_order
  limit least(greatest(coalesce(p_limit, 3), 1), 12)
$$;

revoke all on function public.get_improvement_priorities(uuid, integer) from public;
grant execute on function public.get_improvement_priorities(uuid, integer) to authenticated;

create function public.get_training_recommendations_for_result(
  p_diagnosis_result_id uuid,
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
  select rec.*
  from public.get_training_recommendations(
    array(
      select p.focus_key
      from public.get_improvement_priorities(p_diagnosis_result_id, 3) p
      order by p.priority_order
    ),
    p_character_id,
    p_opponent_character_id,
    p_limit
  ) rec
$$;

revoke all on function public.get_training_recommendations_for_result(uuid, uuid, uuid, integer) from public;
grant execute on function public.get_training_recommendations_for_result(uuid, uuid, uuid, integer) to authenticated;

create function public.get_ai_coach_context(
  p_recent_match_limit integer default 20,
  p_recent_training_limit integer default 20
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'game_profile', (
      select to_jsonb(gp)
      from public.user_game_profiles gp
      where gp.user_id = (select auth.uid())
    ),
    'latest_diagnosis', (
      select jsonb_build_object(
        'id', r.id,
        'diagnosis_id', r.diagnosis_id,
        'diagnosis_title', d.title,
        'diagnosis_type', d.diagnosis_type,
        'result_payload', r.result_payload,
        'created_at', r.created_at
      )
      from public.diagnosis_results r
      join public.diagnoses d on d.id = r.diagnosis_id
      where r.user_id = (select auth.uid())
      order by r.created_at desc
      limit 1
    ),
    'recent_matches', coalesce((
      select jsonb_agg(to_jsonb(m) order by m.played_at desc)
      from (
        select *
        from public.user_match_logs
        where user_id = (select auth.uid())
        order by played_at desc
        limit least(greatest(coalesce(p_recent_match_limit, 20), 1), 50)
      ) m
    ), '[]'::jsonb),
    'recent_training', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.practiced_at desc)
      from (
        select *
        from public.user_training_logs
        where user_id = (select auth.uid())
        order by practiced_at desc
        limit least(greatest(coalesce(p_recent_training_limit, 20), 1), 50)
      ) t
    ), '[]'::jsonb),
    'active_training_plans', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.priority, p.created_at desc)
      from (
        select *
        from public.user_training_plans
        where user_id = (select auth.uid())
          and status in ('planned', 'in_progress')
        order by priority, created_at desc
        limit 20
      ) p
    ), '[]'::jsonb)
  )
$$;

revoke all on function public.get_ai_coach_context(integer, integer) from public;
grant execute on function public.get_ai_coach_context(integer, integer) to authenticated;
