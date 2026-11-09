import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const root = new URL("../src/", import.meta.url);
const read = file => readFileSync(new URL(file, root), "utf8");

test("registered and YouTube search videos render the same VideoCard", () => {
  const library = read("components/video-library.tsx");
  const auto = read("components/auto-video-results.tsx");
  assert.match(library, /<VideoCard video=\{video\}/);
  assert.match(auto, /import \{ VideoCard \} from/);
  assert.match(auto, /<VideoCard key=\{video\.id\} video=\{video\}/);
  assert.doesNotMatch(auto, /className=\{styles\.card\}/);
  assert.match(auto, /players: \[\]/);
  assert.match(auto, /characters: \[\]/);
});
test("shared card keeps overlay favorite, watched control, share and thumbnail play only", () => {
  const card = read("components/video-card.tsx");
  const style = read("app/unified-design.css");
  assert.match(card, /video-card__favorite/);
  assert.match(card, /favorite \? "★" : "☆"/);
  assert.match(card, /toggleOwnedVideoPreference|preferences\.toggle\("favorite"/);
  assert.match(card, /favoriteToast/);
  assert.match(card, /role="status" aria-live="polite"/);
  assert.match(card, /className="video-card__thumbnail" href=\{videoUrl\}/);
  assert.doesNotMatch(card, /className="video-card__watch"/);
  assert.match(card, /preferences\.toggle\("watched"/);
  assert.match(card, /void share\(\)/);
  assert.match(style, /\.video-card__favorite--active \{ color: #ffd43b; \}/);
  assert.match(style, /\.video-card__toast/);
  assert.match(style, /aspect-ratio: 16 \/ 9/);
  assert.match(style, /\.video-card--watched \{ border-color: #b4232e; \}/);
});
