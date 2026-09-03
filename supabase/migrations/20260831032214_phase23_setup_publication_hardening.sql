-- Phase23: quarantine clearly non-actionable Setup placeholders and harden public Setup publication.
-- No Setup is promoted to verified/published by this migration.

update public.setups
set status = 'archived',
    updated_at = now()
where status = 'draft'
  and verification_status = 'unverified'
  and (
    (
      starter_condition = 'Training verification required'
      and sequence_text = 'Training verification required'
    )
    or (
      starter_condition = '代表ダウン/端/ゲージ条件'
      and sequence_text = 'Trainingで打撃・投げ・シミー・遅らせを再現'
      and description = '現行技性能から起き攻め候補を検証する枠。'
      and counter_notes = 'exact有利F・詐欺飛び・隙間は実機確認まで未確定。'
    )
  );

create or replace function private.is_setup_public_ready(target_setup_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.setups se
    join public.characters c on c.id = se.character_id
    join public.patches p on p.id = se.valid_from_patch_id
    where se.id = target_setup_id
      and se.status = 'published'
      and se.verification_status = 'verified'
      and c.status = 'published'
      and c.is_playable = true
      and p.is_current = true
      and se.valid_to_patch_id is null
      and se.name is not null
      and btrim(se.name) <> ''
      and se.sequence_text is not null
      and btrim(se.sequence_text) <> ''
      and coalesce(se.starter_condition, '') <> 'Training verification required'
      and se.sequence_text <> 'Training verification required'
      and not (
        se.starter_condition = '代表ダウン/端/ゲージ条件'
        and se.sequence_text = 'Trainingで打撃・投げ・シミー・遅らせを再現'
        and se.description = '現行技性能から起き攻め候補を検証する枠。'
      )
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'setup'
          and es.entity_id = se.id
      )
  );
$$;

revoke all on function private.is_setup_public_ready(uuid) from public;
grant execute on function private.is_setup_public_ready(uuid) to anon, authenticated, service_role;

drop policy if exists "public read published setups" on public.setups;
drop policy if exists "public read release-ready setups" on public.setups;
create policy "public read release-ready setups"
on public.setups
for select
to anon, authenticated
using (private.is_setup_public_ready(id));

create or replace function private.enforce_setup_publication_ready()
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
    raise exception 'published setup requires verification_status=verified';
  end if;

  if new.name is null or btrim(new.name) = ''
     or new.sequence_text is null or btrim(new.sequence_text) = '' then
    raise exception 'published setup requires name and exact sequence';
  end if;

  if coalesce(new.starter_condition, '') = 'Training verification required'
     or new.sequence_text = 'Training verification required'
     or (
       new.starter_condition = '代表ダウン/端/ゲージ条件'
       and new.sequence_text = 'Trainingで打撃・投げ・シミー・遅らせを再現'
       and new.description = '現行技性能から起き攻め候補を検証する枠。'
     ) then
    raise exception 'generic Setup verification placeholder cannot be published';
  end if;

  if new.valid_to_patch_id is not null
     or not exists (
       select 1 from public.patches p
       where p.id = new.valid_from_patch_id
         and p.is_current = true
     ) then
    raise exception 'published setup must target the current patch';
  end if;

  if not exists (
    select 1 from public.characters c
    where c.id = new.character_id
      and c.status = 'published'
      and c.is_playable = true
  ) then
    raise exception 'published setup requires a published playable character';
  end if;

  if not exists (
    select 1 from public.entity_sources es
    where es.entity_type = 'setup'
      and es.entity_id = new.id
  ) then
    raise exception 'published setup requires Source evidence';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_setup_publication_ready on public.setups;
create trigger enforce_setup_publication_ready
before insert or update of status, verification_status, name, starter_condition, sequence_text, description, valid_from_patch_id, valid_to_patch_id, character_id
on public.setups
for each row
execute function private.enforce_setup_publication_ready();
