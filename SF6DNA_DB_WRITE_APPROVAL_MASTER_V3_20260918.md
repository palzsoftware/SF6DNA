# DB Write Approval Master V3

状態: `READY_FOR_APPROVAL / NOT_APPLIED`。既存候補にfuture media metadataを追加したが、schema/applyは未承認。

| Order | Target | Candidate count | Gate |
|---:|---|---:|---|
| 1 | snapshot/duplicate check | 0 write | exact pre-write snapshot |
| 2 | Kakeru player/aliases/result | 5–7 | explicit approval; exclude guessed links/videos |
| 3 | 如月れん player/aliases/links | 7 | exclude character/rank/result |
| 4 | reviewed aliases | up to 28 | conflict rows excluded |
| 5 | primary tournament results | 2 | placement source required |
| 6 | player-video relations | up to 12 | exact-ID public reprobe |
| 7 | category/rank | TBD / 0 | schema approval / no guessed rank |
| 8 | legacy JP copy | 1 | old value snapshot |
| 9 | motion media | 0 until Pilot | source video, manifest, move mapping, media validation |

Media metadata候補: media URL/type、poster、move ID、variant、patch/date、verification、loop、duration、dimensions、fps、filesize、source_owner。既存schemaに不足がある場合はmigration案だけを別途作成し、applyしない。

全writeはsingle transaction、expected count、idempotency、rollback、role別readbackが必要。RLS/RPC/GRANT変更は本承認対象外。
