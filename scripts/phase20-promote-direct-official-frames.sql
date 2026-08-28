-- Phase20 Verified Content Expansion
-- Canonical DB action already applied to SF6DNAPro on 2026-08-28 JST.
-- This script documents the exact idempotent eligibility rule used for the DML update.
-- It intentionally does NOT publish Moves or weaken Public Gates.

with cur as (
  select id
  from public.patches
  where is_current = true
  limit 1
), eligible as (
  select distinct mf.id
  from public.move_frame_data mf
  join public.entity_sources es
    on es.entity_type in ('move_frame_data', 'frame')
   and es.entity_id = mf.id
  join public.sources s
    on s.id = es.source_id
  where mf.valid_from_patch_id = (select id from cur)
    and mf.valid_to_patch_id is null
    and mf.verification_status = 'reviewed'
    and s.reliability_level = 'official'
    and s.source_type = 'official_frame_data'
    and es.relationship in ('official', 'primary')
)
update public.move_frame_data mf
set verification_status = 'verified',
    updated_at = now()
from eligible e
where mf.id = e.id;
