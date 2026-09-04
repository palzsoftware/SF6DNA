import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Phase23 Sequence gate quarantines generic work queues and requires release-ready data", () => {
  const sql = read("../supabase/migrations/20260831032355_phase23_sequence_publication_hardening.sql");

  assert.match(sql, /update public\.sequences/i, "Sequence placeholder quarantine missing");
  assert.match(sql, /verification_status = 'unverified'/i, "quarantine must only target unverified Sequence rows");
  assert.match(sql, /status = 'archived'/i, "Sequence placeholders must be archived");
  assert.match(sql, /private\.is_sequence_public_ready/i, "Sequence public readiness helper missing");
  assert.match(sql, /verification_status = 'verified'/i, "published Sequence must be verified");
  assert.match(sql, /p\.is_current = true/i, "published Sequence must target the current patch");
  assert.match(sql, /entity_type = 'sequence'/i, "published Sequence must require Source evidence");
  assert.match(sql, /public read release-ready sequences/i, "release-ready Sequence RLS policy missing");
  assert.match(sql, /enforce_sequence_publication_ready/i, "Sequence publication trigger missing");
  assert.doesNotMatch(sql, /set\s+verification_status\s*=\s*'verified'/i, "migration must not promote Sequence verification");
  assert.doesNotMatch(sql, /set\s+status\s*=\s*'published'/i, "migration must not publish Sequence content");
});
