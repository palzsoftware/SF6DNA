# SF6DNA move publication remediation — 2026-10-02

Base: `aba1746bf062ca87f8745cecd9fea5973db121cc`. DB capture: `2026-10-02T08:59:41.841144+00:00`. All database operations in this batch were SELECT only. Production unchanged. Counts are current DB evidence, not game verification.

## Decision

The existing all-or-nothing gate remains active. A pure, unconnected projection models a proposed field-level contract; it is not a production/public resolver and cannot bypass anon RLS. Publication requires both an approved status and evidence. Draft identities remain hidden even in the proposed projection.

| Condition / protection | Identity | Command | Frame | Damage | Media |
|---|---|---|---|---|---|
| Move published; published/playable parent — publication consent | Required | Required | Required | Required | Required |
| Official move identity evidence — wrong identity/category | Required | Required parent | Required parent | Required parent | Required parent |
| Official evidence for the exact command row — wrong input | No | Required per Classic/Modern row | No | No | No |
| One current-patch open verified detail row — stale/ambiguous values | No | No | Required | Required | No |
| Official evidence covering frame fields — unsupported timing | No | No | Required | No | No |
| Official evidence covering damage fields — unsupported damage | No | No | No | Required | No |
| Published media + approved move identity mapping — wrong clip | No | No | No | No | Required |

Frame and damage evidence must cover the displayed fields. A source merely labelled official is not automatically proof of every field. The DB row counts below reuse the existing verified frame-evidence contract as a **maximum candidate count**, pending field-content review for damage. They do not establish newly verified facts. Values require non-NULL data; explicit N/A evidence is separate. Missing values use an unavailable state, never invented zero. There is no whole-card verified label.

## Live coupling

`loadPublicCharacterMoves` / `isMovePublicReady` require published status, Classic command and official move/command/current verified frame evidence. `moves` SELECT RLS also calls `private.is_move_public_ready`. Command/frame policies depend on that parent. `get_public_entity_sources` uses `private.is_public_source_target`, which also applies the full move gate. UI-only decoupling cannot return identities through these policies. Direct source/entity-source SELECT is restricted. No service-role/public workaround is permitted.

RLS_CHANGE=NO in this batch. Activating the new contract requires a separately approved acquisition/RPC/policy design, or additional evidence that satisfies the unchanged existing gate. The projection has no imports into active loaders, no DB access and no UI effects. Preview Ryu/JP fixtures are not production publication evidence. Production V2 UI rollout is also a separate decision.

## All-31 simulation (hypothetical approved publication status)

| Character | Required | Existing promotion | Identity evidence | Classic evidence | Verified detail row candidates | Damage non-NULL candidates |
|---|---|---|---|---|---|---|
| aki | 52 | 0 | 0 | 0 | 0 | 0 |
| akuma | 61 | 0 | 0 | 0 | 0 | 0 |
| alex | 64 | 0 | 0 | 0 | 0 | 0 |
| blanka | 83 | 83 | 83 | 83 | 83 | 83 |
| c-viper | 61 | 5 | 59 | 5 | 59 | 59 |
| cammy | 53 | 0 | 0 | 0 | 0 | 0 |
| chun-li | 68 | 68 | 68 | 68 | 68 | 68 |
| dee-jay | 97 | 97 | 97 | 97 | 97 | 97 |
| dhalsim | 80 | 80 | 80 | 80 | 80 | 80 |
| e-honda | 62 | 62 | 62 | 62 | 62 | 62 |
| ed | 49 | 0 | 0 | 0 | 0 | 0 |
| elena | 72 | 2 | 66 | 2 | 66 | 66 |
| guile | 70 | 70 | 70 | 70 | 70 | 63 |
| ingrid | 62 | 0 | 0 | 0 | 0 | 0 |
| jamie | 93 | 93 | 93 | 93 | 93 | 92 |
| jp | 59 | 0 | 1 | 0 | 1 | 1 |
| juri | 46 | 0 | 0 | 0 | 0 | 0 |
| ken | 59 | 0 | 0 | 0 | 0 | 0 |
| kimberly | 76 | 76 | 76 | 76 | 76 | 76 |
| lily | 47 | 0 | 0 | 0 | 0 | 0 |
| luke | 50 | 0 | 0 | 0 | 0 | 0 |
| m-bison | 47 | 0 | 0 | 0 | 0 | 0 |
| mai | 82 | 8 | 81 | 8 | 81 | 81 |
| manon | 49 | 0 | 0 | 0 | 0 | 0 |
| marisa | 53 | 0 | 0 | 0 | 0 | 0 |
| rashid | 54 | 0 | 0 | 0 | 0 | 0 |
| ryu | 57 | 0 | 0 | 0 | 0 | 0 |
| sagat | 60 | 0 | 0 | 0 | 0 | 0 |
| terry | 53 | 0 | 0 | 0 | 0 | 0 |
| yasmine | 73 | 17 | 70 | 17 | 70 | 70 |
| zangief | 47 | 0 | 0 | 0 | 0 | 0 |

Totals: identities 906; Classic commands 661; verified detail row candidates 906; non-NULL damage candidates 898. Actual published/public moves remain 0. Only 13 characters have identity evidence; 18 remain empty under this proposed contract. ALL31_SIMULATION=BLOCKED_WITH_EXACT_REASONS. No status was changed.

The simulation evaluates candidate evidence flags, not a live anon rendering or 31-character completion. Missing identity/command evidence cannot be fixed by replacing the gate. The 8 projection tests cover draft/identity boundaries, per-command evidence, unverified/stale/ambiguous detail hiding, independent frame/damage evidence, real zero, NULL and explicit throw N/A, and whitelist-only output.
