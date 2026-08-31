import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Phase23 Setup gate quarantines verification placeholders and requires release-ready data", () => {
  const sql = read("../supabase/migrations/20260831_phase23_setup_publication_hardening.sql");

  assert.match(sql, /update public\.setups/i, "Setup placeholder quarantine missing");
  assert.match(sql, /verification_status = 'unverified'/i, "quarantine must only target unverified Setup rows");
  assert.match(sql, /status = 'archived'/i, "Setup placeholders must be archived");
  assert.match(sql, /private\.is_setup_public_ready/i, "Setup public readiness helper missing");
  assert.match(sql, /verification_status = 'verified'/i, "published Setup must be verified");
  assert.match(sql, /p\.is_current = true/i, "published Setup must target the current patch");
  assert.match(sql, /entity_type = 'setup'/i, "published Setup must require Source evidence");
  assert.match(sql, /public read release-ready setups/i, "release-ready Setup RLS policy missing");
  assert.match(sql, /enforce_setup_publication_ready/i, "Setup publication trigger missing");
  assert.doesNotMatch(sql, /verification_status\s*=\s*'verified'\s*,/i, "migration must not promote verification");
  assert.doesNotMatch(sql, /status\s*=\s*'published'/i, "migration must not publish Setup content");
});
