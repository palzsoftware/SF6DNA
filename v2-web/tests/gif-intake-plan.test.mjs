// 全キャラ共通のGIF受入(受入計画 intake-plan.mjs / ローカルQAデータの自動探索 local-qa-gif-sources.ts)のテスト。
// 公開・承認・DBには触れない。確認するのは「確認済みだけ接続候補になり、未確認はHOLDになる」「MP4優先」「キャラを足してもコード編集が要らない」こと。
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(here(p), "utf8").replace(/^﻿/, ""));
const { normalizePackageRecords, normalizeAliasRows, planIntake, loadMp4MoveIdsFor } = await import(pathToFileURL(here("../../scripts/gif-intake/intake-plan.mjs")).href);

// ---- 合成データ(テスト専用。実在の技ではない) ----
const fixture = { characters: {
  aaa: { moves: [
    { id: "move-aaa-1", slug: "aaa-hp", name: "強P" },
    { id: "move-aaa-2", slug: "aaa-sb-l", name: "弱 サンドブラスト" },
    { id: "move-aaa-3", slug: "aaa-mp4", name: "ドライブインパクト" },
    { id: "move-aaa-4", slug: "aaa-od", name: "OD サンドブラスト" },
  ] },
  bbb: { moves: [{ id: "move-bbb-1", slug: "bbb-hp", name: "強P" }] },
} };
const rec = (o) => ({ asset_filename: "x.gif", asset_sha256: "s0", technical_qa: "PASS", publication_status: "NOT_APPROVED", ...o });
const alias = (sha, moveId) => ({ sha256: sha, moveId, status: "MATCHED_STATIC" });
const run = (records, extra = {}) => planIntake({ character: "aaa", records: normalizePackageRecords({ records }), fixture, ...extra });
const one = (r, extra) => run([r], extra).rows[0];

test("パッケージのキー名の違い(asset_filename / gif / filename)を吸収し、同じGIFは1件にまとめる", () => {
  const a = normalizePackageRecords({ records: [{ asset_filename: "a.gif", asset_sha256: "s1" }] });
  const b = normalizePackageRecords({ rows: [{ gif: "b.gif", gif_sha256: "s2", move_strength: "CANDIDATE_NOT_VERIFIED" }], nested: { list: [{ filename: "c.gif", sha256: "s3" }] } });
  assert.deepEqual([...a, ...b].map((r) => r.file), ["a.gif", "b.gif", "c.gif"]);
  assert.equal(b[0].strengthStatus, "CANDIDATE_NOT_VERIFIED");
  const merged = normalizePackageRecords([{ records: [{ asset_filename: "a.gif", asset_sha256: "s1" }] }, { rows: [{ gif: "a.gif", gif_sha256: "s1" }] }]);
  assert.equal(merged.length, 1);
});

test("「CLAUDE_TO_CONFIRM」のような未確定の語は技IDとして扱わない", () => {
  const [r] = normalizePackageRecords({ rows: [{ gif: "a.gif", gif_sha256: "s", formal_move_id: "CLAUDE_TO_CONFIRM" }] });
  assert.equal(r.claimedMoveId, null);
});

test("技IDの根拠なし→NO_MOVE_ID(HOLD)", () => assert.deepEqual(one(rec({})).reasons, ["NO_MOVE_ID"]));

test("別名対応表で技IDが確認でき目視QAも済み→CONNECT_READY。目視未了→NEEDS_VISUAL_QA", () => {
  const aliases = [alias("s0", "move-aaa-1")];
  assert.equal(one(rec({}), { aliases }).status, "NEEDS_VISUAL_QA");
  const vq = new Map([["x.gif", { result: "CONFIRMED", localConnectionCandidate: true }]]);
  const r = one(rec({}), { aliases, visualQaByFile: vq });
  assert.equal(r.status, "CONNECT_READY");
  assert.equal(r.moveSlug, "aaa-hp");
});

