import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { validateJpAliases, parseMoveName } from "../../scripts/gif-intake/validate-jp-aliases.mjs";
import { loadIntakeManifests, loadMp4MoveIds } from "../../scripts/gif-intake/validate-gif-intake.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const fixture = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json");
const analysis = json("../../scripts/gif-intake/no-move-id-analysis-20261116.json");

/** TypeScriptの対応表そのものを型除去モードで読み込む(JSONへコピーした別データを使わない)。 */
function loadTs(rel, expr) {
  const mod = pathToFileURL(here(rel)).href;
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--input-type=module", "-e",
    `const m = await import(${JSON.stringify(mod)}); console.log(JSON.stringify((${expr})(m)));`], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}
const aliases = loadTs("../src/data/gif-intake/jp-move-aliases.ts", "(m)=>m.JP_MOVE_ALIASES");
const clone = (v) => JSON.parse(JSON.stringify(v));
const jpMoves = fixture.characters.jp.moves;

test("対象は分類『識別名不一致』のJP22本で、全件に結果(対応根拠 または HOLD理由)が記録されている", () => {
  const targets = analysis.filter((a) => a.character === "jp" && a.category === "識別名不一致").map((a) => a.file).sort();
  assert.equal(targets.length, 22);
  assert.deepEqual(aliases.map((a) => a.sourceFile).sort(), targets);
  for (const a of aliases) {
    assert.ok(["MATCHED_STATIC", "NEEDS_VISUAL_QA", "HOLD"].includes(a.status), a.sourceFile);
    assert.ok(a.status === "HOLD" ? a.holdReasons.length > 0 : a.evidence.length >= 5, `${a.sourceFile}: 根拠/理由が不足`);
  }
});

test("22本の静的検証: 技IDがJPに実在し、名称・強度/OD/SA・重複がすべて整合する", () => {
  const results = validateJpAliases({ aliases, fixture });
  assert.deepEqual(results.filter((r) => !r.ok), []);
  assert.equal(results.length, 22);
  // 個別結果を出力(報告用)
  for (const r of results) console.log(`  [JP22] ${r.sourceFile} -> ${r.status} ${r.ok ? "PASS" : r.errors.join(";")}`);
});

test("自動でAPPROVEDへ昇格していない。映像確認はMATCHED_STATICでも未実施", () => {
  assert.equal(aliases.filter((a) => a.status === "APPROVED").length, 0);
  const s = Object.fromEntries(["MATCHED_STATIC", "NEEDS_VISUAL_QA", "HOLD"].map((k) => [k, aliases.filter((a) => a.status === k).length]));
  assert.equal(s.MATCHED_STATIC + s.NEEDS_VISUAL_QA + s.HOLD, 22, "重複集計なし");
});

test("強度別・OD別を同じ技IDへ割り当てない(系統ごとに技IDが全て別)", () => {
  const ids = aliases.map((a) => a.moveId);
  assert.equal(new Set(ids).size, ids.length);
  const family = (a) => parseMoveName(a.fixtureName).base;
  const byFamily = Object.groupBy ? Object.groupBy(aliases, family) : aliases.reduce((acc, a) => ((acc[family(a)] ||= []).push(a), acc), {});
  for (const [fam, rows] of Object.entries(byFamily)) assert.equal(new Set(rows.map((r) => r.moveId)).size, rows.length, fam);
  assert.deepEqual(Object.keys(byFamily).sort(), ["ヴィーハト", "ヴィーハト・アクノ", "ヴィーハト・チェーニ", "ザプリェット", "ストリボーグ", "チェルノボーグ", "トリグラフ", "トルバラン", "ラヴーシュカ"].sort());
});

