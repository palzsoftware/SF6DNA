-- Security P0 (2026-11-25): public search must not depend on anon/authenticated reading the source tables.
-- search_sf6dna (SECURITY INVOKER) reads combos / setups / sequences / counters / trainings.
--   * Production already uses "public read release-ready <table>" policies backed by SECURITY DEFINER functions
--     (private.is_<kind>_public_ready); nothing reads the source tables inline there → this file is a no-op.
--   * Development still has the older "public read published <table>" policies that check public.entity_sources
--     inline as the caller, so after the anon REVOKE (already in effect on Development, planned in 20261120120000)
--     every anonymous /search fails with 42501 (permission denied for table entity_sources).
-- Only policies that still read the source tables inline are replaced, using the same approach as 20261120115000:
-- the existence check moves into a SECURITY DEFINER function that returns a boolean. The visibility rule of the
-- replaced policy is unchanged. No table grant is widened. Sorts before 20261120120000.
BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE OR REPLACE FUNCTION private.content_has_source(target_entity_type text, target_entity_id uuid)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO ''
AS $function$
  select exists (
    select 1 from public.entity_sources es
    where es.entity_type = target_entity_type
      and es.entity_id = target_entity_id);
$function$;
REVOKE ALL ON FUNCTION private.content_has_source(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.content_has_source(text, uuid) TO anon, authenticated, service_role;

DO $replace$
DECLARE
  t text; kind text; pol record; replaced int := 0;
  inline constant text := '(^|[^_a-z])(entity_sources|sources)([^_a-z]|$)';
BEGIN
  FOREACH t IN ARRAY ARRAY['combos','setups','sequences','counters','trainings'] LOOP
    kind := CASE t WHEN 'combos' THEN 'combo' WHEN 'setups' THEN 'setup' WHEN 'sequences' THEN 'sequence'
                   WHEN 'counters' THEN 'counter' ELSE 'training' END;
    FOR pol IN
      SELECT p.polname, pg_catalog.pg_get_expr(p.polqual, p.polrelid) AS qual
      FROM pg_catalog.pg_policy p
      WHERE p.polrelid = pg_catalog.to_regclass('public.' || t)
        AND pg_catalog.pg_get_expr(p.polqual, p.polrelid) ~ inline
    LOOP
      -- Only the known Development shape is rewritten; anything else stops the migration for review.
      IF pol.polname <> 'public read published ' || t
         OR pol.qual !~ ('status = ''published''.*verification_status = ''verified''.*entity_sources es.*es\.entity_type = ''' || kind || '''.*es\.entity_id = ' || t || '\.id') THEN
        RAISE EXCEPTION 'unexpected inline source policy on %: % — review before applying', t, pol.polname;
      END IF;
      EXECUTE pg_catalog.format('DROP POLICY %I ON public.%I', pol.polname, t);
      EXECUTE pg_catalog.format(
        'CREATE POLICY %I ON public.%I FOR SELECT TO public USING (status = ''published'' AND verification_status = ''verified'' AND private.content_has_source(%L, %I.id))',
        pol.polname, t, kind, t);
      replaced := replaced + 1;
    END LOOP;
  END LOOP;
  RAISE NOTICE 'public content policies rewritten: % (0 expected on Production, 5 on Development)', replaced;
END $replace$;

DO $post$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_policy p JOIN pg_catalog.pg_class c ON c.oid = p.polrelid
             JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = 'public'
               AND pg_catalog.pg_get_expr(p.polqual, p.polrelid) ~ '(^|[^_a-z])(entity_sources|sources)([^_a-z]|$)') THEN
    RAISE EXCEPTION 'inline source reference remains in a public policy';
  END IF;
END $post$;
COMMIT;
