-- Security P0 (① Round16 candidate 20261120130000, re-versioned by ③ to run BEFORE 20261120120000).
-- Ordering guarantee: this file sorts before the anon REVOKE in 20261120120000, so the REVOKE can never land
-- while the old inline policy is still active (that state makes every anon move_commands read fail with 42501).
-- The "anon has no source table grants" assertion lives in 20261120120000's postcondition (anon still holds
-- grants when this file runs), and 20261120120000 now refuses to run if this fix is missing.
BEGIN;
SET LOCAL lock_timeout = '5s';

DO $pre$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid='public.move_commands'::regclass AND polname='public read move commands') THEN
    RAISE EXCEPTION 'expected policy missing: abort'; END IF;
END $pre$;

CREATE OR REPLACE FUNCTION private.move_command_has_official_source(target_move_command_id uuid)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO ''
AS $function$
  select exists (
    select 1 from public.entity_sources es
    join public.sources s on s.id = es.source_id
    where es.entity_type = 'move_command'
      and es.entity_id = target_move_command_id
      and s.reliability_level = 'official');
$function$;
REVOKE ALL ON FUNCTION private.move_command_has_official_source(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.move_command_has_official_source(uuid) TO anon, authenticated, service_role;

DROP POLICY "public read move commands" ON public.move_commands;
CREATE POLICY "public read move commands" ON public.move_commands FOR SELECT TO public
  USING (
    EXISTS (SELECT 1 FROM public.moves m WHERE m.id = move_commands.move_id AND m.status = 'published')
    AND private.move_command_has_official_source(move_commands.id)
  );

DO $post$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policy p WHERE p.polrelid='public.move_commands'::regclass
             AND pg_get_expr(p.polqual,p.polrelid) ~ 'entity_sources|sources s') THEN
    RAISE EXCEPTION 'inline source reference remains in move_commands policy'; END IF;
END $post$;
COMMIT;
