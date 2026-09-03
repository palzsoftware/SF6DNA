
create or replace function public.get_activity_timeline(
  p_limit integer default 50,
  p_before timestamptz default null,
  p_activity_types text[] default null
)
returns table (
  activity_id uuid,
  activity_type text,
  source_type text,
  source_id uuid,
  label text,
  metadata jsonb,
  occurred_at timestamptz
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_limit integer := greatest(1, least(coalesce(p_limit, 50), 100));
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  return query
  select
    l.id,
    l.activity_type,
    l.source_type,
    l.source_id,
    l.label,
    l.metadata,
    l.occurred_at
  from public.user_activity_logs l
  where l.user_id = v_user_id
    and l.retention_until > now()
    and (p_before is null or l.occurred_at < p_before)
    and (p_activity_types is null or l.activity_type = any(p_activity_types))
  order by l.occurred_at desc, l.id desc
  limit v_limit;
end;
$$;

revoke all on function public.get_activity_timeline(integer, timestamptz, text[])
  from public, anon, authenticated;
grant execute on function public.get_activity_timeline(integer, timestamptz, text[])
  to authenticated;

comment on function public.get_activity_timeline(integer, timestamptz, text[]) is
  'Returns the signed-in user activity timeline with cursor-style timestamp pagination. Expired entries are hidden.';

create or replace function public.get_activity_summary(
  p_period text default 'week',
  p_periods integer default 8,
  p_timezone text default 'Asia/Tokyo'
)
returns table (
  period_start date,
  period_end date,
  activity_total bigint,
  matches_logged bigint,
  match_wins bigint,
  trainings_completed bigint,
  training_minutes bigint,
  quick_help_completed bigint,
  ai_coach_sessions bigint,
  diagnoses_completed bigint
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_period text := lower(coalesce(p_period, 'week'));
  v_periods integer := greatest(1, least(coalesce(p_periods, 8), 24));
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if v_period not in ('week', 'month') then
    raise exception 'period must be week or month' using errcode = '22023';
  end if;

  if p_timezone is null or not exists (
    select 1 from pg_catalog.pg_timezone_names where name = p_timezone
  ) then
    raise exception 'invalid timezone' using errcode = '22023';
  end if;

  return query
  with period_offsets as (
    select generate_series(0, v_periods - 1) as offset_no
  ),
  period_bounds as (
    select
      case
        when v_period = 'week' then
          date_trunc('week', pg_catalog.timezone(p_timezone, now()))
            - (offset_no * interval '1 week')
        else
          date_trunc('month', pg_catalog.timezone(p_timezone, now()))
            - (offset_no * interval '1 month')
      end as start_local,
      case
        when v_period = 'week' then
          date_trunc('week', pg_catalog.timezone(p_timezone, now()))
            - (offset_no * interval '1 week') + interval '1 week'
        else
          date_trunc('month', pg_catalog.timezone(p_timezone, now()))
            - (offset_no * interval '1 month') + interval '1 month'
      end as end_local
    from period_offsets
  )
  select
    b.start_local::date,
    (b.end_local - interval '1 day')::date,
    count(l.id)::bigint,
    count(l.id) filter (where l.activity_type = 'match.logged')::bigint,
    count(l.id) filter (
      where l.activity_type = 'match.logged'
        and l.metadata->>'result' = 'win'
    )::bigint,
    count(l.id) filter (where l.activity_type = 'training.completed')::bigint,
    coalesce(sum(
      case
        when l.activity_type = 'training.completed'
          and jsonb_typeof(l.metadata->'duration_minutes') = 'number'
        then (l.metadata->>'duration_minutes')::bigint
        else 0
      end
    ), 0)::bigint,
    count(l.id) filter (where l.activity_type = 'quick_help.completed')::bigint,
    count(l.id) filter (where l.activity_type = 'ai_coach.session_started')::bigint,
    count(l.id) filter (where l.activity_type = 'diagnosis.completed')::bigint
  from period_bounds b
  left join public.user_activity_logs l
    on l.user_id = v_user_id
   and l.occurred_at >= (b.start_local at time zone p_timezone)
   and l.occurred_at < (b.end_local at time zone p_timezone)
   and l.retention_until > now()
  group by b.start_local, b.end_local
  order by b.start_local;
end;
$$;

revoke all on function public.get_activity_summary(text, integer, text)
  from public, anon, authenticated;
grant execute on function public.get_activity_summary(text, integer, text)
  to authenticated;

comment on function public.get_activity_summary(text, integer, text) is
  'Returns weekly or monthly cross-feature progress totals in the requested IANA timezone.';

create or replace function public.purge_expired_user_activity_logs(
  p_limit integer default 5000
)
returns integer
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  v_deleted integer;
  v_limit integer := greatest(1, least(coalesce(p_limit, 5000), 20000));
begin
  with expired as (
    select l.id
    from public.user_activity_logs l
    where l.retention_until <= now()
    order by l.retention_until, l.id
    limit v_limit
    for update skip locked
  )
  delete from public.user_activity_logs l
  using expired e
  where l.id = e.id;

  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.purge_expired_user_activity_logs(integer)
  from public, anon, authenticated;
grant execute on function public.purge_expired_user_activity_logs(integer)
  to service_role;

comment on function public.purge_expired_user_activity_logs(integer) is
  'Server-only bounded cleanup for entries past their 180-day retention date. No schedule is created by this migration.';
