-- SF6DNA 2026-11-17 エレナ「ジャンプ強K（オーバーヘッドキック）」持続 表記破損 修正候補（1行）
-- 対象: public.move_frame_data id=7dad606b-62bb-4597-99c4-c3b618ad6389 の active のみ。技ID・frame ID・slugは不変。
-- 根拠: DB値 '10-20 / 10-11,13-20' は「全体範囲 / 詳細」の併記で、後半 '10-11,13-20' が公式TXT elena:web:117 '10-11, 13-20' と同値。
--       修正値はDB自身の後半部分（新しい値は採用しない）。ブランカ・本田の連結破損と同じ扱い。
--       frame ID と現在値は fixture監査情報と remaining-character-intake(2026-10-04) の両方で一致。
-- 状態: 候補。実DB未実行。別途承認が必要。
begin;
set transaction read only;
select f.active, case when f.active = '10-11,13-20' then 'APPLIED' when f.active = '10-20 / 10-11,13-20' then 'NOT_APPLIED' else 'UNEXPECTED' end as status
from public.move_frame_data f where f.id = '7dad606b-62bb-4597-99c4-c3b618ad6389' and f.move_id = '3e2fd952-26b8-4942-85fb-651512e650ba';
rollback;
