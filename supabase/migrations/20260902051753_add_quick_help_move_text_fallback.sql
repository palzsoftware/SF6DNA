
with flow as (
  select id
  from public.coach_quick_help_flows
  where slug='quick-help'
),
node_data(node_key,node_type,prompt,input_type,answer_key,topic_key,help_text,sort_order) as (
  values
    ('move_lookup_choice','question','技名は分かりますか？','static','move_lookup_method','specific_move','一覧にない場合や技名が分からない場合は、見た目や状況を入力できます。',125),
    ('move_detail_text','question','技名、見た目、受けた場面を短く入力してください。','free_text','move_description','specific_move','例：「ホンダの頭突き」「ザンギエフが頭を振り下ろす技」',135)
)
insert into public.coach_quick_help_nodes (
  flow_id,node_key,node_type,prompt,input_type,answer_key,topic_key,help_text,sort_order
)
select
  f.id,d.node_key,d.node_type,d.prompt,d.input_type,d.answer_key,d.topic_key,d.help_text,d.sort_order
from flow f
cross join node_data d
on conflict (flow_id,node_key) do update
set
  node_type=excluded.node_type,
  prompt=excluded.prompt,
  input_type=excluded.input_type,
  answer_key=excluded.answer_key,
  topic_key=excluded.topic_key,
  help_text=excluded.help_text,
  sort_order=excluded.sort_order;

with flow as (
  select id from public.coach_quick_help_flows where slug='quick-help'
)
update public.coach_quick_help_nodes source
set default_next_node_id=target.id
from flow f
join public.coach_quick_help_nodes target
  on target.flow_id=f.id
 and target.node_key='move_lookup_choice'
where source.flow_id=f.id
  and source.node_key='move_character';

with flow as (
  select id from public.coach_quick_help_flows where slug='quick-help'
)
update public.coach_quick_help_nodes source
set default_next_node_id=target.id
from flow f
join public.coach_quick_help_nodes target
  on target.flow_id=f.id
 and target.node_key='move_problem'
where source.flow_id=f.id
  and source.node_key='move_detail_text';

with flow as (
  select id from public.coach_quick_help_flows where slug='quick-help'
),
option_data(option_key,label,option_value,next_node_key,sort_order) as (
  values
    ('select_from_list','技一覧から選ぶ','select_from_list','move_select',10),
    ('describe_move','技名や見た目を入力する','describe_move','move_detail_text',20)
)
insert into public.coach_quick_help_options (
  node_id,option_key,label,option_value,next_node_id,metadata,sort_order
)
select
  source.id,
  d.option_key,
  d.label,
  d.option_value,
  target.id,
  '{}'::jsonb,
  d.sort_order
from flow f
join public.coach_quick_help_nodes source
  on source.flow_id=f.id
 and source.node_key='move_lookup_choice'
join option_data d on true
join public.coach_quick_help_nodes target
  on target.flow_id=f.id
 and target.node_key=d.next_node_key
on conflict (node_id,option_key) do update
set
  label=excluded.label,
  option_value=excluded.option_value,
  next_node_id=excluded.next_node_id,
  metadata=excluded.metadata,
  sort_order=excluded.sort_order;

with flow as (
  select id from public.coach_quick_help_flows where slug='quick-help'
),
target_node as (
  select n.id
  from public.coach_quick_help_nodes n
  join flow f on f.id=n.flow_id
  where n.node_key='character_problem'
)
update public.coach_quick_help_options o
set
  option_key='how_to_attack',
  option_value='how_to_attack',
  label='こちらから攻める方法'
from target_node n
where o.node_id=n.id
  and o.option_key='defense';
