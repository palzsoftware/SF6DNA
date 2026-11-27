import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadIntakeManifests, loadMp4MoveIds, validateGifIntake } from "../../scripts/gif-intake/validate-gif-intake.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const fixture = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json");
const report = json("../../scripts/gif-intake/gif-intake-report-20261116.json");
const analysis = json("../../scripts/gif-intake/no-move-id-analysis-20261116.json");
const manifests = loadIntakeManifests();
const mp4MoveIds = loadMp4MoveIds();
const allClips = manifests.flatMap((m) => m.manifest.clips);
const clone = (v) => JSON.parse(JSON.stringify(v));

/** TypeScriptの本物のモジュール(preview-gif-media.ts)を、Nodeの型除去モードで読み込んで実行する。 */
function runTs(fn, args) {
  const mod = pathToFileURL(here("../src/lib/preview-gif-media.ts")).href;
  // Arguments go through stdin: on Windows a long argv (over ~32K chars) fails with ENAMETOOLONG.
  const code = `import { readFileSync } from "node:fs"; const m = await import(${JSON.stringify(mod)}); const a = JSON.parse(readFileSync(0, "utf8"));
    const out = (${fn})(m, a); console.log(JSON.stringify(out));`;
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--input-type=module", "-e", code], { encoding: "utf8", input: JSON.stringify(args) });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}

test("接続候補75本が読み込め、公開用データと照合して問題がない", () => {
  assert.equal(allClips.length, 75);
  const r = validateGifIntake({ manifests, fixture, mp4MoveIds });
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, [], "候補にMP4保有の技は含まれない");
  assert.equal(r.stats.clips, 75);
});

test("候補は全件 目視未承認(approved_for_preview ではない)", () => {
  for (const c of allClips) {
    assert.equal(c.verification_status, "capture_received");
    assert.equal(c.cut_review_status, "CUT_REVIEW_PENDING");
    assert.match(c.mapping_evidence, /目視確認: 未実施/);
  }
});

test("未承認GIFは表示対象に昇格しない(実データでは表示0件)", () => {
  const shown = runTs("(m,a)=>a.flatMap((x)=>m.getGifIntakeMotionMedia(x,new Set(),0))", manifests.map((m) => m.manifest));
  assert.equal(shown.length, 0);
});

test("承認済みだけが表示され、MP4がある技・重複・非GIFは出ない", () => {
  const base = clone(allClips[0]);
  const mk = (over) => ({ ...clone(base), ...over });
  const manifest = { character_slug: "luke", clips: [
    mk({ move_id: "A", move_slug: "a", verification_status: "approved_for_preview" }),            // 表示される
    mk({ move_id: "B", move_slug: "b", verification_status: "capture_received" }),                // 未承認 → 出ない
    mk({ move_id: "C", move_slug: "c", verification_status: "approved_for_preview" }),            // MP4あり → 出ない
    mk({ move_id: "D", move_slug: "d", verification_status: "approved_for_preview" }),            // 表示される
    mk({ move_id: "D", move_slug: "d2", verification_status: "approved_for_preview" }),           // 同じ技の2件目 → 出ない
    mk({ move_id: "E", move_slug: "e", verification_status: "approved_for_preview", media_type: "video" }), // GIFでない → 出ない
  ] };
  const out = runTs("(m,a)=>m.getGifIntakeMotionMedia(a.manifest,new Set(a.mp4),10)", { manifest, mp4: ["C"] });
  assert.deepEqual(out.map((r) => r.moveId), ["A", "D"]);
  assert.deepEqual(out.map((r) => r.displayOrder), [10, 11]);
  assert.ok(out.every((r) => r.mediaType === "gif" && r.sourceUrl === null && r.status === "approved_for_preview"));
});

test("実データの技IDで MP4優先: 既存MP4の技に承認GIFを足しても出ない", () => {
  const mp4Id = [...mp4MoveIds][0];
  const clip = { ...clone(allClips[0]), move_id: mp4Id, verification_status: "approved_for_preview" };
  const out = runTs("(m,a)=>m.getGifIntakeMotionMedia({character_slug:'x',clips:[a.clip]},new Set(a.mp4),0)", { clip, mp4: [...mp4MoveIds] });
  assert.equal(out.length, 0);
});

test("検証: 技ID不存在・slug不一致・重複・無審査の承認を検出する", () => {
  const bad = (mutate) => { const ms = clone(manifests); mutate(ms); return validateGifIntake({ manifests: ms, fixture, mp4MoveIds }).errors.join("\n"); };
  assert.match(bad((ms) => { ms[0].manifest.clips[0].move_id = "00000000-0000-0000-0000-000000000000"; }), /UNKNOWN_MOVE_ID/);
  assert.match(bad((ms) => { ms[0].manifest.clips[0].move_slug = "wrong-slug"; }), /SLUG_MISMATCH/);
  assert.match(bad((ms) => { ms[0].manifest.clips[1].move_id = ms[0].manifest.clips[0].move_id; ms[0].manifest.clips[1].move_slug = ms[0].manifest.clips[0].move_slug; }), /DUPLICATE_MOVE/);
  assert.match(bad((ms) => { ms[0].manifest.source_files[1].sha256 = ms[0].manifest.source_files[0].sha256; }), /DUPLICATE_CONTENT/);
  assert.match(bad((ms) => { ms[0].manifest.clips[0].verification_status = "approved_for_preview"; }), /APPROVED_WITHOUT_REVIEW/);
});

