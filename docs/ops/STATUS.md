# SF6DNA STATUS（単一の進捗台帳）

最終更新: 2026-11-17（Claude Code 第6回: Player図鑑の移管を追加）
基準: `sf6dna-v2-chatgpt-rc-20260916` @ `014aa4bb3448c6cb9f2d6a8a2694ce51376bb7e6`（リモートと一致）

> 運用ルール: 進捗はこのファイルだけを正本とする。旧資料（`PROJECT_STATUS.md`、`NEXT_PROMPT.md` など）は**削除・編集せず**、履歴として残す。
> 各担当は作業終了時に、自分の行を更新し、`checkpoints/` にCheckpointを1件追加する。
> 他の担当の行は書き換えない。

## 反映状態の段階
`未着手` → `ローカル実装` → `ローカル検証` → `GitHub反映` → `Preview反映` → `Preview QA` → `Production反映` → `Production確認`

## 機能別の反映状態
| 機能 | 担当 | 段階 | 承認待ち・ブロッカー | 最新Checkpoint |
|---|---|---|---|---|
| 技データ品質監査・分類 | Claude | ローカル検証 | Commit・Push承認 | `checkpoints/20261117-claude-move-data.md` |
| DBフレーム修正（ブランカ・本田31件、エレナ1件） | Claude（SQL候補） | ローカル検証（PGlite） | 実DB照合SELECTの実行 → DB書込承認 | 同上 |
| DB修正（キャミィSA2・舞3段目） | Claude（SQL候補） | ローカル検証（PGlite） | **現行公式値の確認** → DB書込承認 | 同上 |
| ディージェイ 106技の表示経路 | Claude | ローカル検証 | Commit・Push承認 | 同上 |
| ディージェイ メディアキー別名（106行） | GIF接続担当 | 未着手（候補は提出済み） | GIF接続担当の判断 | 同上 |
| アルジュン 72枚ローカル表示 | Claude | ローカル検証（dev serverでHTTP 200） | Commit・Push承認／Patch・公式確認 | 同上 |
| アルジュン DB登録（62技） | 未定 | 未着手 | Patch確認・UUID採番・DB書込承認 | 同上 |
| GIF制作（ヤスミン R1 12本） | Claude | ローカル検証＋Drive引き渡し済み | 公開承認なし（`NOT_GRANTED`） | `checkpoints/20261117-claude-gif-production.md` |
| GIF制作（ギル・ディージェイ・マノン・JP・ルークほか） | GIF担当 | Drive候補あり（詳細は担当資料） | 担当側で管理 | 担当側 |
| Player図鑑 P8（既存59名・動画15本） | 統括（最終監査・反映）／Claude（受領・準備） | Drive納品済み・Dev DB未実行。保護台帳とSHA-256記録済み、コード衝突0 | 統括の最終監査・承認 → 承認参照の記入 → Dev DB実行 → コード生成 | `checkpoints/20261117-claude-player-intake-prep.md` |
| Player図鑑 UI修正2ファイル（P6 Preview QA） | Player担当 → Claude受領 | 未コミット（パッチで受領）。統合試験PASS | P8と同時にCommit（別承認） | 同上 |
| Player図鑑 P9（追加候補11名・大会実績） | Claude（準備） | 照合SQL（読み取り専用）作成・PGlite検証済み | 移管ZIP・RLS強化案・大会実績31件の正本が**未受領**／Dev DBでの照合実行 | 同上 |
| Ryu統合（Workモード） | 不明 | 未確認 | 担当と状態をこの台帳に記入してほしい | — |

## 環境
| 項目 | 状態 |
|---|---|
| Claude Code（クラウド） | Node・Next.js build・FFmpeg 6.1.1・Python 3.13・Pillow 利用可。GitHubへの書込は未接続（読み取り専用clone） |
| Google Drive（コネクタ） | 検索・アップロード・10MB以下のダウンロードは可。**10MB超は不可** |
| Drive API（`www.googleapis.com`） | ネットワーク上は到達可。認証情報なし |
| ユーザーPC接続 | 接続可能なフォルダなし |
| ChatGPT Work / Codex | ユーザー報告では利用不可（2026-11-17） |

