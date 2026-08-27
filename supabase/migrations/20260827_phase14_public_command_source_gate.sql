-- Phase14 P0-02 follow-up: move_commands has no verification_status column.
-- Public command data is therefore exposed only when the parent move is published
-- and the exact command row has at least one official-reliability Source relation.
-- Admin ALL policy remains unchanged.

drop policy if exists "public read move commands" on public.move_commands;
create policy "public read move commands" on public.move_commands
for select using (
  exists (
    select 1
    from public.moves m
    where m.id = move_commands.move_id
      and m.status = 'published'
  )
  and exists (
    select 1
    from public.entity_sources es
    join public.sources s on s.id = es.source_id
    where es.entity_type = 'move_command'
      and es.entity_id = move_commands.id
      and s.reliability_level = 'official'
  )
);
