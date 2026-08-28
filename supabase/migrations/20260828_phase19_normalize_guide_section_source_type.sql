-- Phase19: normalize legacy entity_sources entity_type for character guide sections.
-- This is a structural metadata correction only; no verification/status values are changed.

update public.entity_sources
set entity_type = 'character_guide_section'
where entity_type = 'guide_section'
  and exists (
    select 1
    from public.character_guide_sections cgs
    where cgs.id = entity_sources.entity_id
  );
