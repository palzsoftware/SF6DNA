-- Phase44 follow-up: the public media RLS policy calls this readiness helper.
-- It must be executable by the same read roles, otherwise PostgreSQL can raise
-- a permission error before the permissive Preview policy is evaluated.

grant execute on function private.is_move_motion_media_public_ready(uuid)
to anon, authenticated, service_role;
