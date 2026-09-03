create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists public.patches (
  id uuid primary key default gen_random_uuid(),
  version_label text not null unique,
  name text,
  released_at timestamptz,
  official_url text,
  notes text,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists patches_one_current_idx on public.patches ((is_current)) where is_current = true;

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  source_type text not null,
  publisher text,
  published_at timestamptz,
  accessed_at timestamptz,
  reliability_level text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ja text not null,
  name_en text,
  short_name text,
  image_url text,
  release_date date,
  archetype text,
  difficulty smallint check (difficulty between 1 and 5),
  preferred_range text,
  summary text,
  strengths_summary text,
  weaknesses_summary text,
  is_playable boolean not null default true,
  display_order integer,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.character_aliases (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  alias text not null,
  normalized_alias text not null,
  locale text,
  created_at timestamptz not null default now(),
  unique(character_id, normalized_alias)
);
create index if not exists character_aliases_normalized_trgm_idx on public.character_aliases using gin (normalized_alias gin_trgm_ops);

create table if not exists public.character_guide_sections (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  section_type text not null,
  title text not null,
  body text not null,
  summary text,
  difficulty_level text,
  display_order integer not null default 0,
  valid_from_patch_id uuid references public.patches(id),
  valid_to_patch_id uuid references public.patches(id),
  verification_status text not null default 'unverified',
  content_kind text not null default 'editorial',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.moves (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  slug text not null unique,
  name_ja text not null,
  name_en text,
  move_type text not null,
  strength_variant text,
  description text,
  usage_summary text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.move_aliases (
  id uuid primary key default gen_random_uuid(),
  move_id uuid not null references public.moves(id) on delete cascade,
  alias text not null,
  normalized_alias text not null,
  alias_type text,
  created_at timestamptz not null default now(),
  unique(move_id, normalized_alias)
);
create index if not exists move_aliases_normalized_trgm_idx on public.move_aliases using gin (normalized_alias gin_trgm_ops);

create table if not exists public.move_commands (
  id uuid primary key default gen_random_uuid(),
  move_id uuid not null references public.moves(id) on delete cascade,
  control_scheme text not null check (control_scheme in ('classic','modern')),
  command_text text not null,
  numeric_notation text,
  button_notation text,
  condition_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.move_frame_data (
  id uuid primary key default gen_random_uuid(),
  move_id uuid not null references public.moves(id) on delete cascade,
  startup text,
  active text,
  recovery text,
  on_hit text,
  on_block text,
  damage integer,
  drive_damage integer,
  super_gain integer,
  cancel_type text,
  hit_level text,
  invincibility text,
  notes text,
  valid_from_patch_id uuid references public.patches(id),
  valid_to_patch_id uuid references public.patches(id),
  verification_status text not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.combos (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  slug text not null unique,
  name text not null,
  combo_type text not null,
  notation text not null,
  starter_text text,
  damage integer,
  drive_cost numeric(5,2),
  drive_gain numeric(5,2),
  sa_cost smallint,
  position text,
  side_requirement text,
  difficulty smallint check (difficulty between 1 and 5),
  purpose text,
  conditions text,
  notes text,
  video_url text,
  valid_from_patch_id uuid references public.patches(id),
  valid_to_patch_id uuid references public.patches(id),
  verification_status text not null default 'unverified',
  content_kind text not null default 'verified_strategy',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.combo_moves (
  combo_id uuid not null references public.combos(id) on delete cascade,
  move_id uuid not null references public.moves(id) on delete cascade,
  step_order integer not null,
  note text,
  primary key (combo_id, step_order)
);

create table if not exists public.setups (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  slug text not null unique,
  name text not null,
  setup_type text,
  starter_condition text,
  sequence_text text,
  frame_advantage text,
  position text,
  meter_condition text,
  description text,
  counter_notes text,
  valid_from_patch_id uuid references public.patches(id),
  valid_to_patch_id uuid references public.patches(id),
  verification_status text not null default 'unverified',
  content_kind text not null default 'verified_strategy',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.setup_moves (
  setup_id uuid not null references public.setups(id) on delete cascade,
  move_id uuid not null references public.moves(id) on delete cascade,
  step_order integer not null,
  note text,
  primary key (setup_id, step_order)
);

create table if not exists public.sequences (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  slug text not null unique,
  name text not null,
  sequence_type text,
  sequence_text text,
  is_true_blockstring boolean,
  mash_point text,
  throw_point text,
  shimmy_point text,
  jump_option text,
  parry_option text,
  drive_reversal_option text,
  invincible_option text,
  notes text,
  valid_from_patch_id uuid references public.patches(id),
  valid_to_patch_id uuid references public.patches(id),
  verification_status text not null default 'unverified',
  content_kind text not null default 'verified_strategy',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.counters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  defender_character_id uuid references public.characters(id),
  opponent_character_id uuid references public.characters(id),
  target_type text not null,
  target_id uuid,
  situation text,
  counter_type text,
  title text not null,
  summary text,
  method text,
  benefit text,
  risk text,
  difficulty smallint check (difficulty between 1 and 5),
  conditions text,
  valid_from_patch_id uuid references public.patches(id),
  valid_to_patch_id uuid references public.patches(id),
  verification_status text not null default 'unverified',
  content_kind text not null default 'verified_strategy',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trainings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  training_type text,
  purpose text,
  level text,
  duration_minutes integer,
  player_character_id uuid references public.characters(id),
  dummy_character_id uuid references public.characters(id),
  recording_instructions text,
  playback_settings text,
  cpu_settings text,
  method text,
  success_criteria text,
  recommended_reps integer,
  next_step text,
  valid_from_patch_id uuid references public.patches(id),
  valid_to_patch_id uuid references public.patches(id),
  verification_status text not null default 'unverified',
  content_kind text not null default 'verified_strategy',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.training_relations (
  training_id uuid not null references public.trainings(id) on delete cascade,
  related_type text not null,
  related_id uuid not null,
  relationship text,
  primary key (training_id, related_type, related_id)
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  real_name text,
  country_code text,
  region text,
  player_type text,
  team_name text,
  bio text,
  image_url text,
  youtube_url text,
  twitch_url text,
  x_url text,
  website_url text,
  is_active boolean not null default true,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.player_aliases (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  alias text not null,
  normalized_alias text not null,
  created_at timestamptz not null default now(),
  unique(player_id, normalized_alias)
);
create index if not exists player_aliases_normalized_trgm_idx on public.player_aliases using gin (normalized_alias gin_trgm_ops);

create table if not exists public.player_characters (
  player_id uuid not null references public.players(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  role text not null default 'main',
  valid_from_patch_id uuid references public.patches(id),
  valid_to_patch_id uuid references public.patches(id),
  note text,
  primary key (player_id, character_id, role)
);

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  series_name text,
  start_date date,
  end_date date,
  region text,
  venue text,
  event_type text,
  scale text,
  official_url text,
  notes text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tournament_results (
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  placement integer,
  note text,
  primary key (tournament_id, player_id)
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  platform text not null default 'youtube',
  external_id text,
  title text not null,
  url text not null,
  thumbnail_url text,
  published_at timestamptz,
  description text,
  video_type text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references public.tournaments(id) on delete set null,
  round_name text,
  played_at timestamptz,
  best_of integer,
  winner_player_id uuid references public.players(id),
  score_text text,
  video_id uuid references public.videos(id) on delete set null,
  notes text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.match_participants (
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  side smallint not null,
  character_id uuid references public.characters(id),
  is_winner boolean,
  primary key (match_id, side)
);

create table if not exists public.glossary (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  term text not null,
  short_definition text,
  definition text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.glossary_aliases (
  id uuid primary key default gen_random_uuid(),
  glossary_id uuid not null references public.glossary(id) on delete cascade,
  alias text not null,
  normalized_alias text not null,
  unique(glossary_id, normalized_alias)
);

create table if not exists public.entity_sources (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  source_id uuid not null references public.sources(id) on delete cascade,
  relationship text not null default 'supporting',
  note text,
  unique(entity_type, entity_id, source_id)
);

create table if not exists public.diagnoses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  diagnosis_type text not null,
  question_count integer not null default 0,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diagnosis_questions (
  id uuid primary key default gen_random_uuid(),
  diagnosis_id uuid not null references public.diagnoses(id) on delete cascade,
  prompt text not null,
  help_text text,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diagnosis_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.diagnosis_questions(id) on delete cascade,
  label text not null,
  value text not null,
  score_payload jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user','admin')),
  sf6_id text,
  sf6_id_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diagnosis_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  diagnosis_id uuid not null references public.diagnoses(id) on delete cascade,
  result_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, entity_type, entity_id)
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['patches','sources','characters','character_guide_sections','moves','move_frame_data','combos','setups','sequences','counters','trainings','players','tournaments','videos','matches','glossary','diagnoses','diagnosis_questions','profiles']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;
