-- Close the stale JP collection flag after the final 31-character coverage audit.
-- Verification remains review; this does not promote any content to verified/published.

update character_content_packages p
set source_status='review',
    notes=concat_ws(E'\n',nullif(p.notes,''),'2026-09-01 phase33b: source collection flag reconciled after cross-character audit; capture/verification still pending.'),
    updated_at=now()
from characters c
where c.id=p.character_id
  and c.slug='jp'
  and p.source_status='in_progress';