test("目視QAがNEEDS_MORE_CHECKなら接続候補にしない", () => {
  const vq = new Map([["x.gif", { result: "NEEDS_MORE_CHECK", localConnectionCandidate: false, moveId: "move-aaa-1" }]]);
  assert.equal(one(rec({}), { aliases: [alias("s0", "move-aaa-1")], visualQaByFile: vq }).status, "NEEDS_VISUAL_QA");
  assert.equal(one(rec({}), { visualQaByFile: vq }).status, "HOLD"); // 未確認の目視QAは技IDの根拠にもしない
});

test("既存MP4がある技はMP4_PRIORITY(GIFを上乗せしない)", () => {
  const r = one(rec({}), { aliases: [alias("s0", "move-aaa-3")], mp4MoveIds: new Set(["move-aaa-3"]) });
  assert.equal(r.status, "MP4_PRIORITY");
});

test("強度(弱/中/強)が未確認のGIFは、技IDが分かってもHOLD(撮影順・見た目だけで解除しない)", () => {
  for (const s of ["NOT_VERIFIED", "CANDIDATE_NOT_VERIFIED"]) {
    const r = one(rec({ move_strength: s }), { aliases: [alias("s0", "move-aaa-2")] });
    assert.equal(r.status, "HOLD");
    assert.deepEqual(r.reasons, ["STRENGTH_NOT_VERIFIED"]);
  }
  // パッケージの主張だけ(別名表・目視QAの裏付け無し)で強度未記載の弱/中/強もHOLD
  assert.deepEqual(one(rec({ confirmed_move_id: "move-aaa-2" })).reasons, ["STRENGTH_NOT_VERIFIED"]);
  // 強度の記載が無い場合も(別名表で技IDが分かっていても)HOLD。VERIFIED/CONFIRMED と明記されたものだけ通る
  assert.deepEqual(one(rec({}), { aliases: [alias("s0", "move-aaa-2")] }).reasons, ["STRENGTH_NOT_VERIFIED"]);
  for (const ok of ["VERIFIED", "CONFIRMED"]) assert.equal(one(rec({ move_strength: ok }), { aliases: [alias("s0", "move-aaa-2")] }).status, "NEEDS_VISUAL_QA");
});

test("強度を持たない技(OD・単発など)は、強度の記載が無くてもHOLDにしない", () => {
  assert.equal(one(rec({}), { aliases: [alias("s0", "move-aaa-4")] }).status, "NEEDS_VISUAL_QA");
});

test("公開用データに無い技ID/他キャラの技IDはHOLD", () => {
  assert.deepEqual(one(rec({ confirmed_move_id: "zzz-unknown-id" })).reasons, ["MOVE_ID_NOT_IN_FIXTURE"]);
  assert.deepEqual(one(rec({ confirmed_move_id: "move-bbb-9-unknown" })).reasons, ["MOVE_ID_NOT_IN_FIXTURE"]);
  assert.deepEqual(one(rec({}), { aliases: [alias("s0", "move-bbb-1")] }).reasons, ["CROSS_CHARACTER_MOVE_ID"]);
});

test("別名表とパッケージの技IDが食い違えばID_CONFLICT。MAPPING_HOLD・技術QA不合格・SHA欠落もHOLD", () => {
  assert.deepEqual(one(rec({ confirmed_move_id: "move-aaa-1-claimed" }), { aliases: [alias("s0", "move-aaa-1")] }).reasons, ["ID_CONFLICT"]);
  assert.ok(one(rec({ mapping_status: "HOLD" }), { aliases: [alias("s0", "move-aaa-1")] }).reasons.includes("MAPPING_HOLD"));
  assert.ok(one(rec({ technical_qa: "FAIL" }), { aliases: [alias("s0", "move-aaa-1")] }).reasons.includes("TECHNICAL_QA_NOT_PASS"));
  assert.ok(one(rec({ asset_sha256: null }), { aliases: [alias("s0", "move-aaa-1")] }).reasons.includes("SHA_MISSING"));
});

