# SF6DNA ルーク技カード/GIF統合マスター — 2026-11-17

## 判定と調査の境界
- この作業はChatGPT環境のみ、製品コード/DB/Preview/Production未変更。
- `スト6フレームデータ.txt` のJavaScript `luke: Q` に格納された有効`webId`付きの77レコードを抽出。重複`webId=208`が二つあるため77行/76ユニーク番号。**CAPCOM最新Patchの公式原本としての真偽・適用Patchは未検証**。外部の現行サイトでは78技と示す別粒度の一覧もあり、77行を全公式技と断定しない。
- GitHub `palzsoftware/SF6DNA`, branch `sf6dna-v2`, `v2-web/src/lib/device-preview.ts`, `v2-web/src/lib/characters.ts` などを読み取り、技データはSupabase RPC/Previewに依存することを確認。実DBは未読、**カード件数・内部moveId・本番/Preview表示は全件未確認**。

## 既存資産
- `キャラGif画像/ルーク` 直下71GIF + Markdown台帳1件を確認。
- 2026-11-13制作台帳36本は71本の内数で、重複加算禁止。旧SA元版/軽量版、立強P・ジャンプ強Kの版違い、ODフラッシュナックル2HITS/4HITSは別ファイルとして管理。
- ファイル名・旧台帳からルークの**66/77ソースレコードにGIF候補**が存在し、11/77は71本の直下に個別対応がない。ただしその11のうち2件は別の既存素材から候補を回収した。8件の「同一動作/段別カード要否」の確認が必要。**新規録画/新規GIF制作が確定した件数0。**
- 過去QA報告により71本中62本は技術PASS報告があるが、ChatGPT現ターンで62本の再読込はしていない。残9本はこの台帳では技術QA未確認。映像・入力・強度の正式PASSではない。

## 既存不足候補・優先順
| webId（資料内） | 技 | 現状 | 次の解除条件 |
|---|---|---|---|
| 204 | ダブルインパクト1段目 | `luke_double_impact_first_strike_22s12_22s98_HOLD.gif` 17F、既存ZIPから回収、個別Drive受渡。技ID HOLD | 前強P単発/連係初段の表示要件、元動画の動作開始〜終了、入力条件を確認 |
| 314 / 315 | ODフラッシュナックル、2段目 | 2HITS候補と4HITS版があり対応未確定 | 元映像の初段/2段目/派生を入力時系列で照合 |
| 202 | トレンチブレイク Modern独立入力 | しゃがみ強Kと同動作か要確認 | Modern入力とカード表示契約確認 |
| 206 | トリプルインパクト2段止め | 最終段の既存GIFはあるが個別GIF未確認 | 2段止めカードがあるか確認、撮影区間が非重複か検証 |
| 208 | スナップバック2段止め | 最終段の既存GIFあり、段別未確認 | 2段止めカード要件確認。資料webId=208の衝突に注意 |
| 210 | スナップバック3段止め | 同上 | 3段止めの独立表示要件確認 |
| 601 | 後方ステップ | 独立GIF未確認 | 対象技カード有無と元動画の独立記録を確認 |
| 603 / 604 | ドライブリバーサル2条件 | それぞれ独立GIF未確認 | ガード中/起き上がりの入力条件と別映像要否確認 |
| 606 / 607 | ジャストパリィ打撃/飛び道具 | 条件別GIF未確認 | 2条件を分けて表示する仕様を確認 |

## このターンの実体検査
- 既存 `luke_double_impact_first_strike_22s12_22s98_HOLD.gif` を過去のSPECIAL8 ZIPから解凍。480×270、17フレーム、loop=0、全フレームPillow decode PASS。SHA256=`579eda7146e0c1013ec2ce7675d5f4667cf3dac5cc9100005c06825173c81d95`。
- Google Drive受渡へ新規の**個別ファイルとして転送**。ID=`11rGPDK1M1w09nE7PmNFrwQlYzrAm2Xsd`。保存後に再ダウンロードしてSHA256完全一致。制作済みGIFの再エンコードではない。
- 2026-11-16の2HITS OD候補はDrive既存ID=`1EHzWdiMplDMzrzliDpnXChbM_rf9AW-e`であり新たに制作していない。

## 制作可否
- 今回 **新規GIF生成=0件**。候補段別技の独立収録が正式に必要か、元動画区間が既存と異なるか確定していない。重複制作禁止ルールを優先。
- 未検証Patch、表示カード不明のため「ルーク全技カード完成」とは判定しない。

## 次回最優先作業
1. `sf6dna-v2`の実DB/Previewでルークのカード一覧と`internal_move_id`をread-only取得（ユーザーの操作は現時点では不要）。今回の77行マスターと突合する。
2. 最優先でwebId 204、314、315の既存HOLD映像を比較。独立カードと元映像証拠の条件を満たす場合のみHOLD解除。
3. 202、206、208、210の段別必要性を確認。必要と判断された欠損技を`luke_tokushu.mp4`から厳密に切り出し、480×270/20fps/loop/SHA/全フレームを検査。
4. 601/603/604/606/607について独立カードの有無と元動画を先に確認し、見つからなければ「映像未確認」のまま保持。
5. 次回完了条件: 77行のカード・技ID根拠、GIF候補1件ごとの採否、正式不足GIF件数を台帳で区別し、制作可能な確定分だけDriveへ保存してSHA再照合。HOLD解除条件: 実カード、入力強度、映像区間、既存映像との非重複の4点の根拠が揃うこと。

## 関連資料
- Drive 71本: https://drive.google.com/drive/folders/13s-urRloxz-XoWbuegvfY31uHl9XJtLh
- 旧36本制作台帳: https://drive.google.com/file/d/19iF4rVRhRad50UT3XahFqnptnwOEZLZs/view
- GIF受渡フォルダ: https://drive.google.com/drive/folders/1env3Gfw3EGQ9YxiiSGF0wltUHb8iJZNj
- 個別HOLD候補: https://drive.google.com/file/d/11rGPDK1M1w09nE7PmNFrwQlYzrAm2Xsd/view
- GitHub branch: https://github.com/palzsoftware/SF6DNA/tree/sf6dna-v2
