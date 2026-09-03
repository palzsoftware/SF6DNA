-- Internal capture queue for combo/setup/sequence reproduction requests.
-- This table is not public product content. RLS is enabled with no client
-- policies; maintenance is performed only through trusted administrative flows.

create table if not exists public.capture_backlog (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  training_id uuid not null references public.trainings(id) on delete cascade,
  capture_status text not null default 'pending'
    check (capture_status in ('pending','provided','confirmed','rejected','not_needed')),
  priority smallint not null default 100 check (priority between 1 and 999),
  request_notes text,
  result_notes text,
  requested_at timestamptz,
  provided_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(training_id)
);

alter table public.capture_backlog enable row level security;
revoke all on table public.capture_backlog from anon, authenticated;

drop policy if exists "client deny capture backlog" on public.capture_backlog;
create policy "client deny capture backlog"
on public.capture_backlog
for all
to anon, authenticated
using (false)
with check (false);

create index if not exists capture_backlog_character_status_idx
  on public.capture_backlog(character_id,capture_status,priority);

insert into public.capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select c.id,t.id,'pending',
 case
   when t.name ilike '%SA2%' or t.name ilike '%SA3%' or t.name ilike '%詐欺飛び%' then 30
   when t.training_type in ('combo_retest','oki_retest') then 50
   else 80
 end,
 '既存の未検証レシピ。入力履歴・フレーム・ダメージ・Drive/SAを表示して撮影する。'
from public.trainings t
join public.characters c on c.id=t.player_character_id
where c.slug in ('ryu','jp')
  and t.status='draft'
  and t.verification_status='unverified'
  and t.training_type in ('combo_retest','oki_retest','pressure_retest','video_candidate_retest')
on conflict(training_id) do nothing;

insert into public.capture_backlog(character_id,training_id,capture_status,priority,request_notes)
select c.id,t.id,'pending',40,
 '動画・Shorts内の表示情報をユーザー撮影で確認する。画面内で確認できない入力は推測しない。'
from public.trainings t
join public.characters c on c.id=t.player_character_id
where c.slug='luke' and t.slug like 'luke-capture-%'
on conflict(training_id) do nothing;
