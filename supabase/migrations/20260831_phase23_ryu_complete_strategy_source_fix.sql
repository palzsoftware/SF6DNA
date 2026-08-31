-- Attach each generated Ryu Training to the concrete recipe evidence of its related entity.
insert into public.entity_sources(entity_type,entity_id,source_id,relationship,note)
select 'training',tr.training_id,es.source_id,'supporting','Inherited recipe evidence from the related Ryu strategy item; reviewed, not verified.'
from public.training_relations tr
join public.entity_sources es
  on es.entity_type=tr.related_type and es.entity_id=tr.related_id
join public.trainings t on t.id=tr.training_id
where t.slug like 'training-ryu-y4-%'
on conflict(entity_type,entity_id,source_id) do nothing;
