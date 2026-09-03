create table if not exists public.character_content_packages (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null unique references public.characters(id) on delete cascade,
  rollout_status text not null default 'not_started' check (rollout_status in ('not_started','in_progress','review','complete','blocked')),
  move_status text not null default 'not_started',
  frame_status text not null default 'not_started',
  command_status text not null default 'not_started',
  alias_status text not null default 'not_started',
  combo_status text not null default 'not_started',
  setup_status text not null default 'not_started',
  sequence_status text not null default 'not_started',
  counter_status text not null default 'not_started',
  training_status text not null default 'not_started',
  player_status text not null default 'not_started',
  video_status text not null default 'not_started',
  trait_status text not null default 'not_started',
  source_status text not null default 'not_started',
  patch_status text not null default 'not_started',
  verification_status text not null default 'not_started',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint character_content_packages_stage_check check (
    move_status in ('not_started','in_progress','review','complete','blocked') and
    frame_status in ('not_started','in_progress','review','complete','blocked') and
    command_status in ('not_started','in_progress','review','complete','blocked') and
    alias_status in ('not_started','in_progress','review','complete','blocked') and
    combo_status in ('not_started','in_progress','review','complete','blocked') and
    setup_status in ('not_started','in_progress','review','complete','blocked') and
    sequence_status in ('not_started','in_progress','review','complete','blocked') and
    counter_status in ('not_started','in_progress','review','complete','blocked') and
    training_status in ('not_started','in_progress','review','complete','blocked') and
    player_status in ('not_started','in_progress','review','complete','blocked') and
    video_status in ('not_started','in_progress','review','complete','blocked') and
    trait_status in ('not_started','in_progress','review','complete','blocked') and
    source_status in ('not_started','in_progress','review','complete','blocked') and
    patch_status in ('not_started','in_progress','review','complete','blocked') and
    verification_status in ('not_started','in_progress','review','complete','blocked')
  )
);

create index if not exists character_content_packages_rollout_status_idx
  on public.character_content_packages(rollout_status);

alter table public.character_content_packages enable row level security;

drop policy if exists "admin manage character content packages" on public.character_content_packages;
create policy "admin manage character content packages" on public.character_content_packages
for all using (private.is_admin()) with check (private.is_admin());

insert into public.character_content_packages (
  character_id, rollout_status, move_status, frame_status, command_status, alias_status,
  combo_status, setup_status, sequence_status, counter_status, training_status,
  player_status, video_status, trait_status, source_status, patch_status,
  verification_status, notes
)
select c.id,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'review' else 'not_started' end,
  case when c.slug='jp' then 'in_progress' else 'not_started' end,
  case when c.slug='jp'
    then 'JP reference package: candidate data populated; final in-game verification remains.'
    else 'JP template rollout target.'
  end
from public.characters c
where c.status='published' and c.is_playable=true
on conflict (character_id) do nothing;