test("同一内容(SHA-256)・同一技の重複は2件目をHOLD。1件目は残る(工程全体は止めない)", () => {
  const p = run([rec({ asset_filename: "1.gif", asset_sha256: "dup" }), rec({ asset_filename: "2.gif", asset_sha256: "dup" }),
    rec({ asset_filename: "3.gif", asset_sha256: "s3" }), rec({ asset_filename: "4.gif", asset_sha256: "s4" })],
  { aliases: [alias("dup", "move-aaa-1"), alias("s3", "move-aaa-4"), alias("s4", "move-aaa-4")] });
  assert.deepEqual(p.rows.map((r) => r.status), ["NEEDS_VISUAL_QA", "HOLD", "NEEDS_VISUAL_QA", "HOLD"]);
  assert.deepEqual(p.rows[1].reasons, ["DUPLICATE_CONTENT"]);
  assert.deepEqual(p.rows[3].reasons, ["DUPLICATE_MOVE"]);
});

test("パッケージが公開承認済みと書いていても承認扱いにしない(警告のみ)", () => {
  const r = one(rec({ publication_status: "APPROVED" }), { aliases: [alias("s0", "move-aaa-1")] });
  assert.deepEqual(r.warnings, ["PUBLICATION_FLAG_IGNORED"]);
  assert.ok(!JSON.stringify(r).includes("approved_for_preview"));
  assert.ok(!["APPROVED", "PUBLISHED"].includes(r.status));
});

test("存在しないキャラは例外(黙って別キャラに接続しない)", () => {
  assert.throws(() => planIntake({ character: "nobody", records: [], fixture }), /公開用データに無いキャラ/);
});

test("別名表・素材台帳の列名の違いを吸収する(sha256/asset_sha256, moveId/move_id, status/static_status)", () => {
  assert.deepEqual(normalizeAliasRows([{ asset_sha256: "s", move_id: "m", static_status: "MATCHED_STATIC" }, { sha256: "x" }]), [{ sha256: "s", moveId: "m", status: "MATCHED_STATIC" }]);
});

