drop policy if exists phase23_device_preview_move_commands on public.move_commands;
create policy phase23_device_preview_move_commands
on public.move_commands
for select
to anon
using (
  private.is_phase23_device_preview()
  and exists (
    select 1
    from public.moves m
    join public.characters c on c.id = m.character_id
    where m.id = move_commands.move_id
      and c.slug = 'ryu'
  )
);

create or replace function public.get_phase23_move_commands_preview(
  target_character_id uuid,
  preview_token text
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  result jsonb;
begin
  perform set_config('sf6dna.preview_token', coalesce(preview_token, ''), true);

  if not private.is_phase23_device_preview() then
    return null;
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = target_character_id
      and c.slug = 'ryu'
  ) then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'moveId', mc.move_id,
        'scheme', mc.control_scheme,
        'commandText', mc.command_text,
        'numericNotation', mc.numeric_notation,
        'buttonNotation', mc.button_notation,
        'conditionText', mc.condition_text,
        'sortOrder', mc.sort_order
      )
      order by m.display_order, mc.control_scheme, mc.sort_order
    ),
    '[]'::jsonb
  )
  into result
  from public.move_commands mc
  join public.moves m on m.id = mc.move_id
  where m.character_id = target_character_id
    and m.status <> 'archived';

  return result;
end;
$$;

revoke all on function public.get_phase23_move_commands_preview(uuid, text) from public;
revoke all on function public.get_phase23_move_commands_preview(uuid, text) from authenticated;
grant execute on function public.get_phase23_move_commands_preview(uuid, text) to anon;
