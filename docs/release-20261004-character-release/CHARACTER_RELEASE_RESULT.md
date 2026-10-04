# Character release preparation — 2026-10-04

Target: 2026-10-10. Media optional; transfer/decode/mapping backfill does not block release by itself. This unified work supersedes media-first sequencing. No parallel workstream or remote write.

Fresh remote base: 2380758461e80b39c533f600375d239d407f8d7f. Local base d980a684c59ea9b1109de5aa22e250a3f0aafe55 includes preserved prior C.Viper evidence docs only. Current task changes are separable from those unpushed commits.

## Fresh read-only DB evidence

31 published characters; 2065 moves; 2065 frame rows; 3508 commands. All move published counts are zero. Current DB patch: ecff9a58-d023-43ae-9962-79d25adfc1f3 / 2026.08.03. This is DB current-patch designation, not fresh verification of CAPCOM's current release version.

Required active categories: 1939. Official identity relations: 906; Classic command relations: 661; current verified frame relations: 1938. Full gate candidates if status were promoted: 661. Actual public-ready: 0. Evidence counts reflect existing relation/verification flags, not new game fact review. Missing identity 1033; command 1278; current verified frame evidence 1. Blockers overlap.

| First milestone | Required | Identity relation | Classic relation | Current verified frame relation | Gate candidates if published | Current public-ready |
|---|---:|---:|---:|---:|---:|---:|
| C.Viper |61|59|5|61|5|0|
| Sagat |60|0|0|60|0|0|
| Elena |72|66|2|72|2|0|

C.Viper 72 total DB rows, Sagat 69, Elena 86 include system/other/archived rows and must not be treated as required five-category counts. MEDIA_OPTIONAL does not cure publication/evidence deficits. FIRST_MILESTONE = HOLD; live all-character complete rollout = 0/31 under the public contract, not an HTTP/fixture completeness claim.

## Reference and acquisition audit

Shared CharacterDetailPilot already displays command, startup, on-hit, on-block and damage. No-media fallback already says 動作映像は未掲載; cards are never removed for media absence. Existing MoveMotionMedia handles GIF/video, posters, preload=none and motion controls. No new renderer/schema/encoder was created.

Alex's reviewed local bundle at this exact HEAD is Preview-only and has frame=null; its media/identity overrides stay unchanged. JP has its existing dedicated Preview UI/fixture. Ingrid has a V2 route and overview fallback but no committed dedicated approved move fixture at this HEAD. The user's reference designation is respected as a product target; it is not evidence of Production-ready frame coverage in this code. Approved/unpushed work in other chats was not imported or overwritten.

Production V2 route is still disabled (VERCEL_ENV=preview requirement). Production legacy UI/boundary remains unchanged. Public moves SELECT RLS requires status=published and private.is_move_public_ready; command/frame parent reads depend on that visibility. A server resolver cannot make draft rows public without a publication change. No admin, service-role, secret-key, privileged snapshot or RLS bypass was added. The privileged connector was used for SELECT audit only, not rendering.

## Local implementation

release-character-move-resolver.ts is the common whitelist adapter connected to loadPublicCharacterMoves after the unchanged isMovePublicReady gate. It preserves every eligible input row/order/category and six frame fields, filters exact Classic official evidence, current open verified official frame and character ID, rejects duplicate identities and ambiguous current frames. Null stays null; real zero stays zero; D stays D. No N/A is guessed from a throw category. Media absence cannot remove an eligible card. It does not approve fixtures, expose internal notes, export draft inventory or change publication policy.

Approved Alex/Yasmine precedence, remote device-preview authorization, public lookup and Preview fixture fallback order are preserved. Ryu/JP/Ingrid/Alex assets, manifests and components remain unchanged. Unverified data is not newly described as verified. No Production config or route-condition change.

## Official access and release limits

Fresh official frame URL attempts for cviper/sagat/elena returned 403. The existing phase20 script's official-slug mapping was reviewed and reused as URL reference; its six-retry mirror loop was deliberately not run. Existing repository evidence/relations were used for coverage; no nonofficial substitution, guessed frame values or guessed command evidence was applied. This access limitation does not block common resolver/tests, but prevents new canonical correction from these pages in this batch.

31-character resolver regression checks reconcile all required working-inventory IDs under synthetic published/official prerequisites. Shared-card SSR checks all 31 slugs, six input types (target_combo groups with unique), command arrows, frame/damage labels, missing-media fallback and existing GIF/video rendering. They are contract/component tests with synthetic values, not live DB or browser route completeness PASS. Real DB counts remain zero public-ready. No-media fallback SSR PASS. Existing route tests cover all 31 Preview route flags and gated resolution; no live 31-URL success is claimed.

Desktop / 375 / 390 browser QA NOT_RUN: three real-data milestone pages remain gated, runtime Production rollout unapproved. Responsive CSS remains unchanged; no pixel/overflow PASS is inferred from SSR. Preview NOT_CREATED / remote write NO. Release status NO_GO because public data and Production UI readiness remain blocked, not because media is incomplete.

Protected: DB_WRITE=0; migrations/RLS/RPC changes=0; Production/main/sf6dna-v2/Ver1.1 unchanged; no push/force push. C.Viper prior media review/CA-duration HOLD retained for optional future backfill.

## Fresh validation result

Current full suite 568 PASS / 0 FAIL (561 baseline + 7 new resolver/render tests). Release gates 14 PASS / 0 FAIL. Typecheck, lint, build and diff-check PASS. Targeted acquisition/resolver tests 16 PASS; card render tests 2 PASS. Build produced the existing metadataBase-localhost warnings; generated Next configuration changes were inspected and excluded. Remote head was rechecked before commit and remained 2380758461e80b39c533f600375d239d407f8d7f. No assets, approved references, feature flags or Production routes changed.
