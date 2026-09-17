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

test("pilot supports motion media without an empty media placeholder", () => {
  const source = readProjectFile("src/components/pilot-combo-card.tsx");
  const css = readProjectFile("src/components/pilot-combo-card.module.css");

  assert.match(source, /"gif" \| "webp" \| "video"/);
  assert.match(source, /poster=\{combo\.media\.posterUrl/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(source, /準備中|NO SIGNAL|画像なし/);
});

test("pilot uses safe player fallback and existing video UX", () => {
  const source = readProjectFile("src/components/character-detail-pilot.tsx");
  const page = readProjectFile("src/app/characters/[slug]/page.tsx");

  assert.match(source, /選手ビジュアルは今後のアップデートで追加予定です/);
  assert.match(source, /<VideoCard/);
  assert.match(page, /getDevicePreviewBundle/);
  assert.doesNotMatch(source, /NO SIGNAL|画像なし|近日アップデート/);
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
