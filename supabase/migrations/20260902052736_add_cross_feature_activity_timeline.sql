
create table public.user_activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null
    check (activity_type ~ '^[a-z][a-z0-9_.-]{1,63}$'),
  source_type text not null
    check (source_type ~ '^[a-z][a-z0-9_]{1,63}$'),
  source_id uuid,
  label text not null
    check (char_length(btrim(label)) between 1 and 120),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  occurred_at timestamptz not null default now(),
  retention_until timestamptz not null default (now() + interval '180 days'),
  created_at timestamptz not null default now(),
  constraint user_activity_logs_retention_after_event
    check (retention_until >= occurred_at)
);

comment on table public.user_activity_logs is
  'User-facing cross-feature activity timeline. Entries are retained for 180 days and are written from authoritative source-table triggers.';
comment on column public.user_activity_logs.activity_type is
  'Stable machine key such as diagnosis.completed or training.completed.';
comment on column public.user_activity_logs.source_type is
  'Originating entity type, normally the source table name without the public schema.';
comment on column public.user_activity_logs.label is
  'Short reader-facing Japanese summary captured at event time.';
comment on column public.user_activity_logs.metadata is
  'Small structured facts needed for summaries; free-form private notes are intentionally excluded.';
comment on column public.user_activity_logs.retention_until is
  'Entry becomes invisible to user-facing RPCs after this timestamp and can then be purged by a server-only cleanup job.';

create unique index user_activity_logs_source_event_uidx
  on public.user_activity_logs (user_id, activity_type, source_type, source_id)
  where source_id is not null;

create index user_activity_logs_user_occurred_idx
  on public.user_activity_logs (user_id, occurred_at desc);

create index user_activity_logs_user_type_occurred_idx
  on public.user_activity_logs (user_id, activity_type, occurred_at desc);

create index user_activity_logs_retention_idx
  on public.user_activity_logs (retention_until);

alter table public.user_activity_logs enable row level security;

create policy "users read own activity logs"
  on public.user_activity_logs
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users delete own activity logs"
  on public.user_activity_logs
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.user_activity_logs from public, anon, authenticated;
grant select, delete on table public.user_activity_logs to authenticated;

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
  if tg_table_name = 'diagnosis_results' and tg_op = 'INSERT' then
    v_user_id := new.user_id;
    if v_user_id is null then
      return new;
    end if;
    v_activity_type := 'diagnosis.completed';
    v_source_id := new.id;
    v_label := '診断を完了しました';
    v_occurred_at := new.created_at;
    v_metadata := jsonb_build_object('diagnosis_id', new.diagnosis_id);

  elsif tg_table_name = 'user_match_logs' and tg_op = 'INSERT' then
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

  elsif tg_table_name = 'user_training_logs' and tg_op = 'INSERT' then
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

  elsif tg_table_name = 'coach_quick_help_intakes' and tg_op = 'INSERT' then
    v_user_id := new.user_id;
    v_activity_type := 'quick_help.started';
    v_source_id := new.id;
    v_label := 'クイック相談を開始しました';
    v_occurred_at := new.started_at;
    v_metadata := jsonb_build_object('flow_id', new.flow_id);

  elsif tg_table_name = 'coach_quick_help_intakes' and tg_op = 'UPDATE'
        and old.status is distinct from new.status
        and new.status = 'completed' then
    v_user_id := new.user_id;
    v_activity_type := 'quick_help.completed';
    v_source_id := new.id;
    v_label := 'クイック相談の質問に回答しました';
    v_occurred_at := coalesce(new.completed_at, new.updated_at, now());
    v_metadata := jsonb_strip_nulls(jsonb_build_object(
      'flow_id', new.flow_id,
      'topic_key', new.topic_key
    ));

  elsif tg_table_name = 'coach_quick_help_intakes' and tg_op = 'UPDATE'
        and old.ai_coach_session_id is distinct from new.ai_coach_session_id
        and new.ai_coach_session_id is not null then
    v_user_id := new.user_id;
    v_activity_type := 'quick_help.coach_linked';
    v_source_id := new.id;
    v_label := '相談内容をAIコーチへ引き継ぎました';
    v_occurred_at := coalesce(new.updated_at, now());
    v_metadata := jsonb_strip_nulls(jsonb_build_object(
      'flow_id', new.flow_id,
      'topic_key', new.topic_key,
      'ai_coach_session_id', new.ai_coach_session_id
    ));

  elsif tg_table_name = 'ai_coach_sessions' and tg_op = 'INSERT' then
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

  elsif tg_table_name = 'ai_coach_sessions' and tg_op = 'UPDATE'
        and old.status is distinct from new.status
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

revoke all on function private.capture_user_activity() from public, anon, authenticated;

create trigger capture_diagnosis_activity
  after insert on public.diagnosis_results
  for each row execute function private.capture_user_activity();

create trigger capture_match_activity
  after insert on public.user_match_logs
  for each row execute function private.capture_user_activity();

create trigger capture_training_activity
  after insert on public.user_training_logs
  for each row execute function private.capture_user_activity();

create trigger capture_quick_help_activity
  after insert or update of status, ai_coach_session_id
  on public.coach_quick_help_intakes
  for each row execute function private.capture_user_activity();

create trigger capture_ai_coach_activity
  after insert or update of status
  on public.ai_coach_sessions
  for each row execute function private.capture_user_activity();
