-- SF6DNA: diagnosis -> training -> logs -> AI coach foundation
-- Additive only. Existing diagnosis questions, score payloads, publication
-- states, and training verification states are intentionally unchanged.

alter table public.diagnosis_results
  add constraint diagnosis_results_id_diagnosis_id_key
  unique (id, diagnosis_id);

alter table public.diagnosis_questions
  add constraint diagnosis_questions_diagnosis_id_id_key
  unique (diagnosis_id, id);

alter table public.diagnosis_options
  add constraint diagnosis_options_question_id_id_key
  unique (question_id, id);

create table public.diagnosis_focus_rules (
  focus_key text primary key,
  label text not null,
  training_types text[] not null,
  default_duration_minutes smallint not null default 10,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint diagnosis_focus_rules_training_types_not_empty
    check (cardinality(training_types) > 0),
  constraint diagnosis_focus_rules_duration_check
    check (default_duration_minutes between 1 and 180),
  constraint diagnosis_focus_rules_status_check
    check (status in ('draft', 'published', 'archived'))
);

insert into public.diagnosis_focus_rules
  (focus_key, label, training_types, default_duration_minutes, status)
values
  ('anti_air', '対空', array['anti_air', 'zoning_anti_air', 'anti_air_conversion'], 10, 'draft'),
  ('drive_rush_defense', 'ドライブラッシュへの対応', array['reaction_dr', 'reaction'], 10, 'draft'),
  ('impact_response', 'ドライブインパクトへの対応', array['reaction_di', 'reaction'], 10, 'draft'),
  ('punish', '確定反撃', array['punish'], 10, 'draft'),
  ('defense', '防御の使い分け', array['defense', 'defense_throw'], 15, 'draft'),
  ('offense', '攻めの組み立て', array['offense', 'pressure'], 15, 'draft'),
  ('meter', 'ゲージ管理', array['resource_management', 'resource'], 10, 'draft'),
  ('matchup', 'キャラクター対策', array['matchup'], 15, 'draft'),
  ('execution', 'コンボと操作の安定', array['execution', 'combo'], 15, 'draft'),
  ('neutral', '中距離と差し合い', array['neutral', 'footsies', 'spacing'], 15, 'draft'),
  ('corner_defense', '画面端からの脱出', array['corner_escape', 'defense_corner', 'escape'], 15, 'draft'),
  ('decision', '観察と判断', array['decision', 'decision_mixed'], 10, 'draft');

create table public.user_game_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  main_character_id uuid references public.characters(id) on delete set null,
  control_scheme text,
  current_rank text,
  current_mr integer,
  coach_tone text not null default 'analytical',
  weekly_goal_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_game_profiles_control_scheme_check
    check (control_scheme is null or control_scheme in ('classic', 'modern', 'both')),
  constraint user_game_profiles_current_rank_length_check
    check (current_rank is null or char_length(current_rank) between 1 and 80),
  constraint user_game_profiles_current_mr_check
    check (current_mr is null or current_mr between 0 and 9999),
  constraint user_game_profiles_coach_tone_check
    check (coach_tone in ('gentle', 'strict', 'analytical')),
  constraint user_game_profiles_weekly_goal_check
    check (weekly_goal_minutes is null or weekly_goal_minutes between 0 and 10080)
);

create table public.diagnosis_answers (
  id uuid primary key default gen_random_uuid(),
  diagnosis_result_id uuid not null,
  diagnosis_id uuid not null,
  question_id uuid not null,
  option_id uuid not null,
  created_at timestamptz not null default now(),
  constraint diagnosis_answers_result_question_key
    unique (diagnosis_result_id, question_id),
  constraint diagnosis_answers_result_diagnosis_fkey
    foreign key (diagnosis_result_id, diagnosis_id)
    references public.diagnosis_results(id, diagnosis_id)
    on delete cascade,
  constraint diagnosis_answers_diagnosis_question_fkey
    foreign key (diagnosis_id, question_id)
    references public.diagnosis_questions(diagnosis_id, id),
  constraint diagnosis_answers_question_option_fkey
    foreign key (question_id, option_id)
    references public.diagnosis_options(question_id, id)
);

