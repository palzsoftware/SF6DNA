import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readProjectFile(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("Ryu and JP pilot is limited to the established preview gate", () => {
  const page = readProjectFile("src/app/characters/[slug]/page.tsx");
  const combos = readProjectFile("src/app/characters/[slug]/combos/page.tsx");
  const flags = readProjectFile("src/lib/release-features.ts");

  assert.match(page, /previewActive\s*&&\s*\(character\.slug === "ryu" \|\| character\.slug === "jp"\)/);
  assert.match(combos, /!releaseFeatures\.publicStrategyContent && !previewActive/);
  assert.match(flags, /publicStrategyContent:\s*false/);
  assert.doesNotMatch(flags, /publicStrategyContent:\s*true/);
});

test("pilot combo cards keep local preferences independent and accessible", () => {
  const source = readProjectFile("src/components/pilot-combo-card.tsx");

  assert.match(source, /sf6dna:favorite-combos:v1/);
  assert.match(source, /sf6dna:training-combos:v1/);
  assert.match(source, /aria-pressed=\{favorite\}/);
  assert.match(source, /aria-pressed=\{training\}/);
  assert.match(source, /<details/);
  assert.match(source, /combo\.verificationStatus === "verified"/);
  assert.match(source, /verified && combo\.difficulty !== null/);
});

test("pilot supports motion media with a compact missing-media fallback", () => {
  const source = readProjectFile("src/components/pilot-combo-card.tsx");
  const css = readProjectFile("src/components/pilot-combo-card.module.css");

  assert.match(source, /"gif" \| "webp" \| "video"/);
  assert.match(source, /poster=\{combo\.media\.posterUrl/);
  assert.match(source, /動作メディア未登録/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(source, /準備中|NO SIGNAL|画像なし/);
});

test("pilot uses safe player fallback and reusable video library", () => {
  const source = readProjectFile("src/components/character-detail-pilot.tsx");
  const page = readProjectFile("src/app/characters/[slug]/page.tsx");

  assert.match(source, /選手ビジュアルは今後のアップデートで追加予定です/);
  assert.match(source, /videos\.slice\(0, 6\)/);
  assert.match(source, /<VideoCard/);
  assert.match(page, /getDevicePreviewBundle/);
  assert.doesNotMatch(source, /NO SIGNAL|画像なし|近日アップデート/);
});

test("V2.2 exposes complete comparison fields and explicit unknown values", () => {
  const pilot = readProjectFile("src/components/character-detail-pilot.tsx");
  const combo = readProjectFile("src/components/pilot-combo-card.tsx");
  const fixture = readProjectFile("src/lib/character-detail-v21-fixture.ts");

  for (const label of ["コマンド", "ダメージ", "Drive Gauge使用量", "SA Gauge使用量", "開始条件", "終了状況", "位置", "用途", "運び", "使用頻度", "Patch", "Source"]) {
    assert.match(combo, new RegExp(label));
  }
  assert.match(combo, /コマンド未確認/);
  assert.match(combo, /動作メディア未登録/);
  assert.match(pilot, /Damage \{valueOrUnknown\(setup\.damage\)\}/);
  assert.match(pilot, /Damage \{valueOrUnknown\(sequence\.damage\)\}/);
  assert.match(fixture, /command:\s*"小技×3/);
  assert.match(fixture, /damage:\s*null/);
  assert.match(fixture, /patch:\s*"2026\.08\.03"/);
});

test("V2.2 uses horizontal rails for dense related content", () => {
  const source = readProjectFile("src/components/character-detail-pilot.tsx");
  const css = readProjectFile("src/components/character-detail-pilot.module.css");

  assert.match(source, /関連プレイヤー（横スクロール）/);
  assert.match(source, /おすすめ動画（横スクロール）/);
  assert.match(source, /基本方針の情報源（横スクロール）/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /scroll-snap-type:\s*x proximity/);
  assert.match(css, /84%/);
});

test("Ryu and JP V2.1 removes duplicate navigation and exposes concrete page structures", () => {
  const source = readProjectFile("src/components/character-detail-pilot.tsx");
  const copy = readProjectFile("src/lib/character-detail-v21.ts");
  const page = readProjectFile("src/app/characters/[slug]/page.tsx");

  for (const marker of ["基本の勝ち筋", "まず確認するコンボ", "セットプレイ", "連携・対策", "距離別の立ち回り", "関連プレイヤー", "おすすめ動画"]) {
    assert.match(source, new RegExp(marker));
  }
  assert.match(page, /!pilotRequested \? <nav/);
  assert.match(page, /!pilotRequested \? <section className="character-home-actions/);
  assert.match(copy, /波動拳/);
  assert.match(copy, /昇龍拳/);
  assert.match(copy, /トルバラン/);
  assert.match(copy, /トリグラフ/);
  assert.match(copy, /ヴィーハト/);
  assert.match(copy, /ラヴーシュカ/);
  assert.doesNotMatch(copy, /空中に置く技|地面からの攻撃|相手を困らせる技/);
});

test("V2.1 keeps strategy copy preview-only and sources use classified CTAs", () => {
  const source = readProjectFile("src/components/character-detail-pilot.tsx");
  const tabs = readProjectFile("src/components/character-tabs.tsx");

  assert.match(source, /presentSource\(source\.sourceType, source\.publisher, source\.url\)/);
  assert.match(source, /Preview限定/);
  assert.match(tabs, /previewActive && \(slug === "ryu" \|\| slug === "jp"\)/);
  assert.match(tabs, /!pilotV21 \? <Link href=\{`\/characters\/\$\{slug\}#sources`\}>情報源<\/Link> : null/);
});

test("pilot does not add Year 4 names or change public data contracts", () => {
  const sources = [
    readProjectFile("src/components/character-detail-pilot.tsx"),
    readProjectFile("src/components/pilot-combo-card.tsx"),
    readProjectFile("src/app/characters/[slug]/page.tsx"),
  ].join("\n");

  assert.doesNotMatch(sources, /Arjun|Tifa|Bosch|アルジュン|ティファ|ボッシュ/);
  assert.doesNotMatch(sources, /\.from\(|\.rpc\(|\.insert\(|\.update\(|\.upsert\(/);
});
