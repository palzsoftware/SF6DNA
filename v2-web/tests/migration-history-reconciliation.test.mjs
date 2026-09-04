import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const migrationsUrl = new URL("../../supabase/migrations/", import.meta.url);
const migrationFiles = readdirSync(migrationsUrl).filter((name) => name.endsWith(".sql"));

const readMigration = (suffix) => {
  const matches = migrationFiles.filter((name) => name.endsWith(suffix));
  assert.equal(matches.length, 1, `expected one migration ending in ${suffix}`);
  return readFileSync(new URL(matches[0], migrationsUrl), "utf8");
};

test("all current Remote history versions have unique 14-digit Local markers", () => {
  const remoteAligned = migrationFiles.filter((name) => /^\d{14}_/.test(name));
  const versions = remoteAligned.map((name) => name.slice(0, 14));

  assert.equal(remoteAligned.length, 194);
  assert.equal(new Set(versions).size, 194);
});

test("retired Phase20 audit endpoints are represented by safe no-op markers", () => {
  const retired = [
    "20260828075820_phase20_temporary_frame_audit_export.sql",
    "20260828075912_phase20_replace_audit_export_with_fingerprints.sql",
    "20260828080453_phase20_extend_frame_audit_fingerprints.sql",
    "20260828083135_phase20_audit_fingerprint_ids.sql",
    "20260828083919_phase20_semantic_frame_fingerprints.sql",
    "20260828084950_phase20_audit_raw_frame_values.sql",
    "20260828112445_phase20_export_full_reviewed_frame_values.sql",
  ];

  for (const name of retired) {
    const sql = readFileSync(new URL(name, migrationsUrl), "utf8");
    const executableSql = sql.replace(/^--.*$/gm, "");
    assert.match(sql, /intentionally a no-op/i);
    assert.doesNotMatch(executableSql, /create\s+(or\s+replace\s+)?function/i);
    assert.doesNotMatch(executableSql, /security\s+definer/i);
    assert.doesNotMatch(executableSql, /grant\s+execute/i);
    assert.doesNotMatch(executableSql, /'[A-Za-z0-9_-]{40,}'/);
  }
});

test("Phase45 capture replay uses stable slugs and persists idempotency keys", () => {
  const sql = readMigration("_phase45_ryu_capture_results_batch1.sql");
  const slugs = [
    "training-ryu-y4-light-crdr-lethal",
    "training-ryu-y4-pc-5hp-max-sa3",
    "training-ryu-y4-corner-senpukyaku-odtatsu-sa3",
    "training-ryu-y4-corner-5hk-denjin-6450",
    "training-ryu-y4-cmp-od-donkey-sa2-tatsu",
  ];

  for (const slug of slugs) {
    assert.match(sql, new RegExp(slug));
  }

  assert.match(sql, /join public\.capture_backlog cb\s+on cb\.training_id = t\.id/i);
  assert.match(sql, /v_target_count <> 5/i);
  assert.match(sql, /' \[provided\] \[' \|\| m\.evidence_key \|\| '\] '/i);
  assert.match(sql, /Ryu capture batch 1 evidence audit failed/i);
  assert.doesNotMatch(sql, /join public\.capture_backlog cb on cb\.id = cr\.backlog_id/i);
});
