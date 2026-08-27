import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readProjectFile(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("strategy details expose patch, verification, and source metadata", () => {
  const source = readProjectFile("src/lib/content-detail.ts");
  assert.match(source, /function getReleaseMetadata/);
  assert.match(source, /\.from\("entity_sources"\)/, "strategy source lookup missing");
  assert.match(source, /\.from\("patches"\)/, "strategy patch lookup missing");
  assert.match(source, /\["Verification",\s*verificationStatus\]/, "verification display metadata missing");
  assert.match(source, /\["Patch",/, "patch display metadata missing");

  for (const [getter, entityType] of [
    ["getComboBySlug", "combo"],
    ["getSetupBySlug", "setup"],
    ["getSequenceBySlug", "sequence"],
    ["getCounterBySlug", "counter"],
    ["getTrainingBySlug", "training"],
  ]) {
    const start = source.indexOf(`export async function ${getter}`);
    assert.notEqual(start, -1, `${getter} missing`);
    const next = source.indexOf("export async function ", start + 24);
    const block = source.slice(start, next === -1 ? source.length : next);
    assert.match(block, new RegExp(`getReleaseMetadata\\(\\"${entityType}\\"`), `${getter}: release metadata integration missing`);
    assert.match(block, /sources:\s*release\.sources/, `${getter}: sources are not exposed`);
  }
});

test("video public integration never promotes draft videos or draft characters", () => {
  const source = readProjectFile("src/lib/event-media.ts");
  const listStart = source.indexOf("export async function listVideos");
  const detailStart = source.indexOf("export async function getVideoBySlug");
  assert.notEqual(listStart, -1);
  assert.notEqual(detailStart, -1);

  const listBlock = source.slice(listStart, source.indexOf("export async function getTournamentBySlug", listStart));
  const detailBlock = source.slice(detailStart);
  assert.match(listBlock, /\.eq\("status",\s*"published"\)/, "video list published gate missing");
  assert.match(detailBlock, /\.eq\("status",\s*"published"\)/, "video detail published gate missing");
  assert.match(detailBlock, /\.eq\("entity_type",\s*"character"\)/, "video character relation scope missing");
  assert.match(detailBlock, /\.from\("characters"\)[\s\S]*?\.eq\("status",\s*"published"\)/, "related character published gate missing");
});

test("player public integration excludes draft players and draft linked characters", () => {
  const source = readProjectFile("src/lib/players.ts");
  assert.match(source, /listPlayers[\s\S]*?\.from\("players"\)[\s\S]*?\.eq\("status",\s*"published"\)/);
  assert.match(source, /getPlayerBySlug[\s\S]*?\.from\("players"\)[\s\S]*?\.eq\("status",\s*"published"\)/);
  assert.match(source, /character\.status\s*!==\s*"published"/, "linked draft characters must be excluded");
});

test("recommendation returns a safe empty state when verified sourced coverage is absent", () => {
  const engine = readProjectFile("src/lib/character-recommendations.ts");
  const route = readProjectFile("src/app/api/diagnosis/recommend/route.ts");
  assert.match(engine, /if \(!sourcedScoreIds\.size\) return \[\]/, "sourceless recommendation fallback missing");
  assert.match(engine, /\.filter\(\(item\) => item\.reasons\.length >= minimumMappedTraits/, "coverage filter missing");
  assert.match(route, /ready:\s*recommendations\.length > 0/, "recommendation readiness flag missing");
  assert.match(route, /verified \+ published/, "safe insufficiency message missing");
});

test("AI coach remains retrieval-only and refuses unsourced evidence", () => {
  const source = readProjectFile("src/app/api/coach/retrieve/route.ts");
  assert.match(source, /filter\(\(item\) => item\.sources\.length > 0\)/, "unsourced coach evidence filter missing");
  assert.match(source, /generationEnabled:\s*false/, "AI generation must remain disabled");
  assert.match(source, /ready:\s*Boolean\(currentPatch && evidence\.length\)/, "coach readiness requires patch and evidence");
});
