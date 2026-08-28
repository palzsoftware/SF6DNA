-- Phase19: align Move RLS with the application-level Public Move Gate.
-- No Move status or verification data is changed.

create or replace function private.is_move_public_ready(target_move_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1
      from public.move_commands mc
      join public.entity_sources es
        on es.entity_type = 'move_command'
       and es.entity_id = mc.id
      join public.sources s on s.id = es.source_id
      where mc.move_id = target_move_id
        and mc.control_scheme = 'classic'
        and s.reliability_level = 'official'
    )
    and exists (
      select 1
      from public.entity_sources es
      where es.entity_type = 'move'
        and es.entity_id = target_move_id
    )
    and exists (
      select 1
      from public.move_frame_data f
      join public.patches p on p.id = f.valid_from_patch_id
      where f.move_id = target_move_id
        and f.verification_status = 'verified'
        and f.valid_to_patch_id is null
        and p.is_current = true
        and exists (
          select 1
          from public.entity_sources es
          where es.entity_id = f.id
            and es.entity_type in ('frame', 'move_frame_data')
        )
    );
$$;

revoke all on function private.is_move_public_ready(uuid) from public;
grant execute on function private.is_move_public_ready(uuid) to anon, authenticated, service_role;

drop policy if exists "public read published moves" on public.moves;
create policy "public read release-ready moves"
on public.moves
for select
using (
  status = 'published'
  and private.is_move_public_ready(id)
);
