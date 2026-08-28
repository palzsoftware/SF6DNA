# SF6DNA v2 — 30 Character Shared Package Rollout

Date: 2026-08-26
Branch: `sf6dna-v2`
Baseline patch: `2026.08.03`
Reference package: JP

## Goal

JPで先行構築した情報カテゴリを、JP以外のプレイアブル30キャラへ同じデータ構造で展開する。

対象カテゴリ:

- Move
- Frame
- Classic / Modern Command
- Alias
- Combo
- Setup
- Sequence
- Counter
- Training
- Character Guide / 30-second matchup card
- Player
- Video
- Character Trait Score
- Source
- Patch
- Verification

## Implemented across all 30 in this rollout batch

1. CAPCOM 2026.08.03 character battle-change source registered.
2. CAPCOM official movelist source registered.
3. Current Season 4 / current-character guide candidate source registered.
4. Character-level source relationships created.
5. Five standardized current-patch training records per character created as `draft + unverified`:
   - anti-air recognition
   - punish verification
   - midrange / approach verification
   - corner defense / escape
   - combo + oki revalidation
6. One `matchup_card` guide section per character migrated as `reviewed + draft`.
7. Current-guide candidate video records and character-video relationships created.
8. `character_content_packages` source / patch / training / video / verification tracking advanced to review state where applicable.

## Quality rule

The prior project audit confirmed 31/31 characters have initial guides, 30-second cards, official links and training-record plans, but it also explicitly recorded that current-patch combo numbers, frame-perfect punish data, receiver-dependent setups and video-derived techniques are not fully in-game verified.

Therefore:

- Official CAPCOM facts can progress toward verified after structured transcription.
- Community / video-derived gameplay is candidate only until current-patch reproduction.
- Unknown numeric values are not invented.
- Strategy entities such as Combo / Setup / Sequence / Counter are not populated with placeholder facts merely to make counts look complete.
- Public AI evidence remains isolated from unverified candidate data.

## Remaining work for true JP-equivalent factual completeness

- full Move / Frame / Classic + Modern transcription for every character
- aliases for every move
- verified combo catalog (basic / confirm / max / corner / SA / burnout / character-specific where applicable)
- verified setup / oki catalog
- verified sequence / interruption catalog
- verified punish / counter catalog
- current competitive player references per character
- multiple current guide / match videos per character
- reviewed character trait scores
- final current-patch in-game verification and publication gates

`main` remains untouched.