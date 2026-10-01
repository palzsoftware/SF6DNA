# SF6DNA Ver.1.0 平日Batch 追加結果 — 2026-10-01

Release: **NO-GO**。以下は前回結果への追加証拠。全Task完了・実機PASSとは扱わない。

## Fresh状態と変更範囲

- Remote RC: `fec8d09c9aae112e2678e6fff2faecb99c22d2f3`
- Branch: `sf6dna-v2-chatgpt-rc-20260916`
- Preview: https://sf-6-kv4z4j3e3-somas11620-9368.vercel.app/
- Deployment: `dpl_3sGDhkX1ajCDdXvxKL3vJqAUTajh`, READY, Branch/SHA一致。
- 作業開始時のlocal HEADは`f0ef399`で、既にRemote反映された46ファイルがstageに残っていた。別indexでworking treeを計算し、Remote tree `3a568fc04b113d5d115f502f3b0f4dde6521a3c8`と完全一致を確認。古いHEADへ戻していない。既存stageを再Pushしていない。
- 今回の実装差分は`source-presentation.ts`とその回帰テストのみ。**local修正済み・RC未反映**。軽微な表示文言だけでPreviewを増やさず、次の実装Batchへまとめる。
- Production/main/sf6dna-v2/Ver1.1、DB、依存定義、lockfile、認証・公開境界の変更なし。新しい認証開始・Push・Deployなし。

## 追加自動ブラウザQA

最新Previewを直接開き、サインインなしでページが表示された。最初のnavigateはtimeoutしたが、その後同じtabで表示を確認できた。証明書エラー・認証エラーとは判定していない。

| 対象 | 条件 | 結果 |
|---|---|---|
| 31 Character Detail | Desktop / Standard / Dark | 文書幅PASS 31/31 |
| JP全6技カテゴリ展開後 | 4デザイン×Light/Dark | 文書幅PASS 8/8 |
| 見出し・画像alt・内部語句の限定スキャン | 31ページ | h1各1、alt属性欠落0、指定内部英語キーワード0 |
| 320/375/390/430 | 最新SHA | NOT_RUN |
| contrast / tap target / clipping全面確認 | 最新SHA | NOT_VERIFIED |
| 実機・ゲーム・Auth/Save | 今回 | NOT_RUN |

計測値は全条件`innerWidth=1363 / clientWidth=1348 / html.scrollWidth=1348 / body.scrollWidth=1348`。詳細は`LIVE_DESKTOP_DOM_EVIDENCE.json`。Desktopでは文書横はみ出しを再現しなかった。

JPの画面外リンクは、`jp-character-detail.module.css`の`.rail`内にある。railの`clientWidth=1240 / scrollWidth=1416 / overflow-x:auto`。局所スクロールと文書全体の横スクロールを区別した。リンクのbounding box/computed styleも保存した。これは実機P1原因の証明ではない。

この環境では前回scratchのChromium実行ファイルとagent-browser CLIが存在せず、使用中のcloud browser APIにはviewport幅変更操作がない。最新SHAの375pxをPASSにせず、過去SHAのmobile結果も置き換えない。ブラウザログには拡張機能のmetadata送信エラーがあったため、包括的なpage error=0とは報告しない。

### コンテンツ不足と表示不具合

- Overview・情報源セクションは31ページで取得できた。
- 技一覧の表示件数: Ryu57、JP59、Luke1、Manon3。他27ページは技未掲載。これは表示件数でありDB総数ではない。公開ゲートを緩めて埋めていない。
- 関連プレイヤーは14ページに各3カード、他17ページは未掲載。重複を含む表示件数であり人物数ではない。
- Combo/Setplay/Video/Motion/Patchの全面カバレッジはPARTIAL。空欄をバグと断定せず、既存公開準備・検証待ちとして維持する。
- Public画面でLukeのdraftアイコンを確認したとは扱わない。Luke5は準備済み、GAME_VERIFIED=0、PUBLICATION_APPROVED=0。入力の要修正判定は実ゲーム証拠待ち。

## Public Copyの最小修正

JPの`/character/jp/movelist`リンクが「公式プロフィールを見る」になっていた。汎用`/character/`判定が技表判定より先に実行されるため。技表判定を先にし、URLの`/movelist`も判定することで「公式技表を見る」へ修正。CAPCOMドメイン確認、プロフィール・フレームのラベルは維持する。

- Targeted tests: **11 PASS**（技表/profile/frame/非公式URLの実例を含む）
- Typecheck: **PASS**
- 変更ファイルのESLint: **PASS**
- Diff check: **PASS**
- Full tests / 14 gates / build: 前回368 tests・14 gates・build PASSを再利用。**今回のlocal差分を含むfull runはNOT_RUN**。
- 共通CSS/layout/card/auth/data変更なし。関連再QAはSource CTAを使うCharacter Detail/Sourcesに限定する。
- 全Public Copy監査はPARTIAL。Juri/Dee Jayの公開本文で「ドライラッシュ」表記を観測したが、localコードに該当文字列がないためDB/取込データ側の修正候補として保留。DB_WRITE=NOを維持。