create table public.user_match_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  played_at timestamptz not null default now(),
  player_character_id uuid not null references public.characters(id),
  opponent_character_id uuid not null references public.characters(id),
  result text not null,
  mode text not null default 'ranked',
  rank_before text,
  rank_after text,
  mr_before integer,
  mr_after integer,
  rounds_won smallint,
  rounds_lost smallint,
  primary_issue text not null default 'unknown',
  issue_detail text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_match_logs_result_check
    check (result in ('win', 'loss', 'draw')),
  constraint user_match_logs_mode_check
    check (mode in ('ranked', 'casual', 'custom_room', 'battle_hub', 'offline', 'training', 'other')),
  constraint user_match_logs_mr_before_check
    check (mr_before is null or mr_before between 0 and 9999),
  constraint user_match_logs_mr_after_check
    check (mr_after is null or mr_after between 0 and 9999),
  constraint user_match_logs_rounds_won_check
    check (rounds_won is null or rounds_won between 0 and 99),
  constraint user_match_logs_rounds_lost_check
    check (rounds_lost is null or rounds_lost between 0 and 99),
  constraint user_match_logs_primary_issue_check
    check (primary_issue in ('knowledge', 'execution', 'decision', 'habit', 'matchup', 'unknown')),
  constraint user_match_logs_issue_detail_length_check
    check (issue_detail is null or char_length(issue_detail) <= 500),
  constraint user_match_logs_notes_length_check
    check (notes is null or char_length(notes) <= 2000)
);

create table public.ai_coach_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  coach_tone text not null default 'analytical',
  character_id uuid references public.characters(id) on delete set null,
  diagnosis_result_id uuid references public.diagnosis_results(id) on delete set null,
  status text not null default 'active',
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_coach_sessions_title_length_check
    check (title is null or char_length(title) <= 120),
  constraint ai_coach_sessions_tone_check
    check (coach_tone in ('gentle', 'strict', 'analytical')),
  constraint ai_coach_sessions_status_check
    check (status in ('active', 'archived')),
  constraint ai_coach_sessions_summary_length_check
    check (summary is null or char_length(summary) <= 4000)
);

create table public.user_training_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  training_id uuid not null references public.trainings(id),
  focus_key text not null references public.diagnosis_focus_rules(focus_key),
  source_type text not null,
  source_diagnosis_result_id uuid references public.diagnosis_results(id) on delete cascade,
  source_match_log_id uuid references public.user_match_logs(id) on delete cascade,
  source_coach_session_id uuid references public.ai_coach_sessions(id) on delete cascade,
  priority smallint not null default 3,
  status text not null default 'planned',
  scheduled_for date,
  rationale text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_training_plans_source_type_check
    check (source_type in ('diagnosis', 'match_log', 'ai_coach', 'manual')),
  constraint user_training_plans_source_consistency_check
    check (
      (source_type = 'diagnosis' and source_diagnosis_result_id is not null and source_match_log_id is null and source_coach_session_id is null)
      or (source_type = 'match_log' and source_diagnosis_result_id is null and source_match_log_id is not null and source_coach_session_id is null)
      or (source_type = 'ai_coach' and source_diagnosis_result_id is null and source_match_log_id is null and source_coach_session_id is not null)
      or (source_type = 'manual' and source_diagnosis_result_id is null and source_match_log_id is null and source_coach_session_id is null)
    ),
  constraint user_training_plans_priority_check
    check (priority between 1 and 5),
  constraint user_training_plans_status_check
    check (status in ('planned', 'in_progress', 'completed', 'skipped')),
  constraint user_training_plans_rationale_length_check
    check (rationale is null or char_length(rationale) <= 1000)
);

