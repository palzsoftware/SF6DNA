create or replace function public.set_current_patch(target_patch_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not private.is_admin() then
    raise exception 'admin required' using errcode = '42501';
  end if;

  if not exists (select 1 from public.patches where id = target_patch_id) then
    raise exception 'patch not found' using errcode = 'P0002';
  end if;

  update public.patches
  set is_current = false
  where is_current = true
    and id <> target_patch_id;

  update public.patches
  set is_current = true
  where id = target_patch_id;
end;
$$;

revoke all on function public.set_current_patch(uuid) from public;
revoke all on function public.set_current_patch(uuid) from anon;
grant execute on function public.set_current_patch(uuid) to authenticated;
