import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Training copy audit only rewrites current user-facing draft purposes", () => {
  const sql = read("../supabase/migrations/20260902013630_phase48_training_natural_japanese.sql");

  assert.match(sql, /status = 'draft'/i);
  assert.match(sql, /valid_to_patch_id is null/i);
  assert.match(sql, /content_kind in \('training', 'editorial', 'verified_strategy'\)/i);
  assert.match(sql, /fixed_rows <> 45/);
  assert.match(sql, /organized_rows <> 4/);
  assert.match(sql, /固定する。\?\$/);
  assert.match(sql, /安定させる。/);
  assert.match(sql, /を整理する。\?\$/);
  assert.match(sql, /の違いを覚える。/);
  assert.doesNotMatch(sql, /\bset\s+(?:status|verification_status)\s*=|,\s*(?:status|verification_status)\s*=/i);
  assert.doesNotMatch(sql, /\bdelete\b|\binsert\b/i);
});
