# DB Write Approval Master — Pre 18:00

状態: `READY_FOR_APPROVAL / NOT_APPLIED`。DB changed `NO`。

| Order | Target | Expected candidate rows | Old / New | Source/confidence | Rollback/readback |
|---:|---|---:|---|---|---|
| 1 | snapshot / duplicate check | 0 write | current snapshot / same | current DB | mismatchなら停止 |
| 2 | Kakeru | 5–7 | absent/legacy alias → reviewed player/aliases/result | CAPCOM primary/high | inserted IDs削除、player readback |
| 3 | 如月れん | 7 | absent → player/aliases/official links | VSPO/本人/high | links→aliases→player、role readback |
| 4 | reviewed aliases | up to 28 | current → reviewed alias rows | source queue/medium-high | conflict除外、alias search確認 |
| 5 | tournament results | 2 | absent → primary-confirmed results | official/high | inserted IDs削除、placement readback |
| 6 | player-video relation | up to 12 | absent → exact-ID relations | public exact-ID/medium-high | write直前reprobe、relation readback |
| 7 | category | TBD | current → approved category relation | schema approval required | migrationなしでは適用しない |
| 8 | rank | 0 | unchanged | verified valueなし | 推測値禁止 |
| 9 | legacy JP copy | 1 | exact old snapshot → approved V2 wording | current V2/high | old valueへ復元、public UI確認 |

single transaction、idempotent conflict rule、row-count assertion、post-write role checkを必須とする。RLS/RPC/GRANT、migration apply、第三者Kakeru動画、如月れんcharacter/rank/result、未検証strategyは対象外。
