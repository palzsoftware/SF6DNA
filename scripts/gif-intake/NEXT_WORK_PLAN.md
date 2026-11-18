# SF6DNA GIF受入 次回作業予定(Checkpoint 2026-11-17 09:5x JST)

## 到達点
- Branch work/luke-gif-connect / HEAD 52eddb3 / 全て未コミット / 保護対象11ファイル差分SHA-256 14c6047b216322a02330b06f9253c80e0e11d835c34677ae6c83c31cfe1182a0
- ローカルQA接続 27本(Luke15/JP5/Manon4/Juri3)。公開承認 0。案A(page.tsx)未適用
- 受渡確認: Driveフォルダ 1env3Gfw3EGQ9YxiiSGF0wltUHb8iJZNj。個別GIF(<10MB)は取得可、ZIP/10MB超は不可
- Manon新規3本: 取得・SHA一致・技術PASS・技ID無し→HOLD(packages/manon-new3-20261116/)
- Juri第3バッチ3本HOLD、第4バッチはManifestのみ(実体は個別保存が無くZIPのみ)、SA3 11MB 未取得
- Luke 2HITS GIF実体はDriveに無い。JP 2本(web316/317)は映像確認待ち

## 次回の最優先作業
**作業分類:** GIF受入
**内容:** Chatモードが保存する新規GIF(個別ファイル、各10MB未満)をDriveから差分受領し、SHA照合→intake-plan.mjs→接続可否判定
**対象:** Drive 1env3Gfw3EGQ9YxiiSGF0wltUHb8iJZNj ほか。既処理SHAは scripts/gif-intake/progress-2026111*.json と packages/*/plan.json を参照して再処理しない
**手順:** (1) HEAD/保護SHA確認 (2) Driveで modifiedTime>2026-11-16T09:09Z の新規を列挙 (3) 個別GIFをdownload (4) SHA・Pillowで全フレーム検査 (5) intake-plan.mjs (6) CONNECT_READYがあればbuild-local-qa-data.mjs --plan→Chromium(run-gif-pipeline.mjs)→関連テスト (7) 無ければ理由コード付きHOLDを記録
**完了条件:** 新規素材全てが CONNECT_READY/NEEDS_VISUAL_QA/MP4_PRIORITY/HOLD に分類され、保護SHA不変
**停止条件:** 保護SHA不一致・HEAD変更・page.tsx/保護ファイルの変更が必要・素材取得不能(その素材のみHOLD)
**USER_ACTION_REQUIRED:** YES — (a) Chatモード側で Juri第4バッチ3本/SA3/Luke2HITS を個別GIF(<10MB)としてDrive保存、(b) 映像で技名・入力が分かる方のManon新規3本・JPヴィーハト2本の確認、(c) 案A適用の可否

## 再開用メッセージ(コピー用)
「続けて。前回: SF6DNA GIF受入。HEAD 52eddb3、未コミット、保護11ファイルSHA 14c6047b…、ローカルQA27本(Luke15/JP5/Manon4/Juri3)。Manon新規3本は取得・SHA・技術PASSだが技ID無しでHOLD。次: scripts/gif-intake/NEXT_WORK_PLAN.md の『次回の最優先作業』(Driveの新規個別GIFを差分受入)。保護: 11ファイル・page.tsx(案A未承認)・公開Manifest・承認Registry・Feature Flags。検証: SHA/全フレーム/intake-plan/関連テスト、接続変更時はBuild・Chromium。禁止: Commit/Push/PR/Deploy/DB/Production、技IDの推測確定。」

---
## 2026-11-17 11:40 JST 更新(Checkpoint)
- ローカルQA接続 合計 **29本**: ルーク15 / JP5 / マノン4 / ジュリ5(今回 +空中投げ, +SA3軽量版)。公開承認0・page.tsx案A未適用・HEAD 52eddb3・保護11ファイルSHA 14c6047b… 不変。
- テスト: 全体 1051件 pass1038/fail0/skip13、Chromium 17/17 PASS、tsc OK。
- HOLD_MOVE_ID: ジュリ 地上投げ2本・風破陣(弱/中/強/OD候補)・第3〜6/8バッチ、P0のジュリ変種3本、ルーク2HITS(OD閃光ナックル2段目の行なし)・ダブルインパクト初撃(前後不明)、マノン新3本。
- 次の最優先: ジェイミー(Drive 26本・未処理)の取得→SHA/QA→intake-plan。ルークはmoveId確定(ユーザー確認)待ちが多く、確定済みのみ接続。
- 再開: `cd v2-web && node --test tests/*.test.mjs` → `node ../scripts/gif-intake/run-gif-pipeline.mjs --characters luke,jp,manon,juri --views qa,unified --restore-next-env`

---
## 2026-11-17 13:xx JST 更新(ジェイミー受入後)
- ローカルQA接続 **36本**: ルーク15 / JP5 / マノン6(+SA1,SA2) / ジュリ5 / ジェイミー5(新規: SA1, SA2, OD張弓腿, OD爆廻, OD無影蹴)。テスト 1053件 pass1040/fail0/skip13、Chromium 20/20 PASS、tsc OK、保護SHA 14c6047b… 不変、HEAD 52eddb3。
- 確定の決め手: 映像内の入力表示(+OD表示)が公開コマンドと一意に対応すること。弱/中/強は絵柄で区別できず HOLD。
- ジェイミー: 点辰/OD点辰はMP4優先(未接続)、SA3/CA は10MB超でDOWNLOAD_HOLD、弱/中/強の爆廻・無影蹴・張弓腿は強度未確認、魔身2本・打撃派生3本・足払いは技ID未確定。
- 待ち一覧: ジュリ風破刃(中/強)未アップロード、ジェイミーSA3/CA(10MB未満の個別GIF)、マノンSA3/CA。
- 案A整理: scripts/gif-intake/page-gif-connect-caseA-summary-20261117.md(未適用・別承認)。36本での隔離ビルド再確認は未実施。
- 次: 弱/中/強の強度根拠が取れる素材(入力表示付き)の再受入、または他キャラ(春麗・キャミィ・ディージェイ)のDrive素材確認。

---
## 2026-11-17 13:5x JST 更新(春麗・キャミィ・ディージェイ確認+検証)
- 接続は **36本のまま**(新規接続0)。春麗: GIF無し(HOLD_SOURCE)。キャミィ: R32候補1本はポーズメニュー混入・複数試行・10fpsでHOLD_QA。ディージェイ/キャミィR16: 分割ZIP(各約84MB)で取得不可(DOWNLOAD_HOLD)。その他のDrive GIFはリュウのみ(対象外)。
- 検証: eslint exit 0 / 全体テスト pass1040 fail0 / 隔離ビルド+案A: build成功・QA値0件 / 実ツリーbuildはNOT_RUN。
- 次: Chatモード側の10MB未満の個別GIF(ジェイミー・マノン軽量版、春麗/キャミィ/ディージェイ個別GIF)をDriveで受入。案A適用は別承認。

---
## 2026-11-17 14:xx JST 更新(SA3/CA軽量版4本を接続)
- ローカルQA接続 **40本**: ルーク15 / JP5 / マノン8(+SA3,CA) / ジュリ5 / ジェイミー7(+SA3,CA)。SA3とCAは別の技行・別カード(同コマンド236236P、CAは体力25%以下)。公開承認0・案A未適用・HEAD 52eddb3・保護SHA 14c6047b… 不変。
- テスト 1054件 pass1041/fail0/skip13、Chromium 20/20 PASS、tsc OK。案Aの隔離ビルド(QA値0件)は36本時点で確認済み・40本での再ビルドは未実施。
- 軽量版は減色(PSNR25〜28dB)。画質が問題なら元GIFを個別に再エンコード(別途)。
- 次: Chatモード側のジェイミー第2バッチ以降・春麗/キャミィ/ディージェイ個別GIFの受入。


## 2026-11-17 15:xx JST 更新(Drive個別GIF 114本の受入)
- 取得: Cammy 45 + DeeJay 40 は10MB未満のうち強度表記なし35本中33本+Jamie/Manon/春麗29本=62本を取得。全62本でManifestのSHA-256一致。
- 新規接続 +32: DeeJay 14 / Cammy 16 / Chun-Li 2(投げ)。累計 40→72(ルーク15 / JP5 / マノン8 / ジュリ5 / ジェイミー7 / キャミィ16 / ディージェイ14 / 春麗2)。
- 根拠: 左下の入力表示(拡大)で確定。通常技(弱/中/強)は入力表示が出ず強度を確認できないため HOLD(STRENGTH_NOT_VERIFIED)。
- 注意: DeeJay 041/042(ソバット中/強)はファイル名と中身が入替(表示の強/中で確定、パッケージ主張を不採用)。
- HOLD: 通常技など強度確認不可 / Cammy SA2×2(入力表示はP・データはK) / Cammy CA(体力満タン) / 未取得は evaluation-20261117-p1-cammy-deejay-jmc.json 参照。
- 検証: 全体テスト 1054 / pass 1041 / fail 0 / skip 13、Chromium 29/29 PASS、tsc・eslint 問題なし、保護SHA 14c6047b… 不変、HEAD 52eddb3、page.tsx 未変更(案A未適用)。
- 次回: 残り素材(Cammy R16/R15・DeeJay の10MB超分割分など)の個別GIF受入、案Aの72本隔離ビルド再検証(要承認)。


## 2026-11-17 16:xx JST 更新(P2: 通常技の複合根拠・SA2・残り素材)
- 取得: DeeJay 27 + Cammy 27 の個別GIF。うち SHA一致52本(+P1取得済みSA2×2)。新規接続 **+34**(DeeJay 21 / Cammy 13)。累計 72→**106**(ルーク15 / JP5 / マノン8 / ジュリ5 / ジェイミー7 / キャミィ29 / ディージェイ35 / 春麗2)。
- 強度は「複合根拠」(撮影順=コマンドリスト順・Manifest主張・GIF再生時間の順序・fixtureフレーム順・必殺技は入力コマンド一致)。入力表示そのものの強度確認ではない。基準と除外理由: data-correction-candidates-20261117.md
- HOLD(新規): DeeJayジャンプ攻撃5、Cammyしゃがみ弱P/中P、Cammyジャンプ6、Cammyナックル/スパイク/スパイラル弱中強の7本。Cammy CAは体力満タンのまま。
- Cammy SA2: fixture 214214K → 214214P の修正候補(fixture未変更)。CAPCOM公式ページは取得不可・二次情報+入力表示で補強。公式確認が必要(USER_ACTION_REQUIRED)。GIF2本はローカルQAに接続済み。
- DeeJayソバット: Manifest誤表記(041強/042中が名前と逆)を記録。接続は入力表示基準で維持。
- 案A隔離ビルド(106本): build成功・QA値212件ヒット0・nft参照0。案Aは未適用。
- 検証: 全体テスト 1054/pass1041/fail0/skip13、Chromium 29/29(初回はdee-jay 1枚の動作計測が揺れ、再実行で全PASS)、tsc/eslint OK、保護SHA 14c6047b… 不変、HEAD 52eddb3。
- 未着手: 新Driveフォルダ SF6DNA_GIF_NEW_BATCH_20261117(ガイル投げ+HOLD)の全件確認、10MB超/分割の未取得約26本。

## 2026-11-17 17:xx JST 更新(P3: 優先順位変更後・厳格複合根拠+Guile)
- ローカルQA接続 **132本**(+26): ルーク15 / JP5 / マノン14(+6) / ジュリ5 / ジェイミー11(+4) / キャミィ29 / ディージェイ35 / 春麗9(+7) / ガイル9(新規)。150本まで残り18。
- 根拠が弱い通常技は別管理: weak-evidence-normals-20261117.json(未接続の保留と、接続済みだが監視する項目)。
- ガイル: OD ソニックブーム/OD サマーソルト/SA1(上・横)/SA2/SA3/CA/前投げ/後ろ投げ=9本を入力表示・ゲージ・投げ位置で確定。通常技12・サマー弱中強・ソニックブレード/クロス等は供給側HOLDまたは判別不能。
- 優先キャラ「No.1〜12・27〜32」の番号↔キャラ対応は未確認(撮影済み素材全体を処理)。
- キャミィSA2: Claude Code担当向け連携メモは data-correction-candidates-20261117.md §4。
- 検証: 全体テスト 1054/pass1041/fail0/skip13、Chromium 32/32、tsc/eslint OK、保護SHA不変、HEAD 52eddb3、page.tsx未変更。案Aは106本隔離Build PASSを再利用(132本再Buildは未実施)。

## 2026-11-17 18:xx JST 更新(132本継続・弱根拠の分離・引き継ぎパッケージ)
- 接続は **132本のまま**(新規0)。Driveに06:00Z以降の新規GIFは無し。未取得の大容量(>10MB・分割ZIP)はコネクタで取得不可。150本は未達(残り18)。
- 「再生時間の長短だけで強度を確定しない」に対応: 複合根拠のみの48本に evidenceTier=COMPOSITE_WEAK_STRENGTH / publicCandidate=false を付与(公開候補から分離。ローカルQA表示は維持)。テスト追加済み。
- 未受領: DeeJay 97技↔TXT106行の対応表、dee-jay/deejayメディアキー対応候補、アルジュン77行GIF対応表(リポジトリ・Driveで見つからず)。受領後に再判定。
- 引き継ぎ: SF6DNA_GIF_QA_132_HANDOFF_20261117.tgz(データ・Manifest・差分・テスト結果)+ gif-bytes-132.tar.gz(GIF実体、約560MB)。
- 検証: テスト 1055/pass1042/fail0/skip13、Chromium 32/32、tsc/eslint OK、保護SHA 14c6047b… 不変、HEAD 52eddb3。

## 2026-11-17 STANDBY(Claude Code移管)
- 通常のGIF接続作業は終了。132本維持(弱根拠48本は publicCandidate=false)。新規素材が届くまで同じ調査を繰り返さない。
- 引き継ぎ: HANDOVER_TO_CLAUDE_CODE_20261117.md / RESTORE_TABLE_132_20261117.json(.csv)(Drive fileId+SHA256) / verify-restore-132.mjs(132/132一致を確認済み)。560MBアーカイブは任意の予備。
- 再開条件: ①対応表3点の受領 ②新規GIF/再撮影素材 ③ユーザーの再開指示。