// ---- 実データでの回帰(今回のルーク必殺技・JP) ----
const real = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json");
const pkgDir = "../../scripts/gif-intake/packages/";
test("実データ: ルーク必殺技 — 強度未確認9本・技ID無し7本はHOLD、接続可能は既に接続済みの3本のみ", () => {
  const recs = normalizePackageRecords([json(`${pkgDir}luke-special-handoff-20261116/LUKE_SPECIAL9_strength_manifest.json`), json(`${pkgDir}luke-special-handoff-20261116/LUKE_SPECIAL_REMAINING10_manifest.json`)]);
  const vq = new Map(json("../../scripts/gif-intake/luke-visual-qa-20261116.json").entries.map((e) => [e.file, e]));
  const p = planIntake({ character: "luke", records: recs, aliases: json("../../scripts/gif-intake/luke-ledger-71-20261116.json").rows, fixture: real, mp4MoveIds: loadMp4MoveIdsFor("luke"), visualQaByFile: vq });
  assert.equal(p.total, 19);
  assert.deepEqual(p.summary, { HOLD: 16, CONNECT_READY: 3 });
  assert.deepEqual(p.holdReasons, { STRENGTH_NOT_VERIFIED: 9, NO_MOVE_ID: 7 });
  const connected = new Set(json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_LUKE_20261116.json").entries.map((e) => e.moveId));
  for (const r of p.rows.filter((x) => x.status === "CONNECT_READY")) assert.ok(connected.has(r.moveId), r.file); // 新規接続は増えない
});

test("実データ: JP47本 — 接続可能5(既存3+OD ストリボーグ/OD トルバラン)・MP4優先3・HOLD39(弱中強は強度未確認)", () => {
  const vq = new Map([...json("../../scripts/gif-intake/jp-visual-qa-20261116.json").entries, ...json("../../scripts/gif-intake/jp-visual-qa-supplement-20261116.json").entries].map((e) => [e.file, e]));
  const p = planIntake({ character: "jp", records: normalizePackageRecords(json(`${pkgDir}jp-47-handoff-20261116/integration_manifest.json`)),
    aliases: json("../../scripts/gif-intake/jp-alias-verification-20261116.json").rows, fixture: real, mp4MoveIds: loadMp4MoveIdsFor("jp"), visualQaByFile: vq });
  assert.deepEqual(p.summary, { HOLD: 39, CONNECT_READY: 5, MP4_PRIORITY: 3 });
  const qa = json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_JP_20261116.json");
  assert.deepEqual(qa.entries.map((e) => e.moveSlug).sort(), p.rows.filter((r) => r.status === "CONNECT_READY").map((r) => r.moveSlug).sort()); // 接続データ=接続可能判定
});

test("ルーク④共通システム5本の記録: 接続0・全HOLD・技IDを増やさない", () => {
  const d = json("../../scripts/gif-intake/luke-system5-20261116.json");
  assert.equal(d.entries.length, 5);
  assert.equal(d.result.connected, 0);
  assert.ok(d.entries.every((e) => e.status === "HOLD_NO_RELEASE_MOVE_ID"));
  const ids = new Set(real.characters.luke.moves.map((m) => m.slug));
  for (const w of ["forward-dash", "muzzle-flash", "drive-parry", "parry-drive-rush", "cancel-drive-rush"]) assert.ok(![...ids].some((s) => s.includes(w)), w);
});

// ---- ローカルQAデータの自動探索(キャラを足してもコード編集が要らない) ----
async function loadSources() {
  const dir = mkdtempSync(join(tmpdir(), "sources-test-"));
  writeFileSync(join(dir, "sources.mjs"), ts.transpileModule(readFileSync(here("../src/lib/local-qa-gif-sources.ts"), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText);
  return import(pathToFileURL(join(dir, "sources.mjs")).href);
}
const S = await loadSources();

test("ファイル名の規則で最新日付のQAデータを選ぶ。VARIANTS専用ファイルや別キャラは混ざらない", () => {
  const files = ["SF6DNA_LOCAL_QA_GIF_LUKE_20261116.json", "SF6DNA_LOCAL_QA_GIF_LUKE_20261120.json", "SF6DNA_LOCAL_QA_GIF_LUKE_VARIANTS_20261130.json", "SF6DNA_LOCAL_QA_GIF_E-HONDA_20261117.json", "SF6DNA_LOCAL_QA_GIF_LUKEX_20261201.json"];
  assert.equal(S.pickLatestQaFile(files, "luke", "gif"), "SF6DNA_LOCAL_QA_GIF_LUKE_20261120.json");
  assert.equal(S.pickLatestQaFile(files, "luke", "variants"), "SF6DNA_LOCAL_QA_GIF_LUKE_VARIANTS_20261130.json");
  assert.equal(S.pickLatestQaFile(files, "e-honda", "gif"), "SF6DNA_LOCAL_QA_GIF_E-HONDA_20261117.json");
  assert.equal(S.pickLatestQaFile(files, "ryu", "gif"), null);
});

test("危険なslug(../ など)は受け付けない", async () => {
  for (const bad of ["../luke", "luke/../../x", "LUKE", "luke.json", "", "a b"]) {
    assert.equal(S.isSafeCharacterSlug(bad), false, bad);
    assert.equal(await S.loadLocalQaGifDoc(bad), null, bad);
    assert.equal((await S.loadMp4MoveIdsFor(bad)).size, 0, bad);
  }
});

test("実ファイル: 既存のluke(15本)/jp/manon/派生パターンを従来どおり読める。QAデータが無いキャラはnull", async () => {
  assert.equal((await S.loadLocalQaGifDoc("luke")).entries.length, 15);
  assert.equal((await S.loadLocalQaGifDoc("jp")).entries.length, 5); // 既存3 + OD ストリボーグ/OD トルバラン
  assert.equal((await S.loadLocalQaGifDoc("manon")).entries.length, 16); // 8 + 立ち通常技6(複合根拠 P3) + 投げ2(2026-11-17)
  assert.equal((await S.loadLocalQaVariantDoc("luke")).groups.length, 4);
  assert.equal(await S.loadLocalQaGifDoc("zangief"), null);
  assert.equal(await S.loadLocalQaVariantDoc("jp"), null);
  assert.equal((await S.loadLocalQaGifDoc("juri")).entries.length, 5); // 新キャラ(juri)は対応表の編集なしで自動検出される
  const listed = await S.listLocalQaGifCharacters();
  for (const slug of ["jp", "juri", "luke", "manon"]) assert.ok(listed.includes(slug), slug);
});

test("MP4優先: 従来3キャラの件数が変わらず、これまで対応表に無かったjamie/marisa/yasmine/ryuでも読める", async () => {
  const approved = (f, slug) => json(`../src/data/${f}`).clips.filter((c) => c.verification_status === "approved_for_preview").map((c) => c.move_id);
  const cases = { luke: "SF6DNA_VER1_LUKE_MEDIA_MANIFEST_20260924.json", jp: "SF6DNA_VER1_RYU_JP_MEDIA_MANIFEST_20260923.json", manon: "SF6DNA_VER1_MANON_MEDIA_MANIFEST_20260925.json",
    jamie: "SF6DNA_VER1_JAMIE_MEDIA_MANIFEST_20261003.json", marisa: "SF6DNA_VER1_MARISA_MEDIA_MANIFEST_20261003.json", yasmine: "SF6DNA_VER1_YASMINE_MEDIA_MANIFEST_20261003.json", ryu: "SF6DNA_VER1_RYU_MEDIA_MANIFEST_20260924.json" };
  for (const [slug, f] of Object.entries(cases)) {
    const ids = await S.loadMp4MoveIdsFor(slug);
    assert.deepEqual([...ids].sort(), [...new Set(approved(f, slug))].sort(), slug);
  }
  assert.equal((await S.loadMp4MoveIdsFor("luke")).size, 6); // ルークのMP4優先は6本のまま
  assert.equal((await S.loadMp4MoveIdsFor("zangief")).size, 0);
});

test("取得できなかった素材(容量制限)は素材不存在と区別してHOLD。動画(.mp4)の記載はGIFとして拾わない", () => {
  const recs = normalizePackageRecords({ records: [{ asset_filename: "big.gif", asset_sha256: null, asset_retrieval: "SIZE_LIMIT" }], source_video: { filename: "clip.mp4", sha256: "v" }, luke: { source_videos: [{ filename: "a.mp4" }] } });
  assert.deepEqual(recs.map((r) => r.file), ["big.gif"]);
  const r = planIntake({ character: "aaa", records: recs, fixture }).rows[0];
  assert.deepEqual(r.reasons.slice(0, 1), ["ASSET_NOT_RETRIEVED"]);
  assert.ok(!r.reasons.includes("SHA_MISSING")); // 「SHA未記載」ではなく「取得できなかった」と記録する
});

test("別名表で『技IDは名前で分かるが強度の証拠なし』と明示された弱/中/強はSTRENGTH_NOT_VERIFIEDでHOLD", () => {
  const a = [{ sha256: "s0", moveId: "move-aaa-2", status: "NEEDS_STRENGTH_EVIDENCE" }];
  assert.deepEqual(one(rec({}), { aliases: a }).reasons, ["STRENGTH_NOT_VERIFIED"]);
});

test("実データ: ジュリ — 接続可能はOD天穿輪・SA1・SA2の3本、弱中強・SA3(容量制限)・新規2本はHOLD", () => {
  const d = `${pkgDir}juri-handoff-20261116/`;
  const p = planIntake({ character: "juri", records: normalizePackageRecords([json(`${d}LUKE_MODERN_JURI_batch_manifest_20261116.json`), json(`${d}JURI_existing7_records_20261116.json`)]),
    aliases: json("../../scripts/gif-intake/juri-aliases-20261116.json").rows, fixture: real, mp4MoveIds: loadMp4MoveIdsFor("juri"),
    visualQaByFile: new Map(json("../../scripts/gif-intake/juri-visual-qa-20261116.json").entries.map((e) => [e.file, e])) });
  assert.equal(p.total, 9);
  assert.deepEqual(p.summary, { HOLD: 6, CONNECT_READY: 3 });
  assert.deepEqual(p.holdReasons, { MAPPING_HOLD: 2, NO_MOVE_ID: 3, STRENGTH_NOT_VERIFIED: 3, ASSET_NOT_RETRIEVED: 1 });
  const ready = p.rows.filter((r) => r.status === "CONNECT_READY").map((r) => r.moveSlug).sort();
  assert.deepEqual(ready, ["juri-sa1", "juri-sa2", "juri-tensenrin-od"]);
  const qa = json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_JURI_20261116.json");
  assert.equal(qa.localQaOnly, true);
  assert.equal(qa.approval, "NOT_APPROVED");
  // 接続データ = 既存の接続可能3本 + 第7バッチの空中投げ(下のテストで判定)。弱中強・SA3・第2バッチ新規は含まない
  assert.deepEqual(qa.entries.map((e) => e.moveSlug).sort(), [...ready, "juri-air-throw", "juri-sa3"].sort());
  const ids = new Map(real.characters.juri.moves.map((m) => [m.id, m.slug]));
  for (const e of qa.entries) assert.equal(ids.get(e.moveId), e.moveSlug); // 技IDは公開用データのもの(増やしていない)
});

test("実データ: ジュリ第2バッチ4本 — 全てHOLD(技ID・強度・入力条件が未記載)で新規接続0、既存の接続可能3本は変わらない", () => {
  const d = `${pkgDir}juri-handoff-20261116/`;
  const b2 = json(`${pkgDir}juri-handoff-20261116-02/JURI_GIF_BATCH_20261116_02_manifest.json`);
  const recs = normalizePackageRecords([json(`${d}LUKE_MODERN_JURI_batch_manifest_20261116.json`), json(`${d}JURI_existing7_records_20261116.json`), b2]);
  const p = planIntake({ character: "juri", records: recs, aliases: json("../../scripts/gif-intake/juri-aliases-20261116.json").rows, fixture: real, mp4MoveIds: loadMp4MoveIdsFor("juri"),
    visualQaByFile: new Map(json("../../scripts/gif-intake/juri-visual-qa-20261116.json").entries.map((e) => [e.file, e])) });
  const newFiles = b2.new_candidates.map((c) => c.filename);
  assert.equal(newFiles.length, 4);
  for (const f of newFiles) {
    const r = p.rows.find((x) => x.file === f);
    assert.equal(r.status, "HOLD", f);
    assert.ok(r.reasons.includes("NO_MOVE_ID") && r.reasons.includes("MAPPING_HOLD"), f);
  }
  assert.equal(p.total, 13);
  assert.deepEqual(p.summary, { HOLD: 10, CONNECT_READY: 3 });
  const ev = json("../../scripts/gif-intake/juri-batch2-evaluation-20261116.json");
  assert.equal(ev.result.connected, 0);
  assert.equal(ev.sa3.status, "SIZE_LIMIT");
  assert.equal(json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_JURI_20261116.json").entries.length, 5); // 第2バッチ時点で3本 + 第7バッチの空中投げ1本(第2バッチ自体の新規接続は0)
});

test("実データ: ジュリ第7バッチ — 空中投げ1本だけ接続可能(目視QA済み・公開用データに1行のみ)、地上投げ2本は前後の区別ができずHOLD", () => {
  const p = planIntake({ character: "juri", records: normalizePackageRecords(json(`${pkgDir}juri-handoff-20261117-b07/JURI_BATCH07_manifest.json`)),
    fixture: real, mp4MoveIds: loadMp4MoveIdsFor("juri"),
    visualQaByFile: new Map(json("../../scripts/gif-intake/juri-visual-qa-supplement-20261117.json").entries.map((e) => [e.file, e])) });
  assert.deepEqual(p.summary, { HOLD: 2, CONNECT_READY: 1 });
  assert.deepEqual(p.holdReasons, { NO_MOVE_ID: 2 });
  const ready = p.rows.find((r) => r.status === "CONNECT_READY");
  assert.equal(ready.moveSlug, "juri-air-throw");
  assert.equal(ready.idSource, "VISUAL_QA");
  assert.equal(real.characters.juri.moves.filter((m) => m.name === "空中投げ").length, 1); // 名前が一意であることが接続の前提
  const qa = json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_JURI_20261116.json");
  assert.ok(qa.entries.some((e) => e.moveSlug === "juri-air-throw" && e.sha256 === ready.sha256));
  assert.ok(qa.approval === "NOT_APPROVED" && qa.localQaOnly === true);
});

test("実データ: P0 5本 — 入れ子の qa.sha256 形式でも読め、ジュリSA3(軽量版)だけ接続可能、他4本はmoveId未確定でHOLD", () => {
  const p = planIntake({ character: "juri", records: normalizePackageRecords(json(`${pkgDir}drive-handoff-p0-20261117/CLAUDE_P0_5GIF_MANIFEST_20261117.json`)),
    fixture: real, mp4MoveIds: loadMp4MoveIdsFor("juri"),
    visualQaByFile: new Map(json("../../scripts/gif-intake/juri-visual-qa-supplement-20261117.json").entries.map((e) => [e.file, e])) });
  const ready = p.rows.filter((r) => r.status === "CONNECT_READY");
  assert.deepEqual(ready.map((r) => r.moveSlug), ["juri-sa3"]);
  assert.ok(!p.rows.some((r) => r.reasons?.includes?.("SHA_MISSING")), "入れ子qaのSHAを読めている");
  assert.equal(p.rows.filter((r) => r.status === "HOLD").length, 4);
  const qa = json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_JURI_20261116.json");
  assert.ok(qa.entries.some((e) => e.moveSlug === "juri-sa3" && e.sha256 === ready[0].sha256));
});

test("実データ: ジェイミー27本 — 入力表示+OD表示で確定した5本だけ接続可能、点辰2本はMP4優先、強度未確認・多段・10MB超はHOLD", () => {
  const p = planIntake({ character: "jamie",
    records: normalizePackageRecords(json(`${pkgDir}jamie-drive-20261117/JAMIE_INTAKE_manifest_20261117.json`)),
    fixture: real, mp4MoveIds: loadMp4MoveIdsFor("jamie"),
    visualQaByFile: new Map(json("../../scripts/gif-intake/jamie-visual-qa-20261117.json").entries.map((e) => [e.file, e])) });
  assert.equal(p.total, 27);
  assert.deepEqual(p.rows.filter((r) => r.status === "CONNECT_READY").map((r) => r.moveSlug).sort(),
    ["jamie-frame-075", "jamie-frame-079", "jamie-frame-083", "jamie-frame-088", "jamie-frame-089"]);
  // 既存MP4がある技(点辰)はGIFより動画を優先
  assert.deepEqual(p.rows.filter((r) => r.status === "MP4_PRIORITY").map((r) => r.moveSlug).sort(), ["jamie-frame-084", "jamie-frame-085"]);
  // 弱/中/強はファイル名だけでは確定しない(9本)、10MB超の2本は取得不可として区別される
  assert.equal(p.holdReasons.STRENGTH_NOT_VERIFIED, 9);
  assert.equal(p.holdReasons.ASSET_NOT_RETRIEVED, 2);
  for (const r of p.rows.filter((r) => r.status === "CONNECT_READY")) assert.equal(r.idSource, "VISUAL_QA");
  const qa = json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_JAMIE_20261116.json");
  assert.equal(qa.entries.length, 11); // このバッチの5本 + SA3/CA軽量版2本(別テスト) + 立ち通常技4本(複合根拠 P3)
  assert.ok(qa.approval === "NOT_APPROVED" && qa.localQaOnly === true);
});

test("実データ: マノンSA1/SA2 — 映像内の入力表示(236236K / 214214K)で区別でき、SA1/SA2を含む接続(SA3/CAは236236Pで別カード・軽量版で後日追加)", () => {
  const qa = json("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_MANON_20261116.json");
  assert.deepEqual(qa.entries.map((e) => e.moveSlug).sort(), ["manon-back-throw", "manon-ca", "manon-degage-h", "manon-degage-od", "manon-forward-throw", "manon-manege-od", "manon-rond-point-od", "manon-sa1", "manon-sa2", "manon-sa3", "manon-standing-hk", "manon-standing-hp", "manon-standing-lk", "manon-standing-lp", "manon-standing-mk", "manon-standing-mp"]);
  const cmd = (slug) => real.characters.manon.moves.find((m) => m.slug === slug).commands.find((c) => c.scheme === "classic").numericNotation;
  assert.equal(cmd("manon-sa1"), "236236K"); assert.equal(cmd("manon-sa2"), "214214K");
  assert.equal(cmd("manon-sa3"), "236236P"); // SA1と同じ↓↘→↓↘→でもボタンがPなので別の技
  assert.ok(qa.approval === "NOT_APPROVED" && qa.localQaOnly === true);
});

test("実データ: SA3/CA軽量版4本 — SHA一致・10MB未満・独立カード(技ID別)へ接続、既存SA/CAカードの仕様は変更なし", () => {
  const man = json("../../scripts/gif-intake/packages/sa-lightweight-20261117/SF6DNA_SA_LIGHTWEIGHT_MANIFEST_20261117.json");
  const want = { "jamie-sa3-getsusaiho.gif": ["jamie", "jamie-frame-090"], "jamie-ca-getsusaiho.gif": ["jamie", "jamie-frame-091"],
    "manon-sa3-pas-de-deux.gif": ["manon", "manon-sa3"], "manon-ca-pas-de-deux.gif": ["manon", "manon-ca"] };
  for (const a of man.assets) {
    assert.ok(a.bytes < 10 * 1024 * 1024, a.filename);
    const [ch, slug] = want[a.original];
    const qa = json(`../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_${ch.toUpperCase()}_20261116.json`);
    const e = qa.entries.find((x) => x.moveSlug === slug);
    assert.ok(e, slug);
    assert.equal(e.sha256, a.sha256); // 受領SHA(manifest)と接続データのSHAが一致
    const row = real.characters[ch].moves.find((m) => m.slug === slug);
    assert.equal(e.moveId, row.id);
  }
  // SA3 と CA は別々の技行(別カード)で、同じコマンド 236236P を共有する
  for (const ch of ["jamie", "manon"]) {
    const ms = real.characters[ch].moves;
    const sa3 = ms.find((m) => /^SA3/.test(m.name)), ca = ms.find((m) => /^CA/.test(m.name));
    assert.notEqual(sa3.id, ca.id);
    const c = (m) => m.commands.find((x) => x.scheme === "classic").numericNotation;
    assert.equal(c(sa3), c(ca));
  }
});
