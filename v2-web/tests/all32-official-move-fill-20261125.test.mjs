import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
function realModule(file) {
  const result = { exports: {} };
  const script = ts.transpileModule(readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const dir = file.slice(0, file.lastIndexOf("/") + 1);
  new Function("module", "exports", "require", script)(result, result.exports, name => {
    if (name.endsWith(".json")) return { __esModule: true, default: JSON.parse(readFileSync(new URL(`../src/${name.replace(/^@\//, "")}`, import.meta.url), "utf8")) };
    const local = name.startsWith("@/") ? name.slice(2) : name.startsWith(".") ? new URL(name, `file:///${dir}`).pathname.slice(1) : null;
    if (local) return realModule(local + (existsSync(new URL(`../src/${local}.tsx`, import.meta.url)) ? ".tsx" : ".ts"));
    return require(name);
  });
  return result.exports;
}
const data = JSON.parse(readFileSync(new URL("../src/data/SF6DNA_ALL32_OFFICIAL_MOVE_FILL_20261125.json", import.meta.url), "utf8"));
const { withAll32OfficialMoveFill, officialMoveDisplayName } = realModule("lib/all32-official-move-fill.ts");
const { unifiedFrameValue } = realModule("lib/character-unified-contract.ts");

test("data: every official row of all 32 characters (2672), one record per source key, ids stable", () => {
  const chars = Object.keys(data.byCharacter);
  assert.equal(chars.length, 32);
  assert.ok(chars.includes("arjun") && chars.includes("dee-jay"));
  assert.equal(Object.values(data.byCharacter).reduce((sum, rows) => sum + rows.length, 0), 2672);
  for (const [char, rows] of Object.entries(data.byCharacter)) {
    const keys = rows.filter(r => r.k).map(r => r.k);
    assert.equal(new Set(keys).size, keys.length, char);
    assert.equal(new Set(rows.map(r => r.h)).size, rows.length, char);
    for (const row of rows) assert.ok(row.n.trim() && row.u.startsWith("https://www.streetfighter.com/"), `${char} ${row.n}`);
  }
});

const record = { k: "ryu:web:999", n: "テスト技", t: "special", v: { startup: "9", onBlock: "-4", onHit: "NA", damage: "700" }, i: { classic: "236+LP", modern: "SP" }, u: "https://www.streetfighter.com/6/ja-jp/character/ryu/frame", h: "abc" };
const fixture = { status: "LOCAL_OFFICIAL_FRAME_20261124", byCharacter: { ryu: [record, { ...record, k: null, n: "新規", h: "def" }] } };
const move = (frame, frameFieldStatus = {}) => ({ id: "m1", slug: "m1", name: "テスト技", moveType: "special", usageSummary: null, status: "draft",
  frame, frameFieldStatus, commands: [{ moveId: "m1", scheme: "classic", commandText: "236+LP", numericNotation: null, buttonNotation: null, conditionText: null, sortOrder: 0 }],
  media: null, ws5CanonicalSource: "ryu:web:999" });
const bundle = moves => ({ guideSections: [], moves, combos: [], setups: [], sequences: [], matchups: [], training: [] });

test("fill: only empty fields and missing inputs; existing values and states are never replaced", () => {
  const out = withAll32OfficialMoveFill(bundle([move({ startup: "8", onBlock: null, damage: "" }, { startup: "LOCAL_OFFICIAL_TXT_CANONICAL", damage: "PENDING" })]), "ryu", fixture);
  const filled = out.bundle.moves[0];
  assert.equal(filled.frame.startup, "8", "existing value kept");
  assert.equal(filled.frame.onBlock, "-4");
  assert.equal(filled.frame.damage, "700");
  assert.equal(filled.frameFieldStatus.onHit, "OFFICIAL_NA");
  assert.equal(unifiedFrameValue(filled, "onHit", true), "—");
  assert.equal(unifiedFrameValue(filled, "onBlock", true), "-4");
  assert.equal(unifiedFrameValue(filled, "onBlock", false), "確認中", "the local value is not shown outside local review");
  assert.deepEqual(filled.commands.map(c => [c.scheme, c.commandText]), [["classic", "236+LP"], ["modern", "SP"]]);
});

test("append: a row without a card becomes one local card with the official values; evidence names the source", () => {
  const out = withAll32OfficialMoveFill(bundle([move({ startup: "9" })]), "ryu", fixture);
  assert.equal(out.bundle.moves.length, 2);
  const added = out.bundle.moves[1];
  assert.equal(added.id, "sf6dna-official-20261124:ryu:def");
  assert.equal(added.frame.verificationStatus, "candidate_only");
  assert.equal(added.frameFieldStatus.recovery, "OFFICIAL_NOT_LISTED");
  assert.match(out.evidence[added.id].verification, /公式フレーム表（2026-11-24確認）.*公開承認待ち/);
  assert.match(out.evidence[added.id].patch, /Patch未確定/);
  assert.equal(added.ws5CanonicalSource, undefined, "a 2026-11-24 table value is not labelled as the TXT snapshot");
  // A second pass does not add duplicates (keyed or not).
  assert.equal(withAll32OfficialMoveFill(out.bundle, "ryu", fixture).bundle.moves.length, 2);
  const keyed = withAll32OfficialMoveFill(bundle([]), "ryu", fixture);
  assert.equal(keyed.bundle.moves.length, 2);
  assert.equal(withAll32OfficialMoveFill(keyed.bundle, "ryu", fixture).bundle.moves.length, 2);
  assert.equal(withAll32OfficialMoveFill(bundle([]), "unknown", fixture).bundle.moves.length, 0);
});

test("auto-derived rows: command cell says there is no own input, the official condition goes to the condition cell", () => {
  const auto = { ...record, k: "kimberly:web:316", n: "弧空", i: { classic: "（疾駆けで相手に一定距離まで近付くと自動派生）" }, h: "auto" };
  const out = withAll32OfficialMoveFill(bundle([]), "kimberly", { ...fixture, byCharacter: { kimberly: [auto] } });
  assert.deepEqual(out.bundle.moves[0].commands.map(c => [c.commandText, c.conditionText]), [["自動派生（個別入力なし）", "疾駆けで相手に一定距離まで近付くと自動派生"]]);
  const rows = Object.entries(data.byCharacter).flatMap(([char, list]) => list.filter(r => /自動派生）$/.test(r.i.classic ?? "")).map(r => `${char}:${r.n}`));
  assert.deepEqual(rows.sort(), ["arjun:OD 過剰な正義", "arjun:過剰な正義", "kimberly:OD 弧空", "kimberly:弧空"]);
});

test("old rows: a card whose official source key is not in the latest table leaves the normal list and is reported", () => {
  const old = { ...move({ startup: "9" }), id: "old", name: "OD 空中竜巻旋風脚", ws5CanonicalSource: "ryu:sha:3f62f456a4fc6c6a30d5" };
  const out = withAll32OfficialMoveFill(bundle([move({ startup: "9" }), old]), "ryu", fixture);
  assert.ok(!out.bundle.moves.some(m => m.id === "old"));
  assert.deepEqual(out.heldOldRows.map(r => [r.id, r.sourceKey]), [["old", "ryu:sha:3f62f456a4fc6c6a30d5"]]);
  const untouched = withAll32OfficialMoveFill(bundle([old]), "unknown", fixture);
  assert.equal(untouched.bundle.moves.length, 1, "characters without official rows are left as they are");
});

test("V36 display names: empty （） and repeated spaces are dropped from new cards only; the official value 10982 (Elena STEP row) is never a displayed frame field", () => {
  assert.equal(officialMoveDisplayName("ジャンプ弱K（）"), "ジャンプ弱K");
  assert.equal(officialMoveDisplayName("強  百鬼豪刃"), "強 百鬼豪刃");
  assert.equal(officialMoveDisplayName("立ち中P （フック）"), "立ち中P （フック）", "non-empty parentheses are kept");
  const row = { ...record, k: "c-viper:sha:706b2fdab5586b46fc8f", n: "ジャンプ弱K（）", i: {}, h: "empty-paren" };
  const out = withAll32OfficialMoveFill(bundle([]), "c-viper", { ...fixture, byCharacter: { "c-viper": [row] } });
  assert.equal(out.bundle.moves[0].name, "ジャンプ弱K");
  assert.equal(out.bundle.moves[0].officialFrameKey, "c-viper:sha:706b2fdab5586b46fc8f", "the official key is unchanged");
  // Fill fields never carry a 4-digit frame value ("total" is not filled; a 4-digit total from the TXT snapshot is held in unifiedFrameValue, tested below).
  for (const [char, list] of Object.entries(data.byCharacter)) for (const r of list) for (const f of ["startup", "active", "recovery", "onHit", "onBlock"]) {
    assert.ok(!/\d{4,}/.test(String(r.v[f] ?? "")), `${char}:${r.n}:${f}`);
  }
});

test("V37: an official total of 1000F or more (Elena STEP row 10982, found on Preview) is shown as unconfirmed, normal totals are unchanged", () => {
  const m = (total) => ({ id: "x", frame: { total }, frameFieldStatus: { total: "LOCAL_OFFICIAL_TXT_CANONICAL" } });
  assert.equal(unifiedFrameValue(m("10982"), "total", true), "確認中");
  assert.equal(unifiedFrameValue(m(10982), "total", true), "確認中");
  assert.equal(unifiedFrameValue(m("45"), "total", true), "45");
  assert.equal(unifiedFrameValue(m("45"), "startup", true), "確認中", "other fields are untouched by the guard");
});
