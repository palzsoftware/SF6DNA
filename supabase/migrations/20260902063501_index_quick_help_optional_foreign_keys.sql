
create index if not exists coach_quick_help_answers_option_idx
  on public.coach_quick_help_answers (option_id)
  where option_id is not null;

create index if not exists coach_quick_help_answers_selected_character_idx
  on public.coach_quick_help_answers (selected_character_id)
  where selected_character_id is not null;

create index if not exists coach_quick_help_answers_selected_move_idx
  on public.coach_quick_help_answers (selected_move_id)
  where selected_move_id is not null;

create index if not exists coach_quick_help_flows_root_node_idx
  on public.coach_quick_help_flows (root_node_id)
  where root_node_id is not null;
