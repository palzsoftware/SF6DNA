// Luke/Manon/JP の素材一括検査(batch-inventory.py)と技単位カバレッジ(coverage-gaps.py)の結果の整合テスト。
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const inv = json("../../scripts/gif-intake/asset-inventory-luke-manon-jp-20261116.json");
const cov = json("../../scripts/gif-intake/coverage-gaps-20261116.json");
const insp38 = json("../../scripts/gif-intake/asset-inspection-38-20261116.json").assets;
const fixture = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json").characters;

test("在庫: Luke71 / Manon20 / JP47 を数え、取得できない素材は ASSET_UNAVAILABLE(合格扱いにしない)", () => {
  const p = inv.perCharacter;
  assert.deepEqual([p.luke.driveGifs, p.manon.driveGifs, p.jp.driveGifs], [71, 20, 47]);
  assert.deepEqual([p.luke.verified, p.manon.verified, p.jp.verified], [69, 18, 46]);
  const un = inv.records.filter((r) => r.assetStatus === "ASSET_UNAVAILABLE").map((r) => r.file).sort();
  assert.deepEqual(un, ["02-luke-sa2-eraser.gif", "03-luke-sa3-pale-rider.gif", "9_56-jp-ca-interdiction.gif", "manon-ca-pas-de-deux.gif", "manon-sa3-pas-de-deux.gif"]);
  for (const r of inv.records) {
    if (r.assetStatus === "ASSET_UNAVAILABLE") assert.ok(!r.sha256 && r.driveBytes > 10 * 1024 * 1024);
    else assert.ok(r.sha256 && r.bytes === r.driveBytes && r.errors.length === 0, r.file);
  }
});

test("同一バイトの重複は2組(Luke 立ちMP=立ちHP / ジャンプMK=ジャンプHK)で、制作規格外は SA1(640x360)の1本", () => {
  assert.deepEqual(inv.duplicateGroups.map((d) => d.files.slice().sort()).sort(), [["22_16-luke-jumping-mk.gif", "22_18-luke-jumping-hk.gif"], ["22_3-luke-standing-mp.gif", "22_5-luke-standing-hp.gif"]]);
  const dev = inv.records.filter((r) => r.assetStatus === "ASSET_VERIFIED" && !r.specAllOk).map((r) => r.file);
  assert.deepEqual(dev, ["01-luke-sa1-vulcan-blast.gif"]);
});

test("既存の38本検査(SHA)と新しい在庫のSHAが一致する(再取得で内容が変わっていない)", () => {
  const byFile = new Map(inv.records.map((r) => [r.file, r]));
  const comparable = insp38.filter((a) => a.character !== "juri"); // 在庫の対象はLuke/Manon/JP(Juriの1本は対象外)
  assert.equal(comparable.length, 37);
  for (const a of comparable) assert.equal(byFile.get(a.file).sha256, a.sha256, a.file);
});

test("技単位カバレッジ: 件数が整合し、素材のある技とカバレッジ外の技が重ならない", () => {
  for (const [ch, v] of Object.entries(cov.perCharacter)) {
    assert.equal(v.covered + v.gapCount, v.targetMoves, ch);
    assert.equal(v.gaps.length, v.gapCount);
    const slugs = new Set(fixture[ch].moves.map((m) => m.slug));
    for (const g of v.gaps) assert.ok(slugs.has(g.slug), `${ch}:${g.slug} は公開用データに実在`);
  }
  assert.deepEqual(Object.fromEntries(Object.entries(cov.perCharacter).map(([k, v]) => [k, v.gapCount])), { jp: 4, luke: 2, manon: 10 });
});
