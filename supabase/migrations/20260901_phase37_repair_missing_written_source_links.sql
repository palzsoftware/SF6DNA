-- Repair written-source links that were listed in collection migrations but
-- were not inserted into sources, causing the relationship insert to no-op.
-- No content is promoted by this repair.

begin;

insert into public.sources (
  title,
  url,
  source_type,
  publisher,
  published_at,
  accessed_at,
  reliability_level,
  notes
)
select *
from (values
  (
    'モダンA.K.I. 立ち回り・コンボ・起き攻め',
    'https://www.sukoreru.com/sf6-modern-aki',
    'community_guide',
    'すこれるブログ（仮）',
    null::timestamptz,
    now(),
    'community',
    'Written/image Modern A.K.I. guide used by the phase30 collection.'
  ),
  (
    'vsA.K.I. キャラ対メモ S4 (2026/8/13)',
    'https://note.com/emesirna/n/nf0ef76289f94',
    'community_guide',
    'さーな',
    null::timestamptz,
    now(),
    'community',
    'Written current-patch poison, punish-counter and pressure reference.'
  ),
  (
    'C:A.K.I.と行くact12 起き攻め強化',
    'https://note.com/terry631/n/n5f5eab88b9c7',
    'community_guide',
    'ムサイ',
    '2026-08-01 00:00:00+00'::timestamptz,
    now(),
    'community',
    'Written +44F H Serpent Lash oki and frame-consumption reference.'
  ),
  (
    'ラシード攻略：コンボと起き攻め厳選',
    'https://note.com/nikotarosun/n/n582575ab1388',
    'community_guide',
    'にこ太郎',
    '2024-09-09 00:00:00+00'::timestamptz,
    now(),
    'community',
    'Written Rashid combo, oki and Ysaar route reference.'
  ),
  (
    'ラシード、おもしれー男',
    'https://note.com/oldistrict77/n/n2d25c56f3255',
    'community_guide',
    'S_T_G',
    null::timestamptz,
    now(),
    'community',
    'Written Rashid M Eagle Spike oki reference.'
  ),
  (
    'ラシード 起き攻めセットプレイメモ',
    'https://note.com/shinakuma/n/n8ae9d6618c41',
    'community_guide',
    'J.Cole',
    '2024-12-08 00:00:00+00'::timestamptz,
    now(),
    'community',
    'Written Rashid knockdown frame and oki reference; legacy claims remain unverified.'
  ),
  (
    'これから始めるモダンラシード とりこれ',
    'https://note.com/emesirna/n/n684620436146',
    'community_guide',
    'さーな',
    null::timestamptz,
    now(),
    'community',
    'Written Modern Rashid corner throw and assist pressure reference.'
  ),
  (
    'ラシード（モダン）編 Year4版初心者おすすめキャラ',
    'https://note.com/buredon/n/n1ef19d2dc009',
    'community_guide',
    'BUREDON',
    null::timestamptz,
    now(),
    'community',
    'Written Year4 Modern Rashid overview and corner oki reference.'
  ),
  (
    'vsラシード キャラ対メモ S4 (2026/8/13)',
    'https://note.com/emesirna/n/n668f842a7bc4',
    'community_guide',
    'さーな',
    null::timestamptz,
    now(),
    'community',
    'Written current-patch Rashid pressure and counterplay reference.'
  )
) as v(
  title,
  url,
  source_type,
  publisher,
  published_at,
  accessed_at,
  reliability_level,
  notes
)
where not exists (
  select 1
  from public.sources s
  where s.url = v.url
);

create temporary table phase37_written_source_map (
  entity_type text not null,
  entity_slug text not null,
  source_url text not null
) on commit drop;

