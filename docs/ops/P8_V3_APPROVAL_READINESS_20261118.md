# P8 V3 正式承認準備（Claude, 2026-11-18）

実DB書込・Migration適用は未実施。以下はすべて使い捨てPostgreSQL 16（V3同梱fixture）での結果。

## 1. 結合試験（V3本体 × Development専用ガード）
| ケース | 結果 |
|---|---|
| A: V3原本 → 開発ホスト | V3のfixture専用ガードで停止（`V3 FIXTURE_ONLY`） |
| B: ガード差替版 → 本番ホスト | Claudeガードで停止（BEGIN・LOCK前） |
| C: ガード差替版・承認番号なし | 停止 |
| D: ガード差替版 → 開発ホスト・承認番号あり | 通過し `V3_COMMIT_CONFIRMED`。承認CSVにYがないため変更0件 |
- 差替版は `v3_begin.sql` の fixture専用ブロック（Unixソケット・DB名・トークン確認）をガードに置き換えたもの。**承認者は差分がこの部分のみであることを確認すること**。
- PostgreSQL 17: aptにパッケージなし・公式リポジトリへ到達不可のため **HOLD**。PG16のみで検証。

## 2. RLS強化候補2件
| 候補 | 適用前 | 適用後 | 判定 |
|---|---|---|---|
| `RLS_V3_CANDIDATE.sql`（V3同梱） | アサーション失敗（anon video boundary） | アサーション全PASS（`V3_RLS_CONFIRMED`） | **採用推奨** |
| `SF6DNA_P8_RLS_HARDENING_ENTITY_VIDEOS_CANDIDATE.sql`（V2、SHA-256 `75c43bb3…`） | 同上 | 動画境界は解消するが `anon result boundary`（大会実績）が残る | 不完全。RLS_V3に置き換え |
- RLS_V3には自動Rollbackがない（V3 READMEどおり）。適用は個別承認が必要。

## 3. 承認対象（現状はすべて未承認＝Y 0件）
| 承認CSV | 行 | 推奨Y |
|---|---|---|
| P8選手 `SF6DNA_P8_APPROVAL_20261117.csv` | 59 | 登録1・公開58・動画関連48・使用キャラ48 |
| P8動画 `SF6DNA_P8_VIDEO_APPROVAL_20261117.csv` | 15 | 15 |
| P8 SNS `P8_SNS_APPROVAL.csv` | 16 | 推奨値なし（要判断） |
| P6プロフィール `P6_PROFILE_APPROVAL.csv` | 42 | 推奨値なし（要判断） |
| P6バッチ `P6_BATCH_APPROVAL.csv` | 1 | 推奨値なし（要判断） |
| P9大会実績31件 | — | V3対象外の後続バッチ（順序はV3適用後） |
- 承認番号（approval_ref）は全行空欄。Yに承認番号がないとV3は停止する。

## 4. 動画リスト（⑦）との依存
- P8動画15本と⑦の候補76本の重複0。⑦の76本はP8に含まれない。
- 選手ページの動画表示には「動画の承認（approve_video）」「選手の動画承認（approve_videos）」「選手の公開」の3つが必要。
- ⑦の公開前提は RLS_V3 の適用（下書き選手の関連付け行・大会実績の露出防止）。

## 5. 正式承認を受けるために残る項目
1. 承認CSV 5種の本値と承認番号の記入（別承認者の照合）
2. ガード差替版のレビュー（差分がガード部分のみ）
3. 実DBのバージョン記録・バックアップ／PITR確認・実施時間帯の確保
4. RLS_V3適用の個別承認（自動Rollbackなし）
5. PG17での再検証（環境が用意できた場合）
