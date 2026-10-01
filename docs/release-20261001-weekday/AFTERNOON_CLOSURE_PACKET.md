# SF6DNA Ver.1.0 Afternoon Release Closure 2026-10-01

**NO-GOを維持。** Work側Auth例外回帰と承認パケットを完成。JP 375px原因は未確定、Luke Static Mobileも未検証。人間実機以外に、検証環境不足・公開判断・承認というWork側blockerが残る。「週末に人間確認だけを残せた」とは報告しない。

## RCとPreview

- BASE_RC: `63ccab726d52a8df43915fa7ae15f53907ef8fee`。
- Preflight Preview: https://sf-6-d1879v1cm-somas11620-9368.vercel.app/ / `dpl_Ew2ebtSJtaD4QaMmcXahHgR197Y4` / READY / Branch・SHA一致。
- FINAL_RC / 新Previewは統合後のFresh確認を最終報告に記載。今回はtest1ファイルと本packetのみをRCへ統合する。
- Production Fresh: `dpl_3T4VAzUWb57vwaN6HphfNGucDPVL` / `b9a2a8f638a3d4a98bfa042d56470664fe225ba7` / main / READY。変更なし。
- Local HEADは以前のf0ef3991のままで既存indexを保全。現在RCに相当するtree `2f1b9a1f2a537835363e1746740f7f40781e97e5` を基準に、今回2ファイルだけを別indexで積む。前回反映済み差分を重複commitしない。

## Verification

| 項目 | 判定 |
|---|---|
| Tests | 372 PASS / 0 FAIL（369からAuth実Component試験3件追加） |
| Release gates | 14 PASS / 0 FAIL |
| Typecheck / lint / build / diff check | PASS |
| Actual account login/save | NOT_RUN |
| Database write | 0 |

アプリ本体に変更なし。既存のReact-hook harnessで本物のDiagnosisRunnerを実行し、AuthSessionMissingErrorは通常Guest/no RPC、AuthApiErrorはfailed、getUser通信例外はfailedと再試行可能であることを検証。RPCエラー・応答喪失後Retry・Reload同一request_idの既存試験もPASS。実DBのidempotencyや実アカウントPASSとはしない。

Buildは前回と同じnext-env.d.ts生成型import・tsconfig JSX/include/整形を自動変更。差分を確認し、testのみのBatchに不要な設定変更は除外して既存RC設定を維持。復元後typecheckを再確認。

## JPとLuke Mobile

| 対象 | 320 | 375 | 390 | 430 | Desktop |
|---|---|---|---|---|---|
| JP全技展開 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | fec8既存document幅8条件PASSを再利用、最新実機NOT_RUN |
| Luke Icon5 | BLOCKED | BLOCKED | BLOCKED | BLOCKED | SSRのみPASS、visual NOT_VERIFIED |
| Ryu/Luke/Manon representative sweep | BLOCKED | BLOCKED | BLOCKED | BLOCKED | fec8既存document幅PASSを再利用 |
| 全31 Character Detail | NOT_RUN | NOT_RUN | NOT_RUN | NOT_RUN | fec8既存document幅31/31 PASSを再利用 |

JP ROOT_CAUSE: NOT_CONFIRMED。FIX: NONE。RETEST: BLOCKED_WITH_REASON。Luke STATIC_MOBILE: BLOCKED / DEVICE_QA_REQUIRED YES。NON_LUKE_LEAK: SSR代表4件なし。RAW_RECIPE: Luke5 SSR PASS再利用。

実行環境の既存Playwright moduleはあるが、Chromium/Chrome executable・agent-browser CLIがない。Cloud Browserにはviewport変更APIがない。新依存・ブラウザ導入は行わない。同一SHAで前回観測したPreview Vercel認証blockも再試行しない。

### 実測がない原因候補と除外範囲

