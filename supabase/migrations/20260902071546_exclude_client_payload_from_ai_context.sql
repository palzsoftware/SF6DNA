
do $migration$
declare
  v_def text;
  v_changed text;
  v_needle text := E'        ''result_payload'', r.result_payload,\n';
begin
  select pg_get_functiondef(
    'public.get_ai_coach_context(integer,integer)'::regprocedure
  ) into v_def;

  if position(v_needle in v_def) = 0 then
    raise exception 'Expected result_payload field was not found in get_ai_coach_context';
  end if;

  v_changed := replace(v_def, v_needle, '');

  if position('''result_payload'', r.result_payload' in v_changed) > 0 then
    raise exception 'Untrusted result_payload removal was incomplete';
  end if;

  execute v_changed;
end
$migration$;