create table public.user_training_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  training_plan_id uuid references public.user_training_plans(id) on delete set null,
  training_id uuid references public.trainings(id),
  custom_title text,
  practiced_at timestamptz not null default now(),
  duration_minutes integer not null,
  attempts integer,
  successes integer,
  self_rating smallint,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_training_logs_target_check
    check (training_id is not null or nullif(btrim(custom_title), '') is not null),
  constraint user_training_logs_custom_title_length_check
    check (custom_title is null or char_length(custom_title) <= 160),
  constraint user_training_logs_duration_check
    check (duration_minutes between 1 and 1440),
  constraint user_training_logs_attempts_check
    check (attempts is null or attempts >= 0),
  constraint user_training_logs_successes_check
    check (successes is null or successes >= 0),
  constraint user_training_logs_successes_attempts_check
    check (attempts is null or successes is null or successes <= attempts),
  constraint user_training_logs_self_rating_check
    check (self_rating is null or self_rating between 1 and 5),
  constraint user_training_logs_notes_length_check
    check (notes is null or char_length(notes) <= 2000)
);

create table public.ai_coach_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ai_coach_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  content text not null,
  grounding_refs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  constraint ai_coach_messages_role_check
    check (role in ('user', 'assistant')),
  constraint ai_coach_messages_content_length_check
    check (char_length(content) between 1 and 20000),
  constraint ai_coach_messages_grounding_refs_check
    check (jsonb_typeof(grounding_refs) = 'array')
);

create table public.ai_coach_generations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ai_coach_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_message_id uuid references public.ai_coach_messages(id) on delete set null,
  assistant_message_id uuid references public.ai_coach_messages(id) on delete set null,
  model text not null,
  status text not null default 'pending',
  prompt_hash text,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  estimated_cost_usd numeric(12, 6),
  latency_ms integer,
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  constraint ai_coach_generations_status_check
    check (status in ('pending', 'streaming', 'complete', 'error')),
  constraint ai_coach_generations_prompt_hash_length_check
    check (prompt_hash is null or char_length(prompt_hash) <= 128),
  constraint ai_coach_generations_token_counts_check
    check (
      (input_tokens is null or input_tokens >= 0)
      and (output_tokens is null or output_tokens >= 0)
      and (total_tokens is null or total_tokens >= 0)
    ),
  constraint ai_coach_generations_cost_check
    check (estimated_cost_usd is null or estimated_cost_usd >= 0),
  constraint ai_coach_generations_latency_check
    check (latency_ms is null or latency_ms >= 0),
  constraint ai_coach_generations_error_code_length_check
    check (error_code is null or char_length(error_code) <= 120),
  constraint ai_coach_generations_error_message_length_check
    check (error_message is null or char_length(error_message) <= 2000)
);

create index diagnosis_answers_result_idx
  on public.diagnosis_answers(diagnosis_result_id);
create index user_match_logs_user_played_at_idx
  on public.user_match_logs(user_id, played_at desc);
create index user_match_logs_matchup_idx
  on public.user_match_logs(user_id, player_character_id, opponent_character_id);
create index ai_coach_sessions_user_updated_at_idx
  on public.ai_coach_sessions(user_id, updated_at desc);
create index user_training_plans_user_status_priority_idx
  on public.user_training_plans(user_id, status, priority, created_at desc);
create index user_training_plans_training_idx
  on public.user_training_plans(training_id);
create index user_training_logs_user_practiced_at_idx
  on public.user_training_logs(user_id, practiced_at desc);
create index user_training_logs_training_idx
  on public.user_training_logs(training_id);
create index ai_coach_messages_session_created_at_idx
  on public.ai_coach_messages(session_id, created_at);
create index ai_coach_generations_session_created_at_idx
  on public.ai_coach_generations(session_id, created_at desc);
create index ai_coach_generations_user_status_idx
  on public.ai_coach_generations(user_id, status, created_at desc);

