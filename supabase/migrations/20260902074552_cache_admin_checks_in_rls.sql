
do $migration$
declare
  r record;
  v_using text;
  v_check text;
  v_roles_clause text;
  v_sql text;
begin
  for r in
    select *
    from pg_policies
    where schemaname='public'
      and (
        (
          coalesce(qual,'') like '%private.is_admin()%'
          and coalesce(qual,'') not ilike '%select private.is_admin()%'
        )
        or (
          coalesce(with_check,'') like '%private.is_admin()%'
          and coalesce(with_check,'') not ilike '%select private.is_admin()%'
        )
      )
    order by tablename, policyname
  loop
    v_using := case
      when r.qual is null then null
      else replace(r.qual, 'private.is_admin()', '(select private.is_admin())')
    end;
    v_check := case
      when r.with_check is null then null
      else replace(r.with_check, 'private.is_admin()', '(select private.is_admin())')
    end;
    v_roles_clause := case
      when r.roles = array['public']::name[] then ' to authenticated'
      else ''
    end;

    v_sql := format(
      'alter policy %I on %I.%I%s',
      r.policyname,
      r.schemaname,
      r.tablename,
      v_roles_clause
    );

    if r.cmd in ('ALL', 'UPDATE') then
      v_sql := v_sql
        || format(' using (%s) with check (%s)', v_using, v_check);
    elsif r.cmd in ('SELECT', 'DELETE') then
      v_sql := v_sql || format(' using (%s)', v_using);
    elsif r.cmd = 'INSERT' then
      v_sql := v_sql || format(' with check (%s)', v_check);
    else
      raise exception 'Unsupported policy command % for %.%',
        r.cmd, r.tablename, r.policyname;
    end if;

    execute v_sql;
  end loop;
end
$migration$;
