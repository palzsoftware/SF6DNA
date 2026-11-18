// Luke 71本の接続候補台帳(build-character-ledger.py --character luke)のテスト。静的照合であり、承認・表示を伴わない。
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadMp4MoveIds } from "../../scripts/gif-intake/validate-gif-intake.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const led = json("../../scripts/gif-intake/luke-ledger-71-20261116.json");
const inv = json("../../scripts/gif-intake/asset-inventory-luke-manon-jp-20261116.json").records.filter((r) => r.character === "luke");
const luke = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json").characters.luke.moves;
const cands = json("../src/data/gif-intake/SF6DNA_VER1_LUKE_GIF_MANIFEST_CANDIDATE_20261116.json").clips;
const mp4 = loadMp4MoveIds();

test("71本が重複なく載り、素材在庫と一致する(取得不能2本は合格扱いにしない)", () => {
  assert.equal(led.rows.length, 71);
  assert.equal(new Set(led.rows.map((r) => r.filename)).size, 71);
  assert.deepEqual(led.rows.map((r) => r.filename).sort(), inv.map((r) => r.file).sort());
  assert.deepEqual(led.assetSummary, { ASSET_VERIFIED: 69, ASSET_UNAVAILABLE: 2 });
  for (const r of led.rows.filter((x) => x.asset_status === "ASSET_UNAVAILABLE")) {
    assert.ok(!r.asset_sha256 && r.static_status !== "MATCHED_STATIC" && r.issue.includes("ASSET_UNAVAILABLE"), r.filename);
  }
});

test("判定内訳: 静的一致36 / 要映像確認10 / HOLD17 / 重複BLOCKED2 / MP4優先6 (APPROVEDなし)", () => {
  assert.deepEqual(led.summary, { MATCHED_STATIC: 36, NEEDS_VISUAL_QA: 10, HOLD: 17, BLOCKED_DUPLICATE: 2, MP4_PRIORITY_KEPT: 6 });
  assert.ok(led.rows.every((r) => r.approval === "NOT_APPROVED" && r.display_eligible === false));
});

test("技IDはLukeの公開用データに実在し、MATCHED_STATICは候補Manifestと完全に一致する", () => {
  const ids = new Map(luke.map((m) => [m.id, m.slug]));
  for (const r of led.rows.filter((x) => x.move_id)) assert.equal(ids.get(r.move_id), r.move_slug, r.filename);
  const m = led.rows.filter((r) => r.static_status === "MATCHED_STATIC");
  assert.deepEqual(m.map((r) => r.move_id).sort(), cands.map((c) => c.move_id).sort());
  assert.equal(new Set(m.map((r) => r.move_id)).size, 36, "1技IDにつき候補GIFは1本");
});

test("MP4優先・重複・HOLDは接続候補に入らない。同一バイト重複は片方のみ候補", () => {
  for (const r of led.rows.filter((x) => x.static_status === "MP4_PRIORITY_KEPT")) assert.ok(r.existing_mp4 && !cands.some((c) => c.source_file === r.filename));
  for (const f of ["22_3-luke-standing-mp.gif", "22_16-luke-jumping-mk.gif"]) assert.equal(led.rows.find((r) => r.filename === f).static_status, "BLOCKED_DUPLICATE");
  for (const r of led.rows.filter((x) => x.static_status === "MATCHED_STATIC")) assert.ok(!mp4.has(r.move_id), `${r.filename}: MP4を持つ技にGIFを上乗せしない`);
});

test("未制作の2技(前強P単発・OD フラッシュナックル)は素材なしとして記録され、近い名前のGIFを自動対応させない", () => {
  assert.deepEqual(led.moveGaps.map((g) => g.slug).sort(), ["luke-flash-knuckle-od", "luke-forward-hp"]);
  const od = led.moveGaps.find((g) => g.slug === "luke-flash-knuckle-od");
  assert.ok(od.nameNearMatches.includes("22_45-luke-od-flash-knuckle-followup.gif"));
  for (const f of od.nameNearMatches) assert.ok(!led.rows.find((r) => r.filename === f).move_id || led.rows.find((r) => r.filename === f).move_slug !== "luke-flash-knuckle-od");
  assert.equal(led.rows.find((r) => r.filename === "22_23-luke-double-impact-followup.gif").move_slug, "luke-forward-hp-hp", "2段目は前強P単発ではない");
});

