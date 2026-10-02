# Production Character UI Readiness / Decision Plan

BASE_SHA = 69a3f958cbabdcc995cd8a3ef4cc0eb936aafc41
PRODUCTION = NO_CHANGE
DB_WRITE = 0
PUBLICATION_GATE = UNCHANGED
RELEASE_STATUS = NO-GO
RC_FREEZE_CANDIDATE = NO

## Blocking decisions

1. Public rollout: moves.status is draft for all2052 active rows. Existing gate additionally requires official Move/Classic Command/current verified Frame evidence. Missing official Move1033, Classic1278, verified currentFrame1 among required1939. Counts overlap. Full active counts are1082/1351/32 respectively.
2. Ordinary Preview lacks authorized Device Preview token. No privileged key, internal-token extraction, RLS bypass or giant static DB snapshot was introduced. Authorized Remote path is supported, but not supplied by ordinary deployment authentication.
3. Existing character bundle RPC omits on_hit. RPC modification needs explicit DB change authorization and review; this batch forbids it.
4. V2 route gate is Preview-only. Production still legacy UI. No silent Production boundary rollout. Need explicit decision for31-character V2 Production condition, with publication gate retained.

## Reviewable next-batch plan (NOT EXECUTED)

First publish only evidence-ready draft IDs after explicit DB-write authorization, fresh patch/status/evidence recheck, and exact ID snapshot. Eligibility:701 overall /661 required moves across12 characters. This alone does not complete31. No Source inference, RLS change or isMovePublicReady bypass. Rollback uses exact captured IDs and previous draft status, not blanket update.

|Character|Required evidence-ready draft|
|---|---:|
|blanka|83|
|c-viper|5|
|chun-li|68|
|dee-jay|97|
|dhalsim|80|
|e-honda|62|
|elena|2|
|guile|70|
|jamie|93|
|kimberly|76|
|mai|8|
|yasmine|17|

For the remaining1278 required rows, complete official Command evidence and overlapping Move/frame gaps or review a separately approved basic-encyclopedia publication contract. Unverified values must not appear verified. This proposal is not approval or implementation. Read-only evidence does not authorize publishing DB content.

Authenticated Preview full onHit delivery proposal: expand existing token-guarded current-patch bundle projection using existing fields, preserve token/expiry/admin boundaries, tests for past/reviewed/null frames. No queryparam bypass or secret service key.

Production-like UI adoption, Chibi exclusion when rights unverified, Internal Guard decision, Auth Save acceptance, env scope and approval remain separate Release conditions. Combo/Setup candidates unchanged/unpublished. Optional media/true zero video count are not blockers by themselves. Empty move list is a release blocker.

Current Production/rollback anchor from prior Fresh evidence: dpl_3T4VAzUWb57vwaN6HphfNGucDPVL / b9a2a8f638a3d4a98bfa042d56470664fe225ba7 / main. No promotion/rollback executed.

NEXT_SINGLE_ACTION = Approve the publication/data-access decision plan for a separate explicitly authorized batch; do not proceed to⑯ Freeze yet.
