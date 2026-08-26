# 2026-08-26 Move rollout batch

Branch: `sf6dna-v2`
Baseline patch: `2026.08.03`

## Characters processed

- Terry
- Mai
- Elena

## Database work

Added candidate objective data from frame-search direct pages:

- Move: 58
- Classic Command: 58
- Frame candidate: 58
- Move ↔ Source links: 58
- Character packages advanced: 3

All records remain `draft / unverified`.

## Source/version handling

The direct pages for Terry, Mai and Elena report `Ver.2.0401.000`; search results can show `Ver.2.0401.001`. Because that version presentation is inconsistent, no frame row was promoted to verified/published.

Sagat was intentionally not imported in this batch because the directly opened frame-search page reported `Ver.2.0301.001`, which is clearly older than the current baseline used for the SF6DNA rollout. Akuma was also deferred because the frame-search cache fetch for the `Gouki/Akuma` character endpoint failed in this run. Neither character was filled with guessed data.

## Next

- Re-query current sources for Akuma and Sagat.
- Continue C. Viper, Alex, Ingrid, Yasmine objective Move / Frame / Command ingestion.
- Then return to missing JP-equivalent layers: aliases, combo, setup, sequence, counter, player and trait scores.
