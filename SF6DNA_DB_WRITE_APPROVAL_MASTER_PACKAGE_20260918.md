# DB Write Approval Master Package

State: `READY_FOR_APPROVAL`; apply `NO`; DB changed `NO`.

| Order | Target | Expected rows | Source/confidence | Rollback |
|---:|---|---:|---|---|
| 1 | duplicate/read-only snapshot | 0 writes | current DB | none |
| 2 | Kakeru player | 1 | CAPCOM primary | inserted ID only |
| 3 | Kakeru aliases/JP/result | 4–6 | primary + reviewed aliases | relations→alias→player |
| 4 | 如月れん player | 1 | official profile | inserted ID only |
| 5 | 如月れん aliases/links | 6 | official/本人 | links→aliases→player |
| 6 | existing aliases | up to 28 | reviewed queue | inserted relation IDs |
| 7 | tournament results | 2 result rows | primary | inserted result IDs |
| 8 | video relations | 10 | exact IDs; re-probe | inserted relation IDs |
| 9 | category relation | TBD | schema approval | migration rollback |
| 10 | rank snapshots | 0 initial | no verified rank values | schema rollback |
| 11 | legacy JP copy candidate | 1 | current V2 public wording | old value snapshot |

Prerequisites: explicit approval, exact pre-write snapshot, duplicate check, URL re-probe, transaction SQL, row-count assertion, rollback SQL. RLS/RPC/GRANT, migration apply, Character relation guesses, 如月れんcharacter/result, Kakeru third-party videos are excluded。
