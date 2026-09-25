import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/coach-loss-analysis.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const { holdLossAnalysis } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const base = { playerCharacter: "JP", opponentCharacter: "Sagat", result: "loss", problemScene: "端で弾を受けた", selfNoticedMistake: "歩きガードが遅かったかも", notes: "2ラウンド目" };

test("self reports and hypotheses stay distinct and practice is held", () => {
  const answer = holdLossAnalysis(base);
  assert.equal(answer.status, "HELD_FOR_INSUFFICIENT_EVIDENCE");
  assert.match(answer.observed.join(" "), /本人が困った場面/);
  assert.doesNotMatch(answer.observed.join(" "), /歩きガードが遅かった/);
  assert.match(answer.hypothesis, /本人の仮説/);
  assert.equal(answer.nextPractice, null);
});

test("missing scene and oversized text cannot become a result", () => {
  assert.deepEqual(holdLossAnalysis({ ...base, problemScene: " " }).observed, []);
  assert.ok(holdLossAnalysis({ ...base, notes: "x".repeat(501) }).errors.length);
});

test("manual form has no persistence or network path and is preview gated", () => {
  const form = readFileSync(new URL("../src/components/coach-loss-analysis-form.tsx", import.meta.url), "utf8");
  const page = readFileSync(new URL("../src/app/coach/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(form, /fetch\(|localStorage|sessionStorage/);
  assert.match(page, /isCoachSurfaceEnabled/);
  assert.match(page, /<CoachLossAnalysisForm/);
});
