create table if not exists public.character_traits (
  id uuid primary key default gen_random_uuid(),
  trait_key text not null unique,
  label text not null,
  description text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.character_trait_scores (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  trait_id uuid not null references public.character_traits(id) on delete cascade,
  score smallint not null check (score between 0 and 5),
  verification_status text not null default 'unverified' check (verification_status in ('unverified','reviewed','verified')),
  source_id uuid references public.sources(id) on delete set null,
  note text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(character_id, trait_id)
);

create index if not exists idx_character_trait_scores_character on public.character_trait_scores(character_id);
create index if not exists idx_character_trait_scores_trait on public.character_trait_scores(trait_id);

alter table public.character_traits enable row level security;
alter table public.character_trait_scores enable row level security;

drop policy if exists "public read published character traits" on public.character_traits;
create policy "public read published character traits" on public.character_traits for select using (status = 'published');
drop policy if exists "admin manage character traits" on public.character_traits;
create policy "admin manage character traits" on public.character_traits for all using (private.is_admin()) with check (private.is_admin());

drop policy if exists "public read published character trait scores" on public.character_trait_scores;
create policy "public read published character trait scores" on public.character_trait_scores for select using (status = 'published' and verification_status = 'verified');
drop policy if exists "admin manage character trait scores" on public.character_trait_scores;
create policy "admin manage character trait scores" on public.character_trait_scores for all using (private.is_admin()) with check (private.is_admin());

insert into public.character_traits (trait_key,label,description,display_order,status) values
('aggression','前に出る攻め','自分から接近・攻めを開始しやすい特性。',10,'published'),
('patience','待ち・観察','相手の行動を観察して対応しやすい特性。',20,'published'),
('keepout','遠距離・けん制','遠距離や長い技・飛び道具で空間を管理する特性。',30,'published'),
('rushdown','近距離ラッシュ','接近後の継続的な近距離攻めを重視する特性。',40,'published'),
('grappling','投げ・コマンド投げ','投げを主要な勝ち筋として扱う特性。',50,'published'),
('setup','設置・セットプレイ','事前準備や有利状況から攻めを組み立てる特性。',60,'published'),
('footsies','差し合い・地上戦','歩き・通常技・差し返しなど地上戦を重視する特性。',70,'published'),
('mobility','機動力・位置調整','移動性能や位置入れ替えを活用する特性。',80,'published'),
('simplicity','操作の分かりやすさ','比較的シンプルな操作・役割で判断に集中しやすい特性。',90,'published'),
('technicality','テクニカル操作','操作・選択肢・研究量の深さを活かす特性。',100,'published'),
('defense_preference','守りから組み立てる','防御・迎撃から試合を組み立てやすい特性。',110,'published'),
('explosive','一気に試合を動かす','一度の読み勝ちやリソース投入で大きく展開を変える特性。',120,'published')
on conflict (trait_key) do update set label=excluded.label, description=excluded.description, display_order=excluded.display_order, status=excluded.status;