- 確認候補: 展開後Move Cardの長コマンド/nowrap、grid/flex子のmin-width、Source CTA/rail、header/theme/bottom navigationの固定要素・transform。存在だけで原因としない。
- 除外済み範囲: fec8 Desktopではdocument幅超過なし。JP Sourceの右側リンクはoverflow-x:autoを持つrail内で、Desktop文書overflowの証拠ではない。Mobileの除外には使わない。
- 必要な証拠: 失敗端末・OS/browser・URL(pathのみ)・viewportとvisualViewport・Theme/Mode・全技展開状態・HTML/bodyのclientWidth/scrollWidth・水平移動量。
- 次に測るelement: JP展開Move Cardからrootまでのparent chain、Source railからrootまでのparent chain。候補ごとrect left/right/width・scroll/clientWidth・CSS width/min/max/whiteSpace/flex/grid/transform/overflowを取得。
- 既存READ_ONLY_DOM_CAPTURE.jsはrect/computed CSS/scroll ancestorを収集するが、本文text sampleと全parent chain、body.clientWidth、実scrollTo後移動量は収集していない。補助として使い、全必要証拠が揃ったとはしない。
- 通常Public LukeはCombo draftで5件を表示できない。先に既存の正規内部確認経路が使える状態へ進める必要がある。QAのためにpublish/flag/guardを変更しない。

## Auth静的判定

GUEST_STATIC PASS / AUTH_STATIC PASS / IDEMPOTENCY CLIENT_MOCK_PASS / REAL_ACCOUNT_TEST NOT_RUN。
Guest Result→Daily15の既存導線・route testは再利用。Guest account RPCなし。予期しないerrorをGuestへ丸めない。Historyの端末local履歴とアカウントRPC保存を区別。Logout後も端末local履歴が残る既存仕様を、アカウント漏洩やDB消失と混同しない。実Logout/History persistenceは未確認。

## Combo公開分類と小さな検証Queue

TOTAL1478 / READY_FOR_PUBLICATION0 / GAME_VERIFY_REQUIRED1213 / SOURCE_REVIEW_REQUIRED主分類0 / DATA_INCOMPLETE主分類0 / DATA_CONFLICT主分類0 / DUPLICATE confirmed0 / HOLD265。
主分類は前回監査を再利用。secondary SOURCE_NOT_READY224・notes conflict302・duplicate candidate202行/28組は別軸であり、0件と消えていない。選抜930 cohortの548READY/382HOLDと全1478 inventoryを混ぜない。

公開候補の第一検証単位は既存Luke5のみ。成立・適切な始動/位置・現行patch・リソース値・Sourceを確認するまでは公開候補であり、公開承認済みではない。Perfect入力・DI状態・P/K/PPの曖昧入力を勝手に確定しない。初心者への適切さも成立だけで承認しない。

### Luke 1 luke-dr-overhead

- Combo ID: `11337af8-4a19-4688-ac22-826f05ebd11e` / Priority P1 / GAME_VERIFY_REQUIRED。
- Recipe（原文）: `DR > 6MP > 2HP > 214MP(Perfect) > 214LP(Perfect) > 236K > P`
- 必要理由: 現行ゲーム内再現証拠なし。draft/reviewedを維持。
- 確認: Recipe成立、始動と位置、Perfect/timing/DI状態、実Damage・Drive・SA。
- 既存値（未実測、期待値として保証しない）: Damage None, Drive None, SA None, Position mid; 条件 Drive Rush, Perfect Knuckle execution。nullは未確認。
- Source（既存監査、今回本文/再生の再検証なし）:
  - `9e0141ec-765e-40d7-83f1-566df7c1ed52` / patch_context / metadata_ready=True: https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/luke
  - `f6efb8b1-6900-4cef-bf66-9aae90591cde` / supporting / metadata_ready=False: https://ultimateframedata.com/sf6/luke
  - `b71f861c-cbbb-4da5-b06f-9ce3073cf743` / reference / metadata_ready=True: https://pachi-mea.com/sf6-wiki/10313/

リンクとmetadata_readyは攻略成立・採用・利用許諾の証拠ではない。公開判定前にRecipe根拠の対応を確認する。

### Luke 2 luke-y4-di-pc-hp-mflash-nochaser

- Combo ID: `537e6839-69fd-443d-a87e-be12601311e6` / Priority P1 / GAME_VERIFY_REQUIRED。
- Recipe（原文）: `DI(PC) > 2HP > 214MP(Perfect) > 236K > P`
- 必要理由: 現行ゲーム内再現証拠なし。draft/reviewedを維持。
- 確認: Recipe成立、始動と位置、Perfect/timing/DI状態、実Damage・Drive・SA。
- 既存値（未実測、期待値として保証しない）: Damage 2809, Drive 1, SA 0, Position midscreen; 条件 中フラPerfect。。nullは未確認。
- Source（既存監査、今回本文/再生の再検証なし）:
  - `9e0141ec-765e-40d7-83f1-566df7c1ed52` / patch_context / metadata_ready=True: https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/luke
  - `a6cd285f-5309-4f18-9b50-aa95621c8192` / supporting / metadata_ready=True: https://takukakugamer.com/sf6-luke-combo/

