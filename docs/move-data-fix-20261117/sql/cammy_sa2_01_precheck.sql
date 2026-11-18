-- SF6DNA 2026-11-17 キャミィ SA2 Classicコマンド 修正候補（2件）
-- 対象: public.move_commands の command_text / numeric_notation のみ（control_scheme = 'classic'）。
--       技ID・コマンド行ID・slug・フレームは変更しない。
-- 根拠: 公式TXT表示コマンド欄が LP|MP|HP（地上・空中とも）。統括側調査も 214214P を支持。
--       公式TXT内部ラベル (SA2_214214K) とは矛盾するため、現行CAPCOM公式ページでの最終確認が前提条件。
-- 状態: 候補。実DBでは未実行。公式確認と別途承認が必要。
-- 01 実行前照合（読み取り専用）。期待: 2行とも status = 'READY'。
with expected(command_id, move_id, move_slug, before_text, after_text) as (values
  ('b23ccfc9-f215-41f3-a3b4-f0587fcfd098'::uuid, 'b71563a1-1e76-426e-846a-efe566eb419f'::uuid, 'cammy-sa2', '214214K', '214214P'),
  ('9701702b-6570-4d1d-8a67-4aec601006c3'::uuid, '13a0114b-6cb3-4079-ae51-d51fa15b20ee'::uuid, 'cammy-sa2-air', 'j.214214K', 'j.214214P')
)
select e.move_slug, c.id, c.control_scheme, c.command_text, c.numeric_notation, m.slug,
  case
    when c.id is null then 'MISSING_COMMAND'
    when m.slug is distinct from e.move_slug then 'MOVE_SLUG_MISMATCH'
    when c.control_scheme <> 'classic' then 'SCHEME_MISMATCH'
    when c.command_text = e.after_text then 'ALREADY_APPLIED'
    when c.command_text is distinct from e.before_text or c.numeric_notation is distinct from e.before_text then 'VALUE_CHANGED_SINCE_SNAPSHOT'
    else 'READY' end as status
from expected e
left join public.move_commands c on c.id = e.command_id and c.move_id = e.move_id
left join public.moves m on m.id = e.move_id;
