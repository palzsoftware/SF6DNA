# SF6DNA Ver.1.1 Related Video DB Approval Package

Date: 2026-09-20
Status: APPROVAL REQUIRED — NOT APPLIED

## Proposed review scope

- Persist a controlled availability enum equivalent to `PUBLIC_CONFIRMED`, `MEMBERS_ONLY`, `PRIVATE`, `DELETED`, `RESTRICTED`, and `UNKNOWN`.
- Persist the timestamp and operator/source used to confirm availability.
- Continue using an exact Player–Video relation; never infer a Player from title, channel, or free text.
- Default existing and newly ingested rows to `UNKNOWN`, which is not publicly eligible.

## Approval prerequisites

1. Schema and naming review against the current production database.
2. Backfill plan with read-only inventory and rollback procedure.
3. RLS/RPC/GRANT impact review.
4. Separate explicit authorization for migration and DB writes.

No SQL, migration, RLS, RPC, GRANT, or database write was executed in this recovery.
