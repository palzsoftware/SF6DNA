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

  // 196 versions recorded in the Prod migration ledger (2026-11-20) + 4 Git-only forward candidates awaiting approval
  // (20261120115000 move_commands SECURITY DEFINER source check, 20261120116000 preview RPC source boundary,
  //  20261120117000 public content policies off inline source reads (2026-11-25; no-op on Production),
  //  20261120120000 source boundary REVOKE). They must be applied together, in this order.
  // 2026-11-26 (V26): + 20261126100000 entity_videos public target boundary (independent candidate, not applied).
  //  Production DDL check 2026-11-26: 115000 is also safe on its own (no grant change); 116000 is only needed before 120000.
  assert.equal(remoteAligned.length, 201);
  assert.equal(new Set(versions).size, 201);
});

test("Prod-only ledger versions are back-ported to Git and Git-only versions are explicit candidates", () => {
  const versions = new Set(migrationFiles.map((name) => name.slice(0, 14)));
  // Applied on Prod outside Git until 2026-11-20 (source boundary fix; contact inbox under its Prod version).
  for (const v of ["20260916060806", "20260922130139"]) assert.ok(versions.has(v), v);
  assert.ok(!versions.has("20260922143000"), "contact inbox must use the Prod ledger version");
  // Single forward migration sets the final source boundary (functions + grants); no second variant.
  assert.ok(versions.has("20261120120000"));
  for (const v of ["20260923000000", "20261120000100"]) assert.ok(!versions.has(v), `superseded candidate ${v}`);
  // The Prod-only history version is a no-op placeholder so definitions are applied exactly once.
  const placeholder = readMigration("_fix_public_source_boundary.sql").replace(/^--.*$/gm, "").trim();
  assert.equal(placeholder, "SELECT 1;");
  const forward = readMigration("_align_source_boundary_with_production.sql");
  assert.match(forward, /\$preflight\$/);
  assert.match(forward, /REVOKE ALL ON TABLE public\.sources, public\.entity_sources FROM anon;/);
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