create trigger set_updated_at
before update on public.diagnosis_focus_rules
for each row execute function public.set_updated_at();
create trigger set_updated_at
before update on public.user_game_profiles
for each row execute function public.set_updated_at();
create trigger set_updated_at
before update on public.user_match_logs
for each row execute function public.set_updated_at();
create trigger set_updated_at
before update on public.ai_coach_sessions
for each row execute function public.set_updated_at();
create trigger set_updated_at
before update on public.user_training_plans
for each row execute function public.set_updated_at();
create trigger set_updated_at
before update on public.user_training_logs
for each row execute function public.set_updated_at();

alter table public.diagnosis_focus_rules enable row level security;
alter table public.user_game_profiles enable row level security;
alter table public.diagnosis_answers enable row level security;
alter table public.user_match_logs enable row level security;
alter table public.ai_coach_sessions enable row level security;
alter table public.user_training_plans enable row level security;
alter table public.user_training_logs enable row level security;
alter table public.ai_coach_messages enable row level security;
alter table public.ai_coach_generations enable row level security;

revoke all on public.diagnosis_focus_rules from anon, authenticated;
revoke all on public.user_game_profiles from anon, authenticated;
revoke all on public.diagnosis_answers from anon, authenticated;
revoke all on public.user_match_logs from anon, authenticated;
revoke all on public.ai_coach_sessions from anon, authenticated;
revoke all on public.user_training_plans from anon, authenticated;
revoke all on public.user_training_logs from anon, authenticated;
revoke all on public.ai_coach_messages from anon, authenticated;
revoke all on public.ai_coach_generations from anon, authenticated;

grant select on public.diagnosis_focus_rules to anon, authenticated;
grant select, insert, update, delete on public.user_game_profiles to authenticated;
grant select, insert, update, delete on public.diagnosis_answers to authenticated;
grant select, insert, update, delete on public.user_match_logs to authenticated;
grant select, insert, update, delete on public.ai_coach_sessions to authenticated;
grant select, insert, update, delete on public.user_training_plans to authenticated;
grant select, insert, update, delete on public.user_training_logs to authenticated;
grant select, insert, update, delete on public.ai_coach_messages to authenticated;
grant select on public.ai_coach_generations to authenticated;

create policy "public read published diagnosis focus rules"
on public.diagnosis_focus_rules for select
to anon, authenticated
using (status = 'published');

create policy "admin manage diagnosis focus rules"
on public.diagnosis_focus_rules for all
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "users read own game profile"
on public.user_game_profiles for select
to authenticated
using ((select auth.uid()) = user_id);
create policy "users insert own game profile"
on public.user_game_profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);
create policy "users update own game profile"
on public.user_game_profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "users delete own game profile"
on public.user_game_profiles for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "users read own diagnosis answers"
on public.diagnosis_answers for select
to authenticated
using (exists (
  select 1 from public.diagnosis_results r
  where r.id = diagnosis_answers.diagnosis_result_id
    and r.user_id = (select auth.uid())
));
create policy "users insert own diagnosis answers"
on public.diagnosis_answers for insert
to authenticated
with check (exists (
  select 1 from public.diagnosis_results r
  where r.id = diagnosis_answers.diagnosis_result_id
    and r.user_id = (select auth.uid())
));
create policy "users delete own diagnosis answers"
on public.diagnosis_answers for delete
to authenticated
using (exists (
  select 1 from public.diagnosis_results r
  where r.id = diagnosis_answers.diagnosis_result_id
    and r.user_id = (select auth.uid())
));

