# Phase13 Modern / Moveset Cleanup — 2026-08-27

Branch: `sf6dna-v2`
Patch baseline: `2026.08.03`

## Completed in this cleanup pass

### Japanese move names
- 31 characters / all current Move rows: untranslated count = 0.

### Hidden moveset gaps corrected
- Akuma: Move/Frame/Classic expanded from 47 to 61; missing current moves such as Adamant Flame strength variants, Ashura Senku, additional Demon Raid branches, air/OD variants, and related rows were restored. Existing Demon Raid punch branch naming was corrected from the wrong low-branch label to the current punch-branch mapping.
- Ed: missing OD Psycho Flicker row restored; Move/Frame/Classic = 49.
- M. Bison: OD Head Press and Somersault Skull Diver restored; Move/Frame/Classic = 47.
- Terry: Quick Burn variants restored and a duplicate OD projectile naming conflict was normalized into the existing canonical row/alias structure.
- C. Viper: Seismic Hammer split into Light / Medium / Heavy / OD rows with current 2026 values and commands; Move/Frame/Classic = 66.

### Modern Command expansion
Source-confirmed Modern rows only; manual Modern commands and simplified SP shortcuts are both retained where documented.

Notable improvements:
- Sagat: 1 -> 58
- Ingrid: 6 -> 32
- Akuma: 3 -> 24
- A.K.I.: 5 -> 23
- Luke: 7 -> 22
- Ed: 3 -> 18
- Cammy: 7 -> 16
- Rashid: 3 -> 16
- Terry: 3 -> 15
- Alex: 3 -> 15
- M. Bison: 4 -> 14
- C. Viper: 3 -> 39
- Mai: 6 -> 40
- Elena: 18 -> 33

### C. Viper specifics
- Current Japanese naming normalized to サンダースラップ / サンダースラップ・フェイント for the relevant Thunder Dash source rows.
- Seismic Hammer:
  - Light: 24F, +53 / -10, 700
  - Medium: 24F, +53 / -10, 700
  - Heavy: 24F, +53 / -10, 700
  - OD: 19F, +53 / -8, 900
- Modern shortcuts registered:
  - Light: ↙ + SP
  - Medium: ↓ + SP
  - Heavy: ↘ + SP
  - OD: ↓ + Assist + SP

### Mai specifics
Modern command coverage expanded for Kachousen, Ryuuenbu, Hissatsu Shinobi Bachi, Hishou Ryuuenjin, Musasabi no Mai, powered variants, and SA1.
Current source confirms Medium/Heavy Hissatsu Shinobi Bachi are unavailable in Modern; no fake rows were created for unavailable moves.

### Elena specifics
Modern command coverage expanded for Rhino Horn, Scratch Wheel, Lynx Song, Spinning Scythe manual-only inputs, Moon Glider and SA1-SA3/CA. Current source confirms Spinning Scythe has no simplified Modern input but remains available through manual command input.

## Verification rules preserved
- No training-mode-only value was promoted to `verified` without direct evidence.
- Source-confirmed frame values are `reviewed`, not automatically `verified`.
- Missing/ambiguous Modern inputs are left absent rather than inferred.
- `main` remains untouched.
- Phase14 not entered.

## Remaining Phase13 priorities
1. Continue full Move-set content audit for remaining characters, not just row-count equality.
2. Complete source-confirmed Modern command coverage, prioritizing Yasmine and other low-coverage characters.
3. Resolve remaining unverified Frame rows (JP legacy rows and newly restored Akuma rows).
4. Exact Combo / Setup / Sequence verification backlog.
5. 30-matchup Counter / Training exact verification backlog.
6. Re-run full 31-character source/patch/duplicate/coverage audit before closing Phase13.
