# Non-character copy audit

The full route inventory is in `SF6DNA_VER1_PUBLIC_COPY_FULL_INVENTORY_20260922.csv`; concrete changes are in `SF6DNA_VER1_NATURAL_JAPANESE_BEFORE_AFTER_20260922.csv`.

Result:

- `NON_CHARACTER_COPY = PASS`
- `BROWSER_TERM = ブラウザ`
- `INTERNAL_TERM_LEAK = 0` for the reviewed public surfaces
- `METADATA_RELATION_PUBLIC_LEAK = 0`
- Vague CTAs were replaced where the destination was known.
- Legal meaning was preserved.
- No character-specific game fact or recommendation contract changed.
