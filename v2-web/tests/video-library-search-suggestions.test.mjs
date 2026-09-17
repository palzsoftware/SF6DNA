import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("video library supports scalable display, AND groups, OR values and requested sorts", async () => {
  const [component, logic] = await Promise.all([
    read("src/components/video-library.tsx"),
    read("src/lib/video-library.ts"),
  ]);
  assert.match(component, /setVisible\(12\)/);
  assert.match(component, /count \+ 12/);
  assert.match(component, /大会・イベント/);
  assert.match(component, /プレイヤー（1P \/ 2P）/);
  assert.match(component, /キャラクター（1P \/ 2P）/);
  assert.match(component, /操作タイプ/);
  assert.match(component, /カテゴリ/);
  assert.match(component, /ガイド \/ 対戦/);
  assert.match(component, /言語/);
  assert.match(component, /お気に入り優先/);
  assert.match(component, /未視聴優先/);
  assert.match(component, /短い順/);
  assert.match(logic, /includesAny\(video\.events, filters\.events\)/);
  assert.match(logic, /values\.some\(\(value\) => selected\.has\(value\)\)/);
  assert.match(logic, /preferenceMatches/);
  assert.match(logic, /\.some\(Boolean\)/);
});

test("video preferences stay local and reversible while Character V2.1 links to the preserved library", async () => {
  const [card, preferences, globalPage, pilot] = await Promise.all([
    read("src/components/video-card.tsx"),
    read("src/lib/video-preferences.ts"),
    read("src/app/videos/page.tsx"),
    read("src/components/character-detail-pilot.tsx"),
  ]);
  assert.match(preferences, /sf6dna:favorite-videos:v1/);
  assert.match(preferences, /sf6dna:watched-videos:v1/);
  assert.match(card, /aria-pressed=\{favorite\}/);
  assert.match(card, /aria-pressed=\{watched\}/);
  assert.match(card, /navigator\.share/);
  assert.match(card, /navigator\.clipboard\.writeText/);
  assert.match(globalPage, /<VideoLibrary videos=\{videos\}/);
  assert.match(pilot, /videos\.slice\(0, 6\)/);
  assert.match(pilot, /`\/characters\/\$\{characterSlug\}\/videos`/);
});

test("missing video metadata is not inferred from titles or URLs", async () => {
  const [loader, component] = await Promise.all([
    read("src/lib/event-media.ts"),
    read("src/components/video-library.tsx"),
  ]);
  assert.match(loader, /Do not infer language, control type, duration, or publisher/);
  assert.match(loader, /channelName: null/);
  assert.match(loader, /durationSeconds: null/);
  assert.match(loader, /language: null/);
  assert.match(component, /metadata待ち/);
});

test("did-you-mean is clickable, thresholded and does not auto-replace", async () => {
  const [page, helper] = await Promise.all([
    read("src/app/search/page.tsx"),
    read("src/lib/search-suggestions.ts"),
  ]);
  assert.match(page, /もしかして/);
  assert.match(page, /href=\{typeHref\(suggestion\.value, "all"\)\}/);
  assert.match(helper, /matchedBy: "alias"/);
  assert.match(helper, /matchedBy: "normalized"/);
  assert.match(helper, /matchedBy: "typo"/);
  assert.match(helper, /score >= threshold/);
  assert.match(helper, /normalizedQuery\.length < 2/);
  assert.doesNotMatch(page, /router\.replace|redirect\(/);
});

test("Ryu, JP, player handles and video category aliases are part of the public suggestion corpus", async () => {
  const [search, helper] = await Promise.all([
    read("src/lib/search.ts"),
    read("src/lib/search-suggestions.ts"),
  ]);
  assert.match(search, /ryu: \["りゅう"\]/);
  assert.match(search, /jp: \["じぇいぴー"\]/);
  assert.match(search, /tokido: \["Tokido"\]/);
  assert.match(search, /official_guide: \{ label: "公式ガイド"/);
  assert.match(search, /setplay: \{ label: "セットプレイ"/);
  assert.match(helper, /query\.toLowerCase\(\) === candidate\.label\.toLowerCase\(\)/);
});

test("29-character rollout and public strategy flag remain closed", async () => {
  const [page, flags] = await Promise.all([
    read("src/app/characters/[slug]/page.tsx"),
    read("src/lib/release-features.ts"),
  ]);
  assert.match(page, /character\.slug === "ryu" \|\| character\.slug === "jp"/);
  assert.match(flags, /publicStrategyContent:\s*false/);
  assert.doesNotMatch(flags, /publicStrategyContent:\s*true/);
});
