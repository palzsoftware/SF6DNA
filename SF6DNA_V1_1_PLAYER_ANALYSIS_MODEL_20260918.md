# SF6DNA V1.1 Player Analysis Model — 2026-09-18

## Categories

- strength
- playstyle
- what_to_learn
- decision_tendency
- similar_player
- complementary_player

## Allowed attribution evidence

| Kind | Public label | Requirement |
|---|---|---|
| PLAYER_STATEMENT | 本人発言 | Source reference required |
| OBSERVED_BEHAVIOR | 試合から確認できる行動 | Source reference required |
| OBSERVED_PATTERN | 複数試合で見られる傾向 | Source reference required |
| AI_INFERENCE | AIによる分析 | Must not be presented as verified |

`VERIFIED_GAME_FACT` and other game-fact kinds are not silently converted into a Player Analysis attribution. Game facts can remain in the shared Coach Evidence layer instead.

## Empty-state decision

No Player Analysis section is added to public Player Detail until supported analysis data exists. Empty sections and inferred player personality are not generated.

## Related Video audit

Read-only DB audit on 2026-09-18:

- videos: published=3, draft=87
- videos table has no explicit availability/members-only/private/restricted column
- entity_videos currently has Character relations only (112 rows)
- published Match + Video path produced 0 Player relations at audit time

Therefore Player Related Video is not declared complete. Existing published-only video UI is retained, but V1.1 must add/verify exact Player relation and public-availability evidence before relying on it for Coach learning navigation.
