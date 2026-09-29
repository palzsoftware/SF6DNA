import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const dataSource = read("src/lib/pre-release-character.ts");
const compiled = ts.transpileModule(dataSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function load(environment) {
  const loaded = { exports: {} };
  new Function("module", "exports", "process", compiled)(loaded, loaded.exports, { env: { VERCEL_ENV: environment } });
  return loaded.exports.getPreReleaseCharacter;
}

test("Arjun source data can only be loaded in RC Preview", () => {
  for (const environment of ["production", "development", undefined]) {
    assert.equal(load(environment)("arjun"), null);
  }
  const preview = load("preview");
  assert.equal(preview("ryu"), null);
  const arjun = preview("arjun");
  assert.equal(arjun.name, "アルジュン");
  assert.equal(arjun.bundle.moves.length, 9);
  assert.ok(arjun.bundle.moves.every(move => move.status === "draft" && move.commands.length === 0 && move.frame === null && !move.media));
  for (const section of ["combos", "setups", "sequences", "matchups", "training"]) {
    assert.deepEqual(arjun.bundle[section], []);
  }
});

test("internal route reuses Character Detail, remains unindexed, and never enters public discovery", () => {
  const page = read("src/app/internal/character-preview/[slug]/page.tsx");
  assert.match(page, /getPreReleaseCharacter\(slug\)/);
  assert.match(page, /if \(!character\) notFound\(\)/);
  assert.match(page, /<CharacterDetailPilot[\s\S]*?preRelease/);
  assert.match(page, /robots: \{ index: false, follow: false, noarchive: true \}/);
  const shared = read("src/components/character-detail-pilot.tsx");
  assert.match(shared, /!preRelease \? <section className=\{styles\.comboSection\}/);
  for (const path of ["src/lib/character-detail-route.ts", "src/lib/character-detail-v21-fixture.ts", "src/app/sitemap.ts", "src/lib/character-recommendations.ts"]) {
    assert.doesNotMatch(read(path), /["']arjun["']/i, path);
  }
});
