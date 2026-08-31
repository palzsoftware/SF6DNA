# Phase23 30-character data audit — 2026-08-31

Scope: the 30 currently published/playable characters other than Ryu. Draft/non-playable placeholders (Arjun, Tifa, Bosch) are excluded.

Rules preserved:
- reviewed != verified
- draft != published
- no Modern command inference
- no bulk publication
- current patch is the release baseline

## Move / command / frame coverage

| Character | Moves | Classic | Modern | Current verified frame | Public-ready draft |
|---|---:|---:|---:|---:|---:|
| A.K.I. | 52 | 52 | 23 | 52 | 0 |
| C. Viper | 72 | 72 | 67 | 69 | 7 |
| JP | 59 | 59 | 55 | 59 | 0 |
| Alex | 76 | 76 | 15 | 69 | 0 |
| Ingrid | 83 | 83 | 32 | 68 | 0 |
| Ed | 49 | 49 | 18 | 49 | 0 |
| E. Honda | 70 | 70 | 65 | 70 | 70 |
| Elena | 86 | 86 | 74 | 80 | 4 |
| Guile | 70 | 70 | 66 | 70 | 70 |
| Cammy | 53 | 53 | 16 | 53 | 0 |
| Kimberly | 76 | 76 | 74 | 76 | 76 |
| Ken | 59 | 59 | 53 | 59 | 0 |
| Sagat | 69 | 69 | 58 | 66 | 0 |
| Zangief | 47 | 47 | 14 | 47 | 0 |
| Jamie | 93 | 93 | 91 | 93 | 93 |
| Juri | 46 | 46 | 43 | 46 | 0 |
| Dhalsim | 89 | 89 | 77 | 88 | 88 |
| Dee Jay | 105 | 105 | 102 | 105 | 105 |
| Terry | 54 | 54 | 15 | 53 | 0 |
| Blanka | 91 | 91 | 83 | 91 | 91 |
| M. Bison | 47 | 47 | 14 | 47 | 0 |
| Manon | 49 | 49 | 17 | 49 | 0 |
| Marisa | 53 | 53 | 13 | 53 | 0 |
| Yasmine | 85 | 85 | 78 | 81 | 19 |
| Rashid | 54 | 54 | 16 | 54 | 0 |
| Lily | 47 | 47 | 14 | 47 | 0 |
| Luke | 50 | 50 | 22 | 50 | 0 |
| Mai Shiranui | 95 | 95 | 89 | 90 | 10 |
| Chun-Li | 68 | 68 | 64 | 68 | 68 |
| Akuma | 61 | 61 | 24 | 61 | 0 |

Public-ready remains a release gate result only; all Move rows remain unpublished unless separately approved.

## Why many characters are not public-ready

The dominant remaining gap is not missing Move rows or Classic commands. It is official Evidence linkage for the Move body and/or Classic Command. Current verified frame evidence is already strong across most of the roster.

Characters currently showing complete/near-complete official Move + Classic evidence include E. Honda, Guile, Kimberly, Jamie, Dhalsim, Dee Jay, Blanka and Chun-Li. C. Viper, Elena, Yasmine and Mai have partial evidence coverage. The remaining characters need per-move official source confirmation before their draft Moves can pass the public gate.

No Evidence relationship should be bulk-created simply because a character has an official movelist Source; each relation must reflect what the source actually proves.

## Strategy inventory across the 30 characters

- Combo rows: 331 total / 1 verified / 331 sourced
- Setup rows: 180 total / 0 verified / 180 sourced
- Sequence rows: 180 total / 0 verified / 180 sourced
- Counter rows: 1,986 total / 0 verified / 1,986 sourced
- Training rows: 2,331 total / 0 verified / 2,331 sourced

These rows are useful as reviewed/draft working inventory, but are not release-ready merely because a Source relation exists. Strategy verification remains the largest content-quality task after Move evidence alignment.

## Next data work order

1. Complete official Move/Classic Evidence alignment character-by-character without inferring missing Modern commands.
2. Resolve the small current-frame gaps (C. Viper, Alex, Ingrid, Elena, Sagat, Dhalsim, Terry, Yasmine, Mai).
3. Review Strategy data in usefulness order: matchup/counter -> training -> combo -> setup -> sequence.
4. Promote only individually verified and sourced records; do not bulk publish.
5. Motion GIF/short-video capture remains deferred until the final manual-device stage, as requested.
