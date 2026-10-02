# SF6DNA move publication remediation — 2026-10-02

Base: `aba1746bf062ca87f8745cecd9fea5973db121cc`. DB capture: `2026-10-02T08:59:41.841144+00:00`. All database operations in this batch were SELECT only. Production unchanged. Counts are current DB evidence, not game verification.

## Separate decisions

| Pack | Scope | Readiness | Approval effect |
|---|---|---|---|
| A | Exactly 661 required move statuses draft → published | Guarded SQL + rollback prepared; not executed | Up to 661 through unchanged gate; 12 characters only |
| B | New official move/command evidence relations | NOT_READY: 31 character movelist review leads, 0 validated exact relations | No inserts until exact page content supports each field |
| C | Field-level identity/command/frame/damage/media acquisition | Contract/projection proposed, NOT_ACTIVATED | Requires separately approved DB/RPC/policy design; RLS changes forbidden in this batch |

Approval of A does not approve B or C. A alone cannot satisfy 31-character coverage. There is no blanket publication request. Any later DB/RPC update needs exact scope, counts, preconditions and rollback. Field-level activation cannot be silently implemented in the UI while current RLS/source RPC blocks identities.

## Related-video source audit

Published video relations: 3. Public source RPC returns 31 YouTube references, but their existing relationship is `candidate`. All 31 are excluded by the current safe reference display allowlist. Display-eligible new references: 0. Do not relabel candidate to supporting/guide_reference without content review. No synthetic Video entities, relation changes, or notes exposure. Existing unlimited card/dedup/thumbnail code remains unchanged. YouTube identity/dedup is URL identity only, not proof the video is relevant.

| Character | Published relations | YouTube candidate sources | Display eligible references | Relationship |
|---|---|---|---|---|
| aki | 0 | 1 | 0 | candidate |
| akuma | 0 | 1 | 0 | candidate |
| alex | 0 | 1 | 0 | candidate |
| blanka | 0 | 1 | 0 | candidate |
| c-viper | 0 | 1 | 0 | candidate |
| cammy | 0 | 1 | 0 | candidate |
| chun-li | 0 | 1 | 0 | candidate |
| dee-jay | 0 | 1 | 0 | candidate |
| dhalsim | 0 | 1 | 0 | candidate |
| e-honda | 0 | 1 | 0 | candidate |
| ed | 0 | 1 | 0 | candidate |
| elena | 0 | 1 | 0 | candidate |
| guile | 0 | 1 | 0 | candidate |
| ingrid | 0 | 1 | 0 | candidate |
| jamie | 0 | 1 | 0 | candidate |
| jp | 1 | 0 | 0 | — |
| juri | 0 | 1 | 0 | candidate |
| ken | 0 | 1 | 0 | candidate |
| kimberly | 0 | 1 | 0 | candidate |
| lily | 0 | 1 | 0 | candidate |
| luke | 0 | 2 | 1 | candidate,guide_reference |
| m-bison | 0 | 1 | 0 | candidate |
| mai | 0 | 1 | 0 | candidate |
| manon | 0 | 1 | 0 | candidate |
| marisa | 0 | 1 | 0 | candidate |
| rashid | 0 | 1 | 0 | candidate |
| ryu | 2 | 1 | 0 | candidate |
| sagat | 0 | 1 | 0 | candidate |
| terry | 0 | 1 | 0 | candidate |
| yasmine | 0 | 1 | 0 | candidate |
| zangief | 0 | 1 | 0 | candidate |

## Validation and boundaries

Typecheck PASS; lint PASS; tests 456/456 PASS; release gates 14/14 PASS; build PASS. Eight new projection tests. Build-generated next-env.d.ts and tsconfig.json changes were inspected and returned to their exact pre-build HEAD contents; they are not included. Diff-check recorded at commit preparation.

All-31 simulation completed, but 18 identity-empty characters and 19 existing-gate-empty characters remain exact blockers. No new rendering/data rollout was claimed. Actual public moves remain 0. No unverified frame or damage is exposed by the inactive projection. AI Coach=false, training=false, publicStrategyContent=false remain unchanged. DB writes=0, Production unchanged, no active public boundary change. Old final-regression uncommitted docs are preserved and excluded.

## Release judgment / handoff

RELEASE_STATUS=NO-GO. Do not freeze RC while all-character content is empty. Required: remaining official identity/command evidence review; decision A; separately designed and approved C acquisition contract if desired; production Character UI decision. Auth acceptance, internal guard, chibi rights, JP SA2 and beginner media stay their existing separate gates. No repeated Daily15 device QA requested.

No gameplay re-verification was performed. Official registrations and existing verified flags are reused evidence, not a new gameplay claim. Current patch/row availability are database observations. Preview-only Ryu/JP fixtures do not prove production content coverage.

Preview SHA mapping is checked after this document commit and reported in the final response; deployment output is not retroactively claimed here. Browser UI is unchanged because the projection is unconnected. Fresh data-level simulation covers all 31; rendering completion remains BLOCKED, not PASS. Existing mobile/theme evidence is reused, with no fresh 375px viewport or timing/LCP measurement claimed.

NEXT_SINGLE_ACTION: Review approval A's exact 661-target guarded status promotion. B and C require their own later decisions; A does not complete the all-character goal.
