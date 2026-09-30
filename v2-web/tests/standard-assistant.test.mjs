import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

function load(path, dependencies = {}) {
  const source = readFileSync(new URL(`../src/lib/${path}.ts`, import.meta.url), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loadedModule = { exports: {} };
  new Function("module", "exports", "require", output)(loadedModule, loadedModule.exports, (name) => {
    if (dependencies[name]) return dependencies[name];
    throw new Error(`Unexpected dependency: ${name}`);
  });
  return loadedModule.exports;
}
const daily = load("daily-training", { "@/lib/daily-training-details": load("daily-training-details") });
const { buildStandardAssistantContext: context, selectStandardAssistantMessage: select } = load("standard-assistant", { "@/lib/daily-training": daily });
const now = new Date("2026-09-30T05:00:00Z");
const base = { diagnosisHistory: [], now, knownCharacterSlugs: ["jp", "ryu"] };
const diagnosis = (diagnosisType = "improvement", key = "anti_air") => ({ id: "local", diagnosisSlug: "test", diagnosisType, completedAt: "2026-09-30T04:00:00Z", topResults: [{ key, label: "fixture", score: 3 }] });
const message = (events, data = {}) => select({ enabled: true, events, context: context({ ...base, ...data }) });

test("OFF suppresses even the highest priority completion event", () => {
  assert.equal(select({ enabled: false, events: ["diagnosis_completed"], context: context(base) }), null);
});
test("no event produces no unsolicited message", () => assert.equal(message([]), null));
test("existing improvement history drives a focus template and the existing local-history Daily route", () => {
  const result = message(["diagnosis_completed"], { diagnosisHistory: [diagnosis()] });
  assert.equal(result.text, "今日は対空を優先して練習してみましょう。");
  assert.equal(result.cta.href, "/me/training");
});
test("preference diagnosis axes never become weaknesses", () => {
  for (const type of ["playstyle", "character_fit"]) {
    const result = message(["diagnosis_completed"], { diagnosisHistory: [diagnosis(type)] });
    assert.equal(result.text.includes("対空"), false);
  }
});
test("newer invalid focus does not revive an older weakness", () => {
  const latest = { ...diagnosis("comprehensive", "simplicity"), completedAt: "2026-09-30T04:30:00Z" };
  assert.equal(context({ ...base, diagnosisHistory: [latest, diagnosis()] }).diagnosisFocus, null);
});
test("character links require known catalogue slugs and reject user-controlled URLs", () => {
  for (const slug of ["https://evil.example", "../../admin", "unlisted", "jp?next=/admin"]) {
    assert.equal(message(["character_viewed"], { lastCharacterSlug: slug }), null);
  }
  assert.equal(message(["character_viewed"], { lastCharacterSlug: "jp" }).cta.href, "/characters/jp");
});
test("favorites affect CTA only for valid existing character slugs", () => {
  assert.equal(message(["return_visit"], { favoriteCharacterSlugs: ["unknown", {}] }).cta.href, "/me/training");
  assert.equal(message(["return_visit"], { favoriteCharacterSlugs: ["ryu"] }).cta.href, "/favorites");
});
test("Daily completion requires all current plan IDs; stale or duplicate IDs are insufficient", () => {
  const dailyPlan = daily.buildDailyTrainingPlan({ dateKey: "2026-09-30", selection: { source: "default", focus: null } });
  const ids = dailyPlan.items.map((item) => item.id);
  assert.equal(message(["daily15_completed"], { dailyPlan, completedDailyItemIds: [ids[0], ids[0], "old-id"] }), null);
  assert.equal(message(["daily15_completed"], { dailyPlan, completedDailyItemIds: ids }).id, "daily15_completed");
  assert.equal(message(["daily15_completed"], { dailyPlan }), null);
  assert.equal(message(["daily15_completed"], { dailyPlan: { ...dailyPlan, dateKey: "2026-09-29" }, completedDailyItemIds: ids }), null);
});
test("explicit priority selects completion over onboarding irrespective of event order", () => {
  const result = message(["first_visit", "return_visit", "diagnosis_completed", "diagnosis_completed"]);
  assert.equal(result.id, "diagnosis_completed");
  assert.equal(result.persona, "standard");
  assert.equal(result.priority, 80);
});
test("malformed history and future records cannot create focus", () => {
  const future = { ...diagnosis(), completedAt: "2027-01-01T00:00:00Z" };
  for (const diagnosisHistory of [null, {}, [future], [null, []]]) {
    assert.equal(context({ ...base, diagnosisHistory }).diagnosisFocus, null);
  }
});
