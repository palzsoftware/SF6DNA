-- Phase19: align Public Move Gate with V2_RELEASE_READINESS.
-- Move, Classic Command, and Current verified Frame must each have official evidence.
-- No content status or verification values are changed.

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
      join public.sources s on s.id = es.source_id
      where es.entity_type = 'move'
        and es.entity_id = target_move_id
        and s.reliability_level = 'official'
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
          join public.sources s on s.id = es.source_id
          where es.entity_id = f.id
            and es.entity_type in ('frame', 'move_frame_data')
            and s.reliability_level = 'official'
        )
    );
$$;

revoke all on function private.is_move_public_ready(uuid) from public;
grant execute on function private.is_move_public_ready(uuid) to anon, authenticated, service_role;
