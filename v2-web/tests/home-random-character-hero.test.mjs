import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const helperSource = readFileSync(new URL("../src/lib/home-hero.ts", import.meta.url), "utf8");
const imageSource = readFileSync(new URL("../src/lib/legacy-character-images.ts", import.meta.url), "utf8");
const js = ts.transpileModule(helperSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const loadedModule = { exports: {} };
new Function("module", "exports", "require", js)(loadedModule, loadedModule.exports, () => ({}));
const { pickRandomHeroCharacters } = loadedModule.exports;

const characters = Array.from({ length: 31 }, (_, index) => ({ id: String(index), slug: `c${index}`, name: `C${index}`, imageUrl: `/c${index}.png` }));

test("hero pool uses all 31 implemented character image mappings", () => {
  const mappingCount = (imageSource.match(/^  (?:"[^"]+"|[a-z][a-z0-9-]*):/gm) ?? []).length;
  assert.equal(mappingCount, 31);
  assert.match(imageSource, /LEGACY_CHARACTER_IMAGE_SLUGS/);
});

test("hero returns three unique characters and excludes missing images", () => {
  const selected = pickRandomHeroCharacters([...characters, { id: "missing", slug: "missing", name: "Missing", imageUrl: null }], 3, () => 0.42);
  assert.equal(selected.length, 3);
  assert.equal(new Set(selected.map((item) => item.slug)).size, 3);
  assert.ok(selected.every((item) => item.imageUrl));
});

test("different random streams can produce different selections", () => {
  const first = pickRandomHeroCharacters(characters, 3, () => 0);
  const second = pickRandomHeroCharacters(characters, 3, () => 0.999999);
  assert.notDeepEqual(first.map((item) => item.slug), second.map((item) => item.slug));
});
