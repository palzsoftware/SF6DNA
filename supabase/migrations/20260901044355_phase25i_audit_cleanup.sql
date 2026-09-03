-- Final audit cleanup after the cross-character representative-coverage repair.
-- Adds the missing source for one Modern Ryu candidate and removes one duplicated
-- Manon route from the active/capture counts without deleting its history.

insert into sources(title,url,source_type,publisher,published_at,accessed_at,reliability_level,notes)
select
  'モダンタイプ リュウ 基本攻略・コンボ',
  'https://goziline.com/archives/54017',
  'community_guide',
  'ゴジライン',
  null::timestamptz,
  now(),
  'community',
  'Written Modern Ryu route; current-patch capture required.'
where not exists(
  select 1 from sources where url='https://goziline.com/archives/54017'
);

insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select
  'combo',c.id,s.id,'supporting',
  'Written Modern route; exact assist/autocombo branch requires current-device capture.'
from combos c
join sources s on s.url='https://goziline.com/archives/54017'
where c.slug='ryu-modern-m-l-dp'
on conflict(entity_type,entity_id,source_id) do nothing;

-- The phase25g row exactly duplicates manon-modern-overhead notation and source.
-- Keep the earlier canonical row active and retain the later row as archived history.
update combos
set status='archived',
    notes=concat_ws(E'\n',nullif(notes,''),
      'Archived 2026-09-01: exact notation/source duplicate of manon-modern-overhead.'),
    updated_at=now()
where slug='manon-p25g-modern-enhaut-cdr'
  and status<>'archived';

update trainings
set status='archived',
    updated_at=now()
where slug='training-manon-p25g-modern-enhaut-cdr'
  and status<>'archived';

update capture_backlog cb
set capture_status='not_needed',
    request_notes=concat_ws(E'\n',nullif(cb.request_notes,''),
      'Not needed: exact route is covered by training-manon-modern-overhead.'),
    updated_at=now()
from trainings t
where cb.training_id=t.id
  and t.slug='training-manon-p25g-modern-enhaut-cdr'
  and cb.capture_status='pending';
