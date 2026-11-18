import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const json = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const fixture = json("../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json");
const analysis = json("../../scripts/gif-intake/no-move-id-analysis-20261116.json");
const cls = json("../../scripts/gif-intake/remaining-53-classification-20261116.json");
const aliases = json("../../scripts/gif-intake/jp-alias-verification-20261116.json");
const allMoves = new Map(Object.values(fixture.characters).flatMap((c) => c.moves.map((m) => [m.slug, m])));
const SUBS = ["A 既存技の別表記の可能性", "B 強度違い・OD違い・区分違い", "C 派生技", "D 技データ不足", "E 素材名称だけでは識別不能", "F 共通システム技(今回対象外)", "G 検証用画面・旧版(保留)"];

test("残り53本は、JP22本を除く技IDなし素材と1対1で対応し、分類が漏れなく付いている", () => {
  const expected = analysis.filter((a) => !(a.character === "jp" && a.category === "識別名不一致")).map((a) => a.file).sort();
  assert.equal(expected.length, 53);
  assert.deepEqual(cls.rows.map((r) => r.file).sort(), expected);
  assert.equal(new Set(cls.rows.map((r) => r.file)).size, 53, "重複登録なし");
  assert.deepEqual(cls.byOriginalGroup, { "データ未登録": 29, "既存技への統合の可能性": 3, "その他": 21 });
  for (const r of cls.rows) { assert.ok(SUBS.includes(r.subcategory), r.file); assert.ok(r.evidence && r.unlockCondition, `${r.file}: 根拠と解除条件が必要`); }
  assert.equal(Object.values(cls.bySubcategory).reduce((a, b) => a + b, 0), 53);
});

test("全件HOLDで、技IDの確定・承認は行っていない。候補の技は公開用データに実在する", () => {
  for (const r of cls.rows) {
    assert.equal(r.status, "HOLD", r.file);
    if (r.candidateSlug) {
      const m = allMoves.get(r.candidateSlug);
      assert.ok(m, `${r.file}: 候補slugが公開用データに無い`);
      assert.equal(r.candidateMoveId, m.id);
      assert.ok(r.candidateSlug.startsWith(r.character), `${r.file}: 他キャラの技が混入`);
    }
  }
});

test("別表記の候補は、名称が違う場合に『コマンド一致』などの根拠を明記している", () => {
  for (const r of cls.rows.filter((x) => x.subcategory.startsWith("A"))) assert.ok(r.candidateSlug && /一致|同じ|入力|ローマ字/.test(r.evidence), r.file);
});

test("システム技・検証用画面・旧版は『技IDなし』のまま接続対象から外れている", () => {
  for (const r of cls.rows.filter((x) => /^[FG]/.test(x.subcategory))) assert.ok(!r.candidateMoveId || r.subcategory.startsWith("G"), r.file);
});

test("JP22本の結果と合算して 22 + 53 = 75 で、重複集計がない", () => {
  const jp22 = aliases.rows.map((r) => r.sourceFile);
  assert.equal(jp22.length, 22);
  assert.equal(jp22.filter((f) => cls.rows.some((r) => r.file === f)).length, 0);
  assert.equal(jp22.length + cls.rows.length, analysis.length);
  assert.equal(analysis.length, 75);
});
