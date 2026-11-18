# Player図鑑 移管受領（Claude, 2026-11-17 第6回）

## 受領状況
| 成果物 | 状態 |
|---|---|
| `SF6DNA_PLAYER_ZUKAN_HANDOFF_20261117.zip` | **未受領**（添付先 `/mnt/user-data/uploads` は空、Driveの名前検索でも0件） |
| P8一式 `SF6DNA_P8_FINAL_DELIVERY_20261117.zip` | 受領（Drive）。SHA-256先頭16桁 `e2a4344a435b5969` が引き渡し資料と一致 |
| P9 `SF6DNA_P9_UNREGISTERED_TOP8_CANDIDATES_20261117.csv` | 受領（Drive）。11名 |
| P9 `SF6DNA_P9_TOURNAMENT_RESULT_ADDITIONS_20261117.csv` | 受領（Drive）。**5件**（指示の「31件」と不一致） |
| RLS強化案 | **未受領**（Driveで該当なし） |

- 保護: 全22ファイルのSHA-256・Drive ID を `HANDOFF_PROTECTION_MANIFEST.csv` に記録した。リポジトリは公開設定のため、開発DBのプロジェクトID・選手UUID・承認内容を含むSQLとCSVの**本体はリポジトリにコピーしていない**（Driveと作業領域のみ）。本フォルダのP9照合SQLに含まれる開発プロジェクトIDと選手UUIDは、基準SHAの時点で既にリポジトリ内（`src/data/player-research/*.json` 等）に存在する値のみ。

## P0: 既存59名（P8）の反映準備
- **SQL・承認CSV**: 変更していない（SHA-256で照合可能）。
- **未コミットのUI修正2ファイル**（`SF6DNA_P6_PREVIEW_QA_20261117.patch`）: `player-profile.tsx` の表示のみの変更（「種別」欄を非表示、地域が空なら地域欄を出さない、関連動画がなければ動画リンクを出さない）と、そのテスト1件。データ・公開境界への影響なし。
- **キャラクターデータ修正との競合**: P6・P8の差分（計5ファイル）とClaude作業ブランチの変更ファイルの重複は**0件**。両方を重ねた状態で Typecheck・Lint PASS、Test 956件中 PASS 943・FAIL 0・SKIP 13（第5回で確認）。
- **公開境界（既存仕様の確認）**: 選手の表示には「DBで `published`」かつ「アプリの公開ゲート `player-publication-gate.ts` に該当環境の行がある」の両方が必要。P8は開発環境の行だけを追加する。
- **RLS（現状確認。強化案は未受領）**:

| テーブル | 匿名で読める条件 | 所見 |
|---|---|---|
| `players` | 選手が `published` | 問題なし |
| `player_aliases` / `player_characters` | 親の選手が `published` | 問題なし |
| `tournament_results` | **大会**が `published` | 選手が下書きでも読める。P6は下書き大会にのみ追加するため現時点では露出しない |
| `entity_videos` | **動画**が `published` | 選手が下書きでも関連付けの行（選手UUID）が読める。P8で公開動画15本と関連付けを作ると、下書き選手のUUIDが匿名で読める状態になる（名前は `players` 側で保護） |

  - 重大度は低〜中（UUIDの露出のみ）と判断。対策案: `entity_videos` の公開読み取り条件に「関連先エンティティも公開済み」を加える。RLS強化案の受領後に照合する。
- **統括の最終監査・承認待ち**: Claudeは実行しない。

## P1: P9 追加選手
- 候補11名を受領。**P8の59名とは重複0件**（P8台帳と照合）。P8のSQL・承認CSVには含めない。
- HOLD: `nl`（CSV記載）、`hope`（**指示により**HOLD。CSV上の状態は「候補（報道）」で食い違いあり）、`shigematsu`・`zhen`（CSV記載：出典矛盾）。
- 重複確認SQL（読み取り専用）: `p9/P9_DEV_DUPLICATE_CHECK_READONLY.sql`
  - P8と同じ接続先確認（開発プロジェクトの確認＋ryukichiの開発ID確認）を行い、slug・表示名・別名を正規化して完全一致、6文字以上の名前は部分一致も確認する。表記ゆれ（sf5nl、Shigematus、Booce_Lee、小孩、重松）も含める。
- 大会実績の照合SQL（読み取り専用）: `p9/P9_TOURNAMENT_RESULTS_CHECK_READONLY.sql`
  - 受領できた5件（CEO 2026、micky 3位・blaz 4位・kilzyou 5T・craime 5T・wabiichi 7T）。対象5名はP8の59名に含まれ、開発UUIDはP8台帳と一致。P6の大会実績19件とも重複なし。
  - 判定: `PLAYER_ID_NOT_FOUND` / `TOURNAMENT_NOT_FOUND` / `TOURNAMENT_NOT_DRAFT`（公開大会には追加しない）/ `ALREADY_EXISTS_SAME` / `ALREADY_EXISTS_DIFFERENT_PLACEMENT` / `READY_TO_ADD`
  - 「31件」の正本は未受領。受領後にVALUESを差し替える。
- 検証: 両SQLを使い捨てPostgreSQL（PGlite）で実行し、重複検出（slug・別名）、HOLDの表示、5種類の判定、データ無変更を確認（`p9/test-p9-sql-with-pglite.mjs`）。

## 次の一手
1. `SF6DNA_PLAYER_ZUKAN_HANDOFF_20261117.zip`、RLS強化案、大会実績31件の正本を受け取る（このセッションへの添付が確実）。
2. 統括がP8の最終監査・承認を行い、Runbookどおりに実行する。
3. P9の2本のSQLを開発DBで実行し、結果を受けて登録案を作成する（P8とは別のSQL・別の承認CSV）。
