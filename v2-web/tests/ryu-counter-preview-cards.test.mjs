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

  assert.match(route, /process\.env\.VERCEL_ENV === "preview" && character\.slug === "ryu" && counterPreviewRequested/);
  assert.match(unified, /previewCounterCards\.length \? previewCounterCards : visibleStrategyCards\.filter\(card => card\.kind === "counter"\)/);
  assert.equal((component.match(/id: "T\d{3}"/g) ?? []).length, 18);
  assert.match(component, /対策が必要な理由/);
  assert.match(component, /対策の利点/);
  assert.match(component, /<details>/);
  assert.match(component, /キャミィ専用技の候補/);
  assert.match(component, /波掌撃には飛び道具無敵が対策になりません/);
  assert.match(explorer, /"全キャラ共通候補", "キャミィ専用技の候補", "波動拳", "波掌撃"/);
  assert.doesNotMatch(component, /(?:damage|command)\s*:|<dt>[^<]*(?:コマンド|ダメージ)/i);
});
