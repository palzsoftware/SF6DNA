import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sql = readFileSync(
  new URL("../../supabase/quality/phase14_public_readiness.sql", import.meta.url),
  "utf8",
);
const executableSql = sql
  .replace(/--.*$/gm, "")
  .replace(/\/\*[\s\S]*?\*\//g, "");

test("Phase14 quality automation is strictly read-only", () => {
  assert.doesNotMatch(
    executableSql,
    /\b(insert|update|delete|merge|alter|drop|truncate|create|grant|revoke|call|do)\b/i,
  );
  assert.match(executableSql, /^\s*with\b/i);
  assert.match(executableSql, /\bselect\b/i);
});

test("quality report separates inventory from release readiness", () => {
  for (const field of [
    "total", "draft", "reviewed", "verified", "published",
    "published_verified", "sourced", "current_patch", "release_ready",
  ]) {
    assert.match(sql, new RegExp(`\\b${field}\\b`), `missing quality field: ${field}`);
  }
  assert.match(sql, /status='published'[\s\S]*verification_status='verified'[\s\S]*source_count > 0[\s\S]*valid_from_patch_id=/);
});

test("quality report covers all required public entities", () => {
  for (const entity of [
    "characters", "moves", "move_frame_data", "move_commands",
    "combos", "setups", "sequences", "counters", "trainings",
    "character_trait_scores", "players", "videos",
  ]) {
    assert.match(sql, new RegExp(`public\\.${entity}\\b`), `missing entity: ${entity}`);
  }
  for (const metric of [
    "has_frame", "has_verified_frame", "has_classic", "has_modern",
    "with_character_relation", "with_source_relation",
    "recommendation_ready_candidates", "ai_coach_source_evidence_entities",
  ]) {
    assert.match(sql, new RegExp(`\\b${metric}\\b`), `missing metric: ${metric}`);
  }
});

test("31-character coverage includes every requested content category", () => {
  const start = sql.indexOf("character_coverage as");
  const coverage = sql.slice(start, sql.indexOf("summary as", start));
  for (const metric of [
    "moves", "frames", "classic", "modern", "combos", "setups", "sequences",
    "counters", "trainings", "players", "videos", "trait_scores",
    "release_ready_moves", "release_ready_strategies",
  ]) {
    assert.match(coverage, new RegExp(`\\b${metric}\\b`), `missing character coverage: ${metric}`);
  }
  assert.match(coverage, /c\.status='published' and c\.is_playable=true/);
  assert.match(sql, /strategy_character_links as/);
  assert.match(sql, /defender_character_id[\s\S]*opponent_character_id/);
  assert.match(sql, /player_character_id[\s\S]*dummy_character_id/);
});
