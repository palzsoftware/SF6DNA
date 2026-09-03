
do $migration$
declare
  v_def text;
  v_changed text;
begin
  select pg_get_functiondef(
    'public.get_today_training_recommendations(uuid,uuid,integer)'::regprocedure
  ) into v_def;

  if position('p.scheduled_for <= current_date' in v_def) = 0 then
    raise exception 'Expected current_date expression was not found in get_today_training_recommendations';
  end if;

  v_changed := replace(
    v_def,
    'p.scheduled_for <= current_date',
    'p.scheduled_for <= (pg_catalog.timezone(''Asia/Tokyo'', now()))::date'
  );
  execute v_changed;

  select pg_get_functiondef(
    'public.get_adaptive_today_training_recommendations(uuid,uuid,integer)'::regprocedure
  ) into v_def;

  if position(
    'h.last_practiced_at >= date_trunc(''day'', now())'
    in v_def
  ) = 0 or position(
    's.last_practiced_at >= date_trunc(''day'', now())'
    in v_def
  ) = 0 then
    raise exception 'Expected UTC day-boundary expressions were not found in adaptive recommendations';
  end if;

  v_changed := replace(
    v_def,
    'h.last_practiced_at >= date_trunc(''day'', now())',
    'h.last_practiced_at >= (pg_catalog.date_trunc(''day'', pg_catalog.timezone(''Asia/Tokyo'', now())) at time zone ''Asia/Tokyo'')'
  );
  v_changed := replace(
    v_changed,
    's.last_practiced_at >= date_trunc(''day'', now())',
    's.last_practiced_at >= (pg_catalog.date_trunc(''day'', pg_catalog.timezone(''Asia/Tokyo'', now())) at time zone ''Asia/Tokyo'')'
  );
  execute v_changed;

  select pg_get_functiondef(
    'public.start_ai_coach_session(text,text,uuid,uuid)'::regprocedure
  ) into v_def;

  if position(
    '''振り返り '' || to_char(current_date, ''YYYY/MM/DD'')'
    in v_def
  ) = 0 then
    raise exception 'Expected UTC title-date expression was not found in start_ai_coach_session';
  end if;

  v_changed := replace(
    v_def,
    '''振り返り '' || to_char(current_date, ''YYYY/MM/DD'')',
    '''振り返り '' || pg_catalog.to_char(pg_catalog.timezone(''Asia/Tokyo'', now()), ''YYYY/MM/DD'')'
  );
  execute v_changed;

  select pg_get_functiondef(
    'public.get_weekly_progress_review(date,uuid)'::regprocedure
  ) into v_def;

  if position(
    'date_trunc(''week'', current_date)::date'
    in v_def
  ) = 0
  or position('p.week_start::timestamptz' in v_def) = 0
  or position('p.week_end::timestamptz' in v_def) = 0
  or position('p.previous_week_start::timestamptz' in v_def) = 0 then
    raise exception 'Expected UTC week-boundary expressions were not found in get_weekly_progress_review';
  end if;

  v_changed := replace(
    v_def,
    'date_trunc(''week'', current_date)::date',
    'pg_catalog.date_trunc(''week'', pg_catalog.timezone(''Asia/Tokyo'', now()))::date'
  );
  v_changed := replace(
    v_changed,
    'p.week_start::timestamptz',
    '(p.week_start::timestamp at time zone ''Asia/Tokyo'')'
  );
  v_changed := replace(
    v_changed,
    'p.week_end::timestamptz',
    '(p.week_end::timestamp at time zone ''Asia/Tokyo'')'
  );
  v_changed := replace(
    v_changed,
    'p.previous_week_start::timestamptz',
    '(p.previous_week_start::timestamp at time zone ''Asia/Tokyo'')'
  );

  if position('p.week_start::timestamptz' in v_changed) > 0
     or position('p.week_end::timestamptz' in v_changed) > 0
     or position('p.previous_week_start::timestamptz' in v_changed) > 0 then
    raise exception 'Weekly review timezone replacements were incomplete';
  end if;

  execute v_changed;
end
$migration$;
