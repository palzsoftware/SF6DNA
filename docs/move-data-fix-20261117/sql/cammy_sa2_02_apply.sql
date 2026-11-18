-- SF6DNA 2026-11-17 キャミィ SA2 Classicコマンド 修正候補（2件）
-- 対象: public.move_commands の command_text / numeric_notation のみ（control_scheme = 'classic'）。
--       技ID・コマンド行ID・slug・フレームは変更しない。
-- 根拠: 公式TXT表示コマンド欄が LP|MP|HP（地上・空中とも）。統括側調査も 214214P を支持。
--       公式TXT内部ラベル (SA2_214214K) とは矛盾するため、現行CAPCOM公式ページでの最終確認が前提条件。
-- 状態: 候補。実DBでは未実行。公式確認と別途承認が必要。
-- 02 適用。公式確認の明示がない場合、および前提不一致の場合は中断する。
begin;
-- 現行公式ページで地上・空中とも 214214P を確認した後にのみ、次の行の 'no' を 'yes' に変えて実行する。
select set_config('sf6dna.cammy_sa2_official_confirmed', 'no', true);
create temp table sf6dna_fix_20261117_cammy (
  command_id uuid primary key, move_id uuid not null, move_slug text not null, before_text text not null, after_text text not null
) on commit drop;
insert into sf6dna_fix_20261117_cammy values
  ('b23ccfc9-f215-41f3-a3b4-f0587fcfd098'::uuid, 'b71563a1-1e76-426e-846a-efe566eb419f'::uuid, 'cammy-sa2', '214214K', '214214P'),
  ('9701702b-6570-4d1d-8a67-4aec601006c3'::uuid, '13a0114b-6cb3-4079-ae51-d51fa15b20ee'::uuid, 'cammy-sa2-air', 'j.214214K', 'j.214214P');

do $$
declare ready int; changed int;
begin
  if current_setting('sf6dna.cammy_sa2_official_confirmed', true) is distinct from 'yes' then
    raise exception 'official CAPCOM confirmation for Cammy SA2 (214214P) is not recorded';
  end if;
  select count(*) into ready from sf6dna_fix_20261117_cammy x
    join public.move_commands c on c.id = x.command_id and c.move_id = x.move_id and c.control_scheme = 'classic'
    join public.moves m on m.id = x.move_id and m.slug = x.move_slug
   where c.command_text = x.before_text and c.numeric_notation = x.before_text;
  if ready <> 2 then raise exception 'precheck failed: % of 2 rows ready', ready; end if;
  update public.move_commands c set command_text = x.after_text, numeric_notation = x.after_text
    from sf6dna_fix_20261117_cammy x
   where c.id = x.command_id and c.move_id = x.move_id and c.command_text = x.before_text and c.numeric_notation = x.before_text;
  get diagnostics changed = row_count;
  if changed <> 2 then raise exception 'update count mismatch: %', changed; end if;
end $$;
commit;
