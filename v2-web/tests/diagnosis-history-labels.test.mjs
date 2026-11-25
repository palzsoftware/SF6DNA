import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
function loadCommonJs(source, requireStub = () => { throw new Error("Unexpected module"); }) {
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  new Function("module", "exports", "require", output)(loadedModule, loadedModule.exports, requireStub);
  return loadedModule.exports;
}
const labels = loadCommonJs(read("src/lib/diagnosis-axis-labels.ts"));
const cloud = loadCommonJs(read("src/lib/diagnosis-history-cloud.ts"), (name) => {
  if (name === "@/lib/diagnosis-axis-labels") return labels;
  throw new Error(`Unexpected import: ${name}`);
});

test("diagnosis axis keys map to the same Japanese labels as the result screen", () => {
  assert.equal(labels.diagnosisAxisLabel("setup"), "設置・セットプレイ");
  assert.equal(labels.diagnosisAxisLabel("patience"), "待ち・観察");
  assert.equal(labels.diagnosisAxisLabel("anti_air"), "対空");
  assert.equal(labels.diagnosisAxisLabel("unknown_key"), "unknown_key");
  assert.equal(labels.diagnosisAxisLabel("toString"), "toString");
});

test("account history rows are labelled with Japanese names, not raw keys", () => {
  const [row] = cloud.mapCloudDiagnosisRows([{ id: "r1", created_at: "2026-11-25T00:00:00Z", diagnoses: { slug: "playstyle", title: "プレイスタイル診断" }, result_payload: { top_results: [{ key: "setup", score: 7 }, { key: "patience", score: 5 }] } }]);
  assert.deepEqual(row.topResults.map((item) => item.label), ["設置・セットプレイ", "待ち・観察"]);
});

test("label table is shared, not duplicated, across result screen and history", () => {
  for (const path of ["src/components/diagnosis-runner.tsx", "src/lib/diagnosis-history-cloud.ts", "src/components/diagnosis-history-tool.tsx"]) {
    const source = read(path);
    assert.match(source, /from "@\/lib\/diagnosis-axis-labels"/, path);
    assert.doesNotMatch(source, /setup:\s*"設置・セットプレイ"/, path);
  }
});

test("storage notices describe account storage when signed in and browser storage otherwise", () => {
  const tool = read("src/components/diagnosis-history-tool.tsx");
  assert.match(tool, /ログイン中のため、完了した診断の上位傾向はアカウントに保存されます/);
  assert.match(tool, /ログインしていないため、完了した診断の上位傾向をこのブラウザ内に最大50件保存しています/);
  assert.match(read("src/app/diagnosis/history/page.tsx"), /<DiagnosisHistoryStorageNote \/>/);
  assert.match(read("src/components/diagnosis-runner.tsx"), /guest=\{currentOwner === "guest"\}/);
});
