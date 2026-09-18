import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const pilot = read("src/components/character-detail-pilot.tsx");
const pilotCss = read("src/components/character-detail-pilot.module.css");
const globalCss = read("src/app/product-refresh.css");
const sources = read("src/lib/source-presentation.ts");
const page = read("src/app/characters/[slug]/page.tsx");

test("source CTAs describe destinations when the URL or metadata is conclusive", () => {
  for (const label of ["公式プロフィールを見る", "公式フレームデータを見る", "バトル調整内容を見る", "公式技表を見る", "関連動画を見る", "情報源を見る"]) assert.match(sources, new RegExp(label));
  assert.match(sources, /battle_change/);
});

test("move records reserve compact motion media and constrain desktop width", () => {
  assert.match(pilot, /<MoveMotionMedia/);
  assert.match(pilot, /動作メディアは未登録/);
  assert.match(page, /getDevicePreviewMoveMotionMedia/);
  assert.match(pilotCss, /width:\s*min\(100%,1180px\)/);
  assert.match(pilotCss, /aspect-ratio:\s*16 \/ 9/);
  assert.match(pilotCss, /\.moveRow:hover/);
});

test("setplay and pressure records have bounded cards", () => {
  assert.match(pilotCss, /\.timelineList details, \.sequenceList details[^}]*border:/);
  assert.match(pilotCss, /border-radius:\s*12px/);
});

test("video cards align clamped titles and bottom actions", () => {
  assert.match(globalCss, /\.video-card \{ display:\s*flex/);
  assert.match(globalCss, /\.video-card__body \{ display:\s*flex; flex:\s*1/);
  assert.match(globalCss, /-webkit-line-clamp:\s*2/);
  assert.match(globalCss, /\.video-card__actions[^}]*margin-top:\s*auto/);
});

test("public move fallback hides internal publication notes", () => {
  assert.match(pilot, /isInternalMoveNote/);
  assert.match(pilot, /if \(isInternalMoveNote\(value\)\) return null/);
  assert.doesNotMatch(pilot, />Awaiting official\/game verification before publication\.</);
});
