import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const sql = readFileSync(
  new URL("../../supabase/quality/phase14_public_readiness.sql", import.meta.url),
  "utf8",
);
const modernSql = readFileSync(
  new URL("../../supabase/quality/phase14_modern_command_gaps.sql", import.meta.url),
  "utf8",
);
const flyingPartySeed = readFileSync(
  new URL("../../supabase/seeds/20260828_phase14_deejay_flying_party_modern.sql", import.meta.url),
  "utf8",
);
const dhalsimCanonicalSeed = readFileSync(
  new URL("../../supabase/seeds/20260828_phase14_dhalsim_long_slide_canonicalization.sql", import.meta.url),
  "utf8",
);
const jpCrouchingMpSeed = readFileSync(
  new URL("../../supabase/seeds/20260828_phase14_jp_crouching_mp_modern.sql", import.meta.url),
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
  assert.match(sql, /from public\.moves m\s+where m\.status <> 'archived'/);
});

test("Modern Command gap audit stays read-only and does not infer commands", () => {
  const executable = modernSql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(executable, /\b(insert|update|delete|merge|alter|drop|truncate|create|grant|revoke|call|do)\b/i);
  assert.match(modernSql, /control_scheme='modern'/);
  assert.match(modernSql, /missing_modern_with_official_move_source/);
  assert.match(modernSql, /official_classic_command_sources/);
  assert.doesNotMatch(modernSql, /command_text\s*=|numeric_notation\s*=/i);
});

test("verified Flying Party Modern seed stays narrow, sourced, and idempotent", () => {
  assert.match(flyingPartySeed, /m\.slug = 'dee-jay-capcom-frame-029'/);
  assert.match(flyingPartySeed, /'中攻撃 > 中攻撃', 'M>M', 'M>M'/);
  assert.match(flyingPartySeed, /character\/deejay\/movelist/);
  assert.match(flyingPartySeed, /reliability_level = 'official'/);
  assert.match(flyingPartySeed, /where not exists[\s\S]*control_scheme = 'modern'/);
  assert.match(flyingPartySeed, /on conflict \(entity_type, entity_id, source_id\) do nothing/);
  assert.doesNotMatch(flyingPartySeed, /update\s+public\.(moves|character_content_packages)/i);
  assert.doesNotMatch(flyingPartySeed, /verification_status\s*=|status\s*=\s*'published'/i);
});

test("Dhalsim duplicate consolidation is narrow, reversible, and preserves verification", () => {
  assert.match(dhalsimCanonicalSeed, /dhalsim-crouching-hk/);
  assert.match(dhalsimCanonicalSeed, /dhalsim-capcom-frame-031/);
  assert.match(dhalsimCanonicalSeed, /numeric_notation = '3\+H'/);
  assert.match(dhalsimCanonicalSeed, /reliability_level = 'official'/);
  assert.match(dhalsimCanonicalSeed, /update public\.move_commands[\s\S]*set move_id = canonical_move_id/);
  assert.match(dhalsimCanonicalSeed, /set status = 'archived'/);
  assert.match(dhalsimCanonicalSeed, /on conflict \(move_id, normalized_alias\) do nothing/);
  assert.doesNotMatch(dhalsimCanonicalSeed, /\bdelete\b|verification_status\s*=|status\s*=\s*'published'/i);
});

test("verified JP crouching MP Modern seed stays narrow, sourced, and idempotent", () => {
  const executable = jpCrouchingMpSeed.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.match(jpCrouchingMpSeed, /m\.slug = 'jp-crouching-mp'/);
  assert.match(jpCrouchingMpSeed, /'↓ \+ 中攻撃'/);
  assert.match(jpCrouchingMpSeed, /'2M'/);
  assert.match(jpCrouchingMpSeed, /character\/jp\/frame/);
  assert.match(jpCrouchingMpSeed, /reliability_level = 'official'/);
  assert.match(jpCrouchingMpSeed, /where existing\.move_id = m\.id[\s\S]*existing\.control_scheme = 'modern'/);
  assert.match(jpCrouchingMpSeed, /on conflict \(entity_type, entity_id, source_id\) do nothing/);
  assert.doesNotMatch(executable, /\b(update|delete|merge|alter|drop|truncate)\b|status\s*=\s*'published'/i);
});
