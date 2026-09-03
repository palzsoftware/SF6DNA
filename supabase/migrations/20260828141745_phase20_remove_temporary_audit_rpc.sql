-- Phase20 final cleanup: remove the temporary public audit RPC used only by
-- the CAPCOM frame crosscheck workflow.
--
-- The function was SECURITY DEFINER and temporarily executable through the
-- exposed API while Phase20 evidence collection was active. Phase20 is now
-- closing, so the audit surface must not remain available.

drop function if exists public._phase20_frame_audit_fingerprints();
