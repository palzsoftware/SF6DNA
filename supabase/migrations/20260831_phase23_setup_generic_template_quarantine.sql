-- Phase23: quarantine replicated generic Setup templates that are not character-specific.
-- These rows are retained as archived work history only.
-- No Setup is promoted to verified or published by this migration.

create or replace function private.is_generic_setup_template(
  p_starter_condition text,
  p_sequence_text text,
  p_description text
)
returns boolean
language sql
immutable
as $$
  select
    (
      p_starter_condition = '端ダウン'
      and p_sequence_text = '打撃 / 投げ / シミー / DI'
      and p_description = '端での代表択。無敵/Dリバ/パリィへの分岐を記録。'
    )
    or (
      p_starter_condition = 'ダウン後'
      and p_sequence_text = '生DR → 後ろ歩き / 打撃 / 投げ'
      and p_description = '投げ抜けと4F暴れへの相互作用を確認。'
    )
    or (
      p_starter_condition = '相手バーンアウト'
      and p_sequence_text = '有利技 → 打撃 / 投げ / DI'
      and p_description = 'ガード硬直増加を考慮するが、真連携は実機確認前に断定しない。'
    )
    or (
      p_starter_condition = '基本必殺技締め'
      and p_sequence_text = '前進/DR → 打撃 / 投げ / シミー'
      and p_description = '締め技ごとの有利Fと受け身差を実機確認する。'
    )
    or (
      p_starter_condition = '固有リソースあり'
      and p_sequence_text = '固有リソース → 重ね / 接近 / 投げ'
      and p_description = '設置・ストック・メダル・風等のキャラ固有条件を分離。'
    )
    or (
      p_starter_condition = '大きなダウン有利'
      and p_sequence_text = 'フレーム消費 → 前ジャンプ攻撃'
      and p_description = '+42F等の具体値は再現できた場合のみ確定する。'
    );
$$;

revoke all on function private.is_generic_setup_template(text, text, text) from public;

update public.setups
set status = 'archived',
    updated_at = now()
where status = 'draft'
  and verification_status = 'unverified'
  and private.is_generic_setup_template(starter_condition, sequence_text, description);

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
      and not private.is_generic_setup_template(se.starter_condition, se.sequence_text, se.description)
      and exists (
        select 1
        from public.entity_sources es
        where es.entity_type = 'setup'
          and es.entity_id = se.id
      )
  );
$$;

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
     )
     or private.is_generic_setup_template(new.starter_condition, new.sequence_text, new.description) then
    raise exception 'generic Setup template cannot be published';
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
