import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { withOfficialTxtMultiHit } from "../src/lib/official-txt-move-links.ts";

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const canonical = read("../src/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json");
const data = read("../src/data/SF6DNA_R18_OFFICIAL_TXT_MULTIHIT_20261120.json");
const links = read("../src/data/SF6DNA_R17_OFFICIAL_TXT_MOVE_LINKS_20261120.json");
const bundle = (moves) => ({ guideSections: [], moves, combos: [], setups: [], sequences: [], matchups: [], training: [] });
const RYU = "3605c1b6-1f6b-42a3-981d-6ce606d760b4";

test("R18 data: 7 first-hit links, 12 whole-move cards (incl. Ryu), sums equal official per-hit damage", () => {
  assert.equal(Object.keys(data.firstStageLinks).length, 7);
  assert.equal(Object.keys(data.wholeMoveStages).length, 12);
  for (const [id, key] of Object.entries(data.firstStageLinks)) {
    assert.match(canonical[key].raw.skill, /（1段目）$/);
    assert.ok(id in links.held, id); // was held in R17 and is released only by R18 verification
  }
  for (const whole of Object.values(data.wholeMoveStages)) {
    assert.equal(whole.stageKeys.reduce((sum, key) => sum + Number(canonical[key].raw.damage), 0), whole.damageSum);
  }
  assert.equal(data.wholeMoveStages[RYU].damageSum, 1800);
  assert.ok(!Object.values(data.firstStageLinks).some(key => Object.keys(data.wholeMoveStages).includes(key)));
  assert.equal(Object.keys(data.variantLabels).length, 2);
});

test("a whole-move card renamed to a single hit is restored and keeps its whole-move values", () => {
  const original = { id: RYU, name: "中P→弱K→強K（Fuwa Triple Strike）", frame: { damage: 1800 }, frameFieldStatus: {}, commands: [] };
  const connected = { ...original, name: "不破三連撃（2段目）", frame: { damage: "300" }, ws5CanonicalSource: "ryu:web:208" };
  const [out] = withOfficialTxtMultiHit(bundle([connected]), bundle([original]), data, canonical).moves;
  assert.equal(out.name, original.name); // official rename waits for approval
  assert.equal(out.frame.damage, 1800);
  assert.equal(out.ws5CanonicalSource, undefined);
  assert.deepEqual(out.ws5OfficialStages.map(row => row.damage), ["600", "300", "900"]);
  assert.equal(out.ws5StageDamageSum, 1800);
});

test("Juri [チェーンコンボ]刈脚 keeps its ID and gains the official Classic command and name", () => {
  const id = "sf6dna-preview:juri:juri%3Aweb%3A209";
  const card = { id, name: "[チェーンコンボ]刈脚", frame: { damage: "700" }, frameFieldStatus: {},
    commands: [{ moveId: id, scheme: "modern", commandText: "3＋ 強", numericNotation: null, buttonNotation: null, conditionText: null, sortOrder: 1 }] };
  const [out] = withOfficialTxtMultiHit(bundle([card]), bundle([]), data, canonical).moves;
  assert.equal(out.id, id);
  assert.equal(out.name, "[チェーンコンボ]しゃがみ強K（刈脚）");
  assert.deepEqual(out.commands.map(row => [row.scheme, row.commandText]), [["modern", "3＋ 強"], ["classic", "2 + HK"]]);
  assert.equal(out.frame.damage, "700");
});
