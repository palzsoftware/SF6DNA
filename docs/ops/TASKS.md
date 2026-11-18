# SF6DNA TASKS（優先順位・担当範囲・残作業）

最終更新: 2026-11-17（Claude Code 第6回）

## 担当範囲（パス単位。変更前に確認する）
| 担当 | 主なパス | 備考 |
|---|---|---|
| 技データ・キャラクター詳細（Claude） | `v2-web/src/data/SF6DNA_WS5_APP_SLUG_*`、`SF6DNA_ARJUN_CARD_DRAFT_*`、`src/lib/canonical-txt-connection.mjs`、`src/lib/ws5-slug-alias.mjs`、`src/lib/official-txt-preview-snapshot.ts`、`src/lib/pre-release-character.ts`、`src/app/internal/character-preview/**`、`scripts/audit-*`・`build-*`・`classify-*`、`docs/move-data-*` | WS5原本JSON（R3候補・公式TXT・名称）は**読み取り専用** |
| GIF制作 | Drive上のGIF・マニフェスト。リポジトリでは `docs/gif-production-*` | 技術試験と製品候補は別フォルダ・別命名 |
| GIF接続 | `src/data/SF6DNA_WS5_MEDIA_KEY_REGISTRY_*`、`*_MEDIA_MANIFEST_*`、`src/lib/media-key-registry.mjs`、`public/media/**` | Claudeは変更しない |
| Player図鑑 | `src/lib/player*`、`src/lib/confirmed-video-relations.ts`、`src/components/player-*`、`src/app/players/**`、`src/data/player-research/**`、`tests/player-*`、`docs/player-zukan-*` | P8の監査・反映は統括。受領・準備・P9はClaude。P8とP9は別SQL・別承認CSV |
| **共有（予約制）** | `src/app/characters/[slug]/page.tsx`、`src/components/character-unified-page.tsx`、`v2-web/package.json` | 変更前に下の「予約」欄へ記入 |

### 予約（共有ファイル）
| ファイル | 担当 | 期間 | 目的 |
|---|---|---|---|
| （なし） | | | |

## 優先順位つき残作業
| 優先 | タスク | 担当 | 状態 | 次の一手 |
|---|---|---|---|---|
| P0 | 第1〜5回の変更を作業ブランチへCommit・Push | Claude | 承認待ち | 承認後、書込権限で接続し `claude/move-data-quality-20261117` にPush |
| P0 | ブランカ・本田31件の実DB照合 | 統括／DB担当 | 未着手 | `docs/move-data-release-prep-20261117/sql/frame_concat_live_readonly_select.sql` を実行し、31 READYを確認 |
| P0 | GIF元動画の取得経路を決める | ユーザー | 判断待ち | `docs/gif-production-20261117/SOURCE_RETRIEVAL.md` の選択肢A〜Dから選ぶ |
| P0 | ディージェイ メディアキー別名106行の反映 | GIF接続担当 | 未着手 | `docs/move-data-integration-20261117/dee-jay/` のCSVを使う |
| P0 | ヤスミン R1 GIF 12本のレビュー | GIF担当／統括 | Drive引き渡し済み | Drive `SF6DNA_YASMINE_R1_GIF_CANDIDATE_20261117` を確認 |
| P0 | Player P8 最終監査・承認参照の記入・Dev DB実行 | 統括 | 納品済み | P8 Runbookの順序で実行。Claude側の統合確認は済み（衝突0）。SQL・CSVは `docs/player-zukan-20261117/HANDOFF_PROTECTION_MANIFEST.csv` のSHA-256で照合 |
| P0 | Player図鑑 移管ZIP・RLS強化案・大会実績31件の受領 | ユーザー／Player担当 | **未受領** | このセッションへ添付（DriveではZIP名の該当0件） |
| P1 | P9 候補11名のDev DB重複確認 | 統括（実行）／Claude（SQL作成済み） | 実行待ち | `docs/player-zukan-20261117/p9/P9_DEV_DUPLICATE_CHECK_READONLY.sql`。HOLD: nl・hope・shigematsu・zhen |
| P1 | P9 大会実績の既存データ照合 | 統括（実行）／Claude（SQL作成済み） | 実行待ち（5/31件のみ受領） | `p9/P9_TOURNAMENT_RESULTS_CHECK_READONLY.sql`。31件の正本受領後に差し替え |
| P2 | `entity_videos` のRLSで下書き選手のUUIDが読める件 | 統括 | 所見のみ | RLS強化案と照合して判断 |
| P1 | キャミィSA2・舞3段目の現行公式値の確認 | ユーザー／統括 | 未確認 | 確認後、確認フラグを付けてSQLを適用 |
| P1 | アルジュンSA2 技名「鎚」と「槌」の確認 | ユーザー／統括 | 未確認 | 公式ページの表記を確認 |
| P1 | リュウ不破三連撃の対応付け解除 | WS5担当 | 未着手 | R3候補の対応付けを修正 |
| P1 | ヤスミンのHOLDクリップ14本の再監査 | GIF担当 | HOLD | 再監査で合格した分だけR2として制作 |
| P2 | 数値不一致（パッチ確認待ち14件など）の公式照合 | 統括 | 未着手 | `docs/move-data-release-prep-20261117/p1/` |
| P2 | 0プレースホルダ10技の扱いの決定 | 統括 | 未着手 | `p1/ZERO_PLACEHOLDER_REVIEW.csv` |
