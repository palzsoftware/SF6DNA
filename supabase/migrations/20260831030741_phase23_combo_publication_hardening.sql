-- Phase23: quarantine non-actionable combo placeholders and harden the public Combo gate.
-- This migration does not publish any Combo. reviewed != verified and draft != published remain unchanged.

update public.combos
set status = 'archived',
    notes = case
      when notes is null or btrim(notes) = '' then
        '[Phase23 QA 2026-08-31] Exact recipe/current-patch reproduction is not present. Placeholder candidate archived; verification_status remains unverified.'
      when notes not ilike '%[Phase23 QA 2026-08-31]%' then
        notes || E'\n[Phase23 QA 2026-08-31] Exact recipe/current-patch reproduction is not present. Placeholder candidate archived; verification_status remains unverified.'
      else notes
    end,
    updated_at = now()
where status = 'draft'
  and verification_status = 'unverified'
  and (
    notation = 'Training verification required'
    or notation = '現行技表を基準にTrainingで正確な入力順を確定する。'
    or notation like '%（候補。正確な入力順・強度はトレモで確定）%'
    or notes ilike '%candidate slot%'
    or notes ilike '%候補スロット%'
  );

create or replace function private.is_combo_public_ready(target_combo_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.combos co
    join public.characters c on c.id = co.character_id
    join public.patches p on p.id = co.valid_from_patch_id
    where co.id = target_combo_id
      and co.status = 'published'
      and co.verification_status = 'verified'
      and c.status = 'published'
      and c.is_playable = true
      and p.is_current = true
      and co.valid_to_patch_id is null
      and co.notation is not null
      and btrim(co.notation) <> ''
      and co.notation <> 'Training verification required'
      and co.notation <> '現行技表を基準にTrainingで正確な入力順を確定する。'
      and co.notation not like '%（候補。正確な入力順・強度はトレモで確定）%'
      and co.notation not ilike '%要トレモ確認%'
      and co.notation not ilike '%正確な入力順%確定%'
      and co.notes is distinct from 'candidate slot'
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'combo'
          and es.entity_id = co.id
      )
  );
$$;

revoke all on function private.is_combo_public_ready(uuid) from public;
grant execute on function private.is_combo_public_ready(uuid) to anon, authenticated, service_role;

drop policy if exists "public read published combos" on public.combos;
create policy "public read release-ready combos"
on public.combos
for select
to anon, authenticated
using (private.is_combo_public_ready(id));
