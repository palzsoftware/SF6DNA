import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const jpCounterSql = read("../supabase/migrations/20260902015648_jp_counter_copy_naturalization.sql");
const commonTrainingSql = read("../supabase/migrations/20260902015831_training_common_copy_naturalization.sql");
const systemTermsSql = read("../supabase/migrations/20260902020246_counter_training_system_terms_japanese.sql");

const assertCopyOnlyMigration = (sql) => {
  assert.doesNotMatch(sql, /\bset\s+(?:status|verification_status)\s*=|,\s*(?:status|verification_status)\s*=/i);
  assert.doesNotMatch(sql, /\bdelete\b|\binsert\b/i);
};

test("JP matchup copy is naturalized within the current draft scope", () => {
  assert.match(jpCounterSql, /parent_rows<>30 or generic_rows<>110/);
  assert.match(jpCounterSql, /JP使用時の/);
  assert.match(jpCounterSql, /トレーニングモードで再現し/);
  assert.match(jpCounterSql, /2026\.08\.03版以降/);
  assert.match(jpCounterSql, /実機確認が終わるまでは未検証/);
  assert.match(jpCounterSql, /status='draft'/);
  assert.match(jpCounterSql, /valid_to_patch_id is null/);
  assertCopyOnlyMigration(jpCounterSql);
});

test("Repeated training instructions use reader-facing Japanese", () => {
  assert.match(commonTrainingSql, /資料に記載された有利フレーム/);
  assert.match(commonTrainingSql, /ランダム再生/);
  assert.match(commonTrainingSql, /CPU操作：オフ/);
  assert.match(commonTrainingSql, /ドライブリバーサル/);
  assert.match(commonTrainingSql, /content_kind in \('training','editorial','verified_strategy'\)/);
  assert.match(commonTrainingSql, /training exact copy remained/);
  assertCopyOnlyMigration(commonTrainingSql);
});

test("Counter and training terminology audit preserves counts and workflow state", () => {
  assert.match(systemTermsSql, /counter_count_before <> 282/);
  assert.match(systemTermsSql, /training_count_before <> 535/);
  assert.match(systemTermsSql, /regexp_replace\(value, 'training', 'トレーニングモード', 'gi'\)/);
  assert.match(systemTermsSql, /キャンセルドライブラッシュ/);
  assert.match(systemTermsSql, /ドライブインパクト/);
  assert.match(systemTermsSql, /パニッシュカウンター/);
  assert.match(systemTermsSql, /internal terms remain/);
  assert.match(systemTermsSql, /abbreviations remain/);
  assert.match(systemTermsSql, /publication or verification state changed/);
  assert.match(systemTermsSql, /content_kind in \('training','editorial','verified_strategy'\)/);
  assertCopyOnlyMigration(systemTermsSql);
});
