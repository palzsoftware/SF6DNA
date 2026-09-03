-- P0-SEC-01
-- Separate public Source access from internal/admin Source metadata.
--
-- Public callers must use the RPCs defined below.
-- sources.notes and entity_sources.note are intentionally never returned.

create or replace function private.is_public_source_target(
  target_entity_type text,
  target_entity_id uuid
)
returns boolean
language plpgsql
stable
security definer
set search_path = public, private
as $$
begin
  case target_entity_type

    when 'character' then
      return exists (
        select 1
        from public.characters c
        where c.id = target_entity_id
          and c.status = 'published'
          and c.is_playable = true
      );

    when 'character_trait_score' then
      return private.is_character_trait_score_public_ready(target_entity_id);

    when 'move' then
      return private.is_move_public_ready(target_entity_id);

    when 'move_command' then
      return exists (
        select 1
        from public.move_commands mc
        join public.moves m on m.id = mc.move_id
        where mc.id = target_entity_id
          and private.is_move_public_ready(m.id)
      );

    when 'frame' then
      return exists (
        select 1
        from public.move_frame_data mfd
        join public.moves m on m.id = mfd.move_id
        where mfd.id = target_entity_id
          and mfd.verification_status = 'verified'
          and mfd.valid_to_patch_id is null
          and private.is_move_public_ready(m.id)
      );

    when 'move_frame_data' then
      return exists (
        select 1
        from public.move_frame_data mfd
        join public.moves m on m.id = mfd.move_id
        where mfd.id = target_entity_id
          and mfd.verification_status = 'verified'
          and mfd.valid_to_patch_id is null
          and private.is_move_public_ready(m.id)
      );

    when 'combo' then
      return private.is_combo_public_ready(target_entity_id);

    when 'setup' then
      return private.is_setup_public_ready(target_entity_id);

    when 'sequence' then
      return private.is_sequence_public_ready(target_entity_id);

    when 'counter' then
      return private.is_counter_public_ready(target_entity_id);

    when 'training' then
      return private.is_training_public_ready(target_entity_id);

    when 'player' then
      return exists (
        select 1
        from public.players p
        where p.id = target_entity_id
          and p.status = 'published'
      );

    when 'video' then
      return exists (
        select 1
        from public.videos v
        where v.id = target_entity_id
          and v.status = 'published'
      );

    else
      -- Unknown polymorphic entity types are private by default.
      return false;
  end case;
end;
$$;

revoke all
on function private.is_public_source_target(text, uuid)
from public;

grant execute
on function private.is_public_source_target(text, uuid)
to anon, authenticated, service_role;


-- Public Source directory.
-- Internal columns such as notes / created_at / updated_at are not exposed.
create or replace function public.list_public_sources()
returns table (
  id uuid,
  title text,
  url text,
  source_type text,
  publisher text,
  published_at timestamptz,
  accessed_at timestamptz,
  reliability_level text
)
language sql
stable
security definer
set search_path = public, private
as $$
  select
    s.id,
    s.title,
    s.url,
    s.source_type,
    s.publisher,
    s.published_at,
    s.accessed_at,
    s.reliability_level
  from public.sources s;
$$;

revoke all
on function public.list_public_sources()
from public;

grant execute
on function public.list_public_sources()
to anon, authenticated, service_role;


-- Public Source links.
-- entity_sources.id and entity_sources.note are intentionally omitted.
-- Source metadata is returned inline so public callers do not need direct
-- SELECT access to either base table.
create or replace function public.get_public_entity_sources(
  target_entity_types text[] default null,
  target_entity_ids uuid[] default null
)
returns table (
  entity_type text,
  entity_id uuid,
  source_id uuid,
  relationship text,
  title text,
  url text,
  source_type text,
  publisher text,
  published_at timestamptz,
  accessed_at timestamptz,
  reliability_level text
)
language sql
stable
security definer
set search_path = public, private
as $$
  select
    es.entity_type,
    es.entity_id,
    es.source_id,
    es.relationship,
    s.title,
    s.url,
    s.source_type,
    s.publisher,
    s.published_at,
    s.accessed_at,
    s.reliability_level
  from public.entity_sources es
  join public.sources s
    on s.id = es.source_id
  where
    (
      target_entity_types is null
      or es.entity_type = any(target_entity_types)
    )
    and (
      target_entity_ids is null
      or es.entity_id = any(target_entity_ids)
    )
    and private.is_public_source_target(es.entity_type, es.entity_id);
$$;

revoke all
on function public.get_public_entity_sources(text[], uuid[])
from public;

grant execute
on function public.get_public_entity_sources(text[], uuid[])
to anon, authenticated, service_role;


-- Remove unrestricted public access to internal base tables.
-- Admin access remains available through the existing admin policies.
drop policy if exists "public read sources"
on public.sources;

drop policy if exists "public read entity sources"
on public.entity_sources;