test("受入検査の結果: 接続候補=マニフェストの75本、技IDなし75本はマニフェストに入らずHOLD", () => {
  const recs = report.records;
  assert.equal(recs.length, 246);
  const cand = recs.filter((r) => r.connectionClass === "CONNECTABLE_CANDIDATE").map((r) => r.fixtureMove.id).sort();
  assert.deepEqual(cand, allClips.map((c) => c.move_id).sort());
  const holds = recs.filter((r) => r.connectionClass === "HOLD_NO_FIXTURE_MOVE");
  assert.equal(holds.length, 75);
  const clipFiles = new Set(allClips.map((c) => c.source_file));
  for (const h of holds) {
    assert.equal(h.fixtureMove, null, `${h.file}: 技IDが無いのでfixtureMoveはnull`);
    assert.ok(!clipFiles.has(h.file), `${h.file}: HOLD素材は接続用マニフェストに入らない`);
  }
});

test("技IDなし75本の理由分類が全件を網羅し、新規技データは追加されていない", () => {
  assert.equal(analysis.length, 75);
  const cats = new Set(analysis.map((a) => a.category.split("(")[0]));
  assert.deepEqual([...cats].sort(), ["その他", "データ未登録", "既存技への統合の可能性", "識別名不一致"].sort());
  const holdFiles = new Set(report.records.filter((r) => r.connectionClass === "HOLD_NO_FIXTURE_MOVE").map((r) => r.file));
  assert.deepEqual(new Set(analysis.map((a) => a.file)), holdFiles);
  assert.equal(fixture.totals.moves, 2065, "公開用データの技数が変わっていない");
});

test("新モジュールはどこからも読み込まれていない(既存表示経路は未接続)", () => {
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
  const src = walk(here("../src")).filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith("preview-gif-media.ts"));
  assert.deepEqual(src.filter((f) => readFileSync(f, "utf8").includes("preview-gif-media")), []);
});

test("gif_intake.py: ChatGPT受領分(--incoming)で 技ID不存在=HOLD・重複=BLOCKED・MP4保有=MP4_KEPT", { skip: spawnSync("python3", ["--version"]).status !== 0 }, () => {
  const dir = mkdtempSync(path.join(tmpdir(), "gif-intake-"));
  const gif = (n) => Buffer.concat([Buffer.from("GIF89a"), Buffer.from([0xe0, 1, 0x0e, 1, 0x80, 0, 0]), Buffer.from([0, 0, 0, 255, 255, 255]),
    Buffer.from([0x21, 0xff, 11]), Buffer.from("NETSCAPE2.0"), Buffer.from([3, 1, 0, 0, 0]),
    ...Array.from({ length: 3 }, (_, i) => Buffer.concat([Buffer.from([0x21, 0xf9, 4, 0, 5, 0, 0, 0]), Buffer.from([0x2c, 0, 0, 0, 0, 0xe0, 1, 0x0e, 1, 0, 2, 2, 0x44 + n + i, 1, 0])])), Buffer.from([0x3b])]);
  writeFileSync(path.join(dir, "a.gif"), gif(1)); writeFileSync(path.join(dir, "b.gif"), gif(1)); writeFileSync(path.join(dir, "c.gif"), gif(7));
  const mp4Slug = fixture.characters.luke.moves.find((m) => m.slug === "luke-nose-breaker")?.slug ?? "luke-nose-breaker";
  writeFileSync(path.join(dir, "intake.json"), JSON.stringify([
    { file: "a.gif", character: "luke", moveSlug: "luke-no-such-move" },          // 技IDなし → HOLD
    { file: "b.gif", character: "luke", moveSlug: "luke-standing-lp" },            // aと同じ中身 → 重複
    { file: "c.gif", character: "luke", moveSlug: mp4Slug },                       // MP4保有
  ]));
  const out = path.join(dir, "out");
  const r = spawnSync("python3", [here("../../scripts/gif-intake/gif_intake.py"), "--incoming", dir, "--out", out], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  const recs = JSON.parse(readFileSync(path.join(out, "gif-intake-report.json"), "utf8")).records;
  const by = Object.fromEntries(recs.map((x) => [x.file, x.connectionClass]));
  assert.equal(by["c.gif"], "MP4_KEPT");
  assert.equal(by["b.gif"], "BLOCKED");
  assert.ok(["HOLD_NO_FIXTURE_MOVE", "BLOCKED"].includes(by["a.gif"]), by["a.gif"]);
});
