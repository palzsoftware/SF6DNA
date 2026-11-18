// 別表記16本の対応表 + 38本QA台帳のテスト(新規)。既存表示経路には接続しない前提の静的検証。
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { validateMoveAliases } from "../../scripts/gif-intake/validate-move-aliases.mjs";
import { validateJpAliases } from "../../scripts/gif-intake/validate-jp-aliases.mjs";
import { loadMp4MoveIds } from "../../scripts/gif-intake/validate-gif-intake.mjs";
import { buildQaRows, loadQaInputs } from "../../scripts/gif-intake/build-qa-ledger.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const clone = (v) => JSON.parse(JSON.stringify(v));
const fixture = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json");
const classification = json("../../scripts/gif-intake/remaining-53-classification-20261116.json").rows;
const ledgerFile = json("../../scripts/gif-intake/qa-ledger-38-20261116.json");

/** TypeScriptの表そのもの/関数を型除去モードで評価する(JSONへ写した別データを使わない)。 */
function evalTs(rel, expr, arg) {
  const mod = pathToFileURL(here(rel)).href;
  const r = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", "--input-type=module", "-e",
    `const m = await import(${JSON.stringify(mod)}); console.log(JSON.stringify((${expr})(m, ${JSON.stringify(arg ?? null)})));`], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
}
const batch2 = evalTs("../src/data/gif-intake/move-aliases-batch2.ts", "(m)=>m.MOVE_ALIASES_BATCH2");
const jp22 = evalTs("../src/data/gif-intake/jp-move-aliases.ts", "(m)=>m.JP_MOVE_ALIASES");
const mp4Ids = loadMp4MoveIds();
const inputs = await loadQaInputs();
const rows = buildQaRows(inputs);

test("条件1: 対象16件が重複なく存在する(Manon5/JP7/Luke3/Juri1)", () => {
  const targets = classification.filter((r) => r.subcategory.startsWith("A")).map((r) => r.file).sort();
  assert.equal(targets.length, 16);
  assert.deepEqual(batch2.map((a) => a.sourceFile).sort(), targets);
  const byChar = Object.fromEntries(["manon", "jp", "luke", "juri"].map((c) => [c, batch2.filter((a) => a.character === c).length]));
  assert.deepEqual(byChar, { manon: 5, jp: 7, luke: 3, juri: 1 });
  assert.equal(new Set(batch2.map((a) => a.moveId)).size, 16);
  const res = validateMoveAliases({ aliases: batch2, fixture, mp4Ids });
  assert.deepEqual(res.filter((r) => !r.ok), []);
  for (const r of res) console.log(`  [別表記16] ${r.sourceFile} -> ${r.status} ${r.ok ? "PASS" : r.errors.join(";")}`);
});

test("判定件数: 静的一意6 / 要映像確認10 / HOLD 0 / APPROVED 0(静的一致=映像QA完了ではない)", () => {
  const c = (s) => batch2.filter((a) => a.status === s).length;
  assert.deepEqual([c("MATCHED_STATIC"), c("NEEDS_VISUAL_QA"), c("HOLD"), c("APPROVED")], [6, 10, 0, 0]);
  for (const a of batch2) assert.ok(a.evidence.length >= 4, a.sourceFile);
});

test("条件2: JP22件が保護されている(既存の検証が全件PASSのまま、別表記16件と重ならない)", () => {
  assert.equal(jp22.length, 22);
  assert.deepEqual(validateJpAliases({ aliases: jp22, fixture }).filter((r) => !r.ok), []);
  const jpFiles = new Set(jp22.map((a) => a.sourceFile)), jpIds = new Set(jp22.map((a) => a.moveId));
  assert.equal(batch2.filter((a) => jpFiles.has(a.sourceFile) || jpIds.has(a.moveId)).length, 0);
  assert.equal(jp22.filter((a) => a.status === "APPROVED").length, 0);
});

test("条件3: 合計38件のQA対象が一意である", () => {
  assert.equal(rows.length, 38);
  for (const k of ["asset_id", "filename", "move_id", "asset_sha256"]) assert.equal(new Set(rows.map((r) => r[k])).size, 38, k);
  assert.deepEqual(rows.map((r) => r.asset_id), ledgerFile.rows.map((r) => r.asset_id), "保存済み台帳と再生成が一致");
  assert.deepEqual(ledgerFile.rows, JSON.parse(JSON.stringify(rows)));
});

