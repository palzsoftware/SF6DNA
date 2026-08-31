-- Normalize the single legacy `resource` guide type to the 31-character `meter` convention.
-- Content, review state, patch, and publication state are unchanged.

update character_guide_sections gs
set section_type='meter', updated_at=now()
from characters c
where gs.character_id=c.id
  and c.slug='ryu'
  and gs.section_type='resource'
  and gs.status='draft'
  and gs.verification_status='reviewed'
  and not exists (
    select 1
    from character_guide_sections existing
    where existing.character_id=gs.character_id
      and existing.section_type='meter'
  );
