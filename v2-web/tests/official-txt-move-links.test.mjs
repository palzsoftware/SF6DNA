import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { withOfficialTxtMoveLinks } from "../src/lib/official-txt-move-links.ts";

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const canonical = read("../src/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json");
const data = read("../src/data/SF6DNA_R17_OFFICIAL_TXT_MOVE_LINKS_20261120.json");
const bundle = (moves) => ({ guideSections: [], moves, combos: [], setups: [], sequences: [], matchups: [], training: [] });

test("R17 link data: 129 links to existing official rows, single-hit rows held, never both", () => {
  assert.equal(Object.keys(data.links).length, 129);
  assert.equal(Object.keys(data.held).length, 20);
  for (const [moveId, key] of Object.entries(data.links)) {
    assert.ok(canonical[key], key);
    assert.ok(!(moveId in data.held), moveId);
    assert.doesNotMatch(canonical[key].raw.skill ?? "", /段目/, key);
  }
  for (const held of Object.values(data.held)) assert.match(held.reason, /PART_ROW_ONLY|NO_SINGLE_OFFICIAL_ROW/);
  // Variant labels never merge cards; every label carries its evidence.
  for (const entry of Object.values(data.variantLabels)) assert.ok(entry.label && entry.evidence);
});

test("a linked card shows official values and commands; blank official fields keep the card value", () => {
  const records = { "x:web:1": { characterSlug: "x", raw: { startup_frame: "5", active_frame: "", recovery_frame: "10", hit_frame: "D",
    block_frame: "-2", damage: "500", command: "（近距離で）N or 6 + LPLK", command_modern: "（近距離で）N or 6 + 弱中" } } };
  const move = { id: "m1", name: "前投げ", frame: { startup: "4", active: "3", recovery: null, onHit: "+20", onBlock: null, damage: 1200 },
    frameFieldStatus: {}, commands: [
      { moveId: "m1", scheme: "classic", commandText: "LP+LK", numericNotation: null, buttonNotation: null, conditionText: null, sortOrder: 0 },
      { moveId: "m1", scheme: "modern_assist", commandText: "A", numericNotation: null, buttonNotation: null, conditionText: null, sortOrder: 2 }] };
  const [out] = withOfficialTxtMoveLinks(bundle([move]), { links: { m1: "x:web:1" } }, records).moves;
  assert.equal(out.ws5CanonicalSource, "x:web:1");
  assert.deepEqual([out.frame.startup, out.frame.active, out.frame.recovery, out.frame.onHit, out.frame.damage], ["5", "3", "10", "D", "500"]);
  assert.equal(out.frameFieldStatus.active, undefined);
  const classic = out.commands.find(row => row.scheme === "classic");
  assert.deepEqual([classic.commandText, classic.conditionText], ["N or 6 + LPLK", "近距離で"]);
  assert.ok(out.commands.some(row => row.scheme === "modern_assist" && row.commandText === "A"));
  assert.equal(move.frame.startup, "4"); // input is not mutated
});

test("a card already connected to another official row is never re-pointed; labels are display-only", () => {
  const records = { "x:web:1": { raw: { startup_frame: "5" } } };
  const move = { id: "m1", name: "a", ws5CanonicalSource: "x:web:9", frame: { startup: "4" }, frameFieldStatus: {}, commands: [] };
  const [out] = withOfficialTxtMoveLinks(bundle([move]), { links: { m1: "x:web:1" }, variantLabels: { m1: { label: "OD版", evidence: "e" } } }, records).moves;
  assert.equal(out.ws5CanonicalSource, "x:web:9");
  assert.equal(out.frame.startup, "4");
  assert.equal(out.ws5VariantLabel, "OD版");
  assert.equal(out.id, "m1");
});