test("条件4: 他キャラのmoveIdを参照しない(違反は検出される)", () => {
  for (const r of rows) {
    const owner = Object.entries(fixture.characters).find(([, v]) => v.moves.some((m) => m.id === r.move_id))?.[0];
    assert.equal(owner, r.character, r.filename);
  }
  const bad = clone(batch2); bad[0].moveId = fixture.characters.ryu.moves[0].id;
  assert.ok(validateMoveAliases({ aliases: bad, fixture })[0].errors.some((e) => e.startsWith("OTHER_CHARACTER_MOVE_ID")));
});

test("条件5: 曖昧一致を検出する(区分+名称の重複 / 同コマンドの別技)", () => {
  const fx = clone(fixture);
  const orig = fx.characters.manon.moves.find((m) => m.slug === "manon-manege-l");
  fx.characters.manon.moves.push({ ...clone(orig), id: "dup-id", slug: "manon-manege-l-dup" });
  const r1 = validateMoveAliases({ aliases: batch2.filter((a) => a.moveSlug === "manon-manege-l"), fixture: fx })[0];
  assert.ok(r1.errors.includes("AMBIGUOUS_NAME_MATCH"));
  const fx2 = clone(fixture);
  const e = fx2.characters.jp.moves.find((m) => m.slug === "jp-embrace");
  fx2.characters.jp.moves.push({ ...clone(e), id: "dup2", slug: "jp-embrace-dup", name: "別の技 / Other" });
  const r2 = validateMoveAliases({ aliases: batch2.filter((a) => a.moveSlug === "jp-embrace"), fixture: fx2 })[0];
  assert.ok(r2.errors.includes("AMBIGUOUS_COMMAND_MATCH"));
});

test("条件6: 強度・OD・SAの区分を維持する(Manonの弱/中/強/OD、JPのOD系、JuriのSA1)", () => {
  const s = Object.fromEntries(batch2.map((a) => [a.sourceFile, a.strength]));
  assert.equal(s["manon-light-manege-dore.gif"], "light");
  assert.equal(s["manon-medium-manege-dore.gif"], "medium");
  assert.equal(s["manon-heavy-manege-dore.gif"], "heavy");
  assert.equal(s["manon-od-manege-dore.gif"], "od");
  assert.equal(s["manon-od-renverse.gif"], "od");
  assert.equal(s["17_70-juri-sa1-sakkai-fuhazan.gif"], "sa1");
  for (const f of ["jp-od-abnimach.gif", "jp-od-departure-lp-mp.gif", "jp-od-departure-lp-hp.gif", "jp-od-departure-mp-hp.gif"]) assert.equal(s[f], "od", f);
  // 強度を取り違えた場合は検出される
  const bad = clone(batch2); bad.find((a) => a.sourceFile === "manon-od-manege-dore.gif").strength = "heavy";
  assert.ok(validateMoveAliases({ aliases: bad, fixture }).some((r) => r.errors.some((x) => x.startsWith("STRENGTH_FIELD_MISMATCH"))));
  // 公式名と公開用データの区分が違う対応は MATCHED_STATIC にできない
  const bad2 = clone(batch2); bad2.find((a) => a.sourceFile === "manon-light-manege-dore.gif").officialName = "強 マネージュ・ドレ";
  assert.ok(validateMoveAliases({ aliases: bad2, fixture }).some((r) => r.errors.includes("TAG_MISMATCH_OFFICIAL_VS_FIXTURE")));
  // 各OD/強度が別々の技IDに割り当たっている
  assert.equal(new Set(batch2.filter((a) => a.character === "manon").map((a) => a.moveId)).size, 5);
});

