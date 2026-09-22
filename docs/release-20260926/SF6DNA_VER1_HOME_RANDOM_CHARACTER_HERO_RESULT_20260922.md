# Home random character Hero result

`HOME_RANDOM_31 = PASS`

- Source pool: existing 31-entry public legacy character image mapping plus current published character rows.
- Selection: server-side Fisher–Yates shuffle; three items; no duplicates.
- Missing image: excluded before selection.
- Hydration: no client-side randomization; Server Component output is serialized normally.
- Rendering: Home was already `force-dynamic`; no new dynamic boundary was introduced.
- Images: existing URLs only; no new external asset.
- Alt: current character name.

Pure behavior tests verify mapping count 31, count 3, uniqueness, missing-image exclusion, and different selections from different random streams.
