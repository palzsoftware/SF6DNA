-- SF6DNA v2 PostgreSQL schema draft
-- Phase3 data model reference only. This file is NOT a production migration yet.
-- Target: PostgreSQL / Supabase

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists patches (
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

create table if not exists sources (
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

create table if not exists characters (
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
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists character_aliases (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  alias text not null,
  normalized_alias text not null,
  locale text,
  created_at timestamptz not null default now(),
  unique(character_id, normalized_alias)
);

create table if not exists character_guide_sections (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  section_type text not null,
  title text not null,
  body text not null,
  summary text,
  difficulty_level text,
  display_order integer not null default 0,
  valid_from_patch_id uuid references patches(id),
  valid_to_patch_id uuid references patches(id),
  verification_status text not null default 'unverified',
  content_kind text not null default 'editorial',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists moves (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  slug text not null unique,
  name_ja text not null,
  name_en text,
  move_type text not null,
  strength_variant text,
  description text,
  usage_summary text,
  display_order integer not null default 0,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists move_aliases (
  id uuid primary key default gen_random_uuid(),
  move_id uuid not null references moves(id) on delete cascade,
  alias text not null,
  normalized_alias text not null,
  alias_type text,
  created_at timestamptz not null default now(),
  unique(move_id, normalized_alias)
);

create table if not exists move_commands (
  id uuid primary key default gen_random_uuid(),
  move_id uuid not null references moves(id) on delete cascade,
  control_scheme text not null check (control_scheme in ('classic','modern')),
  command_text text not null,
  numeric_notation text,
  button_notation text,
  condition_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists move_frame_data (
  id uuid primary key default gen_random_uuid(),
  move_id uuid not null references moves(id) on delete cascade,
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
  valid_from_patch_id uuid references patches(id),
  valid_to_patch_id uuid references patches(id),
  verification_status text not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists combos (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
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
  valid_from_patch_id uuid references patches(id),
  valid_to_patch_id uuid references patches(id),
  verification_status text not null default 'unverified',
  content_kind text not null default 'verified_strategy',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists combo_moves (
  combo_id uuid not null references combos(id) on delete cascade,
  move_id uuid not null references moves(id),
  step_order integer not null,
  note text,
  primary key(combo_id, step_order)
);

create table if not exists setups (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  slug text not null unique,
  name text not null,
  setup_type text,
  starter_condition text,
  sequence_text text not null,
  frame_advantage integer,
  position text,
  meter_condition text,
  description text,
  counter_notes text,
  valid_from_patch_id uuid references patches(id),
  valid_to_patch_id uuid references patches(id),
  verification_status text not null default 'unverified',
  content_kind text not null default 'verified_strategy',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists setup_moves (
  setup_id uuid not null references setups(id) on delete cascade,
  move_id uuid not null references moves(id),
  step_order integer not null,
  note text,
  primary key(setup_id, step_order)
);

create table if not exists sequences (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  slug text not null unique,
  name text not null,
  sequence_type text,
  sequence_text text not null,
  is_true_blockstring boolean,
  mash_point text,
  throw_point text,
  shimmy_point text,
  jump_option text,
  parry_option text,
  drive_reversal_option text,
  invincible_option text,
  notes text,
  valid_from_patch_id uuid references patches(id),
  valid_to_patch_id uuid references patches(id),
  verification_status text not null default 'unverified',
  content_kind text not null default 'verified_strategy',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists counters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  defender_character_id uuid references characters(id),
  opponent_character_id uuid references characters(id),
  target_type text not null,
  target_id uuid,
  situation text,
  counter_type text not null,
  title text not null,
  summary text,
  method text not null,
  benefit text,
  risk text,
  difficulty smallint check (difficulty between 1 and 5),
  conditions text,
  valid_from_patch_id uuid references patches(id),
  valid_to_patch_id uuid references patches(id),
  verification_status text not null default 'unverified',
  content_kind text not null default 'verified_strategy',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists trainings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  training_type text not null,
  purpose text not null,
  level text,
  duration_minutes integer,
  player_character_id uuid references characters(id),
  dummy_character_id uuid references characters(id),
  recording_instructions text,
  playback_settings text,
  cpu_settings text,
  method text not null,
  success_criteria text,
  recommended_reps integer,
  next_step text,
  valid_from_patch_id uuid references patches(id),
  valid_to_patch_id uuid references patches(id),
  verification_status text not null default 'unverified',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists training_relations (
  training_id uuid not null references trainings(id) on delete cascade,
  related_type text not null,
  related_id uuid not null,
  relationship text,
  primary key(training_id, related_type, related_id)
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  real_name text,
  country_code text,
  region text,
  player_type text not null,
  team_name text,
  bio text,
  image_url text,
  youtube_url text,
  twitch_url text,
  x_url text,
  website_url text,
  is_active boolean not null default true,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists player_aliases (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  alias text not null,
  normalized_alias text not null,
  created_at timestamptz not null default now(),
  unique(player_id, normalized_alias)
);

create table if not exists player_characters (
  player_id uuid not null references players(id) on delete cascade,
  character_id uuid not null references characters(id) on delete cascade,
  role text not null,
  valid_from_patch_id uuid references patches(id),
  valid_to_patch_id uuid references patches(id),
  note text,
  primary key(player_id, character_id, role)
);

create table if not exists tournaments (
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
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tournament_results (
  tournament_id uuid not null references tournaments(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  placement integer,
  note text,
  primary key(tournament_id, player_id)
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  platform text not null,
  external_id text,
  url text not null,
  title text not null,
  description text,
  thumbnail_url text,
  channel_name text,
  published_at timestamptz,
  video_type text,
  duration_seconds integer,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(platform, external_id)
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id) on delete set null,
  round_name text,
  played_at timestamptz,
  best_of integer,
  winner_player_id uuid references players(id),
  score_text text,
  video_id uuid references videos(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists match_participants (
  match_id uuid not null references matches(id) on delete cascade,
  player_id uuid not null references players(id),
  side smallint not null,
  character_id uuid references characters(id),
  is_winner boolean,
  primary key(match_id, side)
);

create table if not exists video_characters (
  video_id uuid not null references videos(id) on delete cascade,
  character_id uuid not null references characters(id) on delete cascade,
  primary key(video_id, character_id)
);

create table if not exists video_moves (
  video_id uuid not null references videos(id) on delete cascade,
  move_id uuid not null references moves(id) on delete cascade,
  primary key(video_id, move_id)
);

create table if not exists video_players (
  video_id uuid not null references videos(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  primary key(video_id, player_id)
);

create table if not exists video_tournaments (
  video_id uuid not null references videos(id) on delete cascade,
  tournament_id uuid not null references tournaments(id) on delete cascade,
  primary key(video_id, tournament_id)
);

create table if not exists video_matches (
  video_id uuid not null references videos(id) on delete cascade,
  match_id uuid not null references matches(id) on delete cascade,
  primary key(video_id, match_id)
);

create table if not exists video_counters (
  video_id uuid not null references videos(id) on delete cascade,
  counter_id uuid not null references counters(id) on delete cascade,
  primary key(video_id, counter_id)
);

create table if not exists glossary_terms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  term text not null,
  short_definition text,
  definition text not null,
  category text,
  beginner_level text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists glossary_aliases (
  id uuid primary key default gen_random_uuid(),
  glossary_term_id uuid not null references glossary_terms(id) on delete cascade,
  alias text not null,
  normalized_alias text not null,
  unique(glossary_term_id, normalized_alias)
);

create table if not exists diagnoses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  diagnosis_type text not null,
  description text,
  estimated_minutes integer,
  status text not null default 'draft',
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists diagnosis_questions (
  id uuid primary key default gen_random_uuid(),
  diagnosis_id uuid not null references diagnoses(id) on delete cascade,
  question_text text not null,
  help_text text,
  question_type text not null,
  display_order integer not null,
  is_required boolean not null default true,
  dimension_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists diagnosis_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references diagnosis_questions(id) on delete cascade,
  label text not null,
  description text,
  display_order integer not null,
  score_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Supabase auth.users is external to this schema draft.
create table if not exists profiles (
  user_id uuid primary key,
  display_name text,
  sf6_id text,
  sf6_id_public boolean not null default false,
  current_rank text,
  peak_rank text,
  current_mr integer,
  peak_mr integer,
  control_scheme text,
  main_character_id uuid references characters(id) on delete set null,
  target_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists diagnosis_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  diagnosis_id uuid not null references diagnoses(id),
  diagnosis_version integer not null,
  answers jsonb not null,
  scores jsonb not null,
  result_summary jsonb not null,
  completed_at timestamptz not null default now()
);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  entity_type text not null,
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, entity_type, entity_id)
);

create table if not exists entity_sources (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  source_id uuid not null references sources(id) on delete cascade,
  relationship text not null default 'supporting',
  note text,
  created_at timestamptz not null default now(),
  unique(entity_type, entity_id, source_id)
);

-- Search / FK indexes
create index if not exists idx_character_aliases_normalized on character_aliases(normalized_alias);
create index if not exists idx_move_aliases_normalized on move_aliases(normalized_alias);
create index if not exists idx_player_aliases_normalized on player_aliases(normalized_alias);
create index if not exists idx_glossary_aliases_normalized on glossary_aliases(normalized_alias);

create index if not exists idx_characters_name_ja_trgm on characters using gin (name_ja gin_trgm_ops);
create index if not exists idx_moves_name_ja_trgm on moves using gin (name_ja gin_trgm_ops);
create index if not exists idx_players_display_name_trgm on players using gin (display_name gin_trgm_ops);
create index if not exists idx_glossary_term_trgm on glossary_terms using gin (term gin_trgm_ops);

create index if not exists idx_moves_character on moves(character_id);
create index if not exists idx_frame_move on move_frame_data(move_id);
create index if not exists idx_combos_character on combos(character_id);
create index if not exists idx_setups_character on setups(character_id);
create index if not exists idx_sequences_character on sequences(character_id);
create index if not exists idx_counter_matchup on counters(defender_character_id, opponent_character_id);
create index if not exists idx_player_characters_character on player_characters(character_id);
create index if not exists idx_match_participants_character on match_participants(character_id);

-- Important: RLS policies, enum/check constraints, updated_at triggers,
-- exact polymorphic-reference validation and production migrations are Phase4+ work.
