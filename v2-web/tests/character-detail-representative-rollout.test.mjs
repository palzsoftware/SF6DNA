import {renderUnified,character} from './helpers/character-unified-ssr.mjs';
import assert from "node:assert/strict";
import test from "node:test";
import ts from "typescript";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const overviewOnlySlugs = [
  "zangief", "chun-li", "dhalsim", "kimberly",
  "jamie", "guile", "juri", "ken", "blanka", "e-honda", "dee-jay",
  "marisa", "lily", "cammy", "rashid", "aki", "ed", "akuma",
  "m-bison", "terry", "mai", "elena", "sagat", "c-viper", "alex", "ingrid", "yasmine",
];

test("27 overview-only fixtures use empty section data instead of reviewed gameplay data", () => {
  const fixture = read("src/lib/character-detail-v21-fixture.ts");
  for (const slug of overviewOnlySlugs) {
    assert.match(fixture, new RegExp(`"${slug}"`));
  }
  assert.match(fixture, /return \{ \.\.\.sharedEmpty, combos: \[\], setups: \[\], sequences: \[\] \}/);
});

test("shared component receives the adapted profile and renders natural section fallbacks", () => {
  const page = read("src/app/characters/[slug]/page.tsx");
  const tree = ts.createSourceFile('page.tsx', page, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const forwarded = [];
  function visit(node) {
    if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(tree) === 'CharacterUnifiedPage') {
      const prop = node.attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.getText(tree) === 'character');
      forwarded.push(prop?.initializer && ts.isJsxExpression(prop.initializer) ? prop.initializer.expression?.getText(tree) : null);
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  assert.deepEqual(forwarded, ['character']);
  for (const slug of ['ryu','jp','luke','yasmine']) {
    const missing=renderUnified(slug);
    for(const text of ['概要は確認中です。','強みは確認中です。','注意点は確認中です。','英名確認中','技データは確認中です。','使用プレイヤーの情報を確認中です。','関連動画は準備中です。','情報源を確認中です。'])assert.ok(missing.includes(text),text);
    const internal=renderUnified(slug,{character:character(slug,{shortDescription:'baseline internal',strengthsSummary:'publication gated internal',weaknessesSummary:'awaiting official/game verification'})});
    assert.doesNotMatch(internal,/baseline internal|publication gated internal|awaiting official/);
    const valid=renderUnified(slug,{character:character(slug,{shortDescription:'確認済みの概要',strengthsSummary:'確認済みの強み',weaknessesSummary:'確認済みの注意点'})});
    for(const text of ['確認済みの概要','確認済みの強み','確認済みの注意点'])assert.ok(valid.includes(text));
  }

});

test("31-character rollout does not enable production or public strategy content", () => {
  const route = read("src/lib/character-detail-route.ts");
  const flags = read("src/lib/release-features.ts");
  assert.match(route, /VERCEL_ENV === "preview"/);
  assert.match(flags, /publicStrategyContent:\s*false/);
});
