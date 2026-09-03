import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("personal tools preserve the high-value legacy feature set", () => {
  const tools = read("src/app/tools/page.tsx");
  for (const route of ["/favorites", "/my-characters", "/compare", "/rank-tracker", "/diagnosis/history"]) {
    assert.ok(tools.includes(route), `missing tool route ${route}`);
  }
});

test("local user data remains browser-only and does not bypass Supabase gates", () => {
  const storage = read("src/lib/local-user-tools.ts");
  assert.ok(storage.includes("window.localStorage"));
  assert.ok(storage.includes("sf6dna_v2_favorite_characters"));
  assert.ok(storage.includes("sf6dna_v2_character_status"));
  assert.ok(storage.includes("sf6dna_v2_rank_history"));
  assert.ok(storage.includes("sf6dna_v2_diagnosis_history"));
  assert.ok(!storage.includes("getSupabase"));
});

test("character detail exposes favorite and usage status controls", () => {
  const detail = read("src/app/characters/[slug]/page.tsx");
  assert.ok(detail.includes("CharacterPreferenceActions"));
});

test("diagnosis completion stores history without changing recommendation gates", () => {
  const runner = read("src/components/diagnosis-runner.tsx");
  assert.ok(runner.includes("saveDiagnosisHistory"));
  assert.ok(runner.includes("/api/diagnosis/recommend"));
});

test("public source directory excludes internal candidate evidence", () => {
  const sources = read("src/lib/public-sources.ts");
  assert.ok(sources.includes("list_public_sources"));
  assert.ok(!sources.includes('"internal_candidate"'));
});
