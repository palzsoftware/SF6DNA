
create table public.coach_quick_help_flows (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  root_node_id uuid,
  version integer not null default 1,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(slug) between 1 and 100),
  check (char_length(title) between 1 and 160),
  check (description is null or char_length(description) <= 1000),
  check (version >= 1)
);

create table public.coach_quick_help_nodes (
  id uuid primary key default gen_random_uuid(),
  flow_id uuid not null
    references public.coach_quick_help_flows(id) on delete cascade,
  node_key text not null,
  node_type text not null
    check (node_type in ('question', 'handoff')),
  prompt text not null,
  input_type text not null
    check (input_type in ('static', 'character', 'move', 'free_text', 'none')),
  answer_key text,
  topic_key text,
  default_next_node_id uuid
    references public.coach_quick_help_nodes(id) on delete set null,
  help_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (flow_id, node_key),
  check (char_length(node_key) between 1 and 100),
  check (char_length(prompt) between 1 and 500),
  check (answer_key is null or char_length(answer_key) <= 100),
  check (topic_key is null or char_length(topic_key) <= 100),
  check (help_text is null or char_length(help_text) <= 500),
  check (
    (node_type = 'handoff' and input_type = 'none')
    or (node_type = 'question' and input_type <> 'none')
  )
);

alter table public.coach_quick_help_flows
  add constraint coach_quick_help_flows_root_node_fkey
  foreign key (root_node_id)
  references public.coach_quick_help_nodes(id)
  on delete set null;

create table public.coach_quick_help_options (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null
    references public.coach_quick_help_nodes(id) on delete cascade,
  option_key text not null,
  label text not null,
  option_value text not null,
  next_node_id uuid not null
    references public.coach_quick_help_nodes(id) on delete restrict,
  metadata jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (node_id, option_key),
  check (char_length(option_key) between 1 and 100),
  check (char_length(label) between 1 and 200),
  check (char_length(option_value) between 1 and 200),
  check (jsonb_typeof(metadata) = 'object')
);

create table public.coach_quick_help_intakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null
    references public.profiles(id) on delete cascade,
  flow_id uuid not null
    references public.coach_quick_help_flows(id),
  current_node_id uuid
    references public.coach_quick_help_nodes(id) on delete set null,
  ai_coach_session_id uuid
    references public.ai_coach_sessions(id) on delete set null,
  status text not null default 'active'
    check (status in ('active', 'ready', 'linked', 'abandoned')),
  topic_key text,
  context jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  check (topic_key is null or char_length(topic_key) <= 100),
  check (jsonb_typeof(context) = 'object')
);

create table public.coach_quick_help_answers (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null
    references public.coach_quick_help_intakes(id) on delete cascade,
  user_id uuid not null
    references public.profiles(id) on delete cascade,
  node_id uuid not null
    references public.coach_quick_help_nodes(id),
  option_id uuid
    references public.coach_quick_help_options(id),
  selected_character_id uuid
    references public.characters(id),
  selected_move_id uuid
    references public.moves(id),
  free_text text,
  answer_payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (intake_id, node_id),
  check (
    num_nonnulls(
      option_id,
      selected_character_id,
      selected_move_id,
      free_text
    ) = 1
  ),
  check (free_text is null or char_length(free_text) between 1 and 2000),
  check (jsonb_typeof(answer_payload) = 'object')
);

create index coach_quick_help_flows_status_idx
  on public.coach_quick_help_flows (status, slug);

create index coach_quick_help_nodes_flow_sort_idx
  on public.coach_quick_help_nodes (flow_id, sort_order, node_key);

create index coach_quick_help_nodes_default_next_idx
  on public.coach_quick_help_nodes (default_next_node_id)
  where default_next_node_id is not null;

create index coach_quick_help_options_node_sort_idx
  on public.coach_quick_help_options (node_id, sort_order, option_key);

create index coach_quick_help_options_next_node_idx
  on public.coach_quick_help_options (next_node_id);

create index coach_quick_help_intakes_user_updated_idx
  on public.coach_quick_help_intakes (user_id, updated_at desc);

create index coach_quick_help_intakes_flow_idx
  on public.coach_quick_help_intakes (flow_id);

create index coach_quick_help_intakes_current_node_idx
  on public.coach_quick_help_intakes (current_node_id)
  where current_node_id is not null;

create unique index coach_quick_help_intakes_session_key
  on public.coach_quick_help_intakes (ai_coach_session_id)
  where ai_coach_session_id is not null;

create index coach_quick_help_answers_user_idx
  on public.coach_quick_help_answers (user_id);

create index coach_quick_help_answers_node_idx
  on public.coach_quick_help_answers (node_id);