test("未承認の候補は表示選別(selectDisplayableGifClips)で0件になる", () => {
  const mod = pathToFileURL(here("../src/lib/preview-gif-media.ts")).href;
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--input-type=module", "-e",
    `const m = await import(${JSON.stringify(mod)}); console.log(JSON.stringify(m.selectDisplayableGifClips(${JSON.stringify(cands)}, new Set())));`], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(JSON.parse(r.stdout).length, 0);
});

const vqa = json("../../scripts/gif-intake/luke-visual-qa-20261116.json");

test("一括映像QA: 静的一致36本を分類(確認済み12 / 要追加確認24 / 不一致0)し、台帳と一致する", () => {
  assert.equal(vqa.entries.length, 36);
  assert.deepEqual(vqa.summary, { CONFIRMED: 12, NEEDS_MORE_CHECK: 24 });
  assert.deepEqual(vqa.mismatches, []);
  assert.deepEqual(vqa.entries.map((e) => e.file).sort(), led.rows.filter((r) => r.static_status === "MATCHED_STATIC").map((r) => r.filename).sort());
  assert.deepEqual(led.visualSummary, { VISUAL_CONFIRMED_SAMPLED: 12, VISUAL_NEEDS_MORE_CHECK: 24, VISUAL_NOT_RUN: 35 });
});

test("ローカル接続候補は『確認済み』だけ。要確認・MP4優先・HOLD・重複・要映像確認10本は含まれず、承認もされない", () => {
  const local = led.rows.filter((r) => r.local_connection_candidate);
  assert.equal(local.length, 12);
  assert.ok(local.every((r) => r.static_status === "MATCHED_STATIC" && r.visual_status === "VISUAL_CONFIRMED_SAMPLED" && !r.existing_mp4 && r.approval === "NOT_APPROVED" && r.display_eligible === false));
  for (const r of led.rows.filter((x) => x.static_status !== "MATCHED_STATIC")) assert.equal(r.local_connection_candidate, false, r.filename);
  for (const r of led.rows.filter((x) => x.visual_status === "VISUAL_NEEDS_MORE_CHECK")) assert.equal(r.local_connection_candidate, false, r.filename);
  assert.ok(vqa.entries.every((e) => e.approval === "NOT_APPROVED" && e.unconfirmed.length > 0), "未確認事項が必ず残る");
});

test("強度が判別できない同系統(弱/中/強)は確認済みにならず、OD・派生・固有技は強度が一意なので確認済み", () => {
  const by = Object.fromEntries(vqa.entries.map((e) => [e.moveSlug, e]));
  for (const s of ["luke-sand-blast-l", "luke-sand-blast-m", "luke-sand-blast-h", "luke-standing-hp", "luke-flash-knuckle-m", "luke-rising-uppercut-h"]) assert.equal(by[s].result, "NEEDS_MORE_CHECK", s);
  for (const s of ["luke-sand-blast-od", "luke-rising-uppercut-od", "luke-fatal-shot", "luke-ddt", "luke-impaler", "luke-no-chaser", "luke-slam-dunk", "luke-avenger"]) assert.equal(by[s].result, "CONFIRMED", s);
  for (const s of ["luke-fatal-shot", "luke-ddt", "luke-impaler", "luke-no-chaser", "luke-slam-dunk"]) assert.equal(by[s].checks.derivationConditionVisible, true, s);
  assert.ok(vqa.entries.every((e) => e.checks.recordingRangeCoversMove === true && e.checks.noUnrelatedScreenOrCutoff === true));
});
