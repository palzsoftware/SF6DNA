# JP special Motion Media review — 2026-09-24

Base: `6b757af07184bf16c66d59296ddc4c7e47370856` on `sf6dna-v2-chatgpt-rc-20260916`. Fresh read-only query of `public.moves`, `public.characters`, and `public.move_commands` found 26 JP `special` moves; their IDs, slugs, names, strengths, commands, and order matched `fresh-moves.json` for this batch. No database write.

## Source inspection

| Source | SHA-256 | Length | Review |
| --- | --- | ---: | --- |
| `jp_specials_20260923_take01.mp4` | `5b6f89ad9308ea348908e1fb1b7d04dfe710bad23ab2d07c665194dc974bb554` | 46.688 s | The visible attack segments contain super art/cinematic sequences, including the `CA ART` HUD indicator and a long cinematic after ~24 s. Menu screens interrupt the footage. No segment verifies a particular JP special move or its strength. Exclude from this batch; SA/CA classification belongs to the next batch. |
| `jp_amnesia_counter_20260923_take01.mp4` | `0f263197a19b6fee65be391362d06e665aa7d650b89764907e0c60c300c2c85e` | 12.523 s | At least two counter activations connect, around 2–5 s and 7–10 s. Settings/menu frames and a later partial action occur as well. The recording does not show a legible command input or unambiguous normal/OD indicator for the defending JP. |

## Mapping decision

| Classification | DB move(s) | Decision |
| --- | --- | --- |
| `SAFE` | none | No new approved clip or encode. |
| `MAPPING_HOLD` | `jp-amnesia` (`51680ee1-db0b-4906-80da-93ba82dde6f1`), `jp-amnesia-od` (`f262b667-3ec4-4b75-a7f1-df1748df2ba3`) | Counter succeeds, but normal versus OD cannot be proven from these frames. The previously published `jp-amnesia-od` counter asset depicts this same source sequence; set its manifest status to `mapping_hold`, so the Preview loader excludes it. Keep its existing asset for later verification. Do not attach the source range to the stitched existing clip. |
| `RECORDING_MISSING` | the other 24 JP specials | No individually verifiable special strength/placement/activation/teleport appears in the provided files. |
| `NOT_IN_RECORDED_SCOPE` | visible super/CA segments in `jp_specials_20260923_take01.mp4` | Leave for `JP_SA_CA`; do not map to a special move. |

To resolve the hold, obtain a recording of the actual special moves with legible selected move/command or an unmistakable strength indicator. For Amnesia, include the activation and counter result with the input or OD distinction visible. Map every distinct DB move independently; a strength inferred from sequence order is insufficient. No new media is cut, so walk contamination and encode quality are not applicable to this batch.