## 外部サイト・ツールFresh調査

12対象をA〜Gに対応させ、目的・利用者・IA・検索・入力表記・学習導線・更新・帰属・権利条件・不足・価値・難易度・分類をJSON/CSVへ整理した。Mobile UXは全対象NOT_VERIFIED。本文取得と実際の375px操作を混同しない。

- 既存学習導線の改善思想: ADOPT_FOR_V1_0（既存リンク/文言監査範囲のみ）
- 独自Input表示: PILOT_FOR_V1_0（Luke5のみ）
- Frame横断検索、候補検索、行選択、条件保存、章/タグ導線: BACKLOG_1_0_X
- Damage/Pressure/Oki計算、Character Progress、Training Planner、Hitbox視覚化: BACKLOG_LATER
- copied assets・利用条件不明の派生データ・AI Coach/API投入: DO_NOT_ADOPT

分類は提案であり新機能の追加決定ではない。本文/コード/CSS/HTML/画像/アイコン/動画/独自表は転載していない。SuperCombo直接取得はBLOCKED、CAPCOMのLuke公式movelist取得は403で、Modern公式対応のFresh確認はNOT_VERIFIED。ClassicからModernを生成していない。Source候補30件の既存方針は再利用し、今回の12対象を公開承認済み情報源へ追加していない。

## Production Readiness（読み取りのみ）

| 項目 | 結果 |
|---|---|
| Production alias | `sf-6-dna.vercel.app` |
| Current Production | `dpl_3T4VAzUWb57vwaN6HphfNGucDPVL`, READY, target=production |
| Production SHA / branch | `b9a2a8f638a3d4a98bfa042d56470664fe225ba7` / main |
| RCとの関係 | GitHub compare: ahead933 / behind0 |
| 全変更ファイル | NOT_VERIFIED: compare返却は300件で上限に達するため完全diffと扱わない |
| RC metadataBase | NEXT_PUBLIC_SITE_URL優先、次にVERCEL_URLを使う実装 |
| Preview robots | 実DOM: noindex,nofollow,noarchive |
| Preview canonical | JP実DOMにlink rel=canonicalなし。Productionの欠陥とは断定しない |
| Production canonical/origin/env割当 | NOT_VERIFIED（値は取得・保存しない） |
| robots/sitemap | RCコードでPreview拒否/empty、Production条件時published対象を収集 |
| Auth redirect | RCログインはpassword方式。nextは同origin相対pathへ制限。プロバイダのredirect設定はNOT_VERIFIED |
| Contact / Legal | 既存ページ/問い合わせfallbackをコード確認。送信・保存・法的承認は未実施 |
| Rollback | 現Production deployment IDを現状記録。ロールバック実行適格性・設定はNOT_VERIFIED |
| Release flag | Character Detail V2はPreview allowlist31のみ。Arjun追加なし |

Project APIのlive=falseだけでProduction不存在と推定せず、aliasから実Deploymentを確認した。

## 残るRelease blockerと週末最小Handoff

P0: **0 observed**。P1: **OPEN**。P2: Public Copy/カバレッジ/残QAがOPEN。正確なチケット総数は未集計。Release readinessの割合を証拠なしに上げない。

1. 元の失敗端末でCharacter Detail横スクロールを再現する。機種/OS/browser/表示倍率/viewport/キャラ/テーマ/手順を記録。`READ_ONLY_DOM_CAPTURE.js`は幅・computed style・scroll ancestorだけを読む。原文/アカウント情報/localStorage/URL queryは収集しない。撮影・取得は週末に行う。
2. 同じ375px条件でテーマ/日本語改行/フォント/タップ/長コマンドを確認。Desktop31ページの幅計測は再実施不要だが、実機全体PASSの代用にはしない。
3. Luke5をSF6本体で確認。DR/CDR/DI状態、入力、成立条件、Damage/Driveを個別記録。READY・GAME_VERIFIED・公開承認を分離する。
4. 承認済みアカウント/保存操作でLogin→Diagnosis→Save→History→Reload→Persistence→Logout。duplicate/save error/logout後stateを確認。今日は実行しない。
5. Internal guard/Source公開承認/Legalの未決項目は従来の承認待ち。承認なしに公開境界を変えない。

次の単一Work Action: **viewportを指定できる検証環境で、最新RCの375px・JP全技展開後のDOM計測を実行する**。現在の環境では操作手段不足でBLOCKED。その他の保存済み調査/表示修正は継続可能であり、実機QAを今日要求しない。