## 2026-11-18 統合候補（Claude）
- 基準: 現行RC `52eddb3`（`014aa4b` からPlayer関連19ファイル更新）
- 統合内容: STANDBY（`SF6DNA_STANDBY_20261118.zip`、SHA-256先頭 `ee4ad3a1f45ed526`）の全未コミット差分 ＋ Claude第1〜6回の累積差分
- 衝突: なし（`v2-web/AGENTS.md`・`CLAUDE.md` はClaude作成物ではないため除外）
- 検証（使い捨てworktree）: Typecheck PASS / Lint PASS / Build PASS / Test 1077件中 PASS 1063・FAIL 1・SKIP 13
  - FAIL 1件はGIF実体（`luke-aerial-flash-knuckle.gif`）未復元による。GIF149本の復元待ちの局所HOLD
- 成果物: `docs/ops/SF6DNA_INTEGRATION_CANDIDATE_52eddb3_20261118.patch`
- GIF一括制作ツール: STANDBY側の `scripts/gif-intake/clip-to-gif.py` を正とする。Claudeの `scripts/gif-batch-render.py` は重複のため統合候補に含めない（未追跡のまま保留）
- HOLD: GIF149本の復元（Drive取得149回が必要。利用量削減のため未実施）、P8 V3の実DB適用

## 2026-11-18 日中（Claude・製品統合専任）
- Remote HEAD: RCブランチ `sf6dna-v2-chatgpt-rc-20260916` = `014aa4b`（変化なし）。`52eddb3` はリモートのブランチに存在しない（SHA指定でのみ取得可）
- 統合候補patch（337ファイル）は `014aa4b` にも衝突なく適用可。適用後: Typecheck PASS / Lint PASS / Build PASS / Test 1109件中 PASS 1095・FAIL 1・SKIP 13
  - FAIL 1件 = ルークGIF variantテスト。必要な11本のうち復元表149本に載っているのは1本のみ → **HOLD**（残り10本の所在をGIF担当に確認）
- GIF149本の全件復元: Drive取得149回が必要 → 利用量削減のため **HOLD**
- P8 V3: 手順・承認項目・Rollbackは STANDBY の `SF6DNA_P8_V3_APPLY_PREP_20261117.md` を正本とし、Development専用ガードの前置き候補 `docs/ops/P8_V3_DEVELOPMENT_GUARD_PREAMBLE.sql` を追加（未試験。V3本体パッケージは未受領）
- 対応表の照合（STANDBY版 ↔ Claude版）: ディージェイ 97↔TXT106 差分0／メディアキー（登録上の技ID）106件 差分0／アルジュン77行（プレビューID・slug）差分0

## 2026-11-18 次工程（Claude）
- ルークGIF11本: 全11本の所在をDrive（`22_35`〜`22_48`）で特定（元ファイル名・バイト数一致）→ 取得してSHA-256 11/11一致・重複0 → 失敗していたテスト `local-qa-gif-variants` 8/8 PASS。再撮影不要。一覧: `docs/ops/LUKE_GIF11_LOCATION_20261118.csv`
- GIF149本: 一括保全ZIPは見当たらず（STANDBYはテキストのみ、`SF6DNA_GIF_TRIMMED6` はトリム6本のみ）。残りは個別取得が必要 → HOLD
- P8 V3本体（`SF6DNA_P8_V3_CANDIDATE_20261117.zip`、SHA-256先頭 `e23cba88662ae120`）を受領
- Development専用ガード: 使い捨てPG16で検証。**`\i` 読み込みでは停止しても呼び出し元が続行する欠陥を発見し修正**（`\quit`→`raise exception`、先頭への直接記述を必須化）。直接記述方式で 開発のみ通過／本番・無関係ホスト・承認番号なし・開発ID欠落はすべて停止
- 014aa4b基準の最新統合patch: `docs/ops/SF6DNA_INTEGRATION_CANDIDATE_014aa4b_20261118.patch`（52eddb3基準patchは変更なし）

## 2026-11-18 ⑧運営・共通（Claude）
- 既存確認: 利用規約・プライバシー・免責・問い合わせ・フィードバック・認証・エラー/404/全体エラー・robots・sitemap は実装済み。管理画面は全ページ・全サーバーアクションでログイン＋管理者ロールを確認。関連既存テスト（security-*、contact-*、global-pages-final-qa、sitemap-public-boundary、public-navigation、mobile-global-menu）PASS
- 不足していた必須項目: セキュリティ応答ヘッダー → `v2-web/next.config.ts` に追加（nosniff / X-Frame-Options SAMEORIGIN / Referrer-Policy / Permissions-Policy / HSTS / X-Powered-By非表示）。本番ビルドで応答ヘッダーを確認、/terms・/privacy 200、未存在URL 404
- 未対応（別途判断）: CSP（インラインスクリプトとYouTube埋め込みの監査が必要）
- 検証: Typecheck・Lint PASS / Test 952件中 PASS 939・FAIL 0・SKIP 13 / Build PASS
- HOME・診断・診断結果・15分トレモはCLEAR扱いで未変更
- `v2-web/AGENTS.md`・`CLAUDE.md` は `next dev` が自動生成するファイル（Claude作成物ではない）

