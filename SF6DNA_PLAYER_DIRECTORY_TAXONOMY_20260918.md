# Player Directory Taxonomy

## Decision

Public category is multi-valued. A person may be both `pro` and `streamer`. Category describes public activity, while tournament results, character relations, team membership, and rank remain separate facts.

| Internal value | Public label | Admission evidence |
|---|---|---|
| `pro` | プロ | Current team, SFL or CPT primary source |
| `former_pro` | 元プロ | Primary profile or team-history evidence |
| `youtuber` | YouTuber | Identified本人 channel with continuing SF6 videos |
| `vtuber` | VTuber | Agency or本人 profile plus SF6 activity |
| `streamer` | ストリーマー | Identified本人 stream channel plus continuing SF6 activity |
| `celebrity_other` | その他著名人 | Public identity and sustained/clear SF6 activity |
| `competitive_player` | 競技プレイヤー | Tournament participation without current pro evidence |

Existing `players.player_type` is retained as the primary compatibility value. Multi-category publication requires a relation table; no value is inferred from fame or a single appearance. `creator` remains a compatibility value and should map to one or more reviewed public categories before migration.

Kakeru candidate: `pro + competitive_player`. 如月れん candidate: `vtuber + streamer`. Both require approval before DB write.
