import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/character-learning-structure.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const compiledModule = { exports: {} };
vm.runInNewContext(compiled, { module: compiledModule, exports: compiledModule.exports, Set });
const { classifyComboFacets, classifyCharacterVideo, COMBO_FACET_LABELS } = compiledModule.exports;

test("combo facets allow multiple explicit conditions without guessing from recipe or name", () => {
  const verified = classifyComboFacets({
    verificationStatus: "verified", position: "中央 / 画面端", driveCost: 0,
    name: "DIスタン SA3締め 小技始動", command: "CDR > SA3",
  });
  assert.deepEqual([...verified], ["no_drive", "center", "corner"]);
  assert.equal(COMBO_FACET_LABELS.sa3_ca_finish, "SA3 / CA締め");
  assert.deepEqual([...classifyComboFacets({ verificationStatus: "reviewed", position: "画面端", driveCost: 3 })], []);
  assert.deepEqual([...classifyComboFacets({ verificationStatus: "verified", position: "位置未確認", driveCost: null })], []);
});

test("video grouping uses only explicit metadata and preserves an unclassified option", () => {
  assert.equal(classifyCharacterVideo({ videoType: "official_guide", level: "unknown" }), "guide");
  assert.equal(classifyCharacterVideo({ videoType: "guide", level: "beginner" }), "beginner");
  assert.equal(classifyCharacterVideo({ videoType: "counter", level: "unknown" }), "counter");
  assert.equal(classifyCharacterVideo({ videoType: "match", level: "unknown" }), "match");
  assert.equal(classifyCharacterVideo({ videoType: "combo", level: "unknown", title: "初心者の対戦動画" }), "unclassified");
});