insert into phase37_written_source_map values
  ('combo', 'aki-y4-2hp-pc-poison', 'https://note.com/emesirna/n/nf0ef76289f94'),
  ('combo', 'aki-y4-modern-dr-overhead', 'https://www.sukoreru.com/sf6-modern-aki'),
  ('sequence', 'aki-y4-modern-poison-cycle', 'https://www.sukoreru.com/sf6-modern-aki'),
  ('sequence', 'aki-y4-poison-state-cycle', 'https://note.com/emesirna/n/nf0ef76289f94'),
  ('setup', 'aki-y4-hwhip44-dash-overhead', 'https://note.com/terry631/n/n5f5eab88b9c7'),
  ('setup', 'aki-y4-hwhip44-double-dash', 'https://note.com/terry631/n/n5f5eab88b9c7'),
  ('setup', 'aki-y4-modern-dr-overhead-oki', 'https://www.sukoreru.com/sf6-modern-aki'),
  ('setup', 'aki-y4-modern-hwhip44', 'https://www.sukoreru.com/sf6-modern-aki'),
  ('setup', 'aki-y4-modern-od-cruelfate', 'https://www.sukoreru.com/sf6-modern-aki'),
  ('combo', 'rashid-y4-corner-sa2-overhead', 'https://note.com/nikotarosun/n/n582575ab1388'),
  ('sequence', 'rashid-y4-hcyclone-plus-tree', 'https://note.com/emesirna/n/n668f842a7bc4'),
  ('setup', 'rashid-y4-corner-throw-loop', 'https://note.com/emesirna/n/n684620436146'),
  ('setup', 'rashid-y4-heagle56-backup', 'https://note.com/shinakuma/n/n8ae9d6618c41'),
  ('setup', 'rashid-y4-meagle52-jump-framekill', 'https://note.com/oldistrict77/n/n2d25c56f3255'),
  ('setup', 'rashid-y4-meagle65-flip', 'https://note.com/shinakuma/n/n8ae9d6618c41'),
  ('setup', 'rashid-y4-mmixer31-dr', 'https://note.com/shinakuma/n/n8ae9d6618c41'),
  ('setup', 'rashid-y4-modern-corner-throw', 'https://note.com/buredon/n/n1ef19d2dc009'),
  ('setup', 'rashid-y4-odmixer9', 'https://note.com/shinakuma/n/n8ae9d6618c41');

create temporary table phase37_resolved_entities on commit drop as
select m.entity_type, x.id as entity_id, s.id as source_id
from phase37_written_source_map m
join lateral (
  select c.id from public.combos c
  where m.entity_type = 'combo' and c.slug = m.entity_slug
  union all
  select st.id from public.setups st
  where m.entity_type = 'setup' and st.slug = m.entity_slug
  union all
  select sq.id from public.sequences sq
  where m.entity_type = 'sequence' and sq.slug = m.entity_slug
) x on true
join public.sources s on s.url = m.source_url;

do $$
declare
  expected_count integer;
  resolved_count integer;
begin
  select count(*) into expected_count from phase37_written_source_map;
  select count(*) into resolved_count from phase37_resolved_entities;

  if expected_count <> resolved_count then
    raise exception 'phase37 source repair resolved % of % mappings',
      resolved_count,
      expected_count;
  end if;
end
$$;

insert into public.entity_sources (
  entity_type,
  entity_id,
  source_id,
  relationship,
  note
)
select
  entity_type,
  entity_id,
  source_id,
  'supporting',
  'Written/image source recorded by the original collection migration; relationship repaired after Source audit.'
from phase37_resolved_entities
on conflict (entity_type, entity_id, source_id) do nothing;

insert into public.entity_sources (
  entity_type,
  entity_id,
  source_id,
  relationship,
  note
)
select distinct
  'training',
  tr.training_id,
  r.source_id,
  'supporting',
  'Written/image source for the related strategy; relationship repaired after Source audit.'
from phase37_resolved_entities r
join public.training_relations tr
  on tr.related_type = r.entity_type
  and tr.related_id = r.entity_id
on conflict (entity_type, entity_id, source_id) do nothing;

commit;
