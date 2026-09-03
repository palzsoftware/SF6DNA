
create or replace function private.capture_user_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_activity_type text;
  v_source_type text := tg_table_name;
  v_source_id uuid;
  v_label text;
  v_metadata jsonb := '{}'::jsonb;
  v_occurred_at timestamptz := now();
begin
  if tg_table_name = 'diagnosis_results' then
    if tg_op <> 'INSERT' then
      return new;
    end if;

    v_user_id := new.user_id;
    if v_user_id is null then
      return new;
    end if;
    v_activity_type := 'diagnosis.completed';
    v_source_id := new.id;
    v_label := '診断を完了しました';
    v_occurred_at := new.created_at;
    v_metadata := jsonb_build_object('diagnosis_id', new.diagnosis_id);

  elsif tg_table_name = 'user_match_logs' then
    if tg_op <> 'INSERT' then
      return new;
    end if;

    v_user_id := new.user_id;
    v_activity_type := 'match.logged';
    v_source_id := new.id;
    v_label := '対戦結果を記録しました';
    v_occurred_at := new.played_at;
    v_metadata := jsonb_strip_nulls(jsonb_build_object(
      'result', new.result,
      'mode', new.mode,
      'primary_issue', new.primary_issue,
      'player_character_id', new.player_character_id,
      'opponent_character_id', new.opponent_character_id
    ));

  elsif tg_table_name = 'user_training_logs' then
    if tg_op <> 'INSERT' then
      return new;
    end if;

    v_user_id := new.user_id;
    v_activity_type := 'training.completed';
    v_source_id := new.id;
    v_label := '練習を完了しました';
    v_occurred_at := new.practiced_at;
    v_metadata := jsonb_strip_nulls(jsonb_build_object(
      'duration_minutes', new.duration_minutes,
      'training_id', new.training_id,
      'training_plan_id', new.training_plan_id,
      'attempts', new.attempts,
      'successes', new.successes,
      'self_rating', new.self_rating
    ));

  elsif tg_table_name = 'coach_quick_help_intakes' then
    if tg_op = 'INSERT' then
      v_user_id := new.user_id;
      v_activity_type := 'quick_help.started';
      v_source_id := new.id;
      v_label := 'クイック相談を開始しました';
      v_occurred_at := new.started_at;
      v_metadata := jsonb_build_object('flow_id', new.flow_id);

    elsif tg_op = 'UPDATE' then
      if old.status is distinct from new.status
         and new.status = 'completed' then
        insert into public.user_activity_logs (
          user_id, activity_type, source_type, source_id,
          label, metadata, occurred_at, retention_until
        )
        values (
          new.user_id,
          'quick_help.completed',
          tg_table_name,
          new.id,
          'クイック相談の質問に回答しました',
          jsonb_strip_nulls(jsonb_build_object(
            'flow_id', new.flow_id,
            'topic_key', new.topic_key
          )),
          coalesce(new.completed_at, new.updated_at, now()),
          coalesce(new.completed_at, new.updated_at, now()) + interval '180 days'
        )
        on conflict (user_id, activity_type, source_type, source_id)
          where source_id is not null
        do nothing;
      end if;

      if old.ai_coach_session_id is distinct from new.ai_coach_session_id
         and new.ai_coach_session_id is not null then
        insert into public.user_activity_logs (
          user_id, activity_type, source_type, source_id,
          label, metadata, occurred_at, retention_until
        )
        values (
          new.user_id,
          'quick_help.coach_linked',
          tg_table_name,
          new.id,
          '相談内容をAIコーチへ引き継ぎました',
          jsonb_strip_nulls(jsonb_build_object(
            'flow_id', new.flow_id,
            'topic_key', new.topic_key,
            'ai_coach_session_id', new.ai_coach_session_id
          )),
          coalesce(new.updated_at, now()),
          coalesce(new.updated_at, now()) + interval '180 days'
        )
        on conflict (user_id, activity_type, source_type, source_id)
          where source_id is not null
        do nothing;
      end if;

      return new;
    else
      return new;
    end if;

  elsif tg_table_name = 'ai_coach_sessions' then
    if tg_op = 'INSERT' then
      v_user_id := new.user_id;
      v_activity_type := 'ai_coach.session_started';
      v_source_id := new.id;
      v_label := 'AIコーチへの相談を開始しました';
      v_occurred_at := new.created_at;
      v_metadata := jsonb_strip_nulls(jsonb_build_object(
        'coach_tone', new.coach_tone,
        'character_id', new.character_id,
        'diagnosis_result_id', new.diagnosis_result_id
      ));

    elsif tg_op = 'UPDATE' then
      if old.status is distinct from new.status
         and new.status = 'archived' then
        v_user_id := new.user_id;
        v_activity_type := 'ai_coach.session_archived';
        v_source_id := new.id;
        v_label := 'AIコーチへの相談を終了しました';
        v_occurred_at := coalesce(new.updated_at, now());
        v_metadata := jsonb_strip_nulls(jsonb_build_object(
          'coach_tone', new.coach_tone,
          'character_id', new.character_id
        ));
      else
        return new;
      end if;
    else
      return new;
    end if;

  else
    return new;
  end if;

  insert into public.user_activity_logs (
    user_id,
    activity_type,
    source_type,
    source_id,
    label,
    metadata,
    occurred_at,
    retention_until
  )
  values (
    v_user_id,
    v_activity_type,
    v_source_type,
    v_source_id,
    v_label,
    v_metadata,
    v_occurred_at,
    v_occurred_at + interval '180 days'
  )
  on conflict (user_id, activity_type, source_type, source_id)
    where source_id is not null
  do nothing;

  return new;
end;
$$;

revoke all on function private.capture_user_activity()
  from public, anon, authenticated;
