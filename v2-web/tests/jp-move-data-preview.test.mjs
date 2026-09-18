import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("JP Preview joins commands into the existing token-gated move bundle", () => {
  const loader = read("src/lib/device-preview.ts");

  assert.match(loader, /get_phase23_move_commands_preview/);
  assert.match(loader, /commands:\s*commandMap\.get\(move\.id\) \?\? \[\]/);
  assert.match(loader, /isDevicePreviewRequest/);
});

test("JP Preview keeps all 59 reviewed moves available when the protected RPC is unavailable", () => {
  const fixture = read("src/lib/jp-move-review-fixture.ts");
  const bundle = read("src/lib/character-detail-v21-fixture.ts");

  assert.equal((fixture.match(/\"id\":/g) ?? []).length, 59);
  assert.match(bundle, /moves: jpMoveReviewFixture/);
  assert.match(fixture, /status: "draft"|\"status\": "draft"/);
  assert.doesNotMatch(fixture, /status: "published"|\"status\": "published"/);
});

test("JP move review renders classic and modern controls separately with safe missing values", () => {
  const pilot = read("src/components/character-detail-pilot.tsx");

  for (const label of ["技一覧・コマンド・主要フレーム", "クラシック", "モダン", "発生", "ガード時", "ダメージ", "確認中"]) {
    assert.match(pilot, new RegExp(label));
  }
  assert.match(pilot, /CAPCOM公式フレームを見る/);
  assert.match(pilot, /appendDevicePreviewToken\(`\/moves\/\$\{move\.slug\}`/);
  assert.doesNotMatch(pilot, /NO SIGNAL|画像なし|準備中/);
});

test("JP move table remains usable at 375px without fixed-width overflow", () => {
  const css = read("src/components/character-detail-pilot.module.css");

  assert.match(css, /@media \(max-width: 760px\) \{ \.moveRow \{ grid-template-columns: 1fr/);
  assert.match(css, /overflow-wrap: anywhere/);
  assert.match(css, /min-height: 44px/);
});
