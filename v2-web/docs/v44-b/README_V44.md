# SF6DNA V44（Claude B）残存データ統合差分（2026-11-27）
基準SHA: e7a6c9da62322962a91aabbfd29fd1f99192caf0（Preview 074ecc6）。開発DB vvsknbmlfvvnrmgtyhbf は読み取りのみ（players 102 / tournaments 11 / tournament_results 61）。
共有DB書込・Push・Deploy・本番変更・公開承認値の変更：なし。V43（動画22本・28関連）との重複：0件。

## 変更対象（すべて新規ファイル）
| ファイル | 内容 | 追加 | 更新 | HOLD |
|---|---|---|---|---|
| delta_tournament_results_v44.json | 既存大会ID×既存Player IDの実績（既存61行に無いものだけ） | 10 | 0 | 8 |
| tournament_results_v44_candidate.sql | 上記の取り込み候補SQL（未実行・冪等・復旧行付き） | 10 | 0 | — |
| delta_profile_supplements_14_v44.json | 追加14名の国・所属・キャラ根拠・SNS（公開承認PENDING） | 14 | 0 | 3（broski/luffy/xianはID無し） |
| delta_strategy_videos_v44.json | C向け68本（不足9キャラ）の攻略対象キャラ関連 | 68 | 0 | 31（接続不可） |
| test_v44.py | 14件 | | | |

SFL48名のプロフィール補完は11/25の SF6DNA_E_PROFILE_RECHECK_48（Drive 1OWIfPymkjNwzoGEQ-0Ul3ZI_om7TxOcb、317行）を正本とし、重複作成しない。

## 根拠の扱い
- 大会実績：主催者記事・CPT公式、またはSaiga NAK＋既存台帳一致のみ追加。推定（EVO2025 LeShar 7位）・報道のみ（CC11 AngryBird 4位、EWC2025 LeShar 3位）は HOLD。
- 既存DBの ewc-2026 hibiki 2位は、主催者表記がSBI e-SportsのHibikiで既存ひびきとの同一性未確認 → HOLD（行は変更しない）。
- CC12・EWC2024・TOPANGA等は大会IDが無いため取り込まない（新規大会IDは作成しない）。
- プロフィール：大会で使ったキャラと現行メインは別項目。本人発信がないものはメインにしない。Kusanagiはフランスの選手。Oil Kingのインタビュー章（3:02:08）と対戦（3:04:34）は別内容（V43）。
- 動画：relationKind=STRATEGY_SUBJECT（攻略対象キャラ）で、選手の使用キャラとしては扱わない。チャプター時刻は「映像未視聴」としてHOLD理由に残す。ACQUAチャンネルは運営者未確定のため接続不可。接続可37本（marisa7・dee-jay6・yasmine5・arjun4・alex4・kimberly4・e-honda3・manon3・ingrid1）。
- Xianの登録状態：Cの最新receipt（V41開発DB実行記録）で未登録のまま。DB読み取りでも不在を確認。

## 取り込み方法
1. python3 test_v44.py（14件）
2. 開発DBで承認後: psql … -f tournament_results_v44_candidate.sql（復旧: note LIKE 'V44 %' を削除）
3. プロフィール・動画は各JSONを製品側の候補データへ取り込み（publicationApprovalはPENDINGのまま）

## 検証結果
test_v44.py 14/14 PASS（既存61行と重複なし、UUID形式、推定値なし、Hibiki保留、14名、未登録3名はIDなし、承認値PENDING、V43重複0、動画重複0、チャプター由来は未視聴明記、ACQUA接続不可、SQL冪等）。

## 連絡事項
- Cより：profile-supplements.json の「Cヴァイパー」1件はB領域。正しくは「C.ヴァイパー」。製品ファイルが手元に無いため本便では修正していない（取り込み時に置換を推奨）。