リンクとmetadata_readyは攻略成立・採用・利用許諾の証拠ではない。公開判定前にRecipe根拠の対応を確認する。

### Luke 3 luke-di-wall

- Combo ID: `54185bc2-8bde-4c82-be10-601f69454434` / Priority P1 / GAME_VERIFY_REQUIRED。
- Recipe（原文）: `5HP > 214LP(Perfect) > 236MP > 623HP`
- 必要理由: 現行ゲーム内再現証拠なし。draft/reviewedを維持。
- 確認: Recipe成立、始動と位置、Perfect/timing/DI状態、実Damage・Drive・SA。
- 既存値（未実測、期待値として保証しない）: Damage None, Drive None, SA None, Position corner; 条件 Wall splat。nullは未確認。
- Source（既存監査、今回本文/再生の再検証なし）:
  - `f6efb8b1-6900-4cef-bf66-9aae90591cde` / supporting / metadata_ready=False: https://ultimateframedata.com/sf6/luke
  - `b71f861c-cbbb-4da5-b06f-9ce3073cf743` / reference / metadata_ready=True: https://pachi-mea.com/sf6-wiki/10313/
  - `9e0141ec-765e-40d7-83f1-566df7c1ed52` / patch_context / metadata_ready=True: https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/luke

リンクとmetadata_readyは攻略成立・採用・利用許諾の証拠ではない。公開判定前にRecipe根拠の対応を確認する。

### Luke 4 luke-crmk-dr-corner

- Combo ID: `da8dac9f-e65e-4c16-a8f4-637318d73a66` / Priority P1 / GAME_VERIFY_REQUIRED。
- Recipe（原文）: `2MK or 2MP > CDR > 2MP > 2HP > 214LP(Perfect) > 236MP > 623HP`
- 必要理由: 現行ゲーム内再現証拠なし。draft/reviewedを維持。
- 確認: Recipe成立、始動と位置、Perfect/timing/DI状態、実Damage・Drive・SA。
- 既存値（未実測、期待値として保証しない）: Damage None, Drive None, SA None, Position corner; 条件 Corner, Drive Rush。nullは未確認。
- Source（既存監査、今回本文/再生の再検証なし）:
  - `f6efb8b1-6900-4cef-bf66-9aae90591cde` / supporting / metadata_ready=False: https://ultimateframedata.com/sf6/luke
  - `9e0141ec-765e-40d7-83f1-566df7c1ed52` / patch_context / metadata_ready=True: https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/luke
  - `b71f861c-cbbb-4da5-b06f-9ce3073cf743` / reference / metadata_ready=True: https://pachi-mea.com/sf6-wiki/10313/

リンクとmetadata_readyは攻略成立・採用・利用許諾の証拠ではない。公開判定前にRecipe根拠の対応を確認する。

### Luke 5 luke-y4-corner-light-odflash-mflash-sa3

- Combo ID: `f321891f-45e0-4e35-8e4c-388818b80675` / Priority P1 / GAME_VERIFY_REQUIRED。
- Recipe（原文）: `2LK > 2LP > 214PP > 214MP > SA3`
- 必要理由: 現行ゲーム内再現証拠なし。draft/reviewedを維持。
- 確認: Recipe成立、始動と位置、Perfect/timing/DI状態、実Damage・Drive・SA。
- 既存値（未実測、期待値として保証しない）: Damage 3540, Drive 2, SA 3, Position corner; 条件 SA3 available.。nullは未確認。
- Source（既存監査、今回本文/再生の再検証なし）:
  - `a6cd285f-5309-4f18-9b50-aa95621c8192` / supporting / metadata_ready=False: https://takukakugamer.com/sf6-luke-combo/
  - `9e0141ec-765e-40d7-83f1-566df7c1ed52` / patch_context / metadata_ready=True: https://www.streetfighter.com/6/buckler/ja-jp/battle_change/20260803/luke

リンクとmetadata_readyは攻略成立・採用・利用許諾の証拠ではない。公開判定前にRecipe根拠の対応を確認する。