test("取り違え・曖昧一致・重複・他キャラ混入・自動承認を検出する", () => {
  const bad = (mut) => { const a = clone(aliases); mut(a); return validateJpAliases({ aliases: a, fixture }).flatMap((r) => r.errors).join("\n"); };
  const lightTri = aliases.findIndex((a) => a.moveSlug === "jp-triglav-l");
  const medTri = aliases.findIndex((a) => a.moveSlug === "jp-triglav-m");
  assert.match(bad((a) => { a[lightTri].moveId = a[medTri].moveId; a[lightTri].moveSlug = a[medTri].moveSlug; a[lightTri].fixtureName = a[medTri].fixtureName; }), /TAG_MISMATCH|DUPLICATE_MOVE_ID/, "弱のGIFを中の技IDへ割り当てられない");
  const odTri = aliases.findIndex((a) => a.moveSlug === "jp-triglav-od-l");
  const heavy = jpMoves.find((m) => m.slug === "jp-triglav-h");
  assert.match(bad((a) => { a[odTri].moveId = heavy.id; a[odTri].moveSlug = heavy.slug; a[odTri].fixtureName = heavy.name; }), /TAG_MISMATCH/, "OD弱のGIFを強の技へ割り当てられない");
  const lukeId = fixture.characters.luke.moves[0].id;
  assert.match(bad((a) => { a[0].moveId = lukeId; }), /NON_JP_MOVE_ID/);
  assert.match(bad((a) => { a[0].moveId = "00000000-0000-0000-0000-000000000000"; }), /MOVE_ID_NOT_FOUND_IN_JP/);
  assert.match(bad((a) => { a[1].sha256 = a[0].sha256; }), /DUPLICATE_CONTENT/);
  assert.match(bad((a) => { a[1].sourceFile = a[0].sourceFile; }), /DUPLICATE_SOURCE_FILE/);
  assert.match(bad((a) => { a[0].status = "APPROVED"; }), /AUTO_APPROVED_NOT_ALLOWED/);
  // 曖昧一致: 区分+名称が同じ技が2件ある公開用データに対しては許可しない
  const dupFixture = clone(fixture); const t = dupFixture.characters.jp.moves.find((m) => m.slug === "jp-torbalan-l");
  dupFixture.characters.jp.moves.push({ ...clone(t), id: "11111111-1111-1111-1111-111111111111", slug: "jp-torbalan-l-copy" });
  assert.match(validateJpAliases({ aliases, fixture: dupFixture }).flatMap((r) => r.errors).join("\n"), /AMBIGUOUS_NAME_MATCH/);
});

test("既存MP4を優先する: MP4のあるSA1〜SA3はGIFを上乗せしない", () => {
  const mp4 = loadMp4MoveIds();
  for (const a of aliases) assert.equal(a.existingMp4, mp4.has(a.moveId), a.sourceFile);
  const withMp4 = aliases.filter((a) => a.existingMp4).map((a) => a.moveSlug).sort();
  assert.deepEqual(withMp4, ["jp-sa1", "jp-sa2", "jp-sa3"]);
  // 承認済みと仮定しても、MP4保有の技は表示されない(共通モジュールの実コードで確認)
  const clips = aliases.map((a) => ({ move_id: a.moveId, move_slug: a.moveSlug, variant: "default", media_type: "gif", media_url: "/x.gif", verification_status: "approved_for_preview" }));
  const shown = loadTsWith("../src/lib/preview-gif-media.ts", clips, [...mp4]);
  assert.deepEqual(shown.map((c) => c.move_slug).filter((s) => ["jp-sa1", "jp-sa2", "jp-sa3"].includes(s)), []);
  assert.equal(shown.length, 22 - 3);
});

function loadTsWith(rel, clips, mp4) {
  const mod = pathToFileURL(here(rel)).href;
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--input-type=module", "-e",
    `const m = await import(${JSON.stringify(mod)}); const a = JSON.parse(process.argv[1]); console.log(JSON.stringify(m.selectDisplayableGifClips(a.clips, new Set(a.mp4))));`, JSON.stringify({ clips, mp4 })], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}

test("未承認(受信のみ)のままなら、22本は表示候補にならない", () => {
  const clips = aliases.map((a) => ({ move_id: a.moveId, move_slug: a.moveSlug, variant: "default", media_type: "gif", media_url: "/x.gif", verification_status: "capture_received" }));
  assert.equal(loadTsWith("../src/lib/preview-gif-media.ts", clips, []).length, 0);
});

test("対応表の素材・HOLD素材は接続用マニフェストに入っていない(接続は未実施)", () => {
  const files = new Set(loadIntakeManifests().flatMap((m) => m.manifest.clips.map((c) => c.source_file)));
  const ids = new Set(loadIntakeManifests().flatMap((m) => m.manifest.clips.map((c) => c.move_id)));
  for (const a of aliases) { assert.ok(!files.has(a.sourceFile), a.sourceFile); assert.ok(!ids.has(a.moveId), `${a.moveSlug} は既に別素材で接続候補になっている`); }
});
