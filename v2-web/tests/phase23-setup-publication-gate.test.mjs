import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Phase23 Setup gate quarantines verification placeholders and requires release-ready data", () => {
  const sql = read("../supabase/migrations/20260831032214_phase23_setup_publication_hardening.sql");

  assert.match(sql, /update public\.setups/i, "Setup placeholder quarantine missing");
  assert.match(sql, /verification_status = 'unverified'/i, "quarantine must only target unverified Setup rows");
  assert.match(sql, /status = 'archived'/i, "Setup placeholders must be archived");
  assert.match(sql, /private\.is_setup_public_ready/i, "Setup public readiness helper missing");
  assert.match(sql, /verification_status = 'verified'/i, "published Setup must be verified");
  assert.match(sql, /p\.is_current = true/i, "published Setup must target the current patch");
  assert.match(sql, /entity_type = 'setup'/i, "published Setup must require Source evidence");
  assert.match(sql, /public read release-ready setups/i, "release-ready Setup RLS policy missing");
  assert.match(sql, /enforce_setup_publication_ready/i, "Setup publication trigger missing");
  assert.doesNotMatch(sql, /set\s+verification_status\s*=\s*'verified'/i, "migration must not promote verification");
  assert.doesNotMatch(sql, /set\s+status\s*=\s*'published'/i, "migration must not publish Setup content");
});

test("Phase23 Setup gate quarantines replicated generic templates", () => {
  const sql = read("../supabase/migrations/20260831040728_phase23_setup_generic_template_quarantine.sql");

  assert.match(sql, /private\.is_generic_setup_template/i, "generic Setup classifier missing");
  assert.match(sql, /update public\.setups/i, "generic Setup quarantine missing");
  assert.match(sql, /verification_status = 'unverified'/i, "generic quarantine must only target unverified Setup");
  assert.match(sql, /status = 'archived'/i, "generic Setup templates must be archived");
  assert.match(sql, /生DR → 後ろ歩き \/ 打撃 \/ 投げ/i, "generic DR shimmy template guard missing");
  assert.match(sql, /フレーム消費 → 前ジャンプ攻撃/i, "generic safe-jump template guard missing");
  assert.match(sql, /not private\.is_generic_setup_template/i, "public-ready helper must reject generic Setup templates");
  assert.match(sql, /generic Setup template cannot be published/i, "publish trigger must reject generic Setup templates");
  assert.doesNotMatch(sql, /set\s+verification_status\s*=\s*'verified'/i, "migration must not promote verification");
  assert.doesNotMatch(sql, /set\s+status\s*=\s*'published'/i, "migration must not publish Setup content");
});

test("Phase23 generic Setup classifier pins search_path", () => {
  const sql = read("../supabase/migrations/20260831040834_phase23_setup_template_classifier_search_path.sql");

  assert.match(sql, /alter function private\.is_generic_setup_template/i, "classifier search_path migration missing");
  assert.match(sql, /set search_path = pg_catalog/i, "classifier search_path must be pinned");
});
