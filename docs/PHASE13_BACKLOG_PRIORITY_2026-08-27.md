# Phase13 Backlog Priority Progress

Date: 2026-08-27
Branch: `sf6dna-v2`
Patch baseline: `2026.08.03`

## Priority order

1. Japanese move-name localization
2. Modern command completion from explicit current sources only
3. Combo / Setup / Sequence exact-value verification
4. Matchup Counter / Training exact-answer verification

## Work completed in this pass

### Cross-character standard Japanese labels
For the characters whose `name_ja` was populated with English labels by structured imports, standardized common labels were applied where the Japanese notation is deterministic:
- standing LP/LK/MP/MK/HP/HK
- crouching LP/LK/MP/MK/HP/HK
- jump LP/LK/MP/MK/HP/HK
- forward/back/air throw
- Drive Parry / Parry Drive Rush / cancel Drive Rush
- common taunt-direction labels

No character-specific special move was translated by inference.

### Character-specific localization
Current Japanese move lists were used to localize high-confidence character-specific move names.

- Alex: untranslated count reduced from 53 to 26 after common-label pass and current Japanese special/SA mapping.
- Yasmine: untranslated count reduced from 47 to 14; current published Japanese names used for Daloy ng Tubig, Alon, Talim ng Hangin, Mukha ng Langit, Ulan, Kulog, Lipad ng Agila, Pangil sa Likuran, SA1/SA2/SA3 family.
- Elena: untranslated count reduced from 58 to 6 using current Japanese move list.
- Mai: untranslated count reduced from 62 to 4 using current Japanese move list.
- Sagat: untranslated count reduced from 46 to 4 using current Japanese move list.
- C. Viper: untranslated count reduced from 41 to 11 using current Japanese move list.

## Verification rules maintained

- `reviewed != verified`
- No exact combo damage, setup frame advantage, sequence gap, punish frame, or matchup answer was fabricated.
- Modern inputs are only registered when the actual Modern input is explicitly supported by a current source.
- Ambiguous English-to-Japanese move-name mappings remain unchanged rather than guessed.

## Remaining high-priority localization

Largest remaining untranslated groups are Ingrid and the previously normalized Year1/Year2 characters that still carry English labels for character-specific moves. These should be processed from current Japanese move-list sources before Phase14.

## Next work

Continue Japanese localization first, then run a fresh all-31 character localization audit. After Japanese names are materially complete, move to Modern command expansion.

`main` was not modified.
Phase14 was not entered.
