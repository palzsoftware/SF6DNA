-- Phase23: enforce Combo publication completeness at the database boundary.
-- New published records must already have Source evidence and current-patch verified content.

create or replace function private.enforce_combo_publication_ready()
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
    raise exception 'published combo requires verification_status=verified';
  end if;

  if new.notation is null or btrim(new.notation) = '' then
    raise exception 'published combo requires exact notation';
  end if;

  if new.notation = 'Training verification required'
     or new.notation = '現行技表を基準にTrainingで正確な入力順を確定する。'
     or new.notation like '%（候補。正確な入力順・強度はトレモで確定）%'
     or new.notation ilike '%要トレモ確認%'
     or new.notation ilike '%正確な入力順%確定%' then
    raise exception 'placeholder combo notation cannot be published';
  end if;

  if new.valid_to_patch_id is not null
     or not exists (
       select 1
       from public.patches p
       where p.id = new.valid_from_patch_id
         and p.is_current = true
     ) then
    raise exception 'published combo must target the current patch';
  end if;

  if not exists (
    select 1
    from public.characters c
    where c.id = new.character_id
      and c.status = 'published'
      and c.is_playable = true
  ) then
    raise exception 'published combo requires a published playable character';
  end if;

  if not exists (
    select 1
    from public.entity_sources es
    where es.entity_type = 'combo'
      and es.entity_id = new.id
  ) then
    raise exception 'published combo requires Source evidence';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_combo_publication_ready on public.combos;
create trigger enforce_combo_publication_ready
before insert or update of status, verification_status, notation, valid_from_patch_id, valid_to_patch_id, character_id
on public.combos
for each row
execute function private.enforce_combo_publication_ready();
