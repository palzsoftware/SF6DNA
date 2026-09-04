import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Phase23 Combo public gate quarantines non-actionable placeholders", () => {
  const sql = read("../supabase/migrations/20260831030741_phase23_combo_publication_hardening.sql");

  assert.match(sql, /update public\.combos/i, "placeholder quarantine update missing");
  assert.match(sql, /verification_status = 'unverified'/i, "quarantine must only target unverified placeholders");
  assert.match(sql, /status = 'archived'/i, "placeholder candidates must be archived, not published");
  assert.match(sql, /private\.is_combo_public_ready/i, "Combo public readiness helper missing");
  assert.match(sql, /p\.is_current = true/i, "Combo gate must require current patch");
  assert.match(sql, /verification_status = 'verified'/i, "Combo gate must require verified content");
  assert.match(sql, /entity_type = 'combo'/i, "Combo gate must require Source evidence");
  assert.match(sql, /public read release-ready combos/i, "release-ready Combo RLS policy missing");
});

test("Phase23 Combo publication trigger rejects placeholder publication", () => {
  const sql = read("../supabase/migrations/20260831030826_phase23_combo_publish_trigger.sql");

  assert.match(sql, /enforce_combo_publication_ready/i, "Combo publication trigger missing");
  assert.match(sql, /placeholder combo notation cannot be published/i, "placeholder rejection missing");
  assert.match(sql, /published combo must target the current patch/i, "current-patch rejection missing");
  assert.match(sql, /published combo requires Source evidence/i, "Source-evidence rejection missing");
  assert.match(sql, /before insert or update/i, "database boundary enforcement missing");
});
