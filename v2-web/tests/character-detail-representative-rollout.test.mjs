import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("representative fixtures use empty section data instead of Ryu or JP gameplay data", () => {
  const fixture = read("src/lib/character-detail-v21-fixture.ts");
  for (const slug of ["zangief", "chun-li", "dhalsim", "kimberly", "luke"]) {
    assert.match(fixture, new RegExp(`"${slug}"`));
  }
  assert.match(fixture, /return \{ \.\.\.sharedEmpty, combos: \[\], setups: \[\], sequences: \[\] \}/);
});

test("shared component receives the adapted profile and renders natural section fallbacks", () => {
  const page = read("src/app/characters/[slug]/page.tsx");
  const shared = read("src/components/character-detail-pilot.tsx");
  assert.match(page, /adaptCharacterDetailV2Profile/);
  assert.match(page, /profile=\{pilotProfile\}/);
  for (const text of [
    "表示できる基本方針はありません。",
    "表示できる技データはありません。",
    "確認対象のコンボ候補はありません。",
    "確認対象のセットプレイ候補はありません。",
    "確認対象の連携候補はありません。",
    "表示できる距離別の攻略情報はありません。",
    "表示できる関連プレイヤーはありません。",
    "表示できる関連動画はありません。",
  ]) {
    assert.match(shared, new RegExp(text));
  }
  assert.doesNotMatch(shared, /NO SIGNAL|developer/i);
});

test("representative rollout does not enable production or public strategy content", () => {
  const route = read("src/lib/character-detail-route.ts");
  const flags = read("src/lib/release-features.ts");
  assert.match(route, /VERCEL_ENV === "preview"/);
  assert.match(flags, /publicStrategyContent:\s*false/);
});
