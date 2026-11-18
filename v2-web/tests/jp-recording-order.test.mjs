// JP設置技の録画順序(ユーザー提供の根拠情報)のテスト。順序は候補を絞る根拠であり、技ID・承認は確定しない。
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildQaRows, loadQaInputs } from "../../scripts/gif-intake/build-qa-ledger.mjs";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const fixture = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json");
const rec = json("../../scripts/gif-intake/jp-recording-order-20261116.json");
const ledger = json("../../scripts/gif-intake/qa-ledger-38-20261116.json");
const inputs = await loadQaInputs();
const jpIds = new Map(fixture.characters.jp.moves.map((m) => [m.id, m.slug]));

test("録画順序は提供どおり8区間(弱設置→中設置→強設置→OD設置→弱ワープ→中ワープ→強起動→OD起動)", () => {
  assert.deepEqual(rec.segments.map((s) => s.label), ["弱設置", "中設置", "強設置", "OD設置", "弱ワープ", "中ワープ", "強起動", "OD起動"]);
  assert.deepEqual(rec.segments.map((s) => s.seq), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test("録画順序だけで技ID・承認を確定していない", () => {
  for (const s of [...rec.segments, ...rec.cancelSegments]) {
    assert.equal(s.status, "ORDER_EVIDENCE_ONLY", s.label);
    assert.equal(s.moveIdConfirmedByOrder, false);
    assert.equal(s.approval, "NOT_APPROVED");
    for (const c of s.candidates) assert.equal(jpIds.get(c.moveId), c.slug, `${s.label}: 候補はJPの実在技IDのみ`);
  }
});

test("単独のワープ・起動と、通常技からのキャンセルワープ・キャンセル起爆は別区間として区別されている", () => {
  const labels = new Set(rec.segments.map((s) => s.label));
  for (const c of rec.cancelSegments) {
    assert.ok(!labels.has(c.label));
    assert.equal(c.seq, null);
    assert.equal(c.candidates.length, 0, "キャンセル系には技IDを作らない/当てない");
    assert.equal(c.overlap, "NO_GIF_NO_MOVE_ID");
  }
  assert.deepEqual(rec.cancelSegments.map((c) => c.label), ["通常技からのキャンセルワープ", "通常技からのキャンセル起爆"]);
});

test("OD起動は技ID・GIFとも無い(HOLD)、OD設置は1区間対3GIFの食い違いとして記録される", () => {
  const od = rec.segments.find((s) => s.label === "OD起動");
  assert.deepEqual([od.candidates.length, od.existingGifs.length, od.production], [0, 0, "HOLD_NO_MOVE_ID"]);
  const set = rec.segments.find((s) => s.label === "OD設置");
  assert.equal(set.existingGifs.length, 3);
  assert.equal(set.overlap, "COUNT_MISMATCH_1_SEGMENT_VS_3_GIFS");
});

test("既存GIFへの対応は既存JP22本の中にあり、台帳に追記されている(技ID・状態は不変)", () => {
  const jpFiles = new Set(inputs.jpAliases.map((a) => a.sourceFile).concat(inputs.batch2Aliases.map((a) => a.sourceFile)));
  for (const s of rec.segments) for (const f of s.existingGifs) assert.ok(jpFiles.has(f), f);
  const mapped = ledger.rows.filter((r) => r.recording_order);
  assert.equal(mapped.length, 8);
  assert.equal(ledger.rows.length, 38);
  // 録画順序を渡しても、技ID・状態・承認は変わらない
  const without = buildQaRows({ ...inputs, recording: { segments: [] } });
  for (const r of buildQaRows(inputs)) {
    const o = without.find((x) => x.filename === r.filename);
    for (const k of ["move_id", "static_status", "visual_status", "approval", "display_eligible", "asset_sha256"]) assert.equal(r[k], o[k], `${r.filename}.${k}`);
  }
  assert.ok(ledger.rows.every((r) => r.approval === "NOT_APPROVED" && r.display_eligible === false));
});

test("不足区間(OD起動・キャンセルワープ・キャンセル起爆)が台帳に記録され、今回GIFは新規制作していない", () => {
  assert.deepEqual(ledger.recordingOrderGaps.map((g) => g.label), ["OD起動", "通常技からのキャンセルワープ", "通常技からのキャンセル起爆"]);
  assert.equal(rec.gifProductionThisRound, 0);
});

test("フレーム重複の手がかり: 9_43は中設置と重なり、OD3本は互いに重ならない。ただし録画区間・技IDは確定しない", () => {
  const by = Object.fromEntries(rec.segments.map((s) => [s.label, s]));
  const w = by["中ワープ"].frameEvidence["9_43_vs_others"];
  assert.ok(w["9_38-jp-medium-departure.gif"].fractionOfAFramesFoundInB > 0.3);
  for (const k of ["9_37-jp-light-departure.gif", "9_39-jp-heavy-departure.gif"]) assert.equal(w[k].fractionOfAFramesFoundInB, 0);
  assert.equal(by["中ワープ"].frameSupport, "SUPPORTED_BY_FRAME_EVIDENCE");
  assert.equal(by["弱ワープ"].frameSupport, "NOT_SUPPORTED_BY_FRAME_EVIDENCE");
  for (const v of Object.values(by["OD設置"].frameEvidence.betweenOdGifs)) assert.ok(v.fractionOfAFramesFoundInB < 0.1);
  assert.equal(by["OD設置"].production, "HOLD_UNTIL_CLARIFIED"); // 別撮影か連続区間かは未確定のためHOLD維持
  for (const s of rec.segments) assert.equal(s.moveIdConfirmedByOrder, false);
});

test("キャンセル系は映像種別を分け、元動画未取得のためキャンセル成立と断定していない", () => {
  for (const c of rec.cancelSegments) {
    assert.equal(c.videoClassification.classes.length, 4);
    assert.equal(c.videoClassification.assigned, "元動画未取得のため判断できない映像");
    assert.equal(c.candidates.length, 0);
  }
});
