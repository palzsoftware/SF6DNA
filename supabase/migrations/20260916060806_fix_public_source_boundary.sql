-- History placeholder for Production-applied migration 20260916060806_fix_public_source_boundary
-- (Prod ledger statement md5 a2c04d53d40a5625157bf121fb9fc7a1). Recorded here only so that
-- the Git chain and the Production ledger list the same versions.
-- The resulting function state is set once, by 20261120120000_align_source_boundary_with_production.
-- Intentionally no DDL: on Production this version is already applied (skipped); on new
-- environments it is a no-op, so the definitions are never applied twice.
SELECT 1;
