
create index diagnosis_answers_result_diagnosis_idx
  on public.diagnosis_answers(diagnosis_result_id, diagnosis_id);
create index diagnosis_answers_diagnosis_question_idx
  on public.diagnosis_answers(diagnosis_id, question_id);
create index diagnosis_answers_question_option_idx
  on public.diagnosis_answers(question_id, option_id);
create index user_game_profiles_main_character_idx
  on public.user_game_profiles(main_character_id);
create index user_match_logs_player_character_idx
  on public.user_match_logs(player_character_id);
create index user_match_logs_opponent_character_idx
  on public.user_match_logs(opponent_character_id);
create index ai_coach_sessions_character_idx
  on public.ai_coach_sessions(character_id);
create index ai_coach_sessions_diagnosis_result_idx
  on public.ai_coach_sessions(diagnosis_result_id);
create index user_training_plans_focus_key_idx
  on public.user_training_plans(focus_key);
create index user_training_plans_source_diagnosis_idx
  on public.user_training_plans(source_diagnosis_result_id);
create index user_training_plans_source_match_idx
  on public.user_training_plans(source_match_log_id);
create index user_training_plans_source_coach_idx
  on public.user_training_plans(source_coach_session_id);
create index user_training_logs_plan_idx
  on public.user_training_logs(training_plan_id);
create index ai_coach_messages_user_idx
  on public.ai_coach_messages(user_id);
create unique index ai_coach_generations_user_message_idx
  on public.ai_coach_generations(user_message_id)
  where user_message_id is not null;
create unique index ai_coach_generations_assistant_message_idx
  on public.ai_coach_generations(assistant_message_id)
  where assistant_message_id is not null;

drop policy "public read published diagnosis focus rules"
  on public.diagnosis_focus_rules;
drop policy "admin manage diagnosis focus rules"
  on public.diagnosis_focus_rules;

create policy "read published or admin diagnosis focus rules"
on public.diagnosis_focus_rules for select
to anon, authenticated
using (status = 'published' or private.is_admin());

create policy "admin insert diagnosis focus rules"
on public.diagnosis_focus_rules for insert
to authenticated
with check (private.is_admin());

create policy "admin update diagnosis focus rules"
on public.diagnosis_focus_rules for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "admin delete diagnosis focus rules"
on public.diagnosis_focus_rules for delete
to authenticated
using (private.is_admin());