alter table public.coach_quick_help_flows enable row level security;
alter table public.coach_quick_help_nodes enable row level security;
alter table public.coach_quick_help_options enable row level security;
alter table public.coach_quick_help_intakes enable row level security;
alter table public.coach_quick_help_answers enable row level security;

create policy "read published or admin quick help flows"
on public.coach_quick_help_flows
for select
to anon, authenticated
using (status = 'published' or (select private.is_admin()));

create policy "admin insert quick help flows"
on public.coach_quick_help_flows
for insert
to authenticated
with check ((select private.is_admin()));

create policy "admin update quick help flows"
on public.coach_quick_help_flows
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admin delete quick help flows"
on public.coach_quick_help_flows
for delete
to authenticated
using ((select private.is_admin()));

create policy "read published or admin quick help nodes"
on public.coach_quick_help_nodes
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.coach_quick_help_flows f
    where f.id = coach_quick_help_nodes.flow_id
      and (f.status = 'published' or (select private.is_admin()))
  )
);

create policy "admin insert quick help nodes"
on public.coach_quick_help_nodes
for insert
to authenticated
with check ((select private.is_admin()));

create policy "admin update quick help nodes"
on public.coach_quick_help_nodes
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admin delete quick help nodes"
on public.coach_quick_help_nodes
for delete
to authenticated
using ((select private.is_admin()));

create policy "read published or admin quick help options"
on public.coach_quick_help_options
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.coach_quick_help_nodes n
    join public.coach_quick_help_flows f on f.id = n.flow_id
    where n.id = coach_quick_help_options.node_id
      and (f.status = 'published' or (select private.is_admin()))
  )
);

create policy "admin insert quick help options"
on public.coach_quick_help_options
for insert
to authenticated
with check ((select private.is_admin()));

create policy "admin update quick help options"
on public.coach_quick_help_options
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "admin delete quick help options"
on public.coach_quick_help_options
for delete
to authenticated
using ((select private.is_admin()));

create policy "users read own quick help intakes"
on public.coach_quick_help_intakes
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "users insert own quick help intakes"
on public.coach_quick_help_intakes
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "users update own quick help intakes"
on public.coach_quick_help_intakes
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    ai_coach_session_id is null
    or exists (
      select 1
      from public.ai_coach_sessions s
      where s.id = coach_quick_help_intakes.ai_coach_session_id
        and s.user_id = (select auth.uid())
    )
  )
);

create policy "users delete own quick help intakes"
on public.coach_quick_help_intakes
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "users read own quick help answers"
on public.coach_quick_help_answers
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "users insert own quick help answers"
on public.coach_quick_help_answers
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.coach_quick_help_intakes i
    where i.id = coach_quick_help_answers.intake_id
      and i.user_id = (select auth.uid())
  )
);

create policy "users delete own quick help answers"
on public.coach_quick_help_answers
for delete
to authenticated
using ((select auth.uid()) = user_id);

create trigger set_updated_at
before update on public.coach_quick_help_flows
for each row execute function public.set_updated_at();

create trigger set_updated_at
before update on public.coach_quick_help_nodes
for each row execute function public.set_updated_at();

create trigger set_updated_at
before update on public.coach_quick_help_options
for each row execute function public.set_updated_at();

create trigger set_updated_at
before update on public.coach_quick_help_intakes
for each row execute function public.set_updated_at();

revoke all on table public.coach_quick_help_flows from anon, authenticated;
revoke all on table public.coach_quick_help_nodes from anon, authenticated;
revoke all on table public.coach_quick_help_options from anon, authenticated;
revoke all on table public.coach_quick_help_intakes from anon, authenticated;
revoke all on table public.coach_quick_help_answers from anon, authenticated;

grant select on table public.coach_quick_help_flows to anon, authenticated;
grant select on table public.coach_quick_help_nodes to anon, authenticated;
grant select on table public.coach_quick_help_options to anon, authenticated;

grant insert, select, update, delete
  on table public.coach_quick_help_flows to authenticated;
grant insert, select, update, delete
  on table public.coach_quick_help_nodes to authenticated;
grant insert, select, update, delete
  on table public.coach_quick_help_options to authenticated;
grant insert, select, update, delete
  on table public.coach_quick_help_intakes to authenticated;
grant insert, select, delete
  on table public.coach_quick_help_answers to authenticated;

grant all on table public.coach_quick_help_flows to service_role;
grant all on table public.coach_quick_help_nodes to service_role;
grant all on table public.coach_quick_help_options to service_role;
grant all on table public.coach_quick_help_intakes to service_role;
grant all on table public.coach_quick_help_answers to service_role;
