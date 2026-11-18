# 技データ修正・実装準備（2026-11-17 第2回）

- 前回監査: `docs/move-data-quality-20261117/`（変更なし・再生成で同一を確認済み）
- 基準: `sf6dna-v2-chatgpt-rc-20260916` @ `014aa4bb3448c6cb9f2d6a8a2694ce51376bb7e6`（作業ブランチ `claude/move-data-quality-20261117`）
- **実DBへの書き込み・Commit・Push・Deployは未実施。** SQLはすべて候補で、ローカルのPGlite（使い捨てPostgreSQL）でのみ検証済み。

## 状態一覧

| 項目 | 成果物 | 状態 |
|---|---|---|
| ディージェイ slug変換・106行対応付け | `src/lib/ws5-slug-alias.mjs`、`dee-jay/DEEJAY_106_CROSSWALK_CANDIDATE.csv` | ローカル実装・テスト済み。**ページ未接続**（接続は承認待ち） |
| アルジュン 77行→登録候補 | `scripts/build-arjun-intake-candidate.mjs`、`arjun/*` | 候補作成・テスト済み。公開ゲートは維持（レビュー前の下書きは0技） |
| フレーム連結破損 31件 | `sql/frame_concat_0[1-4]_*.sql` | SQL候補。DB書き込みは承認待ち |
| キャミィSA2 Classic 2件 | `sql/cammy_sa2_0[1-4]_*.sql` | SQL候補。現行公式確認フラグがないと適用されない |
| 舞 飛燕連脚（3段目） 1件（新規発見） | `sql/mai_hien_step3_0[1-4]_*.sql` | SQL候補。公式確認フラグがないと適用されない |
| N/A表記の正規化（`ー` `―`） | `src/lib/canonical-txt-connection.mjs` | ローカル実装・テスト済み（ローカル開発時のTXT接続にのみ影響） |
| 数値不一致87件の細分類 | `scripts/classify-frame-value-conflicts.mjs`、`conflicts/FRAME_VALUE_CONFLICTS_87_CLASSIFIED.csv` | 分類済み |

## P0 ディージェイ
- 製品slug `dee-jay` は維持。WS5側のキー `deejay` から製品slugへの変換は `WS5_TO_APP_SLUG` に限定。
- `rescopeWs5Candidate()` が候補・公式TXTレコードを `dee-jay:web:N` へ再スコープ（元キーは `ws5OriginalSourceRecordKey` に保持）。
- 対応付けの規則: 空白・全角を正規化した技名が**双方で一意**、かつ**発生フレームが一致**した場合のみ既存IDへ接続。それ以外は隔離プレビューIDのまま。
- 結果: **97/106行を既存97技へ接続（既存技の取りこぼし0、ID/slug不変）**。未接続9行はDB未登録の技（スライディングヒールアッパー1技＋共通システム8行）。
- 既存コネクタ（`connectCanonicalTxtCandidate` → `connectOfficialTxtPreviewCandidate`）に通した結果: merged 97 / appended 9 / ID重複なし。
- **未接続（HOLD）**: ページへの組み込みには次のいずれかが必要。
  1. `src/app/characters/[slug]/page.tsx` で `getWs5TxtPreviewCandidate` と公式TXTレコードを `rescopeWs5Candidate` に通す（page.tsxは無断変更禁止のため未実施）
  2. もしくはWS5担当が候補スナップショットを `dee-jay` で再生成する
- GIF担当のファイル（メディアキー登録・Manifest等）には触れていない。

## P0 アルジュン
- 公式TXT 77行の内訳: 登録候補63行／除外14行（共通システム10行=600番台、飛び道具の分離行4行=316/321/325/329。DBの他キャラにも存在しない形式のため）。
- 既存の取込スキーマ `sf6dna/arjun-official-intake/1`（`src/lib/arjun-official-intake.ts`）をそのまま利用。全項目が `UNCONFIRMED`（レビュー者なし）のため、
  `validateArjunIntake` はエラー0で受理し、`arjunIntakeToDraftBundle` は**0技**を返す＝**公開ゲート維持**。
- 値は公式TXTの文字列をそのまま使用（推測による補完はしていない）。先頭の「（ジャンプ中に）」等は条件欄へ分離。
- slug候補: 通常技は既存規約 `arjun-standing-lp` 形式（18技）、その他は `arjun-capcom-web-<webId>`（DBの `*-capcom-frame-NNN` に倣った中立名）。オーナーレビュー前提。
- DBのUUIDは作成しない（`canonicalMoveId: null`）。UUIDはDB登録時に採番。
- プレビュー9技との対応（`arjun/ARJUN_77_ROW_SCOPE_AND_PREVIEW_MAPPING.csv`）: 9技すべてに1行以上のTXT行が対応。強度違い・OD版は `VARIANT`、追撃・過剰な正義・息吹の震撼・倫理の崩壊は `DERIVED`。
  SA2は漢字が異なる（プレビュー「忘却の一**鎚**」／TXT「忘却の一**槌**」）ため `VARIANT_KANJI_CONFLICT`。
