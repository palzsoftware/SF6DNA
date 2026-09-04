import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Phase23 Counter gate archives generic matchup templates and requires release-ready data", () => {
  const sql = read("../supabase/migrations/20260831031346_phase23_counter_publication_hardening.sql");

  assert.match(sql, /update public\.counters/i, "Counter placeholder quarantine missing");
  assert.match(sql, /matchup_plan.*matchup_overview.*matchup_baseline/is, "generic matchup types must be quarantined");
  assert.match(sql, /private\.is_counter_public_ready/i, "Counter public readiness helper missing");
  assert.match(sql, /verification_status = 'verified'/i, "Counter publication must require verified data");
  assert.match(sql, /p\.is_current = true/i, "Counter publication must require current patch");
  assert.match(sql, /entity_type = 'counter'/i, "Counter publication must require Source evidence");
  assert.match(sql, /public read release-ready counters/i, "release-ready Counter RLS policy missing");
  assert.match(sql, /enforce_counter_publication_ready/i, "Counter database publication trigger missing");
});

test("Phase23 generic system Counter templates remain quarantined", () => {
  const sql = read("../supabase/migrations/20260831031448_phase23_counter_generic_system_quarantine.sql");

  assert.match(sql, /verification_status = 'unverified'/i, "only unverified system templates should be quarantined");
  assert.match(sql, /counter_type = 'system'/i, "system-template selector missing");
  assert.match(sql, /status = 'archived'/i, "generic system templates must be archived");
  assert.doesNotMatch(sql, /verification_status\s*=\s*'verified'/i, "quarantine must never promote verification");
  assert.doesNotMatch(sql, /status\s*=\s*'published'/i, "quarantine must never publish content");
});
