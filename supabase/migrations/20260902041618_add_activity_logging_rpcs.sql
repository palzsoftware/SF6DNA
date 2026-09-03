
create or replace function public.save_match_log(
  p_player_character_id uuid,
  p_opponent_character_id uuid,
  p_result text,
  p_primary_issue text default 'unknown',
  p_played_at timestamptz default now(),
  p_mode text default 'ranked',
  p_rank_before text default null,
  p_rank_after text default null,
  p_mr_before integer default null,
  p_mr_after integer default null,
  p_rounds_won smallint default null,
  p_rounds_lost smallint default null,
  p_issue_detail text default null,
  p_notes text default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_match_log_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = p_player_character_id
      and c.is_playable = true
      and c.status = 'published'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected player character is not available.';
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = p_opponent_character_id
      and c.is_playable = true
      and c.status = 'published'
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected opponent character is not available.';
  end if;

  insert into public.user_match_logs (
    user_id,
    played_at,
    player_character_id,
    opponent_character_id,
    result,
    mode,
    rank_before,
    rank_after,
    mr_before,
    mr_after,
    rounds_won,
    rounds_lost,
    primary_issue,
    issue_detail,
    notes
  )
  values (
    v_user_id,
    coalesce(p_played_at, now()),
    p_player_character_id,
    p_opponent_character_id,
    p_result,
    coalesce(p_mode, 'ranked'),
    nullif(btrim(p_rank_before), ''),
    nullif(btrim(p_rank_after), ''),
    p_mr_before,
    p_mr_after,
    p_rounds_won,
    p_rounds_lost,
    coalesce(p_primary_issue, 'unknown'),
    nullif(btrim(p_issue_detail), ''),
    nullif(btrim(p_notes), '')
  )
  returning id into v_match_log_id;

  return v_match_log_id;
end;
$$;

comment on function public.save_match_log(
  uuid, uuid, text, text, timestamptz, text, text, text,
  integer, integer, smallint, smallint, text, text
) is
  'Saves one authenticated user match log with a minimal 30-second input path.';

revoke all on function public.save_match_log(
  uuid, uuid, text, text, timestamptz, text, text, text,
  integer, integer, smallint, smallint, text, text
) from public;
revoke all on function public.save_match_log(
  uuid, uuid, text, text, timestamptz, text, text, text,
  integer, integer, smallint, smallint, text, text
) from anon;
grant execute on function public.save_match_log(
  uuid, uuid, text, text, timestamptz, text, text, text,
  integer, integer, smallint, smallint, text, text
) to authenticated;
grant execute on function public.save_match_log(
  uuid, uuid, text, text, timestamptz, text, text, text,
  integer, integer, smallint, smallint, text, text
) to service_role;


create or replace function public.save_training_completion(
  p_duration_minutes integer,
  p_training_plan_id uuid default null,
  p_training_id uuid default null,
  p_custom_title text default null,
  p_practiced_at timestamptz default now(),
  p_attempts integer default null,
  p_successes integer default null,
  p_self_rating smallint default null,
  p_notes text default null,
  p_mark_plan_completed boolean default true
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_plan_training_id uuid;
  v_training_id uuid := p_training_id;
  v_training_log_id uuid;
begin
  if v_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  if p_training_plan_id is not null then
    select p.training_id
      into v_plan_training_id
    from public.user_training_plans p
    where p.id = p_training_plan_id
      and p.user_id = v_user_id;

    if v_plan_training_id is null then
      raise exception using
        errcode = '22023',
        message = 'The selected training plan is not available.';
    end if;

    if v_training_id is not null and v_training_id <> v_plan_training_id then
      raise exception using
        errcode = '22023',
        message = 'The training does not match the selected plan.';
    end if;

    v_training_id := v_plan_training_id;
  end if;

  if v_training_id is null and nullif(btrim(p_custom_title), '') is null then
    raise exception using
      errcode = '22023',
      message = 'A training or custom title is required.';
  end if;

  if v_training_id is not null and not exists (
    select 1
    from public.trainings t
    where t.id = v_training_id
  ) then
    raise exception using
      errcode = '22023',
      message = 'The selected training is not available.';
  end if;

  insert into public.user_training_logs (
    user_id,
    training_plan_id,
    training_id,
    custom_title,
    practiced_at,
    duration_minutes,
    attempts,
    successes,
    self_rating,
    notes
  )
  values (
    v_user_id,
    p_training_plan_id,
    v_training_id,
    case
      when v_training_id is null then nullif(btrim(p_custom_title), '')
      else null
    end,
    coalesce(p_practiced_at, now()),
    p_duration_minutes,
    p_attempts,
    p_successes,
    p_self_rating,
    nullif(btrim(p_notes), '')
  )
  returning id into v_training_log_id;

  if p_training_plan_id is not null and coalesce(p_mark_plan_completed, true) then
    update public.user_training_plans
    set
      status = 'completed',
      completed_at = coalesce(p_practiced_at, now())
    where id = p_training_plan_id
      and user_id = v_user_id;
  end if;

  return v_training_log_id;
end;
$$;

comment on function public.save_training_completion(
  integer, uuid, uuid, text, timestamptz, integer, integer, smallint, text, boolean
) is
  'Atomically saves an authenticated user training log and optionally completes its linked plan.';

revoke all on function public.save_training_completion(
  integer, uuid, uuid, text, timestamptz, integer, integer, smallint, text, boolean
) from public;
revoke all on function public.save_training_completion(
  integer, uuid, uuid, text, timestamptz, integer, integer, smallint, text, boolean
) from anon;
grant execute on function public.save_training_completion(
  integer, uuid, uuid, text, timestamptz, integer, integer, smallint, text, boolean
) to authenticated;
grant execute on function public.save_training_completion(
  integer, uuid, uuid, text, timestamptz, integer, integer, smallint, text, boolean
) to service_role;
