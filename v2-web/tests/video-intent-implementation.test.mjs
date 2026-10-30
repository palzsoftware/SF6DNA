import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function loadParser() {
  function load(path, imports = {}) {
    const output = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    const compiled = { exports: {} };
    vm.runInNewContext(output, { module: compiled, exports: compiled.exports, require(name) { assert.ok(name in imports, name); return imports[name]; } });
    return compiled.exports;
  }
  const aliases = load("src/lib/video-event-aliases.ts");
  const registry = load("src/lib/video-learning-registry.ts");
  const learning = load("src/lib/video-learning.ts", { "@/lib/video-learning-registry": registry });
  return load("src/lib/video-intent.ts", { "@/lib/video-event-aliases": aliases, "@/lib/video-learning": learning }).parseVideoIntent;
}

test("parser decomposes natural-language examples and leaves typos untouched", () => {
  const parse = loadParser();
  const jp = parse("JP SA2 上級者");
  assert.equal([...jp.characters].join(","), "jp");
  assert.equal([...jp.categories].join(","), "sa2");
  assert.equal([...jp.levels].join(","), "advanced");
  const player = parse("翔 試合");
  assert.equal([...player.players].join(","), "sho");
  assert.equal([...player.modes].join(","), "match");
  const typo = parse("Tokidoo 試合");
  assert.equal(typo.remainingTerms.join(","), "tokidoo");
  assert.ok(typo.suggestions.includes("tokido"));
});

test("video intent parser covers the release examples without automatic replacement", () => {
  const parser = read("src/lib/video-intent.ts");
  for (const value of ["jp", "ryu", "torikore", "sa2", "lethal", "max_damage_combo", "sho", "tokido", "ryusei", "kisaragi_ren", "beginner", "intermediate", "advanced", "match"]) {
    assert.match(parser, new RegExp(`id: "${value}"`));
  }
  const aliases = read("src/lib/video-event-aliases.ts");
  for (const value of ["capcom_cup", "sfl"]) assert.match(aliases, new RegExp(`id: "${value}"`));
  assert.match(parser, /remainingTerms/);
  assert.match(parser, /suggestions/);
});

test("video filters combine parsed intent with explicit group filters", () => {
  const library = read("src/lib/video-library.ts");
  assert.match(library, /parseVideoIntent\(filters\.query\)/);
  assert.match(library, /videoMatchesIntent/);
  assert.match(library, /filters\.levels/);
  assert.match(library, /includesAny\(videoContentCategories\(video\)/);
});

test("100+ library controls retain twelve-item loading and user preferences", () => {
  const component = read("src/components/video-library.tsx");
  const card = read("src/components/video-card.tsx");
  assert.match(component, /setVisible\(\(count\) => count \+ 12\)/);
  assert.match(component, /Favorite|お気に入り/);
  assert.match(component, /視聴済み/);
  assert.match(card, /navigator\.share/);
});

test("recommended and view-count sorts are transparent and unknown-safe", () => {
  const library = read("src/lib/video-library.ts");
  assert.match(library, /recommendationScore/);
  assert.match(library, /video\.viewCount === null \? 0/);
  assert.match(library, /sort === "view_count"/);
  assert.match(library, /180/);
});
