# SF6DNA GIF接続 132本 Claude Code引き継ぎ(2026-11-17)

状態: **STANDBY**(通常のGIF接続作業は終了。新規素材が来るまで再調査しない)

## 1. 引き継ぐ内容
| 区分 | 場所 |
|---|---|
| 接続データ(132本・変種は別) | `v2-web/src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_*_20261116.json`(luke15 jp5 manon14 juri5 jamie11 cammy29 dee-jay35 chun-li9 guile9 + LUKE_VARIANTS) |
| 弱根拠48本の区分 | 上記JSONの `evidenceTier=COMPOSITE_WEAK_STRENGTH` / `publicCandidate=false`(型は `src/lib/local-qa-gif.ts`) |
| GIF実体の復元表 | `scripts/gif-intake/RESTORE_TABLE_132_20261117.json`(.csv)= Drive fileId + SHA-256 + bytes |
| 復元検証 | `node scripts/gif-intake/verify-restore-132.mjs` |
| 台帳・計画・QA | `scripts/gif-intake/p1-* p2-* p3-* asset-inventory-* evaluation-* weak-evidence-normals-20261117.json data-correction-candidates-20261117.md NEXT_WORK_PLAN.md` |
| 案A整理 | `scripts/gif-intake/page-gif-connect-caseA-summary-20261117.md` + `proposals/page-gif-connect-head.patch`(**未適用**) |

## 2. GIF実体の復元(560MBアーカイブに依存しない)
1. `RESTORE_TABLE_132_20261117.json` の各行の `driveFileId` を Drive から個別ダウンロード(全て10MB未満)。
2. `v2-web/<localFile>`(= `.sf6dna-local-qa-gif/<character>/<fileName>`、gitignore済み)へ配置。
3. `node scripts/gif-intake/verify-restore-132.mjs` で 132/132 一致を確認。
- 注意: 保存名は技slug基準(`<moveSlug>.gif`)で、Drive上のファイル名とは違う。対応は表の `moveSlug`/`localFile`。
- 検証区分: 123本=受入時にSHA-256照合済み / 9本(ジェイミー5・ジュリ4)=ファイルサイズ一致のみ確認(SHA再読取りは未実施。上のverifyスクリプトで確定する)。
- 補助: 同梱の `gif-bytes-132.tar.gz`(約560MB)は任意の予備。

## 3. 適用手順(Claude Code側)
1. `git status` / ブランチ確認。未コミット変更を保護(`reset --hard` / `clean` / `restore .` 禁止)。
2. 現行RCに対して差分を確認(下記4)。
3. データJSON・スクリプト・テストを現行RCへ反映(ファイル単位でadd、`git add .`/`-A` 禁止)。
4. GIF実体を復元→ `verify-restore-132.mjs`。
5. `cd v2-web && node --test tests/*.test.mjs` / `npx tsc --noEmit` / `npx eslint .` / `node ../scripts/gif-intake/run-gif-pipeline.mjs --characters luke,jp,manon,juri,jamie,cammy,dee-jay,chun-li,guile --views qa,unified --restore-next-env`
6. 案A(`characters/[slug]/page.tsx`)の適用・Commit・Push・DB・Deploy・本番は**別承認**。

## 4. 基準SHA 52eddb3 と現行RCの差分に関する注意
- 本作業は HEAD 52eddb3(ブランチ work/luke-gif-connect)基準。現行RCのSHAは**未確認**(こちらからは見えない)。
- 衝突しやすいファイル: `v2-web/src/lib/local-qa-gif.ts`、`local-qa-gif-sources.ts`、`local-qa-gif-page.ts`、`tests/page-gif-connect-patch.test.mjs`、`tests/gif-intake-plan.test.mjs`、`tests/local-qa-gif.test.mjs`、`scripts/gif-intake/build-local-qa-data.mjs`、`characters/[slug]/page.tsx`(案A)。
- `ALL_CHARACTER_RELEASE_FIXTURE_20261004.json` を moveId 照合に使用。RCで技ID・コマンドが変わっていれば、まず `intake-plan.mjs` で再照合する(キャミィSA2は 214214K→P の修正候補あり。fixture未変更)。
- 保護11ファイルの差分SHA(基準): `14c6047b216322a02330b06f9253c80e0e11d835c34677ae6c83c31cfe1182a0`。
- 未受領: DeeJay97技↔TXT106行の対応表 / dee-jay・deejay メディアキー候補 / アルジュン77行GIF対応表。受領後に弱根拠48本・ディージェイ35本を再照合。

## 5. 未解決
- 150本目標は未達(132本)。保留は `weak-evidence-normals-20261117.json`。
- 案Aの隔離Buildは106本でPASS(132本は未実施)。
- 優先リスト15番(フォルダ所在未確認)は未解決。
