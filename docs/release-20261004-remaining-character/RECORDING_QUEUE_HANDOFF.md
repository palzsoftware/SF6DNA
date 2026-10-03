# Recording queue and single-file handoff

## Next available action

Transfer the **existing C.Viper normals MP4** first (suggested `c-viper-normals.mp4`; the actual filename is acceptable). Re-recording is not required. Once accessible: file probe → timeline → success name/input + visual review → confirmed cuts → existing MP4/WebP encoder → existing validator → Preview candidate. Unknown identity/strength/OD/follow-up stays HOLD; other moves continue.

## Reported completed recordings — transfer, do not record again

These are user-reported, source files not yet accessible to this Work. Names below are expected naming conventions, not names found in the file inventory. Process one actual MP4 at a time; split suffixes are accepted.

| Character | DB slug | Expected transfer names |
|---|---|---|
| C.Viper | c-viper | c-viper-normals.mp4; c-viper-unique-moves.mp4; c-viper-specials.mp4; c-viper-throws.mp4; c-viper-super-arts.mp4 |
| Sagat | sagat | sagat-normals.mp4; sagat-unique-moves.mp4; sagat-specials.mp4; sagat-throws.mp4; sagat-super-arts.mp4 |
| Elena | elena | elena-normals.mp4; elena-unique-moves.mp4; elena-specials.mp4; elena-throws.mp4; elena-super-arts.mp4 |
| Mai | mai | mai-normals.mp4; mai-unique-moves.mp4; mai-specials.mp4; mai-throws.mp4; mai-super-arts.mp4 |
| Terry | terry | terry-normals.mp4; terry-unique-moves.mp4; terry-specials.mp4; terry-throws.mp4; terry-super-arts.mp4 |
| M.Bison | m-bison | m-bison-normals.mp4; m-bison-unique-moves.mp4; m-bison-specials.mp4; m-bison-throws.mp4; m-bison-super-arts.mp4 |
| Akuma | akuma | akuma-normals.mp4; akuma-unique-moves.mp4; akuma-specials.mp4; akuma-throws.mp4; akuma-super-arts.mp4 |
| Ed | ed | ed-normals.mp4; ed-unique-moves.mp4; ed-specials.mp4; ed-throws.mp4; ed-super-arts.mp4 |

Jump LP/MP/HP/LK/MK/HK can be in normals or `<slug>-jump-attacks.mp4`; absence holds only Jump media. Do not ask for new Jump footage until the actual transferred recording is reviewed.

## Reverse-roster queue candidates

**14 candidates, not a confirmed unrecorded count.** Check against files already captured on the user's device before recording. The previously cited nine remaining cannot be verified from current evidence.

A.K.I. → Rashid → Cammy → Lily → Zangief → Dee Jay → E.Honda → Dhalsim → Blanka → Ken → Juri → Kimberly → Guile → Chun-Li.

Next recording candidate: **A.K.I. (`aki`)**, only if not already recorded.

Every candidate has active combat DB rows and a prepared intake template. A category with no DB rows must not be fabricated. Sagat has no unique/target_combo rows in this inventory: do not demand a separate unique-moves recording based only on the naming convention. Alex/Ingrid have the same DB category gap in their reused prior work; this is not proof of absent in-game moves. Standard files per slug: `<slug>-normals.mp4`, `<slug>-unique-moves.mp4`, `<slug>-specials.mp4`, `<slug>-throws.mp4`, `<slug>-super-arts.mp4`. Split `unique-moves1/2`, `specials1/2` freely. Jump may be separate. No Modern-specific video needed; retain Modern commands as distinct data.

## Recording contract reused

- Show successful move-name labels and input history when possible. Keep enough on-screen evidence to distinguish weak/mid/heavy/OD, stock/hold/state and follow-up conditions.
- Pause clearly between moves. Neutral → one move → end + short margin. Keep resets outside usable intervals.
- Prefer weak → mid → heavy → OD, then follow-ups near their parent; this order aids review but never proves mapping.
- Separate default and conditional footage; conditional/Punish Counter footage cannot overwrite default.
- No single unresolved clip stops the character. No frame/patch re-audit is required for media processing.

## Existing work excluded from re-recording queue

Ryu, JP, Luke, Jamie, Manon, Marisa, Yasmine, Ingrid, Alex. Existing partial coverage is reused; they are not assumed 100% complete. Ingrid has previous recording evidence but no approved local manifest in the current RC; recover its existing work separately, do not blindly request new footage.

## Prepared files

- `scripts/data/CHARACTER_MEDIA_MAPPING_TEMPLATE_20261004.csv`: 22 characters / 1,379 working DB identities, all INPUT_PENDING, no automatic confirmation.
- `scripts/data/remaining-character-intake-20261004.json`: fresh offline read-only comparison inventory and evidence relations; not a public data source.
- `scripts/prepare-character-media-intake.mjs`: regenerate template, structural candidate validation and YouTube ID dedupe. Visual review and existing final media validators are still mandatory.

Desktop uses the existing large media layout and shared command formatter. Do not edit shared UI for each character. Consolidate 375px device review after rollout; do not repeat Daily15 or per-character mobile QA now.

Remote write is held under this work's §76 until explicit candidate push approval. DB/Production/main/sf6dna-v2/Ver1.1 remain unchanged.
