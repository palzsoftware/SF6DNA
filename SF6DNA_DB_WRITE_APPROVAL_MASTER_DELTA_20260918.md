# DB Write Approval Master Delta

State: `PARTIAL_READY_FOR_APPROVAL`。Apply禁止。DB changed: `NO`。

| Order | Target | Old | Candidate new | Expected rows | Confidence | Rollback |
|---:|---|---|---|---:|---|---|
| 1 | Pre-write snapshot / duplicate check | current DB | no write | 0 | required | none |
| 2 | Kakeru player/result/alias | current record set | CAPCOM CUP 11 winner + reviewed alias | 4–6 | primary for result | inserted IDs only |
| 3 | 如月れん links/agency/alias | missing/partial | official agency profile +本人channels | 6–8 | primary profile/channel | links→aliases→player |
| 4 | Player video relations | existing | 10 ready candidates | 10 max | mixed; URL re-probe required | inserted relation IDs |
| 5 | Tournament results | existing | Kakeru + Tokido | 2 | primary | inserted result IDs |
| 6 | Existing aliases | missing | reviewed queue | up to 28 | reviewed | inserted alias IDs |
| 7 | Category schema/data | absent/partial | approved taxonomy | TBD | approval required | schema/data rollback |
| 8 | Rank schema | absent | schema only; no guessed rank | 0 initial | approval required | schema rollback |
| 9 | Legacy JP copy | vague legacy DB text | current concrete V2 wording | 1 | public code confirmed | restore snapshotted value |

## Fresh delta

- RPQg5ZnqTqo / UBsoBb01LOwは本人Xとpublic resultで公開状態を補強。
- Ryu 3本（Webv4hwKRew、c98pgwqOz70、kWS3zqOINUU）をpublic-confirmed監査へ追加。ただしPlayer relationは未解決。
- 如月れんのJP使用・大会結果はsecondaryで補強されたが、Primary未確認のためDB write対象へ昇格しない。

前提: 明示承認、transaction SQL、exact snapshot、row-count assertion、URL再probe、rollback SQL。RLS/RPC/GRANT変更は本Package外。

