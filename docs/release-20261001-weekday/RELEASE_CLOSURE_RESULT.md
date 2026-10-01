# Ver.1.0 Release Closure — 2026-10-01

Release: **NO-GO**。この記録はRC統合直前の検証結果。統合後のcommit SHA・Preview READYは別途Fresh確認し、最終報告に記載する。前回CONTINUATION_RESULT.mdの「local差分full run NOT_RUN」は本Batchの369 tests等で更新された。

## Current RC / boundaries

- BASE_RC: `fec8d09c9aae112e2678e6fff2faecb99c22d2f3` / tree `3a568fc04b113d5d115f502f3b0f4dde6521a3c8`。
- Preflight Preview: https://sf-6-kv4z4j3e3-somas11620-9368.vercel.app / `dpl_3sGDhkX1ajCDdXvxKL3vJqAUTajh` / READY / branch・SHA一致。
- Production: `dpl_3T4VAzUWb57vwaN6HphfNGucDPVL` / `b9a2a8f638a3d4a98bfa042d56470664fe225ba7` / READY / main。
- main Fresh SHA: `b9a2a8f638a3d4a98bfa042d56470664fe225ba7`。
- sf6dna-v2 Fresh SHA: `bf49caac7fac1f92206f13337d36666b5eae30c1`。
- f0ef3991以降の46ファイル・3 commitsは既にRemote反映済み。重複commitしない。既存indexを維持し、現在Remote treeに新差分のみ積む。
- Production/DB/main/sf6dna-v2/Ver1.1/公開境界変更なし。新依存・Migration・RLS/RPC権限変更なし。
- Flags: aiCoach=false / training=false / publicStrategyContent=false。Daily15とTraining Libraryを分離。

## Verification

| Check | Result | Evidence scope |
|---|---|---|
| Typecheck | PASS | 自動生成設定の差分を確認し既存設定へ戻した後も再PASS |
| Lint | PASS | 全v2-web |
| Tests | 369 PASS / 0 FAIL | 今回CTA修正・Luke実Recipe SSR回帰を含む |
| Release gates | 14 PASS | 実行結果 |
| Build | PASS | Next build完了 |
| Diff check | PASS | 今回変更 |
| Guard preparation + Source planner | 11 PASS | mock/offline; 本番認証PASSではない |

Buildがnext-env.d.tsの生成型import、tsconfig.jsonのJSX/include/整形を自動変更した。今回のCTA・test変更に必要な差分ではなく、既存RCもPreview build成功済みのため、内容を確認して既存設定を維持。設定変更はcommit対象外。

## Luke pilot

- COMBOS_CHECKED: Luke5 + non-Luke4（Ryu/JP/Ken/Manon）。Fresh read-only DBでnotation・status・verification_status照合。
- ICON_RENDER: PASS（React SSRのみ）。RAW_RECIPE_PRESERVED: PASS。NON_LUKE_LEAK: NONE（SSR4代表例）。
- 未知/曖昧tokenは原文維持。DR/CDR・明示DI状態を区別。Classic→Modern推測なし。
- Luke5はすべてdraft/reviewed。READY != GAME_VERIFIED != PUBLICATION_APPROVED。
- MOBILE: BLOCKED。DESKTOP visual/a11y: BLOCKED。通常Public Luke画面では未公開ComboのためPilot表示を検証できない。全展開・公開化・flag変更は行わない。
- STATUS: **BLOCKED_WITH_REASON**。SSR PASSのみでPilot全体PASSとしない。

## Publication recovery

Fresh件数・latest_updateは前回分類と一致。分類ルール・コードに変更がないため、9/30の詳細行分類を再利用。全関連テーブルの内容・ゲーム事実をFresh再検証したものではない。

| Entity | Fresh total / published | Reused classification |
|---|---|---|
| Combos | 1478 / 0 | READY_FOR_PUBLICATION 0; GAME_VERIFY_REQUIRED 1213; HOLD 265 |
| Moves | 2065 / 0 | PUBLISHABLE 0; FRAME_ONLY_READY 701; SOURCE_REQUIRED 1250; HOLD 114 |
| Players | 91 / 41 | draft50: READY_TO_PUBLISH 0; SOURCE_REQUIRED 50; PROFILE_INCOMPLETE 0; HOLD 0 |
| Videos | 90 / 3 | draft87: READY_TO_PUBLISH 0; METADATA_INCOMPLETE 87; RELATION_PROBLEM 0; HOLD 0 |
| Sources | 661 | 対象30件は下記 |
| Move motion media DB binding | 0 | Repo素材の存在とDB bindingを分離 |