## 2026-11-18 ⑧統合（Claude）
- `next.config.ts`（セキュリティヘッダー）を最新統合候補へ追加 → `docs/ops/SF6DNA_INTEGRATION_CANDIDATE_014aa4b_20261118_v2.patch`（v1は不変）
- HSTS: `max-age=31536000` のみ（`includeSubDomains` は本番ドメイン確定まで外す）。サイト内にiframe埋め込みはなく、YouTubeはサムネイル＋外部リンクのため X-Frame-Options / Permissions-Policy の影響なし。CSPは保留
- 統合後検証（014aa4b＋v2候補＋ルークGIF11本をローカル配置）: Typecheck・Lint・Build PASS / Test 1109件中 PASS 1096・FAIL 0・SKIP 13

## 2026-11-18 ⑦動画リスト（Claude）
- 正本: `SF6DNA_VIDEO_P9_P12_DELTA_20261118.zip`（SHA-256 `d6b525d7…`）。動画76本・関連81件、完全検証0・公開承認0、全件HOLD（REVIEW 72／重複2／出演根拠候補4／既存再利用3）
- 差分照合: 76本とP8承認対象15本の重複0。リポジトリ内参照は3本のみ（`src/lib/video-learning-registered.ts` の注釈データ。Dev DBで下書き）。このモジュールは認可済みローダーが返した公開行に注釈を付けるだけで、動画の取得・公開状態変更をしないため公開経路ではない
- 未承認動画の公開防止: `videos` はRLSで `published` のみ公開。既知の残課題は `entity_videos`（動画が公開なら下書き選手の関連行が読める）→ P8 V3同梱の `RLS_V3_CANDIDATE.sql` で対応予定（未適用）
- 検索・フィルター・再生: 既存テスト（video-library-search-suggestions、ws14-video-filter-state、video-publication-boundary-audit、search-release-boundary ほか）は統合候補v2の全体テストでPASS。サイト内に埋め込み再生はなく、外部リンク再生
- コード修正候補: なし。次工程は優先5本・7関係（`priority_7_relations.csv`）の出演場面・使用キャラ・公開承認の確認（人手判断・DB照合が必要なためHOLD）

## 2026-11-18 ⑥Player図鑑（Claude）
- P8 V3 × Development専用ガードの結合試験4ケース全て期待どおり（PG16）。PG17は環境制約でHOLD
- RLS: RLS_V3採用推奨（適用前FAIL→適用後PASS）。V2のentity_videos候補は大会実績の境界が残り不完全
- 承認対象はすべてY 0件。詳細と残項目: `docs/ops/P8_V3_APPROVAL_READINESS_20261118.md`

## 2026-11-18 攻略カード共通デザイン（Claude）
- 共通コンポーネント `v2-web/src/components/strategy-card.tsx`（＋`.module.css`）を追加。表示順: 分類・操作方式→カード名→実演GIF（右上ブックマーク・左下出典）→3列の数値→コマンドアイコン→日本語技名ルート→解説→「成立条件・詳細情報」（開閉）。種類: combo/setplay/sequence/counter
- 日本語表記は検証済みレシピの `move_name` を「 → 」で連結（推測しない。ない場合「技名表記確認中」）。GIF未制作は「実演GIF追加予定」をコンパクト表示
- 既存の `PilotComboCard` を共通カード経由に変更（お気に入り＝ブックマーク、練習・個別ページリンク・出典安全チェック・旧比較項目は詳細欄に維持）
- 公開境界は不変（`publicStrategyContent: false` のまま。公開ページの攻略枠は従来どおり「今後のアップデートで追加予定」）
- テスト更新: デザイン変更で文言・ファイル位置が変わった4ファイルの期待値のみ（動作メディア未登録→実演GIF追加予定、描画を共通カード側で確認、描画テストの読込設定）
- 検証: Typecheck・Lint・Build PASS / Test 952件中 PASS 939・FAIL 0・SKIP 13。スマホ幅の実画面目視は未実施（実データはPreview DB依存）
- P8 V3成果物・検証結果は変更なし
