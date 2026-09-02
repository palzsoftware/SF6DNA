do $migration$
declare
  v_definition text;
begin
  select pg_get_functiondef(p.oid)
    into v_definition
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public'
    and p.proname='save_diagnosis_result_with_answers'
    and pg_get_function_identity_arguments(p.oid)=
      'p_diagnosis_id uuid, p_result_payload jsonb, p_answers jsonb, p_request_id uuid';

  if v_definition is null then
    raise exception 'Target diagnosis save function was not found.';
  end if;

  v_definition := replace(v_definition, E'    FOR UPDATE;\n', E'    ;\n');
  v_definition := replace(v_definition, E'    for update;\n', E'    ;\n');

  if lower(v_definition) like '%for update%' then
    raise exception 'Unexpected FOR UPDATE remained in diagnosis save function.';
  end if;

  execute v_definition;
end
$migration$;
