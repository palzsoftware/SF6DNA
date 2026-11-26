-- 候補（未実行）。開発DBへの適用は個別承認が必要。本番は禁止。
-- 対象: diagnoses.slug='improvement-check' の display_order=11 の質問文のみ。選択肢・配点(score_payload)は一切変更しない。
-- 現行: 自分が画面端を背負ったとき、脱出手段を複数持っていますか？
-- 案  : 画面端を背負ったとき、状況に応じて脱出手段を使い分けられますか？
--   理由: 回答は「安定してできる/時々できる/苦手/よくわからない」の4段階で、他の質問(Q5等)の「〜使い分けられますか？」と
--         文型を揃えると選択肢と噛み合う。help_text は変更しない。
-- 影響: 表示文のみ。履歴の保存済み回答は option id / score で保持されるため再計算に影響しない（要Preview確認）。
-- ロールバック: 下記を逆向きに実行（現行文へ戻す）。
begin;
update public.diagnosis_questions q
   set prompt = '画面端を背負ったとき、状況に応じて脱出手段を使い分けられますか？'
  from public.diagnoses d
 where q.diagnosis_id = d.id and d.slug = 'improvement-check' and q.display_order = 11
   and q.prompt = '自分が画面端を背負ったとき、脱出手段を複数持っていますか？';
-- 期待: 1行更新。0行なら現行文が既に異なるので commit せず調査する。
commit;
-- rollback:
-- update public.diagnosis_questions q set prompt='自分が画面端を背負ったとき、脱出手段を複数持っていますか？'
--   from public.diagnoses d where q.diagnosis_id=d.id and d.slug='improvement-check' and q.display_order=11;
