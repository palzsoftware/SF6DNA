import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

function loadRouteGate(environment) {
  const source = read("src/lib/character-detail-route.ts");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiled = { exports: {} };
  vm.runInNewContext(output, { module: compiled, exports: compiled.exports, process: { env: { VERCEL_ENV: environment } }, Set });
  return compiled.exports.isCharacterDetailV2Route;
}

const allCharacterSlugs = [
  "ryu", "jp", "zangief", "chun-li", "dhalsim", "kimberly", "luke",
  "jamie", "guile", "juri", "ken", "blanka", "e-honda", "dee-jay",
  "manon", "marisa", "lily", "cammy", "rashid", "aki", "ed", "akuma",
  "m-bison", "terry", "mai", "elena", "sagat", "c-viper", "alex", "ingrid", "yasmine",
];

test("all 31 character routes select the V2 shared template in RC Preview", () => {
  const enabled = loadRouteGate("preview");
  for (const slug of allCharacterSlugs) {
    assert.equal(enabled(slug), true);
  }
  assert.equal(enabled("not-a-character"), false);

  const page = read("src/app/characters/[slug]/page.tsx");
  assert.match(page, /isCharacterDetailV2Route\(character\.slug\)/);
  assert.match(page, /pilotProfile\?\.tagline \?\? character\.shortDescription/);
  assert.match(page, /\{pilotBundle && pilotProfile \? \(/);
  assert.doesNotMatch(page, /pilotBundle && previewToken/);
});

test("Production boundary remains closed for all 31 characters", () => {
  const enabled = loadRouteGate("production");
  for (const slug of allCharacterSlugs) {
    assert.equal(enabled(slug), false);
  }
});

test("shared overview navigation exposes all approved sections without legacy source tab", () => {
  const tabs = read("src/components/character-tabs.tsx");
  const pilot = tabs.match(/const pilotV21Tabs:[\s\S]*?\n\];/)?.[0] ?? "";
  for (const label of ["概要", "技", "コンボ", "セットプレイ", "連携・対策", "動画"]) {
    assert.match(pilot, new RegExp(`label: "${label}"`));
  }
  assert.doesNotMatch(pilot, /情報源|プレイヤー|練習/);
  for (const anchor of ["#pilot-overview", "#pilot-moves", "#pilot-combos", "#pilot-setplay", "#pilot-sequences", "#related-videos"]) {
    assert.match(tabs, new RegExp(anchor));
  }
});

test("V2 render contains combo, setplay, sequence-counter and video sections", () => {
  const shared = read("src/components/character-detail-pilot.tsx");
  for (const marker of [
    'id="pilot-combos"',
    'id="pilot-setplay"',
    'id="pilot-sequences"',
    'id="related-videos"',
    "まず確認するコンボ",
    "セットプレイ",
    "連携・対策",
    "おすすめ動画",
  ]) {
    assert.match(shared, new RegExp(marker));
  }
});

test("Preview token is inserted before a section hash", () => {
  const source = read("src/lib/device-preview.ts");
  assert.match(source, /const \[pathAndQuery, hash\] = href\.split\("#", 2\)/);
  assert.match(source, /`\$\{withToken\}#\$\{hash\}`/);
});
