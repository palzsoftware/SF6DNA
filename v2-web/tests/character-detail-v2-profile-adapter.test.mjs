import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

function loadModule(path) {
  const source = read(path);
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiled = { exports: {} };
  vm.runInNewContext(output, { module: compiled, exports: compiled.exports, Array });
  return compiled.exports;
}

function character(overrides = {}) {
  return {
    id: "character-id",
    slug: "zangief",
    name: "ザンギエフ",
    nameEn: "Zangief",
    shortDescription: "長い通常技で近づき、近距離で投げを狙うキャラクターです。",
    imageUrl: null,
    difficulty: 3,
    rangeLabel: "近距離",
    archetypeLabel: "投げ・接近型",
    releaseDate: null,
    updatedAt: null,
    strengthsSummary: "一回の読み勝ちから高いダメージを狙えます。",
    weaknessesSummary: "離れた相手へ近づくまでに時間がかかります。",
    guideSections: [],
    sources: [],
    ...overrides,
  };
}

test("common adapter maps only existing Character fields and opens a safe shell", () => {
  const { adaptCharacterDetailV2Profile } = loadModule("src/lib/character-detail-v2-profile-adapter.ts");
  const result = adaptCharacterDetailV2Profile({ character: character() });
  assert.equal(result.readiness, "SOURCE_REQUIRED");
  assert.equal(result.canRenderV2, true);
  assert.equal(result.shell.characterName, "ザンギエフ");
  assert.equal(result.shell.firstTraining, null);
  assert.deepEqual(Array.from(result.missingFields), ["firstTraining", "gameplan", "rangeActions"]);
  assert.equal(result.profile.tagline, result.shell.heroTitle);
  assert.equal(result.profile.firstLesson, "最初の練習メニューは未掲載です。");
  assert.deepEqual(Array.from(result.profile.gameplan), []);
  assert.deepEqual(Array.from(result.profile.ranges), []);
});

test("missing overview blocks V2 instead of inventing Hero copy", () => {
  const { adaptCharacterDetailV2Profile } = loadModule("src/lib/character-detail-v2-profile-adapter.ts");
  const result = adaptCharacterDetailV2Profile({ character: character({ shortDescription: null }) });
  assert.equal(result.readiness, "BLOCKED");
  assert.equal(result.canRenderV2, false);
  assert.ok(result.missingFields.includes("heroTitle"));
});

test("a dedicated reviewed profile can render without copying Ryu or JP data", () => {
  const { adaptCharacterDetailV2Profile } = loadModule("src/lib/character-detail-v2-profile-adapter.ts");
  const dedicatedProfile = {
    tagline: "固有説明",
    winPath: "固有方針",
    firstLesson: "固有練習",
    strength: "固有の強み",
    weakness: "固有の注意点",
    gameplan: [],
    ranges: [],
  };
  const result = adaptCharacterDetailV2Profile({ character: character(), dedicatedProfile });
  assert.equal(result.readiness, "READY");
  assert.equal(result.canRenderV2, true);
  assert.equal(result.shell.firstTraining, "固有練習");
});

test("section fallback uses natural Japanese and never falls back to the legacy page", () => {
  const { getCharacterDetailV2Fallback, hasRenderableCharacterDetailV2Data } = loadModule("src/lib/character-detail-v2-fallback.ts");
  for (const section of ["moves", "combos", "setups", "sequences", "videos", "players", "sources"]) {
    const copy = getCharacterDetailV2Fallback(section);
    assert.ok(copy.endsWith("。"));
    assert.doesNotMatch(copy, /undefined|null|NO SIGNAL|developer|準備中/i);
  }
  assert.equal(hasRenderableCharacterDetailV2Data([]), false);
  assert.equal(hasRenderableCharacterDetailV2Data(null), false);
  assert.equal(hasRenderableCharacterDetailV2Data([{}]), true);
  const route = read("src/lib/character-detail-route.ts");
  for (const slug of ["ryu", "jp", "zangief", "chun-li", "dhalsim", "kimberly", "luke"]) {
    assert.match(route, new RegExp(`"${slug}"`));
  }
});
