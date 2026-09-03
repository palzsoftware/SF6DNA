-- Phase23: archive legacy unverified Training templates copied across 3+ characters.
-- Canonical foundation drills and per-character practical reviewed drills now replace them.
-- No deletion and no verification/publication promotion.

with base as (
  select t.id,
         t.player_character_id,
         regexp_replace(t.name,'^[^ ]+ ','') as suffix,
         t.training_type,
         t.purpose,
         t.method,
         t.success_criteria,
         coalesce(t.recording_instructions,'') as recording_instructions,
         coalesce(t.playback_settings,'') as playback_settings,
         coalesce(t.cpu_settings,'') as cpu_settings
  from public.trainings t
  where t.status='draft'
    and t.verification_status='unverified'
), replicated as (
  select suffix,training_type,purpose,method,success_criteria,
         recording_instructions,playback_settings,cpu_settings
  from base
  group by suffix,training_type,purpose,method,success_criteria,
           recording_instructions,playback_settings,cpu_settings
  having count(*) >= 3
     and count(distinct player_character_id) >= 3
), targets as (
  select b.id
  from base b
  join replicated r using (
    suffix,training_type,purpose,method,success_criteria,
    recording_instructions,playback_settings,cpu_settings
  )
)
update public.trainings t
set status='archived', updated_at=now()
where t.id in (select id from targets)
  and t.status='draft'
  and t.verification_status='unverified';
