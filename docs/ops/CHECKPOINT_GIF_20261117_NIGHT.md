# Checkpoint — GIF/P8 夜間統合 (2026-11-17)

基準: HEAD 52eddb3(未コミット変更あり・Commit/Push/DB/Deploy なし) / 保護11ファイル差分SHA 14c6047b… 不変

## 状態
| 項目 | 状態 |
|---|---|
| ローカルQA接続 | 132本(固定パッケージ不変)。弱根拠48本は publicCandidate=false 維持 |
| トリム版6本 | ローカルQA作業コピーとデータJSONへ適用済み(承認済)。元6本は outputs/…/delta-144-20261117/originals-replaced に保全 |
| ヤスミン12本 | **HOLD**: 既存の承認済みMP4(approved_for_preview)と同一切り出し(再生時間一致・映像差 平均約3)。MP4優先ルールにより接続せず |
| リリー57本/マノン10本 | 受入準備のみ(Manifest照合)。SHA/切り出し重複0。目視QA待ち: リリー15・マノン6 / 強度根拠待ち: リリー27 / HOLD: リリー15・マノン4 |
| ルークDI | 技ID HOLD(候補 luke:web:602)。共通システム技はfixture外(リリー4・マノン2も同様) |
| GIF一括制作ツール | scripts/gif-intake/clip-to-gif.py 完成・実素材で検証(高速シーク/480x270/20fps固定/10MB未満/SHA/Manifest/重複防止/再開/終了コード) |
| 対応表3点 | DeeJay 97↔TXT106(97一致・TXTのみ9=共通システム8+単独1) / メディアキー 106一致 / アルジュン77行(GIF未受領のため空欄) |
| P8 V3 | 使い捨てPG16で既存ハーネス 52 PASS、契約テスト 38 OK、追加ロック競合8 PASS。実DB適用なし |
| 検証 | Typecheck/Lint/Test(1042 pass・0 fail・13 skip)/Chromium 13/13/案A隔離Build PASS(QA値264件ヒット0) |

## HOLD(局所)
- アルジュンGIF(Drive検索0件) / ルーク・リリー・マノンの共通システム技ID / ヤスミン12本(MP4重複)
- docs/ops は本ファイルで新設(既存の STATUS/TASKS は存在しなかった)

## 追記 22:11指示
- GIF制作ツール: Windows用パッケージ SF6DNA_GIF_TOOL_20261117.zip を共通引継ぎフォルダへ保存(CSV/JSON入力・--ffmpeg指定・PS1はUTF-8 BOM/CRLF)。Windows実機での実行は未確認
- P8 V3: 検証結果 SF6DNA_P8_V3_PG_VERIFICATION_20261117.zip を保存。使用PG 16.15 / 実DBのバージョンは不明。V3候補SQLの修正は不要(差分なし)
- 対応表: SF6DNA_CARD_MAPS_20261117.zip を保存
- 共通システム技のID: 既存の登録簿方式 `sf6dna-preview:<char>:<char>%3Aweb%3A<webId>`(formalMoveIdConfirmed=false)。ルークDI=sf6dna-preview:luke:luke%3Aweb%3A602。正式IDは未確定のためHOLD継続
- リリー15・マノン6: 技術QA・SHA照合・目視QA CONFIRMED(21本、接続候補・未接続・非公開)。visual-qa-lily-manon-21-20261117.json
- アルジュン「72枚」: 該当素材をDrive・ローカルで確認できず(77行の対応表のみ)。HOLD

## 追記 22:55承認分
- ローカルQA接続 149本(リリー15新規ファイル / マノン+投げ2=16)。マノンのレベランス・トモエ・デリエール・ア・テール・アン・オーは既存承認済MP4ありのため未接続(MP4優先)
- 新規17本は目視QA確定のため publicCandidate 欄なし(弱根拠専用の印)。approval=NOT_APPROVED のまま
- テスト期待値更新: page-gif-connect-patch(lily追加・manon16) / gif-intake-plan(manon16・slug一覧) / local-qa-gif(台帳 p4-visual-qa-manon-20261117.json 追加)
- 検証: Test 1042 pass・0 fail / tsc / ESLint / ブラウザQA 10/10 / 案A隔離Build成功・QA値298件ヒット0・nft参照0
- アルジュン: 現行77枚(TXT77行と1対1)を基準。旧表示(pre-release-character.ts)はプレスリリース由来の9技のみで、72枚を生成する条件はコード上に存在しない

## 23:51 Checkpoint 149本 固定
- Drive保存: SF6DNA_GIF_CHECKPOINT_149_20261117.zip (1cEwrUVf8GKMK68FQyOyBl9tUfs9ZFZY1, sha256 ab5172a1…) / SF6DNA_P8_V3_APPLY_PREP_20261117.md (1ac5UJ5eSNZ-Bs7AOy4uqzaxlxkUlH7vn)
- 未送信: トリム修正版6本(各5〜9MB)はコネクタ上限(1回約3MB)超過。outputs の SF6DNA_GIF_TRIMMED6_20261117.zip (ff67a397…) に保管
- RESTORE_TABLE_149: 実体SHA 149/149一致
- アルジュン77枚: TXT77行と名前・フレーム値6項目すべて一致、重複0、全件 draft / releaseFixture=false / releaseEligible=false(IDENTITY_HOLD 77)、表示はプレビュートークン付き内部ルートのみ