- 詳細ページへの接続手順（未実施・承認待ち）: ① Patch・取得元URLの確認 → ② 各項目のレビュー（`CONFIRMED` + evidence + reviewer）→ ③ `arjunIntakeToDraftBundle` で既存の技カード形式（DevicePreviewBundle）を生成 → ④ RC Preview限定の内部ルートで表示。
  既存の `pre-release-character.ts`（9技・テストで固定）は変更していない。

## P0 フレームデータ破損（ブランカ9件・本田22件）
- frame IDと現在値は、fixture監査情報と `scripts/data/remaining-character-intake-20261004.json` の**2つの独立したスナップショットで31/31一致**。
- 修正値はDB値から先頭の全体範囲を除いた文字列（DB自身の値の一部であり、新しい値は採用しない）。
- 手順: `01_precheck`（読み取り専用。31行READYを確認）→ `02_apply`（1件でも前提不一致なら全件ロールバック）→ `03_verify`（31行APPLIED）→ 必要時 `04_rollback`（適用後の値のままの行だけ戻す）。
- PGliteでの検証結果: READY 31 → 適用31 → APPLIED 31 → 復旧で完全一致。1件だけ値を変えた状態では「30 of 31」で中断し、書き込みは0件。

## P0 キャミィSA2
- 対象: `move_commands` のClassic 2行（`b23ccfc9…` 地上 `214214K`→`214214P`、`9701702b…` 空中 `j.214214K`→`j.214214P`）。技ID・コマンド行ID・slugは不変。どちらの行にも出典リレーションはない。
- `02_apply` は `sf6dna.cammy_sa2_official_confirmed = 'yes'` を明示しない限り中断する（現行CAPCOM公式ページでの最終確認を条件とするため）。
- 確定後の推奨: Classicコマンドへの公式出典リレーションを追加する（現状は `classicCommandOfficialEvidence: false`）。

## 新規発見: 不知火舞「飛燕連脚（3段目）」
- DBの3段目のフレーム値は「2段目」の値（`7 / 7-8 / 20 / -2 / -10 / 400`）の完全なコピー。公式TXTの2段目（`mai:web:202`）とも全項目一致するため、コピーによる誤りと判断。
- 修正候補は公式TXT 3段目（`mai:web:203`）の `10 / 10-11 / 28 / 3 / -10 / 500`。ただし公式TXTはPatch未検証のため、確認フラグ付き。
- 全キャラを走査し、同様の兄弟行コピーは他に0件。

## P1 N/A表記の正規化
- 公式TXTの `ー`（12箇所）と `―`（1箇所）は、すべて多段技で「ガードされない段のガード値」「必ず連続ヒットする段のヒット値」の位置にあり、`-` と同じ「該当なし」と判断。
- `canonical-txt-connection.mjs` のN/A判定にこの2文字を追加。元の文字列は保持し、状態だけ `OFFICIAL_NA`（表示「—」）になる。影響はローカル開発時のTXT接続のみ。

## P1 数値不一致87件の細分類
| 優先 | 分類 | 件数 | 意味 |
|---|---|---:|---|
| P0 | SUSPECTED_MAPPING_ERROR | 10 | 同じ技で3項目以上が不一致（舞3段目、ケンOD空中竜巻、ルークODフラッシュナックル、リュウ不破三連撃、テリー パワーダンクのダメージ） |
| P0 | ROW_GRANULARITY_MISMATCH | 5 | DBは複数段を1行、TXTは1段を1行で持つ |
| P1 | NUMERIC_CONFLICT / ACTIVE_RANGE_CONFLICT | 16 | 数値自体の相違（Patch差の可能性。例: A.K.I.紫泡泉 発生46/26、ケン龍尾脚ダメージ） |
| P2 | DB_MULTI_STEP_ROW / ACTIVE_LANDING_SEGMENTS / DB_VARIABLE_PLACEHOLDER / DB_ZERO_PLACEHOLDER / TXT_MALFORMED_SUSPECTED | 30 | 構造・プレースホルダ・公式TXT側の誤記疑い（`23--33`、`20-24.25`） |
| P3 | 表記差（合計=分割、`+0`、範囲表記、段ごとのフレーム数と範囲など） | 26 | 実質的に同値 |

## 再生成コマンド（`v2-web` で実行）
```bash
node scripts/classify-frame-value-conflicts.mjs ../docs/move-data-fix-20261117/conflicts/FRAME_VALUE_CONFLICTS_87_CLASSIFIED.csv
node scripts/build-arjun-intake-candidate.mjs ../docs/move-data-fix-20261117/arjun/ARJUN_INTAKE_CANDIDATE_63.json ../docs/move-data-fix-20261117/arjun/ARJUN_77_ROW_SCOPE_AND_PREVIEW_MAPPING.csv
```
