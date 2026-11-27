# SF6DNA V47（Claude B）動画691本 公開承認データ・最終統合パッケージ（2026-11-27）
基準SHA: 074ecc69a4fe8dc9514fca4ece5415b1b017a015（palzsoftware/sf6dna ブランチ sf6dna-v1-rc-qa-20261127 ＝ 現Preview）。クラウド候補 e7a6c9d まで対象3ファイルの変更なし。
ユーザー承認（11/27 15:31）: READY 691本の公開承認データ作成。HOLD 140本・EXCLUDED 1本は対象外。
Push・Deploy・共有DB書込・Production反映：なし。大会実績SQL：未実行（別途承認）。新規動画収集：終了。

## パッケージ内容
- out/videos.json・out/registered.json・out/profile-supplements.json：統合候補（承認済みデータ）
- SF6DNA_V47_approved_data_074ecc6.patch：上記3ファイルを基準SHAへ当てるパッチ（git apply --check 成功）
- before/：承認前の元データ3ファイルと SHA256SUMS（保全）
- APPROVAL_LIST_READY_V47_ALL_Y.csv：691本すべてY
- sfl48_device_hold_v47.json：既存デバイス値と食い違う18行（上書きせずHOLD）
- delta_profile_supplements_14_v44.json：追加14名（製品のprofile-supplementsは48名用の形式のため別ファイルで維持。Player ID対応後に取り込み）
- tournament_results_v46_apply.sql＋rollback_from_receipt_v46.py：未実行
- 生成スクリプト（apply_meta_v46.py → apply_v45.py → apply_approval_v46.py）、test_v47.py、display_projection_v47.json

## 変更内容
| ファイル | 変更 |
|---|---|
| videos.json | 651行 PENDING→APPROVED／空欄の channelName・sourceDate を YouTube メタデータで補完（118項目）／2026-08-03調整前の本人解説71行に cardNote（調整前の注記） |
| registered.json | V45の58行を追加（PENDINGで追加→READYのものをAPPROVED）／443行 APPROVED／調整前の解説8行に caution を追加 |
| profile-supplements.json | 「Cヴァイパー」→「C.ヴァイパー」1件／SFL48名の未反映71行のうち53行を facts に追加（プレイスタイル48・別表記5。出典URLあり）。publicationApproval は全48名 PENDING のまま（公開されない） |

## 検証結果（test_v47.py 11/11 PASS）
- 承認前データは全件PENDING（保全確認）／行キーの重複0／動画×キャラの重複増加なし
- APPROVED は1,094行（V46のREADY行キーと一致）。HOLD・EXCLUDEDの動画は全行PENDINGのまま
- 承認対象外の変更なし（videos.json は承認・空欄補完・注記のみ、registered.json は承認・注記・V45追加のみ）
- 表示の投影（registered-youtube-videos.ts をPythonで再現）: 本番環境691カード（対戦480・解説206・ランクマ5）、Player 56名、全32キャラ5本以上・0本なし。開発環境687カード（アルジュンは character-ids.json の developmentMissing により0本）
- 調整前の攻略動画は全件に注記あり
- プロフィール: Cヴァイパー0件、追加53facts、全factに https 出典

## 再生確認の区別
- 確認済み: oEmbed HTTP 200（公開・埋め込み許可）＝ 774本＋V45 58本。
- 未確認: 実際の埋め込みプレーヤーでの再生（地域制限・年齢制限・再生時エラー）。Preview反映後のブラウザQAで確認する。

## Cへの引き継ぎ（適用順序）
1. 基準 074ecc6 で `git apply SF6DNA_V47_approved_data_074ecc6.patch`（3ファイル）
2. tsc・既存テストを実行
3. （承認後）Push → Preview再ビルド → ブラウザQA: 動画再生（埋め込み）、検索、キャラ絞り込み、Player絞り込み、「さらに12件表示」、スマホ幅
4. 大会実績SQLは別途承認後に開発DBで実行し、RETURNING結果をreceiptとして保存
- 復旧: `git apply -R SF6DNA_V47_approved_data_074ecc6.patch`、または before/ の3ファイルを戻す（SHA256SUMSで照合）

## 残課題（最終QA待ち）
HOLD 140本、ヤスミンの対戦動画0本、デバイスHOLD 18行、追加14名の取り込み形式、Broski・Luffy・Xian、Hibiki、大会実績SQL。
