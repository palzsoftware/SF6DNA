import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const sql = read("../supabase/migrations/20260831044222_phase23_training_practical_foundations.sql");

test("Phase23 practical Training separates internal work queues from end-user drills", () => {
  assert.match(sql, /verification_status = 'unverified'/i, "archive selector must stay limited to unverified Training");
  assert.match(sql, /コンボ・起き攻め再検証/, "generic combo retest queue selector missing");
  assert.match(sql, /中距離・接近手段/, "generic neutral verification queue selector missing");
  assert.match(sql, /確定反撃検証/, "generic punish verification queue selector missing");
  assert.match(sql, /status = 'archived'/i, "internal work queues must be archived");
  assert.doesNotMatch(sql, /set\s+status\s*=\s*'published'/i, "migration must never publish Training");
});

test("canonical foundation drills are character-independent and remain reviewed drafts", () => {
  for (const slug of [
    "foundation-bnb-both-sides",
    "foundation-anti-air-level1",
    "foundation-anti-air-level2",
    "foundation-di-reaction",
    "foundation-raw-dr-check",
    "foundation-random-guard-hit-confirm",
    "foundation-post-block-punish",
    "foundation-max-punish",
    "foundation-whiff-punish",
    "foundation-throw-strike-defense",
    "foundation-corner-defense-mix",
    "foundation-meaty-wakeup",
    "foundation-oki-strike-throw-shimmy",
    "foundation-mental-stack-mix",
  ]) assert.match(sql, new RegExp(slug), `${slug} missing`);

  assert.match(sql, /select r\.slug[\s\S]*null,\s*null,[\s\S]*'reviewed'[\s\S]*'draft'/i,
    "foundation rows must be player-independent reviewed drafts");
  assert.match(sql, /entity_sources/i, "foundation drills must retain Source evidence");
});

test("character-specific source-backed drills stay reviewed, not verified", () => {
  assert.match(sql, /juri-training-hitconfirm/, "Juri Random Guard confirm refinement missing");
  assert.match(sql, /juri-training-di/, "Juri DI mental-stack refinement missing");
  assert.match(sql, /ken-training-di/, "Ken corner DI refinement missing");
  assert.match(sql, /verification_status\s*=\s*'reviewed'/i, "source review must not be promoted to verified");
});

test("Training publication gate requires a reproducible exercise", () => {
  assert.match(sql, /success_criteria is not null/i, "success criteria gate missing");
  assert.match(sql, /duration_minutes is not null/i, "duration gate missing");
  assert.match(sql, /recommended_reps is not null/i, "repetition gate missing");
  assert.match(sql, /recording_instructions/i, "recording setup gate missing");
  assert.match(sql, /playback_settings/i, "playback setup gate missing");
  assert.match(sql, /cpu_settings/i, "CPU setup gate missing");
  assert.match(sql, /reproducible Training Mode settings/i, "publication trigger must reject non-reproducible Training");
  assert.match(sql, /training_verified候補/, "internal verification-result language must stay blocked from publication");
});