test("条件7: 未承認素材は表示対象にならない(台帳も承認なし・表示不可)", () => {
  assert.ok(rows.every((r) => r.approval === "NOT_APPROVED" && r.display_eligible === false));
  // 既存の表示選別ロジック(preview-gif-media.ts)に、対応表の素材を capture_received として渡しても0件
  const clips = batch2.map((a, i) => ({ move_id: a.moveId, move_slug: a.moveSlug, media_type: "gif", verification_status: "capture_received", file_name: a.sourceFile, display_order: i }));
  const shown = evalTs("../src/lib/preview-gif-media.ts", "(m, a)=>m.selectDisplayableGifClips(a.clips, new Set())", { clips });
  assert.equal(shown.length, 0);
});

test("条件8: MP4優先順位を維持する(MP4を持つ技IDのGIFは承認済みでも表示対象に入らない)", () => {
  const sa1 = jp22.find((a) => a.moveSlug === "jp-sa1");
  assert.ok(sa1.existingMp4 && mp4Ids.has(sa1.moveId));
  const clips = [{ move_id: sa1.moveId, move_slug: "jp-sa1", media_type: "gif", verification_status: "approved_for_preview", file_name: "x.gif", display_order: 0 }];
  const shown = evalTs("../src/lib/preview-gif-media.ts", "(m, a)=>m.selectDisplayableGifClips(a.clips, new Set(a.mp4))", { clips, mp4: [...mp4Ids] });
  assert.equal(shown.length, 0);
  // 対応表のexistingMp4フラグは実データと一致(検証が確認)。MP4を持つ行のGIFは表示対象外として台帳に記録
  assert.deepEqual(rows.filter((r) => r.existing_mp4).map((r) => r.filename).sort(), jp22.concat(batch2).filter((a) => mp4Ids.has(a.moveId)).map((a) => a.sourceFile).sort());
});

test("条件9: 素材不足をPASSと誤判定しない", () => {
  const missing = buildQaRows({ ...inputs, assets: inputs.assets.filter((a) => a.file !== "22_65-luke-sweeper.gif") });
  const r = missing.find((x) => x.filename === "22_65-luke-sweeper.gif");
  assert.equal(r.asset_status, "ASSET_UNAVAILABLE");
  assert.equal(r.asset_sha256, null);
  assert.notEqual(r.visual_status, "VISUAL_PASS");
  assert.ok(r.issue.includes("素材実体を取得できていない"));
  // 実台帳: 実体を確認できた素材のみ ASSET_VERIFIED、SHAとDrive上のサイズが整合
  for (const a of inputs.assets) assert.equal(a.bytes, a.driveBytes, a.file);
  assert.ok(rows.every((x) => x.asset_status === "ASSET_VERIFIED" ? Boolean(x.asset_sha256) && x.gif_loadable : true));
  assert.ok(rows.filter((x) => x.visual_status === "VISUAL_PASS").every((x) => x.asset_status === "ASSET_VERIFIED"));
});

test("条件10: 映像未確認(NOT_RUN/抜き取りのみ)をAPPROVED・VISUAL_PASSへ昇格させない", () => {
  assert.equal(rows.filter((r) => r.visual_status === "VISUAL_PASS").length, 0);
  assert.equal(rows.filter((r) => r.visual_status === "VISUAL_SAMPLED").length, 6);
  assert.equal(rows.filter((r) => r.visual_status === "VISUAL_NOT_RUN").length, 32);
  assert.ok(rows.every((r) => r.approval !== "APPROVED" && r.static_status !== "APPROVED"));
  // 抜き取りの記録に「未確認」項目が必ず残っている
  for (const o of inputs.observations) assert.ok(o.unconfirmed.length > 0 && o.status === "VISUAL_SAMPLED");
  // 台帳のSHAは対応表のSHAと一致(別素材の取り違えなし)
  for (const a of jp22.concat(batch2)) assert.equal(rows.find((r) => r.filename === a.sourceFile).asset_sha256, a.sha256, a.sourceFile);
});

test("既存表示経路から対応表・台帳を参照していない(未接続)", () => {
  const needles = ["move-aliases-batch2", "qa-ledger-38", "jp-move-aliases"];
  const roots = ["../src/lib", "../src/components", "../src/app"];
  for (const d of roots) {
    const r = spawnSync("grep", ["-rl", "--include=*.ts", "--include=*.tsx", "-e", needles.join("\\|"), here(d)], { encoding: "utf8" });
    assert.equal(r.stdout.trim(), "", `${d} が対応表を参照している`);
  }
});
