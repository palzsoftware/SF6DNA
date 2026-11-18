# Player図鑑 P8 受領準備（Claude, 2026-11-17）

役割: P8 V2 の監査・反映は**統括側**。Claude は受領後に実装を引き継げるよう、衝突確認と統合試験だけを行った（DB・コードへの適用はしていない）。

## 受領物の確認（Drive）
- `SF6DNA_P8_FINAL_DELIVERY_20261117.zip`: SHA-256先頭16桁 `e2a4344a435b5969` が引き渡し資料の記載と一致。19ファイル。
- コード差分:
  - `SF6DNA_P6_PREVIEW_QA_20261117.patch`: `src/components/player-profile.tsx`、`tests/player-profile-preview-qa.test.mjs`
  - `SF6DNA_P8_CODE_PREVIEW_ALL_RECOMMENDED_20261117.patch`（推奨値すべて承認した場合の生成結果）: `src/lib/player-publication-gate.ts`、`src/lib/confirmed-video-relations.ts`、`tests/player-publication-gate.test.mjs`

## 衝突確認
- Claude作業ブランチの変更ファイルとの重複: **0件**
- 両パッチを Claude の作業ツリーへ `git apply --check`: どちらもOK
- 使い捨てコピーに両パッチを適用した状態で: Typecheck PASS、Lint PASS、Test 956件中 PASS 943・FAIL 0・SKIP 13

## 引き継ぎ時の手順（統括の承認後）
1. 統括が承認参照を記入し、Runbookの順序でDev DBを実行する（第13回 APPLY → P8 APPLY）。
2. `gen_p8_code.py` を実際の承認CSVで実行して生成したコード差分を受け取る（推奨値のパッチとは差が出る可能性がある）。
3. Player用ブランチ（例: `player/p8-20261117`）を基準SHAから作り、P6のUIパッチと生成差分を適用する。Claude のブランチとは混ぜない。
4. Typecheck・Lint・Test・Release Gates・Buildを実行する → Preview QA。

## 注意
- 生成コードはDev DBの実行結果に依存するため、推奨値パッチを先にコードへ入れない。
- Player担当の未コミット変更（引き渡し資料に記載のUI修正2ファイル）は、担当側の環境にのみ存在する。Claude側で再作成・上書きしない。

## 2026-11-17 追記: 移管受領（第6回）
- 詳細: `docs/player-zukan-20261117/README.md`
- 受領: P8一式（SHA-256一致）、P9候補CSV（11名）、P9大会実績CSV（5件）。**未受領**: 移管ZIP本体、RLS強化案、大会実績31件の正本。
- 保護: 22ファイルのSHA-256・Drive IDを `HANDOFF_PROTECTION_MANIFEST.csv` に記録。本体は公開リポジトリにコピーしていない。
- P6 UI修正2ファイル: 表示のみの変更と確認（種別の非表示・空の地域欄の非表示・動画がない場合のリンク非表示）。
- RLS現状: `entity_videos` は動画が公開なら下書き選手の関連行も読める（UUIDの露出）。`tournament_results` は大会が公開なら読める（P6は下書き大会のみなので現状は露出なし）。
- P9: P8との重複0件。HOLD: nl・hope（指示）・shigematsu・zhen。重複確認・大会実績照合の読み取り専用SQLを作成し、PGliteで検証済み。
- 反映段階: 文書とSQL候補のみ。DB・コードの実行なし。
