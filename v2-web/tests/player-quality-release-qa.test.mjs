import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("player list exposes team, main character, region, and detail route", () => {
  const page = read("src/app/players/page.tsx");
  for (const marker of ["チーム", "主なキャラクター", "地域", "/players/${player.slug}"]) assert.match(page, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("player detail covers release QA sections and natural empty states", () => {
  const page = read("src/app/players/[slug]/page.tsx");
  for (const marker of ["使用キャラクター", "SNS・外部リンク", "大会実績", "関連動画", "情報源", "まだありません"]) assert.match(page, new RegExp(marker));
  assert.doesNotMatch(page, /NO SIGNAL|nullを表示|準備中/);
});

test("player image policy only permits allowlisted images and renders approved fallback copy", () => {
  const images = read("src/lib/approved-player-images.ts");
  const identity = read("src/components/player-identity.tsx");
  assert.match(images, /approvedPlayerImages/);
  assert.match(images, /Object\.hasOwn/);
  assert.match(identity, /選手ビジュアルは今後のアップデートで追加予定です/);
  assert.doesNotMatch(identity, /legacyPlayerImageUrl|raw\.githubusercontent/);
});

test("source CTA is specific when its source type is known", () => {
  const presentation = read("src/lib/player-presentation.ts");
  for (const marker of ["Player本人Xを見る", "YouTubeチャンネルを見る", "Twitchを見る", "大会実績を確認する", "Team公式プロフィールを見る"]) assert.match(presentation, new RegExp(marker));
});

test("player relations exclude unpublished characters and support tournament results", () => {
  const players = read("src/lib/players.ts");
  assert.match(players, /character\.status !== "published"/);
  assert.match(players, /tournament_results/);
  assert.match(players, /tournament\.status !== "published"/);
});

test("related video cards reuse favorite, watched, and share controls", () => {
  const page = read("src/app/players/[slug]/page.tsx");
  const card = read("src/components/video-card.tsx");
  assert.match(page, /<VideoCard/);
  for (const marker of ["お気に入り", "視聴済み", "共有"]) assert.match(card, new RegExp(marker));
});

test("player search suggestions include aliases, team, and character", () => {
  const search = read("src/lib/search.ts");
  assert.match(search, /player_aliases/);
  assert.match(search, /row\.team_name/);
  assert.match(search, /playerCharacters\.get/);
});

test("player layouts retain shrinkable columns and mobile breakpoints", () => {
  const css = read("src/app/players/players.module.css");
  assert.match(css, /minmax\(0, 1fr\)/);
  assert.match(css, /overflow-wrap: anywhere/);
  assert.match(css, /max-width: 720px/);
  assert.match(css, /max-width: 420px/);
  assert.doesNotMatch(css, /overflow-x:\s*hidden/);
});
