# Ver.1 Motion Media Pilot Implementation Result — 2026-09-23

- Scope: JP only; Ryu is explicitly deferred by the user.
- Integrated mappings: 7 (six unique/target moves and one OD Amnesia counter example).
- Holds: JP normals, general specials, and super-arts sources remain `MAPPING_HOLD` rather than being guessed.
- Delivery: repository-local optimized MP4/WebP assets and a versioned manifest; no Storage contract or DB relation was introduced.
- Boundary: static pilot media is returned only after a valid device Preview request. Public/Production published-media behavior is unchanged.
- DB canonical source: JP character `87077ba6-e9da-48b7-b3bd-2499ea4f6d86`, patch `2026.08.03`; Move IDs, slugs, types, order, and Classic/Modern commands were Fresh-read.
- Runtime behavior: MP4 autoplay/loop/muted/playsInline, poster, `preload="none"`, no native controls, reduced-motion pause/reset.

Files changed are limited to the Pilot manifest, optimized JP assets, Preview loader/merge, media component behavior, regression test, and evidence documents.
