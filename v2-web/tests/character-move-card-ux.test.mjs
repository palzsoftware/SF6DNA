import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const pilot = read("src/components/character-detail-pilot.tsx");
const css = read("src/components/character-detail-pilot.module.css");
const explorer = read("src/components/character-move-explorer.tsx");
const filter = read("src/lib/character-move-filter.ts");

test("desktop move cards use a bounded two-column density and larger media track", () => {
  assert.match(css, /grid-template-columns:\s*minmax\(230px,\.82fr\) minmax\(0,1\.18fr\)/);
  assert.match(css, /grid-template-areas:\s*"identity commands" "media frame" "media actions"/);
  assert.match(css, /\.moveMedia[^}]*max-width:\s*420px/);
  assert.doesNotMatch(css, /minmax\(280px,1\.35fr\) minmax\(230px,1fr\)/);
});

test("move explorer exposes category and explicit Classic/Modern controls", () => {
  assert.match(explorer, /aria-label="技のカテゴリ"/);
  assert.match(explorer, /aria-label="操作タイプ"/);
  assert.match(explorer, /クラシック/);
  assert.match(explorer, /モダン/);
  assert.match(filter, /matchesMoveScheme/);
  assert.match(filter, /"modern_simple", "modern_manual", "modern_assist"/);
  assert.doesNotMatch(filter, /startsWith\("modern_"\)/);
  assert.match(filter, /if \(!hasClassic && !hasModern\) return true;/);
});

test("Modern subtypes are presentation-only unless the command scheme explicitly identifies them", () => {
  for (const label of ["モダン・シンプル", "モダン・マニュアル", "モダン・アシスト"]) assert.match(pilot, new RegExp(label));
  assert.doesNotMatch(pilot, /AUTO\(HOLD\)|assist_combo/i);
});

test("throw cards suppress on-block while pending and official N/A remain distinct elsewhere", () => {
  assert.match(pilot, /const isThrow = move\.moveType === "throw"/);
  assert.match(pilot, /!isThrow \? <div><dt>ガード時<\/dt>/);
  assert.match(pilot, /OFFICIAL_NA" \? "—" : "確認中"/);
});

test("move cards expose gated receivers for combo, setup and counter content", () => {
  assert.match(pilot, /className=\{styles\.moveStrategyLinks\}/);
  assert.ok(pilot.includes(`/characters/\${characterSlug}/combos`));
  assert.match(pilot, /href="#pilot-setplay">セットプレイ<\/Link>/);
  assert.match(pilot, /href="#pilot-sequences">対策<\/Link>/);
  assert.match(pilot, /strategyListAvailable/);
  assert.match(pilot, /<Sf6CommandInput value=\{label\.input\} \/>/);
});

test("mobile card layout remains one column without overflow hiding", () => {
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?grid-template-areas:\s*"identity" "media" "commands" "frame" "actions"/);
  assert.match(css, /\.moveCommands code\s*\{[^}]*overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(css, /overflow-x:\s*(?:hidden|clip)/);
});
