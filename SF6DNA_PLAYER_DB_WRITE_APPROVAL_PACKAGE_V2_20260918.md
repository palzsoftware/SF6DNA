# Player DB Write Approval Package V2

Status: `READY_FOR_APPROVAL`; apply: `NO`; DB changed: `NO`.

| Order | Target | Old → candidate | Source / confidence | Expected rows |
|---|---|---|---|---|
| 1 | duplicate check | Sho/Kakeru/如月れん read-only check | current DB | 0 writes |
| 2 | Kakeru player | none → reviewed record | CAPCOM / PRIMARY | 1 |
| 3 | Kakeru aliases | none → 翔, Sho; reviewed handles only | CAPCOM + cross-check | 2-4 |
| 4 | Kakeru character/result | none → JP main; CC11 1st | CAPCOM / PRIMARY | 2 |
| 5 | 如月れん player | none → reviewed profile | VSPO +本人 channels / PRIMARY | 1 |
| 6 | 如月れん aliases/links | none → 3 aliases + 3 links | PRIMARY | 6 |
| 7 | existing aliases | current → APPROVAL_QUEUE only | alias audit | up to 28 |
| 8 | video relations | current → RELATION_READY only | V3 + URL re-probe | 10 |

Excluded: 如月れん character/result/rank, all unconfirmed rank values, third-party Kakeru clips, and multi-category rows until schema approval.

Rollback must be transaction-scoped by inserted IDs: delete relations/results/aliases/links, then new player rows; never broad-delete by display name. Apply prerequisites are user approval, exact current-row snapshot, URL re-probe, duplicate check, transaction SQL review, rollback SQL, and separately approved category/rank migration. No RLS/RPC/GRANT change is included.
