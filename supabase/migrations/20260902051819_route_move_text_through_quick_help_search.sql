
update public.coach_quick_help_nodes n
set answer_key='question_detail'
from public.coach_quick_help_flows f
where f.id=n.flow_id
  and f.slug='quick-help'
  and n.node_key='move_detail_text';