Combo主分類SOURCE_REVIEW_REQUIRED/DATA_INCOMPLETE/DATA_CONFLICT/confirmed DUPLICATEは前回0。別の二次理由SOURCE_NOT_READY 224・notes conflict 302・重複候補202行/28組は存在し、主分類へ足して重複集計しない。READY0は全数ゲーム実証が未完了のためであり、任意のDamage等欠損だけで0にしたものではない。

Move FRAME_ONLY_READYは前回FRAME_VERIFIED_BUT_MOVE_DRAFTの対応表示。COMMAND_REQUIRED/DATA_ERRORは0、主分類VERIFICATION_REQUIREDは0（未verified等はHOLD内）。verified frameがあってもMove publicationを自動承認しない。

Playersの許諾画像追加なし。既存fallback維持。Videosのavailable/deleted/restricted・再生可否はNOT_VERIFIED。URL構造検証を再生PASSにしない。

ゲーム検証QueueはCLOSURE_EVIDENCE.jsonのLuke5だけを最初に渡す。残1213件は既存監査に保管し、一括で人手へ渡さない。KimberlyのDB verified候補も現在ゲーム内再現証拠がないため自動公開しない。

## Sources

- TOTAL_TARGETS 30 / LINK_ONLY 29 / ATTRIBUTION_PUBLIC 1。
- METADATA_APPLY_READY 30 / preparation BLOCKED 0 / execution BLOCKED 30 / NEEDS_REVIEW 0 / DB_APPLIED NO。
- Fresh SELECT: exact IDs/title/publisher/URL/schemaと1,110関連identityを既存planに照合し一致。
- CLOSURE_EVIDENCE.jsonに30行のcurrent/proposed state・分類・帰属・blockerを記録。entity/relation全件は照合済みの既存SOURCE_APPLICATION_PLAN.jsonを参照。
- 対象はtitle/publisherメタデータのみ。URL/関連/信頼度/source_type/publication変更なし。
- DB_WRITE_PROHIBITED・PUBLIC_APPLICATION_APPROVAL_REQUIREDが実行blocker。LINK_ONLYは転載・攻略採用・ゲーム事実検証の承認ではない。

## Public copy / change impact

- 今回修正: 公式技表URL `/character/jp/movelist`を「公式プロフィールを見る」と誤表示していたCTAを「公式技表を見る」へ修正。
- command/movelist判定をprofile判定より優先。公式ドメイン条件維持。ゲーム事実・URL・データは変更なし。
- 影響: Source CTA利用Character Detail/Sources。共通CSS/layout/card/auth/navigation変更なし。
- PUBLIC_COPY_BATCH: **PASS（このCTA修正範囲）**。全Public Copyの自然さ・全ページ最終監査はPARTIAL。
- Juri/Dee JayのDB由来「ドライラッシュ」表記は未反映。DB write禁止のため保留。

## Responsive / QA reuse

| Condition | Status |
|---|---|
| 320 / 375 / 390 / 430 latest RC | BLOCKED: viewport変更API・local Chromium/CLIが利用できない |
| Desktop31 Character Detail・Standard Dark | prior fec8証拠のdocument幅PASSを再利用 |
| JP全6技展開・4appearance×Light/Dark | prior fec8証拠8条件のdocument幅PASSを再利用 |
| Source CTA変更後DOM | 最新Previewで再確認予定。旧DOM結果を変更後PASSとしない |
| Horizontal movement / comprehensive page errors | latest変更後NOT_VERIFIED |
| User Device / Game | NOT_RUN |

JP Sourceのoffscreen linkは親railのoverflow-x:auto内で、文書overflowの原因証拠ではない。実機横スクロールP1原因は未確定・修正なし。overflow-x:hidden等の推測CSS変更なし。

