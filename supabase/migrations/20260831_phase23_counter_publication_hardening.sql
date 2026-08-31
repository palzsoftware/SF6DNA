-- Phase23: quarantine generic matchup Counter templates and harden public Counter publication.
-- No Counter is promoted to verified/published by this migration.

update public.counters
set status = 'archived',
    updated_at = now()
where status = 'draft'
  and verification_status = 'unverified'
  and counter_type in ('matchup_plan', 'matchup_overview', 'matchup_baseline');

create or replace function private.is_counter_public_ready(target_counter_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.counters co
    join public.patches p on p.id = co.valid_from_patch_id
    where co.id = target_counter_id
      and co.status = 'published'
      and co.verification_status = 'verified'
      and p.is_current = true
      and co.valid_to_patch_id is null
      and co.title is not null
      and btrim(co.title) <> ''
      and co.method is not null
      and btrim(co.method) <> ''
      and co.counter_type not in ('matchup_plan', 'matchup_overview', 'matchup_baseline')
      and co.title not ilike '%候補%'
      and co.method not ilike '%実機検証して昇格%'
      and co.method not ilike '%再現後に%昇格%'
      and (
        co.defender_character_id is null
        or exists (
          select 1 from public.characters c
          where c.id = co.defender_character_id
            and c.status = 'published'
            and c.is_playable = true
        )
      )
      and (
        co.opponent_character_id is null
        or exists (
          select 1 from public.characters c
          where c.id = co.opponent_character_id
            and c.status = 'published'
            and c.is_playable = true
        )
      )
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'counter'
          and es.entity_id = co.id
      )
  );
$$;

revoke all on function private.is_counter_public_ready(uuid) from public;
grant execute on function private.is_counter_public_ready(uuid) to anon, authenticated, service_role;

drop policy if exists "public read published counters" on public.counters;
drop policy if exists "public read release-ready counters" on public.counters;
create policy "public read release-ready counters"
on public.counters
for select
to anon, authenticated
using (private.is_counter_public_ready(id));

create or replace function private.enforce_counter_publication_ready()
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
    raise exception 'published counter requires verification_status=verified';
  end if;

  if new.title is null or btrim(new.title) = ''
     or new.method is null or btrim(new.method) = '' then
    raise exception 'published counter requires title and method';
  end if;

  if new.counter_type in ('matchup_plan', 'matchup_overview', 'matchup_baseline')
     or new.title ilike '%候補%'
     or new.method ilike '%実機検証して昇格%'
     or new.method ilike '%再現後に%昇格%' then
    raise exception 'generic matchup candidate cannot be published';
  end if;

  if new.valid_to_patch_id is not null
     or not exists (
       select 1 from public.patches p
       where p.id = new.valid_from_patch_id
         and p.is_current = true
     ) then
    raise exception 'published counter must target the current patch';
  end if;

  if new.defender_character_id is not null
     and not exists (
       select 1 from public.characters c
       where c.id = new.defender_character_id
         and c.status = 'published'
         and c.is_playable = true
     ) then
    raise exception 'published counter defender must be a published playable character';
  end if;

  if new.opponent_character_id is not null
     and not exists (
       select 1 from public.characters c
       where c.id = new.opponent_character_id
         and c.status = 'published'
         and c.is_playable = true
     ) then
    raise exception 'published counter opponent must be a published playable character';
  end if;

  if not exists (
    select 1 from public.entity_sources es
    where es.entity_type = 'counter'
      and es.entity_id = new.id
  ) then
    raise exception 'published counter requires Source evidence';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_counter_publication_ready on public.counters;
create trigger enforce_counter_publication_ready
before insert or update of status, verification_status, title, method, counter_type, valid_from_patch_id, valid_to_patch_id, defender_character_id, opponent_character_id
on public.counters
for each row
execute function private.enforce_counter_publication_ready();
