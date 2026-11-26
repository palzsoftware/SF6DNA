-- 20261126100000 CANDIDATE (not applied anywhere; apply needs separate approval). Security P0: entity_videos public read must also require the linked entity to be published.
-- Current policy only checks videos.status='published'; a published video linked to a draft player/character would expose that link.
-- Prod 2026-11-26 aggregate: character 121 links (3 with published video), player 25 links (0 with published video) -> latent, not active.
-- Rollback: DROP POLICY + recreate the previous policy (see ROLLBACK block at bottom).
BEGIN;
SET LOCAL lock_timeout = '5s';

DO $pre$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid='public.entity_videos'::regclass AND polname='public read published entity videos') THEN
    RAISE EXCEPTION 'expected policy missing: abort'; END IF;
END $pre$;

CREATE OR REPLACE FUNCTION private.entity_video_target_is_public(target_entity_type text, target_entity_id uuid)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO ''
AS $function$
  select case target_entity_type
    when 'character' then exists (select 1 from public.characters c where c.id = target_entity_id and c.status = 'published')
    when 'player'    then exists (select 1 from public.players p    where p.id = target_entity_id and p.status = 'published')
    else false end;
$function$;
REVOKE ALL ON FUNCTION private.entity_video_target_is_public(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.entity_video_target_is_public(text, uuid) TO anon, authenticated, service_role;

DROP POLICY "public read published entity videos" ON public.entity_videos;
CREATE POLICY "public read published entity videos" ON public.entity_videos FOR SELECT TO public
  USING (
    EXISTS (SELECT 1 FROM public.videos v WHERE v.id = entity_videos.video_id AND v.status = 'published')
    AND private.entity_video_target_is_public(entity_videos.entity_type, entity_videos.entity_id)
  );
COMMIT;

-- ROLLBACK (manual):
-- BEGIN; DROP POLICY "public read published entity videos" ON public.entity_videos;
-- CREATE POLICY "public read published entity videos" ON public.entity_videos FOR SELECT TO public
--   USING (EXISTS (SELECT 1 FROM public.videos v WHERE v.id = entity_videos.video_id AND v.status = 'published'));
-- DROP FUNCTION private.entity_video_target_is_public(text, uuid); COMMIT;
