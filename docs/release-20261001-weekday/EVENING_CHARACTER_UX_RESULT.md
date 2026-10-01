# SF6DNA Ver.1.0 Evening Character UX — 2026-10-01

BASE_SHA: 266f170f6ac80a16db76bab0df73f8b8feeddddf
BASE_TREE: ae65e6b589f108b754900fe04ffeed86c6ebf774
RELEASE_STATUS: NO-GO

## Change and impact

Added a five-link Character Quick Start to the existing overview, moves, first lesson, players and videos. This is section navigation, not generated gameplay advice. Added name/command search and category buttons to the already supplied move groups. Existing server-rendered cards, raw commands, frame values, media and publication gates remain in place. Search normalizes width/case, combines terms, supports category intersection, announces result counts and restores all cards on reset. Categories wrap; active selection has text underline and aria-pressed. Inputs and buttons have labels, visible focus and 44px minimum height.

JP and the shared normal-character detail component are affected. The pre-release shell gets no Quick Start or filtering controls. No combo recommendation or publication approval is generated. Existing shared move-group class is retained. No existing layout/CSS overflow rule is changed. New styles are scoped to the new controls/navigation and use existing theme variables. Sticky navigation is deferred: mobile header overlap cannot be measured in this environment.

## Verification

- Targeted actual component-handler/SSR tests: search, category intersection, no-result/reset, raw content, five anchors, pre-release controls exclusion, Home return routes/mobile dock, Video open/close/filter count/clear/search/sort/result count PASS.
- Existing frame rendering tests now execute the real explorer; optional values remain absent, literal zero and signed values survive. Public character SSR confirms all five anchor targets and retained original input.
- Full tests: 379 PASS / 0 FAIL. Release Gates: 14 PASS. Typecheck, lint, build and diff check PASS.
- Earlier full run exposed three stale component test adapters and four Home assertions inherited from before the authorized 266f170 UX change. Updated assertions to the current approved Home structure; preserved public-scope/copy safeguards and added actual SSR/handler checks.
- Build-generated next-env.d.ts route imports and tsconfig formatting/jsx/dev-types changes were inspected and excluded from this feature commit. Baseline configuration restored from the verified base index; typecheck rerun.
- Build warning: metadataBase is absent locally; build defaults social image origin to localhost. No production configuration changed.

## Evidence boundary

Latest base deployment dpl_63F7Dj8SiM2tQD1GSZyxRnpkzw6G was READY with exact branch/SHA match. Cloud browser JP navigation reached Vercel sign-in; authentication was not started. An initial connector fetch returned application HTML, but subsequent JP/Luke/Manon fetches returned 302 and Ryu retrieval did not return usable application HTML. This does not establish consistent browser access or viewport QA.

JP 320/375/390/430: BLOCKED. ROOT_CAUSE: NOT_CONFIRMED. OFFENDING_ELEMENT/CSS_RULE: NOT_VERIFIED. FIX: NONE. Horizontal movement and full-expansion mobile DOM measurement NOT_RUN. Prior Desktop results are reused only for their original SHA/conditions; they are not proof of this candidate's mobile layout. Luke raw-recipe and non-Luke icon exclusion SSR PASS; MOBILE_STATIC BLOCKED; DEVICE/GAME NOT_RUN. Home/Video handler and SSR contracts PASS, mobile visual/filter visibility/sticky overlap NOT_VERIFIED.

Runtime evidence still needed: exact failing URL and section expansion, viewport/client/document/body widths, scrollX after horizontal movement, each offending element's rect/client/scroll width/computed width/min/max/white-space/flex/grid/position/transform and parent chain. First inspect expanded JP command/card parents and Source rail parents. Source rail overflow is not by itself document overflow. No mobile cause is excluded by earlier Desktop PASS.

## Reused release readiness

Auth Guest/error/retry/request_id/idempotency static evidence PASS, unchanged. Real account Login→Diagnosis→Save→History→Reload→Logout NOT_RUN. Source30 and Internal Guard packets reused from AFTERNOON_CLOSURE_PACKET.md; neither recreated nor applied. Source30: 30 targets / 29 link-only / 1 attribution; DB_APPLIED 0. Existing requireAdmin candidate remains unapplied pending explicit approval. Combo game verification and publication remain incomplete. Ryu ZIP remains unavailable; pipeline preparation evidence is reused.

## Blocker ledger

| Group | State |
|---|---|
| P1-A JP/Character overflow | OPEN / BLOCKED_EXTERNAL runtime evidence |
| P1-B Device QA | USER_DEVICE_REQUIRED |
| P1-C Auth/Save | STATIC_PASS / USER_DEVICE_REQUIRED |
| P1-D Combo Publication | OPEN / GAME_VERIFICATION_REQUIRED |
| P1-E Source Application | USER_APPROVAL_REQUIRED / DB_WRITE_NOT_AUTHORIZED |
| P1-F Internal Guard | USER_APPROVAL_REQUIRED / APPLIED NO |

P0: 0 observed (not exhaustive runtime certification). P1_REQUIRED_OPEN: 6 groups. P2: Ryu recording ZIP and residual public copy; unchanged priority. Production/main/sf6dna-v2/Ver1.1/DB/dependencies/authentication boundaries unchanged.

## Compressed weekend handoff

1. JP375: all existing move groups open, horizontal movement and failure evidence. Include new search/category controls and five anchors in the same session; capture Japanese wrapping/tap/focus/theme Light/Dark only where affected.
2. Ryu/Luke/Manon: representative shared move-group/filter/Quick Start regression in the same session. Luke icon collapsed/expanded, long/unknown recipe requires a legitimate unpublished pilot review path; no public leak is introduced.
3. One real-account sequence: Login→Diagnosis→Save→History→Reload→Logout, persistence/no duplicate/error/logout state. Reuse unchanged static error/retry evidence.
4. Luke first five game checks only, using the existing packet. READY is not GAME_VERIFIED or PUBLICATION_APPROVED.
5. Existing Source30/Internal Guard approval packets require separate decisions; no DB or guard changes performed here.

Do not repeat 86 URL audits or 31 manual character checks. Home/Video contract checks above are WORK_STATIC_PASS; mobile visual effects remain unverified. Next single action: obtain an authorized, authentication-free or already-authorized browser environment capable of exact 375px and measure latest JP with all move groups expanded. No weekday user device QA requested.