## Source30承認パケット

APPLICATION_PACKET READY / TOTAL30 / LINK_ONLY29 / ATTRIBUTION1 / DB_APPLIED0。
直前Fresh照合の30 IDs・title/publisher/url・関連1110 identity一致を再利用し、既存Manifestと分類件数のみ再照合。外部Source30の再監査・DB再照会・採用relation変更なし。

| 判断項目 | 内容 |
|---|---|
| What will change | 既存sourcesのtitle・publisherのみ。各exact IDは下表/既存proposalsに固定 |
| Which rows/entities | Source30 rows。既存entity_sources1110接続を維持し、新relationを作らない |
| Public impact | 既に公開される対象カードの名称・帰属表示が更新される。candidate entity採用やStrategy公開は増やさない |
| Risk | 旧値からの他Work変更、動画タイトル/投稿者誤対応、キャラ横断group動画を個別攻略と誤認すること |
| Why limited | old title/publisher/urlの一致を適用条件にし、競合行をHOLDへ戻す。URL・relation・信頼度・statusを変更しない |
| Rollback concept | 更新直前のexact-ID before値を保持。戻す際も適用後値が一致する行のみ対象。他Workの新変更は上書きしない。実行は別承認 |
| Remains unchanged | source_type/reliability_level/URL/entity relations/verified/published/flags/Strategy boundary |
| Approval scope | Source metadata30 rowsのDB書込・公開表示変更を明示承認する範囲が必要。このBatchは承認依頼可能な準備まで |

Exact old/proposed title/publisher/URL・entity/relationは既存SOURCE_APPLICATION_PROPOSALS.json / SOURCE_APPLICATION_PLAN.json、Fresh照合はCLOSURE_EVIDENCE.json。29 Community動画はLINK_ONLY、公式ガイド1件も素材転載・ゲーム事実の検証を許可しない。

