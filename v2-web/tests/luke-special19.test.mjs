// ルーク必殺技19件の照合記録テスト（記録JSONの整合性のみ検証。強度未確認の素材を接続していないことを守る）
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const rec = JSON.parse(fs.readFileSync(new URL("../../scripts/gif-intake/luke-special19-20261116.json", import.meta.url), "utf8"));
const qa = JSON.parse(fs.readFileSync(new URL("../src/data/gif-intake/local-qa/SF6DNA_LOCAL_QA_GIF_LUKE_20261116.json", import.meta.url), "utf8"));

test("19件の内訳: 接続9 / 強度HOLD 9 / OD条件HOLD 1 / 新規接続0", () => {
  assert.equal(rec.entries.length, 19);
  assert.equal(rec.summary.LOCAL_CONNECTED, 9);
  assert.equal(rec.summary.HOLD_STRENGTH_NOT_VERIFIED, 9);
  assert.equal(rec.summary.HOLD_OD_CONDITION_UNVERIFIED, 1);
  assert.equal(rec.summary.newLocalConnections, 0);
});

test("HOLDの技はローカルQA接続データに含まれない（撮影順だけでHOLD解除しない）", () => {
  const connected = new Set(qa.entries.map((e) => e.moveId));
  for (const e of rec.entries) {
    assert.equal(connected.has(e.moveId), e.status === "LOCAL_CONNECTED", e.moveSlug);
  }
});

test("OD閃烈（フラッシュナックルOD）は2HITS/4HITSを別物として保持しHOLD", () => {
  const od = rec.entries.find((e) => e.moveSlug === "luke-flash-knuckle-od");
  assert.equal(od.status, "HOLD_OD_CONDITION_UNVERIFIED");
  assert.notEqual(rec.odFlashKnuckleCandidates.twoHit.sha256, rec.odFlashKnuckleCandidates.fourHit.sha256);
});

test("接続済みは従来どおり15本のまま", () => {
  assert.equal(qa.entries.length, 15);
});
