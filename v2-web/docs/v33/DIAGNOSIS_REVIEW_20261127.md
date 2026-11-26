# V33 診断レビュー（読み取りのみ・配点/推薦ロジック未変更）

- 本番(wnuxaxbrpudyypzdbdho)と開発(vvsknbmlfvvnrmgtyhbf)の4診断は、質問文・補足文・選択肢文・score_payload の連結MD5が全診断で一致（差分なし）。
- 問題数: improvement 12 / playstyle 10 / character-fit 10 / comprehensive 20（全問4択、question_count一致）。
- 全52問を確認。質問文は具体的で意味欠落なし。
## 指摘（修正は未実施・DB変更が絡むため承認待ち）
1. improvement Q11 は選択肢と文型が噛み合わない → 修正案 docs/v33/sql/improvement-check-q11-wording-candidate.sql。
2. comprehensive は選択肢「よくわからない / 未意識」、improvement は「よくわからない / 意識できていない」と表記が違う（アプリ側注記は実ラベルを参照するため動作は問題なし）。統一は任意。
3. comprehensive Q4 は「確定反撃できる場面を逃さず」と improvement Q4 より補足が少ない（help_textは共通文）。
4. 結果文: 改善系12軸は RESULT_PRACTICE に「確認する場面／観察／最初の練習」あり。プレイスタイル/キャラ適性の12軸(aggression〜explosive)は軸名と回答根拠のみで、傾向の説明・次の一歩の文がない → 追加候補（新規文面・要承認）。
5. ImprovementResultGuide の SCENE_HINTS は4軸のみ（anti_air/drive_rush_defense/impact_response/punish）。残り8軸は RESULT_PRACTICE で補完されるため欠落ではない。