create policy "users read own match logs"
on public.user_match_logs for select
to authenticated
using ((select auth.uid()) = user_id);
create policy "users insert own match logs"
on public.user_match_logs for insert
to authenticated
with check ((select auth.uid()) = user_id);
create policy "users update own match logs"
on public.user_match_logs for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy "users delete own match logs"
on public.user_match_logs for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "users read own coach sessions"
on public.ai_coach_sessions for select
to authenticated
using ((select auth.uid()) = user_id);
create policy "users insert own coach sessions"
on public.ai_coach_sessions for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    diagnosis_result_id is null
    or exists (
      select 1 from public.diagnosis_results r
      where r.id = ai_coach_sessions.diagnosis_result_id
        and r.user_id = (select auth.uid())
    )
  )
);
create policy "users update own coach sessions"
on public.ai_coach_sessions for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    diagnosis_result_id is null
    or exists (
      select 1 from public.diagnosis_results r
      where r.id = ai_coach_sessions.diagnosis_result_id
        and r.user_id = (select auth.uid())
    )
  )
);
create policy "users delete own coach sessions"
on public.ai_coach_sessions for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "users read own training plans"
on public.user_training_plans for select
to authenticated
using ((select auth.uid()) = user_id);
create policy "users insert own training plans"
on public.user_training_plans for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    source_diagnosis_result_id is null
    or exists (
      select 1 from public.diagnosis_results r
      where r.id = user_training_plans.source_diagnosis_result_id
        and r.user_id = (select auth.uid())
    )
  )
  and (
    source_match_log_id is null
    or exists (
      select 1 from public.user_match_logs m
      where m.id = user_training_plans.source_match_log_id
        and m.user_id = (select auth.uid())
    )
  )
  and (
    source_coach_session_id is null
    or exists (
      select 1 from public.ai_coach_sessions s
      where s.id = user_training_plans.source_coach_session_id
        and s.user_id = (select auth.uid())
    )
  )
);
create policy "users update own training plans"
on public.user_training_plans for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    source_diagnosis_result_id is null
    or exists (
      select 1 from public.diagnosis_results r
      where r.id = user_training_plans.source_diagnosis_result_id
        and r.user_id = (select auth.uid())
    )
  )
  and (
    source_match_log_id is null
    or exists (
      select 1 from public.user_match_logs m
      where m.id = user_training_plans.source_match_log_id
        and m.user_id = (select auth.uid())
    )
  )
  and (
    source_coach_session_id is null
    or exists (
      select 1 from public.ai_coach_sessions s
      where s.id = user_training_plans.source_coach_session_id
        and s.user_id = (select auth.uid())
    )
  )
);
create policy "users delete own training plans"
on public.user_training_plans for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "users read own training logs"
on public.user_training_logs for select
to authenticated
using ((select auth.uid()) = user_id);
create policy "users insert own training logs"
on public.user_training_logs for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    training_plan_id is null
    or exists (
      select 1 from public.user_training_plans p
      where p.id = user_training_logs.training_plan_id
        and p.user_id = (select auth.uid())
    )
  )
);
create policy "users update own training logs"
on public.user_training_logs for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    training_plan_id is null
    or exists (
      select 1 from public.user_training_plans p
      where p.id = user_training_logs.training_plan_id
        and p.user_id = (select auth.uid())
    )
  )
);
create policy "users delete own training logs"
on public.user_training_logs for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "users read own coach messages"
on public.ai_coach_messages for select
to authenticated
using ((select auth.uid()) = user_id);
create policy "users insert own coach messages"
on public.ai_coach_messages for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and role = 'user'
  and exists (
    select 1 from public.ai_coach_sessions s
    where s.id = ai_coach_messages.session_id
      and s.user_id = (select auth.uid())
  )
);
create policy "users update own coach messages"
on public.ai_coach_messages for update
to authenticated
using ((select auth.uid()) = user_id and role = 'user')
with check (
  (select auth.uid()) = user_id
  and role = 'user'
  and exists (
    select 1 from public.ai_coach_sessions s
    where s.id = ai_coach_messages.session_id
      and s.user_id = (select auth.uid())
  )
);
create policy "users delete own coach messages"
on public.ai_coach_messages for delete
to authenticated
using ((select auth.uid()) = user_id and role = 'user');

create policy "users read own coach generations"
on public.ai_coach_generations for select
to authenticated
using ((select auth.uid()) = user_id);
