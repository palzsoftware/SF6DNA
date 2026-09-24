import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const overviewOnlySlugs = [
  "zangief", "chun-li", "dhalsim", "kimberly",
  "jamie", "guile", "juri", "ken", "blanka", "e-honda", "dee-jay",
  "manon", "marisa", "lily", "cammy", "rashid", "aki", "ed", "akuma",
  "m-bison", "terry", "mai", "elena", "sagat", "c-viper", "alex", "ingrid", "yasmine",
];

test("28 overview-only fixtures use empty section data instead of reviewed gameplay data", () => {
  const fixture = read("src/lib/character-detail-v21-fixture.ts");
  for (const slug of overviewOnlySlugs) {
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
    "技データは未掲載です。",
    "コンボは未掲載です。",
    "セットプレイは未掲載です。",
    "連携・対策は未掲載です。",
    "距離別の攻略情報は未掲載です。",
    "関連プレイヤーは未掲載です。",
    "関連動画は未掲載です。",
  ]) {
    assert.match(shared, new RegExp(text));
  }
  assert.doesNotMatch(shared, /NO SIGNAL|developer/i);
});

test("31-character rollout does not enable production or public strategy content", () => {
  const route = read("src/lib/character-detail-route.ts");
  const flags = read("src/lib/release-features.ts");
  assert.match(route, /VERCEL_ENV === "preview"/);
  assert.match(flags, /publicStrategyContent:\s*false/);
});
