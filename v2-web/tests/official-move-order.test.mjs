import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Move cards follow the saved official command list (src/data/official-move-order.json, built from the
// 2026-11-24 official frame tables). Names below are the Elena cards the cand/v50-pc-fixes Preview showed.
function load() {
  const source = readFileSync(new URL("../src/lib/official-move-order.ts", import.meta.url), "utf8");
  const out = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const loaded = { exports: {} };
  const data = JSON.parse(readFileSync(new URL("../src/data/official-move-order.json", import.meta.url), "utf8"));
  new Function("module", "exports", "require", out)(loaded, loaded.exports, name => {
    if (name === "@/data/official-move-order.json") return { __esModule: true, default: data };
    throw new Error(`unexpected import ${name}`);
  });
  return { ...loaded.exports, data };
}
const loaded = load();
const { sortByOfficialMoveOrder, officialMoveOrderIndex, data } = loaded;
const elena = ["SA3 グラスランドソング", "CA グラスランドソング", "SA1 ミーティアボレー", "SA2リヴァイブダンス", "リヴァイブダンス（回復）",
  "強スピンサイズ", "OD スピンサイズ", "弱 スピンサイズ", "中 スピンサイズ", "強 ライノホーン", "OD ライノホーン", "弱 ライノホーン", "中 ライノホーン",
  "強 リンクシング", "弱 リンクシング", "中 リンクシング", "ODリンクシング", "マレットスマッシュ", "レオパードスナップ", "ハーベストサークル",
  "強 スクラッチホイール", "OD スクラッチホイール", "弱 スクラッチホイール", "中 スクラッチホイール",
  "しゃがみ強P（アカシアブランチ）", "立ち弱P", "立ち中P（ブレイズパーチ）", "未登録の技"].map((name, index) => ({ id: `m${index}`, name }));
const order = names => sortByOfficialMoveOrder("elena", elena.filter(move => names.includes(move.name)), move => move).map(move => move.name);

test("SA: SA1 → SA2 → SA3 → CA, and a related row stays next to its SA", () => {
  assert.deepEqual(order(["SA3 グラスランドソング", "CA グラスランドソング", "SA1 ミーティアボレー", "SA2リヴァイブダンス", "リヴァイブダンス（回復）"]),
    ["SA1 ミーティアボレー", "SA2リヴァイブダンス", "リヴァイブダンス（回復）", "SA3 グラスランドソング", "CA グラスランドソング"]);
});

test("special moves: 弱 → 中 → 強 → OD, special moves in the official list order", () => {
  assert.deepEqual(order(["強スピンサイズ", "OD スピンサイズ", "弱 スピンサイズ", "中 スピンサイズ"]), ["弱 スピンサイズ", "中 スピンサイズ", "強スピンサイズ", "OD スピンサイズ"]);
  assert.deepEqual(order(["強 リンクシング", "弱 リンクシング", "ODリンクシング", "中 リンクシング"]), ["弱 リンクシング", "中 リンクシング", "強 リンクシング", "ODリンクシング"]);
  const all = order(elena.map(move => move.name)).filter(name => /ライノホーン|スクラッチホイール|リンクシング|スピンサイズ/.test(name));
  assert.deepEqual(all.map(name => name.replace(/^(弱|中|強|OD)\s*/, "")).filter((name, i, list) => list.indexOf(name) === i), ["ライノホーン", "スクラッチホイール", "リンクシング", "スピンサイズ"]);
});

test("follow-ups keep the official listed order (レオパードスナップ → ハーベストサークル → マレットスマッシュ)", () => {
  assert.deepEqual(order(["マレットスマッシュ", "レオパードスナップ", "ハーベストサークル"]), ["レオパードスナップ", "ハーベストサークル", "マレットスマッシュ"]);
});

test("normals: card names without the official sub-name still match; unknown moves go last in their existing order", () => {
  assert.deepEqual(order(["しゃがみ強P（アカシアブランチ）", "未登録の技", "立ち中P（ブレイズパーチ）", "立ち弱P"]), ["立ち弱P", "立ち中P（ブレイズパーチ）", "しゃがみ強P（アカシアブランチ）", "未登録の技"]);
  assert.equal(officialMoveOrderIndex("elena", { id: "x", name: "未登録の技" }), Infinity);
  assert.equal(officialMoveOrderIndex("no-such-character", { id: "x", name: "立ち弱P" }), Infinity);
});

test("an official row key wins over the name", () => {
  assert.equal(officialMoveOrderIndex("elena", { id: "x", name: "別名", ws5CanonicalSource: "elena:web:100" }), 0);
});

test("order data covers all 32 characters and matches the official frame tables row for row", () => {
  const fill = JSON.parse(readFileSync(new URL("../src/data/SF6DNA_ALL32_OFFICIAL_MOVE_FILL_20261125.json", import.meta.url), "utf8"));
  assert.equal(Object.keys(data.byCharacter).length, 32);
  for (const [slug, rows] of Object.entries(fill.byCharacter)) assert.deepEqual(data.byCharacter[slug], rows.map(row => [row.k ?? null, row.n]), slug);
});

test("V54: common system rows (web 6xx) are detected by key or exact name only", () => {
  const { isOfficialCommonSystemMove } = loaded;
  assert.equal(isOfficialCommonSystemMove("elena", { id: "x", name: "ドライブパリィ" }), true);
  assert.equal(isOfficialCommonSystemMove("elena", { id: "x", name: "前方ステップ" }), true);
  assert.equal(isOfficialCommonSystemMove("elena", { id: "x", name: "x", officialFrameKey: "elena:web:602" }), true);
  assert.equal(isOfficialCommonSystemMove("elena", { id: "x", name: "ドライブリバーサル（ボアチャージ）" }), true);
  assert.equal(isOfficialCommonSystemMove("elena", { id: "x", name: "弱 ライノホーン" }), false);
  assert.equal(isOfficialCommonSystemMove("elena", { id: "x", name: "レオパードスナップ" }), false);
  assert.equal(isOfficialCommonSystemMove("elena", { id: "x", name: "レッグスタック" }), false);
  assert.equal(isOfficialCommonSystemMove("unknown-character", { id: "x", name: "ドライブパリィ" }), false);
});
