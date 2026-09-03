-- Phase23: quarantine generic Sequence work queues and harden public Sequence publication.
-- No Sequence is promoted to verified/published by this migration.

update public.sequences
set status = 'archived',
    updated_at = now()
where status = 'draft'
  and verification_status = 'unverified'
  and (
    (
      sequence_text = '現行技表を基準にTrainingで連携順・割り込み点を確定する。'
      and notes = 'exact gap/true blockstring判定は実機Frame Meter確認まで未確定。'
    )
    or (
      notes = '候補判断表。確定連携と読み合いを実機検証後に分離する。'
    )
    or (
      mash_point = '未検証'
      and throw_point = '未検証'
      and shimmy_point = '未検証'
      and notes = 'Gap/確定性はTraining再現後に記録。'
    )
  );

create or replace function private.is_sequence_public_ready(target_sequence_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.sequences sq
    join public.characters c on c.id = sq.character_id
    join public.patches p on p.id = sq.valid_from_patch_id
    where sq.id = target_sequence_id
      and sq.status = 'published'
      and sq.verification_status = 'verified'
      and c.status = 'published'
      and c.is_playable = true
      and p.is_current = true
      and sq.valid_to_patch_id is null
      and sq.name is not null
      and btrim(sq.name) <> ''
      and sq.sequence_text is not null
      and btrim(sq.sequence_text) <> ''
      and sq.sequence_text <> '現行技表を基準にTrainingで連携順・割り込み点を確定する。'
      and coalesce(sq.notes, '') <> '候補判断表。確定連携と読み合いを実機検証後に分離する。'
      and not (
        sq.mash_point = '未検証'
        and sq.throw_point = '未検証'
        and sq.shimmy_point = '未検証'
        and sq.notes = 'Gap/確定性はTraining再現後に記録。'
      )
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'sequence'
          and es.entity_id = sq.id
      )
  );
$$;

revoke all on function private.is_sequence_public_ready(uuid) from public;
grant execute on function private.is_sequence_public_ready(uuid) to anon, authenticated, service_role;

drop policy if exists "public read published sequences" on public.sequences;
drop policy if exists "public read release-ready sequences" on public.sequences;
create policy "public read release-ready sequences"
on public.sequences
for select
to anon, authenticated
using (private.is_sequence_public_ready(id));

create or replace function private.enforce_sequence_publication_ready()
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
    raise exception 'published sequence requires verification_status=verified';
  end if;

  if new.name is null or btrim(new.name) = ''
     or new.sequence_text is null or btrim(new.sequence_text) = '' then
    raise exception 'published sequence requires name and exact sequence';
  end if;

  if new.sequence_text = '現行技表を基準にTrainingで連携順・割り込み点を確定する。'
     or coalesce(new.notes, '') = '候補判断表。確定連携と読み合いを実機検証後に分離する。'
     or (
       new.mash_point = '未検証'
       and new.throw_point = '未検証'
       and new.shimmy_point = '未検証'
       and new.notes = 'Gap/確定性はTraining再現後に記録。'
     ) then
    raise exception 'generic Sequence verification placeholder cannot be published';
  end if;

  if new.valid_to_patch_id is not null
     or not exists (
       select 1 from public.patches p
       where p.id = new.valid_from_patch_id
         and p.is_current = true
     ) then
    raise exception 'published sequence must target the current patch';
  end if;

  if not exists (
    select 1 from public.characters c
    where c.id = new.character_id
      and c.status = 'published'
      and c.is_playable = true
  ) then
    raise exception 'published sequence requires a published playable character';
  end if;

  if not exists (
    select 1 from public.entity_sources es
    where es.entity_type = 'sequence'
      and es.entity_id = new.id
  ) then
    raise exception 'published sequence requires Source evidence';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_sequence_publication_ready on public.sequences;
create trigger enforce_sequence_publication_ready
before insert or update of status, verification_status, name, sequence_text, mash_point, throw_point, shimmy_point, notes, valid_from_patch_id, valid_to_patch_id, character_id
on public.sequences
for each row
execute function private.enforce_sequence_publication_ready();
