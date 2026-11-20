import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mergeOfficialTxtControlSchemeListings, officialTxtControlSchemePairs } from "../src/lib/official-txt-control-scheme-merge.ts";

const canonical = JSON.parse(readFileSync(new URL("../src/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json", import.meta.url), "utf8"));
const raw = (over) => ({ name: "(2HK)", startup_frame: "14", active_frame: "14-16", recovery_frame: "25", frame: "41", hit_frame: "D", block_frame: "-11", damage: "800", note: ["n"], ...over });
const card = (id, key, commands) => ({ id, ws5CanonicalSource: key, name: id, commands: commands.map(([scheme, commandText]) => ({ moveId: id, scheme, commandText, numericNotation: null, buttonNotation: null, conditionText: null, sortOrder: 0 })) });
const bundle = (moves) => ({ guideSections: [], moves, combos: [], setups: [], sequences: [], matchups: [], training: [] });

test("arjun 踏み潰す (web:201, Modern only) is the Modern listing of しゃがみ強K (web:111) in the official TXT", () => {
  const pairs = officialTxtControlSchemePairs(canonical);
  assert.equal(pairs.get("arjun:web:201"), "arjun:web:111");
  // Strict rule: one pair per such move, all are Classic-only + Modern-only rows with identical frames.
  assert.equal(pairs.size, 28);
});

test("a strict pair is shown as one card with both inputs; IDs are unchanged", () => {
  const records = { "x:web:111": { characterSlug: "x", raw: raw({ command: "2 + HK", command_modern: null }) },
    "x:web:201": { characterSlug: "x", raw: raw({ command: null, command_modern: "3 + 強" }) } };
  const out = mergeOfficialTxtControlSchemeListings(bundle([card("a", "x:web:111", [["classic", "2 + HK"]]), card("b", "x:web:201", [["modern", "3 + 強"]])]), records);
  assert.deepEqual(out.moves.map(m => m.id), ["a"]);
  assert.deepEqual(out.moves[0].commands.map(c => [c.scheme, c.commandText]), [["classic", "2 + HK"], ["modern", "3 + 強"]]);
});

test("no merge when frames differ, a third row exists, or one card is missing", () => {
  const base = { "x:1": { characterSlug: "x", raw: raw({ command: "2 + HK", command_modern: null }) } };
  const differ = { ...base, "x:2": { characterSlug: "x", raw: raw({ command: null, command_modern: "3 + 強", damage: "900" }) } };
  const triple = { ...base, "x:2": { characterSlug: "x", raw: raw({ command: null, command_modern: "3 + 強" }) },
    "x:3": { characterSlug: "x", raw: raw({ command: "2 + HK", command_modern: "3 + 強" }) } };
  const pair = { ...base, "x:2": { characterSlug: "x", raw: raw({ command: null, command_modern: "3 + 強" }) } };
  const two = bundle([card("a", "x:1", [["classic", "2 + HK"]]), card("b", "x:2", [["modern", "3 + 強"]])]);
  assert.equal(mergeOfficialTxtControlSchemeListings(two, differ).moves.length, 2);
  assert.equal(mergeOfficialTxtControlSchemeListings(two, triple).moves.length, 2);
  assert.equal(mergeOfficialTxtControlSchemeListings(bundle([card("b", "x:2", [["modern", "3 + 強"]])]), pair).moves.length, 1);
});

test("page applies the merge only on the official TXT (Preview/local) path", () => {
  const page = readFileSync(new URL("../src/app/characters/[slug]/page.tsx", import.meta.url), "utf8");
  assert.equal((page.match(/mergeOfficialTxtControlSchemeListings\(withOfficialTotalFrames\(/g) ?? []).length, 2);
});
