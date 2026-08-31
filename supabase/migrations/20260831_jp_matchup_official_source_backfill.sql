with rebuilt as (
  select co.id as counter_id,o.id as opponent_id
  from counters co
  join characters d on d.id=co.defender_character_id and d.slug='jp'
  join characters o on o.id=co.opponent_character_id
  where co.status='draft'
    and co.verification_status='reviewed'
    and (co.slug like 'jp-vs-%' or co.slug like 'jp-matchup-%')
), opponent_official as (
  select distinct r.counter_id,s.id as source_id
  from rebuilt r
  join entity_sources es
    on es.entity_type='character'
   and es.entity_id=r.opponent_id
  join sources s
    on s.id=es.source_id
   and s.publisher='CAPCOM'
   and s.source_type='official_patch'
)
insert into entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'counter',counter_id,source_id,'supporting',
       'Opponent official 2026.08.03 patch baseline for JP matchup review.'
from opponent_official
on conflict(entity_type,entity_id,source_id) do update set
  relationship=excluded.relationship,
  note=excluded.note;
