# DB Write Approval Master — Final Candidate

状態: `READY_FOR_APPROVAL`（Package状態）。`APPLY = NO`、`DB_CHANGED = NO`。

| 順序 | 対象 | 最大候補行 | Source / confidence | 除外・停止条件 |
|---:|---|---:|---|---|
| 1 | pre-write snapshot / duplicate check | 0 write | current DB | snapshot不一致で停止 |
| 2 | Kakeru player / aliases / confirmed result | 5–7 | CAPCOM primary / high | team・第三者videoは除外 |
| 3 | 如月れん player / aliases / official links | 7 | VSPO/本人 / high | character・rank・resultは除外 |
| 4 | reviewed existing aliases | up to 28 | reviewed queue / medium-high | conflict row除外 |
| 5 | tournament results | 2 result rows | primary / high | participation/secondaryを結果化しない |
| 6 | player-video relations | up to 12 ready rows | exact IDs / medium-high | write直前public reprobe必須 |
| 7 | category relations | TBD | schema candidate | schema承認必須 |
| 8 | rank snapshots | 0 initial | verified valueなし | 推測値禁止 |
| 9 | legacy JP copy correction | 1 | current V2 wording / high | exact old value snapshot必須 |

## Transaction contract

1. 対象ID、old/new、Source URL、expected row countを確定。
2. single transaction、idempotent conflict rule、dry-run diffを用意。
3. player→alias/link→result/relationの順で適用。
4. row-count assertion、参照整合性、role別readbackを実施。
5. 失敗時はtransaction rollback。commit後は記録したinserted/updated IDとold snapshotで逆操作。

## 承認対象外

RLS/RPC/GRANT、migration apply、推測character/rank/team、第三者Kakeru動画、如月れん大会結果、未解決video、未検証strategy、29/85 game queueの自動publish。

明示DB Write Approvalが届くまでは一切適用しない。
