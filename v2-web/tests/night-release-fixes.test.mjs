import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("video detail exposes a safe external YouTube action and list dates are localized", () => {
  const detail = read("src/lib/event-media.ts");
  const view = read("src/components/simple-detail.tsx");
  const list = read("src/components/video-library.tsx");
  assert.match(detail, /\? \{ href: data\.url, label: "YouTubeで見る" \}/);
  assert.match(view, /target="_blank" rel="noopener noreferrer"/);
  assert.match(list, /formatVideoPublishedDate\(video\.publishedAt\)/);
});

test("character and player cards use deliberate no-image and CTA layouts", () => {
  const character = read("src/components/character-card.tsx");
  const players = read("src/app/players/page.tsx");
  const playerDirectory = read("src/components/player-directory.tsx");
  const css = read("src/app/product-refresh.css");
  assert.match(character, /character-card--no-image/);
  assert.match(players, /PlayerDirectory/);
  assert.match(playerDirectory, /character-card--no-image/);
  assert.match(character, /character-card__cta/);
  assert.match(css, /\.character-card--no-image \.character-card__media/);
});

test("source labels distinguish source kind and derive missing provider only from the URL", () => {
  const sources = read("src/app/sources/page.tsx");
  assert.match(sources, /localizeSourceType\(sourceType\)/);
  assert.match(sources, /new URL\(url\)\.hostname/);
  assert.doesNotMatch(sources, /\?\? "確認済み情報源"/);
});