| Source ID | proposed title | policy |
|---|---|---|
| `7cfc2619-8f21-4bf1-9dca-bf1f2dbd7403` | マリーザ・ガイル・リリー・A.K.I.のSeason 4調整解説 | LINK_ONLY |
| `e4f109c5-0438-44bb-9ef9-02d313f33c56` | 春麗・キャミィ・マノン・C.ヴァイパーのSeason 4調整解説 | LINK_ONLY |
| `9b03a1a6-c8e9-46ae-aebe-6007f85227ea` | アレックス・サガット・ジュリ・ザンギエフのSeason 4調整解説 | LINK_ONLY |
| `b7dcb40f-2745-4bf9-864a-5d95ae8ffa79` | JP・エレナ・イングリッド・キンバリーのSeason 4調整解説 | LINK_ONLY |
| `aaedce01-af16-47d3-ab3f-08c1bee4d123` | 不知火舞・エド・ベガ・テリーのSeason 4調整解説 | LINK_ONLY |
| `3cbc0e50-20f8-4664-86cd-8924b90f94e9` | ディージェイ・ブランカ・エドモンド本田・ダルシム・ラシード・ジェイミーのSeason 4調整解説 | LINK_ONLY |
| `0cb873a2-b26e-49fd-bbef-a81a67fba6e1` | JP・エレナ・イングリッド・キンバリーのSeason 4調整解説 | LINK_ONLY |
| `392671c4-08ef-4de9-bc2a-fc01088c0413` | マリーザ・ガイル・リリー・A.K.I.のSeason 4調整解説 | LINK_ONLY |
| `1a9658eb-87e0-44b1-a7e1-553c9a3626ae` | 春麗・キャミィ・マノン・C.ヴァイパーのSeason 4調整解説 | LINK_ONLY |
| `3afc9ac8-cd02-47b0-bddb-be720dfa6a4e` | JP・エレナ・イングリッド・キンバリーのSeason 4調整解説 | LINK_ONLY |
| `0296815f-8599-47e5-ba8f-951b4757b7b4` | リュウ・ケン・豪鬼・ルークのSeason 4調整解説 | LINK_ONLY |
| `9fd1440e-09f2-4fb2-86ac-a2889d20662a` | アレックス・サガット・ジュリ・ザンギエフのSeason 4調整解説 | LINK_ONLY |
| `dfba6362-9cce-4ad5-8651-a70fd106e4c5` | アレックス・サガット・ジュリ・ザンギエフのSeason 4調整解説 | LINK_ONLY |
| `70a8c217-52c3-4cc5-9488-7420376598fc` | ディージェイ・ブランカ・エドモンド本田・ダルシム・ラシード・ジェイミーのSeason 4調整解説 | LINK_ONLY |
| `88125317-c149-4718-899c-95ac66f21ea0` | アレックス・サガット・ジュリ・ザンギエフのSeason 4調整解説 | LINK_ONLY |
| `4066ac57-b047-4b85-9b59-b455c8190340` | ディージェイ・ブランカ・エドモンド本田・ダルシム・ラシード・ジェイミーのSeason 4調整解説 | LINK_ONLY |
| `5c757419-8e7d-4e99-a235-8c0496644231` | ディージェイ・ブランカ・エドモンド本田・ダルシム・ラシード・ジェイミーのSeason 4調整解説 | LINK_ONLY |
| `987e1547-90ac-4608-8e6c-20760ff83893` | 不知火舞・エド・ベガ・テリーのSeason 4調整解説 | LINK_ONLY |
| `f60ba94d-d8f8-4416-961d-c9ac854083dc` | ディージェイ・ブランカ・エドモンド本田・ダルシム・ラシード・ジェイミーのSeason 4調整解説 | LINK_ONLY |
| `3d53d4bb-e7cb-4f7a-86b8-e1f6fc388b49` | 不知火舞・エド・ベガ・テリーのSeason 4調整解説 | LINK_ONLY |
| `0f499bfa-9560-4a4d-ba98-563c66fb9206` | 春麗・キャミィ・マノン・C.ヴァイパーのSeason 4調整解説 | LINK_ONLY |
| `e4848ec0-e4b4-4fe1-b698-2ba3cbf64f41` | マリーザ・ガイル・リリー・A.K.I.のSeason 4調整解説 | LINK_ONLY |
| `aca946d5-a62a-471a-b42a-3f97b43294ac` | ヤスミン公式キャラクターガイド | PUBLIC_WITH_ATTRIBUTION |
| `c4282ff4-66dc-40d0-8f50-c725e01f1383` | ディージェイ・ブランカ・エドモンド本田・ダルシム・ラシード・ジェイミーのSeason 4調整解説 | LINK_ONLY |
| `8cc7dbdc-7503-4ebe-8f0a-7b3897a8df78` | リュウ・ケン・豪鬼・ルークのSeason 4調整解説 | LINK_ONLY |
| `e96cf3d0-6f03-4838-b16a-1fb3877b74e6` | マリーザ・ガイル・リリー・A.K.I.のSeason 4調整解説 | LINK_ONLY |
| `e885d470-16cd-4b7c-950f-d989ba8a6097` | リュウ・ケン・豪鬼・ルークのSeason 4調整解説 | LINK_ONLY |
| `b0c2bf68-6c9e-44d1-a350-463a87b9b7c6` | 不知火舞・エド・ベガ・テリーのSeason 4調整解説 | LINK_ONLY |
| `32adfa13-079f-408b-82b2-593b7f88343d` | 春麗・キャミィ・マノン・C.ヴァイパーのSeason 4調整解説 | LINK_ONLY |
| `cff49442-7bba-4807-883d-f51dda19b221` | リュウ・ケン・豪鬼・ルークのSeason 4調整解説 | LINK_ONLY |

## Internal Guard承認パケット

ROUTES_FOUND18 page patterns（admin17/internal1）。15 requireAdmin・2 inline role・1 unguarded。Fresh source inventory・live hash確認。Preview匿名実アクセスは保護によりBLOCKED、現在Live anonymous PASS/FAILとはしない。

- 対象: `/internal/character-preview/[slug]` のみ。
- パッチ: `../release-20260930-publication/INTERNAL_GUARD_UNAPPLIED.patch`。
- live SHA256: `809a8dbcc6c786f5353390a6f4f4d85a59610681be306d275b90b1c88dd5e6f9`。準備時と一致。
- 変更: 既存requireAdmin importと、params/data取得より前のawait requireAdmin追加。
- Public impact: 匿名・非adminが内部確認ページを表示できなくなる。adminの既存確認経路は維持。
- Risk: 必要な確認者がprofiles.role=adminでなければ到達できない。既存requireAdminのredirect先を継承。
- Remains unchanged: Public Character Detail31・Arjun通常一覧除外・Auth方式・RLS/RPC権限・DB・production。
- Rollback concept: 許可されたRC code revertで当該2行追加を戻す。これも公開境界の変更なので承認後判断。
- Approval: REQUIRED。PATCH_READY YES / INTERNAL_GUARD_PACKET READY / APPLIED NO。
- 承認後: live hash再照合→既存patch適用→影響route限定tests→Preview匿名/非admin/admin/404。6件mock PASSは直前結果を再利用、実admin QAの代用にはしない。

