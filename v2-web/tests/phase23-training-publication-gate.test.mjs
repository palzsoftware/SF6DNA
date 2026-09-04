import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Phase23 Training gate quarantines generic verification-only matchup templates", () => {
  const sql = read("../supabase/migrations/20260831031639_phase23_training_publication_hardening.sql");

  assert.match(sql, /update public\.trainings/i, "Training template quarantine missing");
  assert.match(sql, /verification_status = 'unverified'/i, "quarantine must only target unverified Training");
  assert.match(sql, /status = 'archived'/i, "generic Training templates must be archived");
  assert.match(sql, /private\.is_training_public_ready/i, "Training public readiness helper missing");
  assert.match(sql, /verification_status = 'verified'/i, "published Training must be verified");
  assert.match(sql, /p\.is_current = true/i, "published Training must target current patch");
  assert.match(sql, /entity_type = 'training'/i, "published Training must require Source evidence");
  assert.match(sql, /public read release-ready trainings/i, "release-ready Training RLS policy missing");
  assert.match(sql, /enforce_training_publication_ready/i, "Training publication trigger missing");
});

test("Phase23 remaining matchup QA work queues cannot leak into public Training", () => {
  const sql = read("../supabase/migrations/20260831031803_phase23_training_matchup_template_quarantine.sql");

  assert.match(sql, /training_type = 'matchup'/i, "matchup QA selector missing");
  assert.match(sql, /verification_status = 'unverified'/i, "only unverified matchup QA rows should be archived");
  assert.match(sql, /next_step ilike '%Counter%昇格%'/i, "internal Counter-promotion work queue selector missing");
  assert.match(sql, /status = 'archived'/i, "internal matchup QA rows must be archived");
  assert.match(sql, /not ilike '%Counter%昇格%'/i, "public readiness must reject internal Counter-promotion work queues");
  assert.match(sql, /internal Counter-verification training cannot be published/i, "publication trigger rejection missing");
});
