# Source / Verification Progress

基準RC: `7747cc672a6532ec98b4f3021ed4fd7b88fa130f`。DB writeなし。

## JP曖昧文言

| 対象 | 現行公開V2 | 判定 |
|---|---|---|
| 地面からの攻撃 | トルバラン／トリグラフ／ヴィーハトを明記 | `RESOLVED_PUBLIC_UI` |
| 空中に置く技 | 現行V2コード・テストに公開文言なし | `RESOLVED_PUBLIC_UI` |

旧migration `20260902004628_phase46_character_overview_and_japanese_copy.sql`には「地面からの攻撃」が残る。これは履歴を改変せず、将来の承認済みDB copy update候補として扱う。公開Previewは `character-detail-v21.ts` の具体的な技名を描画するため、今回の安全なコード修正は不要。

## Queue classification

- Source route coverage: 28/28 groups（維持）
- Patch直接影響: 29 claims / 8 sessions（実機確認待ち）
- Generic game verification: 85 claims（実機確認待ち）
- official sourceだけでverified/publishedへ昇格した件数: 0
- `SOURCE_RESOLVED`: 公開JP曖昧copy 2表現
- `GAME_VERIFICATION_REQUIRED`: 29 + 85 claims

Source登録、動画タイトル、第三者解説だけではゲーム事実をverifiedにしない。