## Public Copy / Ryu media

P2 Copyは今回の限定source scanで新しい明確な安全修正を確定できず、変更なし。全Public Copy監査PASSとはしない。DB由来ドライラッシュ表記の修正は保留。
RYU ZIP_RECEIVED NO / EXPECTED57 / PIPELINE_READY YES（既存manifest/validator/QA contractを再利用）/ BLOCKER Input ZIP missing。新cut/mapping0。ファイル存在・Repo manifest・public rendering・DB bindingを分離。

## Weekend QA packet

| Item | State | Minimal action |
|---|---|---|
| JP375 全技 | MUST_TEST / Work BLOCKED | 失敗routeと端末情報→通常/特殊/必殺/SA/CA含む全section→横移動とDOM証拠1ケース |
| Luke375 Icons | BLOCKED | 未公開5件を正規確認経路で表示できた後、expanded/collapsed・long recipe・unknown fallback・tap・a11y |
| Ryu/JP/Luke/Manon mobile | MUST_TEST | 同じsessionでTheme/LightDark・日本語font/改行・Source CTA・mediaを差分確認 |
| Auth flow | MUST_TEST / WORK_STATIC_PASS | Login→Diagnosis→Save→History→Reload→Logout。duplicate/error/persistence/logout後state。実SaveはDB writeを伴うため別許可範囲で |
| Luke Game | MUST_TEST | 上の5件だけを最初の単位として成立/条件/実測値を記録 |
| Share/tap/Desktop | MUST_TEST | 実Deviceのみ。Desktop幅の旧自動PASSは実機判定の代用にしない |
| Unchanged parser/SSR/Auth mock | WORK_STATIC_PASS | 再操作要求しない |
| Same-SHA prior Device PASS | REUSE_PRIOR_PASS | 今回対象の同一SHA PASS証拠はない。過去SHAを最新実機PASSにしない |
| New Ryu recording | BLOCKED / NOT_APPLICABLE today | ZIPなしで録画・dummy等を要求しない |

## Release blocker ledger

| Group | Priority | Status |
|---|---|---|
| P1-A JP/Character overflow | P1_REQUIRED | OPEN / runtime evidence required / Work browser unavailable |
| P1-B Device QA | P1_REQUIRED | OPEN / USER_DEVICE_REQUIRED |
| P1-C Auth/Save | P1_REQUIRED | Work static PASS / Real account OPEN |
| P1-D Combo publication | P1_REQUIRED | Classification READY / game・Source対応・公開判断OPEN |
| P1-E Source application | P1_REQUIRED | Packet READY / USER_APPROVAL_REQUIRED / DB write prohibited |
| P1-F Internal guard | P1_REQUIRED | Packet READY / USER_APPROVAL_REQUIRED / APPLIED NO |
| Ryu ZIP / remaining Copy | P2 | 2 groups OPEN |

P0_OBSERVED0 / P1_REQUIRED_OPEN6 groups / P1_OPTIONAL0 newly identified / P2_OPEN2 groups / USER_DEVICE_REQUIRED YES / USER_APPROVAL_REQUIRED YES / BLOCKED_EXTERNAL browser・ZIP / RELEASE_READY_NOW NO。
Production final-readiness（origin/env/auth redirects/Legal/rollback evidence）は別途残るread-only未確認事項であり、新P1へ勝手に昇格しない。

NEXT_SINGLE_ACTION: 認証を開始せず375px指定ができる環境で最新RCのJP全技展開DOM計測。現在は環境不足でBLOCKED。週末実機は失敗条件1ケースを先に取得する。平日に実機QAを要求しない。

Production/main/sf6dna-v2/DB/RLS/RPC/Ver1.1変更なし。AI Coach HOLD。STATIC_PASS != DEVICE_PASS / PREVIEW_READY != RELEASE_READY / GAME_READY != GAME_VERIFIED / DRAFT != PUBLISHED。
