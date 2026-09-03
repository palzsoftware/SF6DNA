-- Phase23: archive remaining internal matchup-verification Training work queues.
-- These rows are QA recipes whose next step is promotion into Counter, not end-user Training content.

update public.trainings
set status = 'archived',
    updated_at = now()
where status = 'draft'
  and verification_status = 'unverified'
  and training_type = 'matchup'
  and next_step ilike '%Counter%昇格%';

create or replace function private.is_training_public_ready(target_training_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trainings tr
    join public.patches p on p.id = tr.valid_from_patch_id
    where tr.id = target_training_id
      and tr.status = 'published'
      and tr.verification_status = 'verified'
      and p.is_current = true
      and tr.valid_to_patch_id is null
      and tr.name is not null
      and btrim(tr.name) <> ''
      and tr.purpose is not null
      and btrim(tr.purpose) <> ''
      and tr.method is not null
      and btrim(tr.method) <> ''
      and coalesce(tr.next_step, '') not ilike '%Counter%昇格%'
      and (
        tr.player_character_id is null
        or exists (
          select 1 from public.characters c
          where c.id = tr.player_character_id
            and c.status = 'published'
            and c.is_playable = true
        )
      )
      and (
        tr.dummy_character_id is null
        or exists (
          select 1 from public.characters c
          where c.id = tr.dummy_character_id
            and c.status = 'published'
            and c.is_playable = true
        )
      )
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'training'
          and es.entity_id = tr.id
      )
  );
$$;

create or replace function private.enforce_training_publication_ready()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status <> 'published' then
    return new;
  end if;

  if new.verification_status <> 'verified' then
    raise exception 'published training requires verification_status=verified';
  end if;

  if new.name is null or btrim(new.name) = ''
     or new.purpose is null or btrim(new.purpose) = ''
     or new.method is null or btrim(new.method) = '' then
    raise exception 'published training requires name, purpose and method';
  end if;

  if coalesce(new.next_step, '') ilike '%Counter%昇格%' then
    raise exception 'internal Counter-verification training cannot be published';
  end if;

  if new.valid_to_patch_id is not null
     or not exists (
       select 1 from public.patches p
       where p.id = new.valid_from_patch_id
         and p.is_current = true
     ) then
    raise exception 'published training must target the current patch';
  end if;

  if new.player_character_id is not null
     and not exists (
       select 1 from public.characters c
       where c.id = new.player_character_id
         and c.status = 'published'
         and c.is_playable = true
     ) then
    raise exception 'published training player must be a published playable character';
  end if;

  if new.dummy_character_id is not null
     and not exists (
       select 1 from public.characters c
       where c.id = new.dummy_character_id
         and c.status = 'published'
         and c.is_playable = true
     ) then
    raise exception 'published training dummy must be a published playable character';
  end if;

  if not exists (
    select 1 from public.entity_sources es
    where es.entity_type = 'training'
      and es.entity_id = new.id
  ) then
    raise exception 'published training requires Source evidence';
  end if;

  return new;
end;
$$;
