# Player Category / Rank Schema Candidate

Status: `PLAYER_CATEGORY_RANK_SCHEMA_APPROVAL_REQUIRED`; apply: `NO`.

## Multi-category candidate

`player_categories(player_id uuid, category text, source_id uuid, checked_at timestamptz, status text)` with unique `(player_id, category)`. Keep `players.player_type` during compatibility migration. Expected initial rows are determined only after approval review; no hardcoded count.

## Source-dated rank candidate

`player_rank_snapshots(id uuid, player_id uuid, rank text, mr integer null, checked_at timestamptz, source_url text, status text)`; public query selects the latest approved snapshot and labels stale data as reference. Unknown is natural and must not become `Master` by default.

## Order / rollback

1. Review allowed values and source rules. 2. Create tables with RLS/policies in a separately approved migration. 3. Backfill reviewed rows. 4. Switch reads. Rollback switches reads back, then removes only migration-owned rows/tables after export. RLS, grants, and migration application require explicit approval.
