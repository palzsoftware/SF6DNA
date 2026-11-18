# 技データ・キャラクター詳細（Claude, 2026-11-17）

## 基準
- ブランチ: `claude/move-data-quality-20261117`（基準 `sf6dna-v2-chatgpt-rc-20260916`）
- 基準SHA: `014aa4bb3448c6cb9f2d6a8a2694ce51376bb7e6` / 最終SHA: 未Commit
- 累積patch: `docs/move-data-integration-20261117/SF6DNA_MOVE_DATA_R1_R4.patch`（第1〜4回分。第5回分は `docs/ops`・`docs/gif-production-20261117` の文書のみ）

## 変更ファイル（既存ファイルの変更は4件、残りは追加）
- M `v2-web/src/lib/canonical-txt-connection.mjs`（N/A表記の正規化、`dee-jay`↔`deejay`のレコード解決）
- M `v2-web/src/lib/official-txt-preview-snapshot.ts`（R3にないslugだけ再生成データを参照）
- M `v2-web/src/lib/pre-release-character.ts`（アルジュンのローカル技カード取得関数）
- M `v2-web/src/app/internal/character-preview/[slug]/page.tsx`（1行）
- A スクリプト5本・ライブラリ1本・テスト10本・生成データ2本・`docs/move-data-*`

## テスト（第4回時点、第5回はコード変更なし）
- Typecheck PASS / Lint PASS / Test 952件中 PASS 939・FAIL 0・SKIP 13 / Build PASS
- 第5回: P6・P8パッチを重ねた使い捨てコピーで Typecheck・Lint PASS、Test 956件中 PASS 943・FAIL 0・SKIP 13

## 反映段階
- ローカル検証まで（GitHub未反映）

## 保護対象（変更しないこと）
- ディージェイ: `src/data/SF6DNA_WS5_APP_SLUG_PREVIEW_BUNDLES_R3_REGEN_20261117.json`（`node scripts/build-ws5-alias-candidates.mjs --check`）
- ディージェイ GIF 40件の対応表: `docs/move-data-integration-20261117/dee-jay/`
- アルジュン: `src/data/SF6DNA_ARJUN_CARD_DRAFT_20261117.json`（`node scripts/build-arjun-intake-candidate.mjs --card-data --check`）
- SQL候補: `SQL_CANDIDATES_MANIFEST.csv` にSHA-256を記録済み

## 承認待ち・未解決
- Commit・Push
- DB: 31件（照合SELECTを提出済み）、エレナ1件、キャミィ2件・舞1件（公式確認フラグが必要）
- GIF接続担当: ディージェイのメディアキー別名106行
- 公式確認: キャミィSA2、舞3段目、アルジュンSA2の技名（鎚/槌）

## 次の一手
- 承認後にCommit・Push。実DB照合の結果を受けてDB書込の判断。
