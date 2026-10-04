# C.Viper recovery candidate — 2026-10-04

Status: PARTIAL_MEDIA_INTEGRATION_CANDIDATE / NO_GO. Metadata and evidence recovery only; no new runtime media integration or Preview deployment.

## Fresh basis

Remote HEAD: 2380758461e80b39c533f600375d239d407f8d7f. Drift: NO at start. Fresh clone used; the two unpushed candidate objects 7d8d4d71 and 194361a2 are absent. The earlier worktree, outputs and manifest were removed by workspace maintenance, not a user deletion. OLD_CANDIDATE_LOST = YES.

Repository working inventory captured 2026-10-04 is reused, not newly queried: C.Viper 72 rows, required categories 61 (normal 21, unique 2, special 32, throw 2, super 4). No DB query or write this batch.

## Old five recovery

| Prior candidate | Recovery | Adopted |
|---|---|---|
| ヴァイパーエルボー | RECOVERED_METADATA_ONLY, prior conversation record + working inventory | NO |
| ダブルキック | RECOVERED_METADATA_ONLY, prior conversation record + working inventory | NO |
| OD バーニングキック | RECOVERED_METADATA_ONLY, prior conversation record + working inventory | NO |
| ダブルバーン | RECOVERED_METADATA_ONLY, prior conversation record + working inventory | NO |
| チェイスナックル | RECOVERED_METADATA_ONLY, prior conversation record + working inventory | NO |

No old MP4/WebP, source interval manifest, candidate bundle or report was found in the C.Viper filename/manifest/mapping searches. Original 165252 recording metadata exists in Library, but this does not recover the prior reviewed cut or approve a new mapping. No old identity was remapped from logs/order. RECOVERED_CONFIRMED = 0/5; old media recovered = 0. Assets outside accessible search results cannot be ruled out globally.

## Preserved SA baseline

All 4 MP4, 4 WebP, manifest.json and validation.json exist at /SF6DNA/CViper/2026-10-04-recovery/. Their identity, source intervals and stored hashes were read from current Library records. The user's previous visual/DB confirmation is reused; no fresh visual audit is claimed.

SA1 バウンサーステップ / c-viper-limit-decoupler-236236k
SA2 ミッションオーバー / c-viper-mission-complete-214214p
SA3 アンラックリジェクター / c-viper-hard-luck-rejector-214214k
CA アンラックリジェクター / c-viper-hard-luck-rejector-ca-214214k

Manifest source: clip_1364780_20261003_170040.mp4, SHA256 9610dbe1e1e25cdd7266bf492f3d54740f2184c34d2c1677a47eddf1ec6aa027. No source or media was regenerated.

Two byte-recovery attempts (batch then one SA1 clip) returned HTTP 502; no media bytes were copied. Current decode, zero-byte and content-hash checks are NOT_RUN; stored validation records zero-byte 0 and duplicate hashes 0. Four identities, unique bindings, hashes and inventory crosschecks pass metadata tests. Wrong mapping: 0 observed in prior user-confirmed four, fresh visual check NOT_RUN.

CA requires a narrow metadata review: manifest interval 104.5–119.5 = 15s; stored validated output duration 14.266667s. This is not proof of wrong identity. Preserve the clip and original interval unchanged; verify the cause when bytes become accessible. Do not invent a corrected end time.

SA_RECOVERY_BINDINGS.json preserves exact file IDs, canonical DB IDs, source provenance and stored hashes. Original manifest uses mp4/ and webp/ subdirectories while saved assets are directly in the recovery folder; explicit bindings record their actual Library paths. No public media path is created. runtime_bound=false; approved_for_public=false. Production remains unchanged.

## HOLD and command

Baseline confirmed: 4/61 (prior reviewed SA evidence preserved). HOLD: 57/61, each listed in CVIPER_RECOVERY_MAPPING.csv. Current blocker is HOLD_SOURCE_NOT_ACCESSIBLE, not NOT_RECORDED. The 57 entries have not been newly audited for strength, variant, canonical, command or condition conflicts; those subclassifications remain UNKNOWN until source access. No re-recording request.

Command formatter unchanged. Prior preparation REVIEW_ONLY=1 is reused as a pending finding, not freshly counted. Shared command regression is covered by the fresh test suite; no per-character formatter added.

## QA and release

No page implementation changed. Desktop / 390 / 375 browser QA NOT_RUN: media not materialized or runtime-bound. No new Preview exists. This is not reference-character completion.

Fresh checks: typecheck PASS; lint PASS; current full suite 561/561 PASS (557 remote tests + 4 recovery metadata tests; lost unpushed tests are not counted as restored); targeted recovery/formatter tests 19/19 PASS; release gates 14/14 PASS; build PASS; diff-check PASS. Production build emitted existing metadataBase localhost warnings. Generated Next config differences were reviewed and excluded. Media decode validator BLOCKED_HTTP_502; metadata integrity is separate from decode validation. Remote write NO; Preview NOT_CREATED. DB/migration/Production/main/sf6dna-v2/Ver1.1 unchanged.

Next single action: restore accessible bytes for the preserved SA4 candidate and verify CA duration metadata before runtime integration or remote-write approval.
