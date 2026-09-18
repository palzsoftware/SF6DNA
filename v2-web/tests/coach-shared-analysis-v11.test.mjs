import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

function transpile(source) {
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
}

const foundationSource = readFileSync(new URL("../src/lib/coach-foundation.ts", import.meta.url), "utf8");
const foundationJs = transpile(foundationSource);
const foundationUrl = `data:text/javascript;base64,${Buffer.from(foundationJs).toString("base64")}`;
let sharedJs = transpile(readFileSync(new URL("../src/lib/coach-shared-analysis.ts", import.meta.url), "utf8"));
sharedJs = sharedJs.replace('"@/lib/coach-foundation"', JSON.stringify(foundationUrl));
const shared = await import(`data:text/javascript;base64,${Buffer.from(sharedJs).toString("base64")}`);
const foundation = await import(foundationUrl);

function dailyPlan() {
  return {
    dateKey: "2026-09-18",
    theme: "対空を優先する日",
    reason: "診断結果を優先しています。",
    source: "diagnosis_link",
    totalMinutes: 15,
    items: [{
      id: "2026-09-18:anti_air",
      title: "対空を安定させる",
      goal: "普段使う対空を安定させます。",
      minutes: 5,
      detail: {
        category: "reaction",
        title: "対空を安定させる",
        why: "飛びを確認します。",
        setup: ["前ジャンプを記録します。"],
        minute01: ["3回確認します。"],
        minute13: ["ランダム再生します。"],
        minute35: ["10回確認します。"],
        successCondition: ["10回中8回成功する。"],
        commonFailure: ["先読みする。"],
        adjustment: ["前ジャンプだけに戻します。"],
        matchFocus: ["飛びを見る時間を増やします。"],
      },
    }],
  };
}

function source(id = "source-1") {
  return { id, title: "Official", url: "https://example.com/source", publisher: "Example", sourceType: "official", relationship: "reference" };
}

test("diagnosis adapter keeps issue semantics and does not reinterpret preference diagnoses", () => {
  const improvement = shared.adaptDiagnosisResult({ diagnosisType: "improvement", results: [
    { key: "anti_air", label: "対空", score: 8 },
    { key: "punish", label: "確定反撃", score: 5 },
    { key: "neutral", label: "中距離", score: 3 },
    { key: "meter", label: "ゲージ管理", score: 2 },
  ] });
  assert.equal(improvement.primaryIssues.length, 3);
  assert.equal(improvement.secondaryIssues.length, 1);
  assert.deepEqual(improvement.strengths, []);
  const characterFit = shared.adaptDiagnosisResult({ diagnosisType: "character_fit", results: [{ key: "keepout", label: "遠距離", score: 9 }] });
  assert.deepEqual(characterFit.primaryIssues, []);
  assert.deepEqual(characterFit.strengths, []);
});

test("daily adapter preserves the real drill objective and success condition", () => {
  const daily = shared.adaptDailyTrainingPlan(dailyPlan());
  assert.equal(daily.trainingDate, "2026-09-18");
  assert.equal(daily.items[0].durationMinutes, 5);
  assert.deepEqual(daily.items[0].successCondition, ["10回中8回成功する。"]);
  assert.deepEqual(daily.items[0].failureAdjustment, ["前ジャンプだけに戻します。"]);
});

test("user asserted frame data stays PLAYER_STATEMENT and never becomes verified fact", () => {
  const user = shared.adaptUserText("この技は+3Fです");
  assert.equal(user.evidenceKind, "PLAYER_STATEMENT");
  assert.equal(user.requiresVerification, true);
  const context = shared.emptyCoachInputContext();
  context.userMessage = user;
  const evidence = shared.buildCoachEvidence(context);
  assert.equal(evidence[0].kind, "PLAYER_STATEMENT");
  assert.equal(evidence[0].verificationStatus, "unverified");
  assert.ok(evidence.every((item) => item.kind !== "VERIFIED_GAME_FACT"));
});

test("character adapter only emits source-backed facts when a public source exists", () => {
  const base = { id: "c1", slug: "jp", name: "JP", nameEn: "JP", shortDescription: "遠距離から試合を組み立てる。", imageUrl: null, difficulty: null, rangeLabel: null, archetypeLabel: null, releaseDate: null, updatedAt: null, strengthsSummary: null, weaknessesSummary: null, guideSections: [] };
  assert.equal(shared.adaptCharacterContext({ ...base, sources: [] }).sourceBackedFacts.length, 0);
  const adapted = shared.adaptCharacterContext({ ...base, sources: [source()] });
  assert.equal(adapted.sourceBackedFacts.length, 1);
  const evidence = shared.buildCharacterEvidence(adapted)[0];
  assert.equal(evidence.sourceUrl, "https://example.com/source");
  assert.equal(evidence.verificationStatus, "reviewed");
});

