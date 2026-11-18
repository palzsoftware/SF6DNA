-- SF6DNA 2026-11-17 不知火舞「飛燕連脚（3段目）」フレーム 修正候補（1行）
-- 対象: public.move_frame_data id=bcbebcaf-6499-4dfb-bc55-62d4e621399d（move mai-hien-ren-kyaku-2-5lk-lk-lk）の startup/active/recovery/on_hit/damage。
--       on_block は現値 -10 が公式TXTと一致するため変更しない。技ID・frame ID・slugは不変。
-- 根拠: DBの3段目の値が「飛燕連脚（2段目）」の値（DB・公式TXT mai:web:202 とも 7/7-8/20/-2/-10/400）と全項目一致するコピー。
--       修正値は公式TXT mai:web:203（10/10-11/28/3/-10/500。取得2026-10-23、Patch未検証）。
-- 状態: 候補。実DB未実行。現行公式値の確認と別途承認が必要（02は確認フラグなしでは中断）。
-- 02 適用。確認フラグ・前提不一致で中断。
begin;
-- 現行公式値（3段目: 10/10-11/28/3/-10/500）を確認した後にのみ 'no' を 'yes' に変えて実行する。
select set_config('sf6dna.mai_hien_step3_official_confirmed', 'no', true);
do $$
declare changed int;
begin
  if current_setting('sf6dna.mai_hien_step3_official_confirmed', true) is distinct from 'yes' then
    raise exception 'official confirmation for Mai Hien Renkyaku step 3 is not recorded';
  end if;
  update public.move_frame_data f set startup = '10', active = '10-11', recovery = '28', on_hit = '3', damage = 500
   where f.id = 'bcbebcaf-6499-4dfb-bc55-62d4e621399d' and f.move_id = 'f3fc4f71-7de2-4f23-9a7c-5b98c41124b7' and f.valid_to_patch_id is null and f.startup = '7' and f.active = '7-8' and f.recovery = '20' and f.on_hit = '-2' and f.on_block = '-10' and f.damage = 400
     and exists (select 1 from public.moves m where m.id = f.move_id and m.slug = 'mai-hien-ren-kyaku-2-5lk-lk-lk');
  get diagnostics changed = row_count;
  if changed <> 1 then raise exception 'precheck failed: % rows matched (expected 1)', changed; end if;
end $$;
commit;
