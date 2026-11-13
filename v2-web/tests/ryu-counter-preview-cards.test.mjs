import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("Ryu counter cards are Preview-only, searchable, and keep details collapsed", () => {
  const route = read("src/app/characters/[slug]/page.tsx");
  const component = read("src/components/ryu-counter-preview-cards.tsx");
  const unified = read("src/components/character-unified-page.tsx");
  const explorer = read("src/components/strategy-card-explorer.tsx");

  assert.match(route, /strategyCardsAuthorized && character\.slug === "ryu" && counterPreviewRequested/);
  assert.match(unified, /previewCounterCards\.length \? previewCounterCards : visibleStrategyCards\.filter\(card => card\.kind === "counter"\)/);
  assert.ok((component.match(/id: "(?:T|N)\d{3}"/g) ?? []).length >= 60);
  assert.match(component, /対策が必要な理由/);
  assert.match(component, /対策の利点/);
  assert.match(component, /<details>/);
  assert.match(component, /キャミィ専用技の候補/);
  assert.match(component, /波掌撃には飛び道具無敵が対策になりません/);
  assert.match(explorer, /"通常技", "特殊技", "ターゲットコンボ", "必殺技", "SA"/);
  assert.doesNotMatch(component, /(?:damage|command)\s*:|<dt>[^<]*(?:コマンド|ダメージ)/i);
});
