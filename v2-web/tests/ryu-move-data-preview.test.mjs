import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("Ryu Preview keeps the Fresh 57-move review isolated from publication state", () => {
  const fixture = read("src/lib/ryu-move-review-fixture.ts");
  const bundle = read("src/lib/character-detail-v21-fixture.ts");

  assert.equal((fixture.match(/"id":/g) ?? []).length, 57);
  assert.match(bundle, /moves: ryuMoveReviewFixture/);
  assert.match(fixture, /"status": "draft"/);
  assert.doesNotMatch(fixture, /"status": "published"/);
});

test("Ryu and JP remain on the guarded Character Detail move template", () => {
  const route = read("src/app/characters/[slug]/page.tsx");
  const routeGate = read("src/lib/character-detail-route.ts");
  const pilot = read("src/components/character-detail-pilot.tsx");

  assert.match(route, /isCharacterDetailV2Route\(character\.slug\)/);
  assert.match(routeGate, /"ryu"/);
  assert.match(routeGate, /"jp"/);
  assert.match(routeGate, /process\.env\.VERCEL_ENV === "preview"/);
  assert.match(pilot, /技一覧・コマンド・主要フレーム/);
  assert.match(pilot, /クラシック/);
  assert.match(pilot, /モダン/);
  assert.match(pilot, /確認中/);
  assert.match(pilot, /CAPCOM公式フレームを見る/);
});

test("Ryu move fallback preserves the 375px accessibility contract", () => {
  const css = read("src/components/character-detail-pilot.module.css");

  assert.match(css, /@media \(max-width: 760px\) \{ \.moveRow \{ grid-template-columns: 1fr/);
  assert.match(css, /overflow-wrap: anywhere/);
  assert.match(css, /min-height: 44px/);
});
