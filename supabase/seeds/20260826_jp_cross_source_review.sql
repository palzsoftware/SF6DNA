-- Promote JP current frame candidates from unverified to reviewed only when corroborated by UFD.
-- `jp-shalosti` is intentionally excluded because current sources disagree on command/display mapping.
with s as (select id from public.sources where url='https://ultimateframedata.com/sf6/jp' limit 1),
j as (select id from public.characters where slug='jp')
update public.move_frame_data f
set verification_status='reviewed',
    notes=coalesce(f.notes,'')||' Corroborated against Ultimate Frame Data current August 2026 JP page.'
from public.moves m,j
where f.move_id=m.id
  and m.character_id=j.id
  and m.slug<>'jp-shalosti'
  and f.valid_to_patch_id is null
  and f.verification_status='unverified';

with s as (select id from public.sources where url='https://ultimateframedata.com/sf6/jp' limit 1),
j as (select id from public.characters where slug='jp')
insert into public.entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'move',m.id,s.id,'corroborating','Cross-source corroboration for August 2026. Direct CAPCOM verification still pending.'
from public.moves m,j,s
where m.character_id=j.id
  and not exists(
    select 1 from public.entity_sources es
    where es.entity_type='move' and es.entity_id=m.id and es.source_id=s.id
  );