31ページcoverageの差: Ryu57/JP59/Luke1/Manon3、他27ページのPublic Move表示0。draft/公開gateのPUBLICATION_GAPとして整理し、UI_BUGと混同しない。Player表示0の17キャラも既存draft relationを採用前提にしない。

## Auth / internal guard

- AUTH_STATIC_READINESS PASS。GuestのAuthSessionMissingError/no userはRPCを呼ばない。authenticated saveはrequest_idを呼出し前に保持しRetry/Reloadで同一payload identityを再利用。例外copyあり。idempotency契約変更なし。
- Login→Diagnosis→Save→History→Reload→Logoutの実アカウントDevice QA: **NOT_RUN**。DB write禁止により実Save実行なし。
- Fresh route code: `/internal/character-preview/[slug]`はrequireAdmin未適用。admin系既存guardを維持。
- 既存INTERNAL_GUARD_UNAPPLIED.patchは6 mock scenarios PASS、live route unchanged。
- INTERNAL_GUARD: READY_FOR_APPROVAL / REQUIRED YES / USER_APPROVAL_REQUIRED YES / APPLIED NO。

## Media / production readiness

- RYU_ZIP_RECEIVED NO / EXPECTED57 / MANIFEST_READY YES / VALIDATOR_READY YES（既存成果再利用）/ new CUT0 / new MAPPED0。
- 既存4manifests35clips:34PreviewApproved/1HOLD。MP4・poster70ファイルとDB binding0は別状態。新録画・dummy・JP流用なし。
- metadataBase/robots/sitemapはNEXT_PUBLIC_SITE_URL優先・VERCEL_URL fallback。Preview noindex/disallowは静的契約で確認。
- Production origin/canonical/env assignment/Auth redirect実設定/rollback実行可能性/正式Legal approval: NOT_VERIFIED。秘密値を取得・記載しない。
- Production deployment/SHAはFresh一致、変更なし。RC vs Production全diffはAPI300file capにより全量未確認。

## Weekend handoff / blocker ledger

| Item | Class / weekend state | Minimum verification |
|---|---|---|
| Real-device horizontal overflow | P1_REQUIRED / MUST_RETEST | 375pxで失敗route・端末/browser・Theme・expanded sectionを記録。READ_ONLY_DOM_CAPTURE.jsでoffending element/CSS/ancestorを取得 |
| Auth Save | P1_REQUIRED / USER_DEVICE_REQUIRED | Login→Diagnosis→Save→History→Reload→Logoutを1本化。duplicate/error/persistence/logout後state |
| Device display | P1_REQUIRED / USER_DEVICE_REQUIRED | 同じ375px sessionでRyu/JP/Luke・Theme4×Light/Dark・日本語font/改行/tap。Desktop最終確認 |
| Luke Pilot | P1_REQUIRED / BLOCKED | 未公開5件を正規の確認手段で表示した後、アイコン/fallback/a11y/wrap。公開化してQAしない |
| Combo publication | P1_REQUIRED / GAME_VERIFY_REQUIRED | Luke5成立・条件・実測値・現行Patch証拠。数百件を一括要求しない |
| Source metadata / internal guard | P1_REQUIRED / USER_APPROVAL_REQUIRED | 既存exact-ID manifest・既存requireAdminパッチの承認判断。無断適用なし |
| Production final readiness | BLOCKED_EXTERNAL | env/origin/auth redirect/Legal/rollbackのread-only証拠と別Approval Packet |
| Ryu ZIP / remaining copy polish | P2 / BLOCKED_EXTERNAL | ZIP入手後のみvalidator・mapping。DB由来copyは反映権限後 |

P0_OPEN: **0 observed**（包括的な保証ではない）。P1_REQUIRED: 上記6 groups OPEN。USER_DEVICE_REQUIRED YES / USER_APPROVAL_REQUIRED YES。Release readinessを推測%で上げない。

NEXT_SINGLE_ACTION: 最新RCを375pxに固定できる検証環境で、JP全技展開後のDOM計測を実行。現環境ではBLOCKEDのため、週末は失敗端末の実測を最小の1ケースとして先に取得する。

STATIC_PASS != DEVICE_PASS / PREVIEW_READY != RELEASE_READY / GAME_READY != GAME_VERIFIED / DRAFT != PUBLISHED。
