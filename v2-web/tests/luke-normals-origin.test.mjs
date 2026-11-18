// ルーク通常技18件: 元動画照合(ORIGIN)の整合テスト。
// 「記録上の確認」と「入力強度の確認」を混同していないことを守る。
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "scripts", "gif-intake");
const read = (f) => JSON.parse(readFileSync(join(root, f), "utf8"));
const origin = read("luke-normals-18-origin-20261116.json");
const base = read("luke-normals-18-20261116.json");

test("18件で、既存の18件台帳とSHA-256が一致する", () => {
  assert.equal(origin.entries.length, 18);
  const shas = new Set(base.entries.map((e) => e.sha256));
  for (const e of origin.entries) assert.ok(shas.has(e.sha256), e.moveSlug);
});

test("旧エイリアス2件(立ち強P旧・ジャンプ強K旧)は採用されていない", () => {
  const rejected = origin.duplicateResolution.map((d) => d.sha256Rejected);
  assert.equal(rejected.length, 2);
  // 採用中のGIFのうち、中P/中Kだけがその内容を持つ(強P/強Kは修正版で別内容)
  for (const sha of rejected) {
    const users = origin.entries.filter((e) => e.sha256 === sha).map((e) => e.moveSlug);
    assert.equal(users.length, 1);
    assert.match(users[0], /-(mp|mk)$/);
  }
});

test("記録照合済みは0件(立ち弱Kの区間記録はChatGPT側が取り下げ)。入力強度の確認済みも0件", () => {
  assert.equal(origin.entries.filter((e) => e.moveIdMatch === "RECORD_VERIFIED").length, 0);
  assert.equal(origin.entries.find((e) => e.moveSlug === "luke-standing-lk").moveIdMatch, "RECORD_RETRACTED");
  assert.equal(origin.entries.filter((e) => e.inputStrength === "CONFIRMED").length, 0);
});

test("ローカル表示・公開承認は付与されていない", () => {
  for (const e of origin.entries) {
    assert.equal(e.localQaDisplay, false);
    assert.equal(e.approval, "NOT_APPROVED");
  }
});
