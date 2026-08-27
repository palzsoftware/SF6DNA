import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

function readProjectFile(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function segment(source, start, end) {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, `missing segment start: ${start}`);
  const endIndex = end ? source.indexOf(end, startIndex + start.length) : source.length;
  assert.notEqual(endIndex, -1, `missing segment end: ${end}`);
  return source.slice(startIndex, endIndex);
}

function assertPublishedVerified(source, label) {
  assert.match(source, /\.eq\("status",\s*"published"\)/, `${label}: published gate missing`);
  assert.match(source, /\.eq\("verification_status",\s*"verified"\)/, `${label}: verified gate missing`);
}

test("strategy detail getters require published + verified", () => {
  const source = readProjectFile("src/lib/content-detail.ts");
  const functions = [
    ["getComboBySlug", "getSetupBySlug"],
    ["getSetupBySlug", "getSequenceBySlug"],
    ["getSequenceBySlug", "getCounterBySlug"],
    ["getCounterBySlug", "getTrainingBySlug"],
    ["getTrainingBySlug", null],
  ];

  for (const [name, next] of functions) {
    assertPublishedVerified(
      segment(source, `export async function ${name}`, next ? `export async function ${next}` : null),
      name,
    );
  }
});

test("character strategy sections require published + verified", () => {
  const source = readProjectFile("src/lib/character-sections.ts");
  const sections = [
    ["combos", "setups"],
    ["setups", "sequences"],
    ["sequences", "matchups"],
    ["matchups", "training"],
    ["training", "players"],
  ];

  for (const [name, next] of sections) {
    assertPublishedVerified(
      segment(source, `if (section === "${name}")`, `if (section === "${next}")`),
      `character section ${name}`,
    );
  }
});

test("recommendation requires verified sourced trait scores", () => {
  const source = readProjectFile("src/lib/character-recommendations.ts");
  assert.match(source, /\.from\("character_trait_scores"\)/);
  assertPublishedVerified(source, "character recommendation");
  assert.match(source, /\.eq\("entity_type",\s*"character_trait_score"\)/, "trait score source gate missing");
  assert.match(source, /sourcedScoreIds\.has\(String\(row\.id\)\)/, "sourced score filter missing");
  assert.match(source, /Math\.ceil\(activeEntries\.length \* 0\.75\)/, "75% coverage gate missing");
});

test("coach retrieval only returns sourced evidence and keeps generation disabled", () => {
  const source = readProjectFile("src/app/api/coach/retrieve/route.ts");
  assert.match(source, /filter\(\(item\) => item\.sources\.length > 0\)/, "sourceless evidence filter missing");
  assert.match(source, /Boolean\(currentPatch && evidence\.length\)/, "current patch readiness gate missing");
  assert.match(source, /generationEnabled:\s*false/, "generation must remain disabled");
});

test("player and video public loaders require published status", () => {
  const players = readProjectFile("src/lib/players.ts");
  const media = readProjectFile("src/lib/event-media.ts");
  assert.match(players, /\.from\("players"\)[\s\S]*?\.eq\("status",\s*"published"\)/);
  assert.match(media, /listVideos[\s\S]*?\.from\("videos"\)[\s\S]*?\.eq\("status",\s*"published"\)/);
  assert.match(media, /getVideoBySlug[\s\S]*?\.from\("videos"\)[\s\S]*?\.eq\("status",\s*"published"\)/);
});

test("sitemap only includes verified strategy entities", () => {
  const source = readProjectFile("src/app/sitemap.ts");
  for (const table of ["combos", "setups", "sequences", "counters", "trainings"]) {
    const tableStart = source.indexOf(`.from("${table}")`);
    assert.notEqual(tableStart, -1, `sitemap missing ${table}`);
    const query = source.slice(tableStart, tableStart + 220);
    assert.match(query, /\.eq\("status",\s*"published"\)/, `${table}: sitemap published gate missing`);
    assert.match(query, /\.eq\("verification_status",\s*"verified"\)/, `${table}: sitemap verified gate missing`);
  }
  assert.doesNotMatch(source, /sf6dna\.(com|net|jp)/i, "sitemap must not guess a production domain");
});

test("latest search RPC keeps strategy published + verified gate", () => {
  const migrationsUrl = new URL("../../supabase/migrations/", import.meta.url);
  const sql = readdirSync(migrationsUrl)
    .filter((name) => name.endsWith(".sql"))
    .sort()
    .map((name) => readFileSync(new URL(name, migrationsUrl), "utf8"))
    .join("\n");

  const definitions = [...sql.matchAll(/create\s+or\s+replace\s+function\s+public\.search_sf6dna/gi)];
  assert.ok(definitions.length > 0, "search_sf6dna migration not found");
  const latestIndex = definitions.at(-1).index;
  const latestRpc = sql.slice(latestIndex);
  const guardedStrategies = latestRpc.match(/status\s*=\s*'published'\s+and\s+x\.verification_status\s*=\s*'verified'/gi) ?? [];
  assert.ok(guardedStrategies.length >= 5, "search RPC must gate all strategy entity types");
});