test("player adapter refuses to create source-backed facts without a public source", () => {
  const player = { id: "p1", slug: "player", displayName: "Player", playerType: null, teamName: "Team", countryCode: null, region: "JP", imageUrl: null, aliases: [], characters: [], realName: null, bio: "Bio", youtubeUrl: null, twitchUrl: null, xUrl: null, websiteUrl: null, tournamentResults: [] };
  assert.equal(shared.adaptPlayerContext({ ...player, sources: [] }).sourceBackedFacts.length, 0);
  assert.ok(shared.adaptPlayerContext({ ...player, sources: [source("player-source")] }).sourceBackedFacts.length >= 1);
});

test("analysis priority issues derive from diagnosis evidence only", () => {
  const context = shared.emptyCoachInputContext();
  context.diagnosisResult = shared.adaptDiagnosisResult({ diagnosisType: "improvement", resultKey: "anti_air", results: [{ key: "anti_air", label: "対空", score: 8 }] });
  const result = shared.analyzeCoachContext(context);
  assert.equal(result.priorityIssues[0].title, "対空");
  assert.deepEqual(result.priorityIssues[0].evidenceIds, ["diagnosis:anti_air:0"]);
});

test("analysis drills derive from Daily and keep Daily evidence relation", () => {
  const context = shared.emptyCoachInputContext();
  context.dailyTraining = shared.adaptDailyTrainingPlan(dailyPlan());
  const result = shared.analyzeCoachContext(context);
  assert.equal(result.drills[0].title, "対空を安定させる");
  assert.match(result.drills[0].evidenceIds[0], /^daily:2026-09-18:/);
});

test("empty context is handled without fabricated facts", () => {
  const result = shared.analyzeCoachContext(shared.emptyCoachInputContext());
  assert.equal(result.evidence.length, 0);
  assert.equal(result.priorityIssues.length, 0);
  assert.equal(result.drills.length, 0);
  assert.ok(result.uncertainty.length > 0);
});

test("mixed context never fabricates VERIFIED_GAME_FACT", () => {
  const context = shared.emptyCoachInputContext();
  context.userMessage = shared.adaptUserText("JPの技は+3Fだと思う");
  context.dailyTraining = shared.adaptDailyTrainingPlan(dailyPlan());
  const result = shared.analyzeCoachContext(context);
  assert.ok(result.evidence.length >= 2);
  assert.ok(result.evidence.every((item) => item.kind !== "VERIFIED_GAME_FACT"));
  assert.ok(result.uncertainty.some((item) => item.includes("未検証")));
});

test("persona formatting preserves evidence facts after adapter and analysis layers", () => {
  const context = shared.emptyCoachInputContext();
  context.userMessage = shared.adaptUserText("対空が遅れます");
  const result = shared.analyzeCoachContext(context);
  const responses = foundation.COACH_PERSONAS.map((persona) => foundation.formatCoachAnalysis(result, persona.id));
  const snapshot = responses[0].evidence.map(({ id, kind, statement, sourceId, sourceUrl, patch, verificationStatus }) => ({ id, kind, statement, sourceId, sourceUrl, patch, verificationStatus }));
  for (const response of responses.slice(1)) {
    assert.deepEqual(response.evidence.map(({ id, kind, statement, sourceId, sourceUrl, patch, verificationStatus }) => ({ id, kind, statement, sourceId, sourceUrl, patch, verificationStatus })), snapshot);
  }
});

test("server input loader uses only public loaders and no strategy data", () => {
  const loader = readFileSync(new URL("../src/lib/coach-input-loader.ts", import.meta.url), "utf8");
  assert.match(loader, /getCharacterBySlug/);
  assert.match(loader, /getPlayerBySlug/);
  assert.match(loader, /isImprovementFocus/);
  assert.doesNotMatch(loader, /content-detail|character-sections|publicStrategyContent|service[_-]?role|internal_notes/i);
});

test("v1.1 context handoff remains behind the existing v1.0 hard gate", () => {
  const flags = readFileSync(new URL("../src/lib/release-features.ts", import.meta.url), "utf8");
  const page = readFileSync(new URL("../src/app/coach/page.tsx", import.meta.url), "utf8");
  const diagnosis = readFileSync(new URL("../src/components/diagnosis-runner.tsx", import.meta.url), "utf8");
  const daily = readFileSync(new URL("../src/components/daily-training-planner.tsx", import.meta.url), "utf8");
  const sitemap = readFileSync(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
  assert.match(flags, /aiCoach:\s*false/);
  assert.ok(page.indexOf("releaseFeatures.aiCoach") < page.indexOf("await searchParams"));
  assert.equal((diagnosis.match(/releaseFeatures\.aiCoach\s*&&\s*topQuery/g) ?? []).length, 2);
  assert.match(daily, /releaseFeatures\.aiCoach/);
  assert.doesNotMatch(sitemap, /["']\/coach["']/);
});
