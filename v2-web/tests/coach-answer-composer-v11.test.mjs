import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const foundation = readFileSync(new URL("../src/lib/coach-foundation.ts", import.meta.url), "utf8");
const quality = readFileSync(new URL("../src/lib/coach-response-quality.ts", import.meta.url), "utf8")
  .replace(/import(?:\s+type)?\s*\{[\s\S]*?\}\s*from\s*"[^\"]+";\n/g, "");
const composer = readFileSync(new URL("../src/lib/coach-answer-composer.ts", import.meta.url), "utf8")
  .replace(/import(?:\s+type)?\s*\{[\s\S]*?\}\s*from\s*"[^\"]+";\n/g, "");
const js = ts.transpileModule(`${foundation}\n${quality}\n${composer}`, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

function evidence(id, kind, statement, overrides = {}) {
  return {
    id, kind, statement, sourceId: null, sourceUrl: null, patch: null, confidence: 0.7,
    verificationStatus: "unverified", characterSlug: "jp", playerId: null, createdAt: null,
    patchStatus: null, sourceType: null, sourceReliability: null, ...overrides,
  };
}

function fixture() {
  return {
    summary: "対空の確認を優先する。",
    strengths: [{ id: "s1", title: "観察", detail: "飛びを見る時間を作れている。", evidenceIds: ["player"] }],
    priorityIssues: [{ id: "p1", title: "対空", detail: "遅れた対空を減らす。", evidenceIds: ["verified", "inference"] }],
    drills: [{ id: "d1", title: "対空5分", purpose: "反応確認", steps: ["飛びを録画", "10回確認"], successCondition: "8回成功", evidenceIds: ["verified"] }],
    evidence: [
      evidence("verified", "VERIFIED_GAME_FACT", "公式フレーム情報", { sourceId: "capcom", sourceUrl: "https://www.streetfighter.com/6/ja-jp/character/jp", patch: "2.10", verificationStatus: "verified", patchStatus: "PATCH_MATCH", sourceType: "official" }),
      evidence("reviewed", "SOURCE_BACKED_FACT", "大会での採用例", { sourceId: "event", sourceUrl: "https://example.com/event", verificationStatus: "reviewed", patchStatus: "PATCH_UNKNOWN", sourceType: "tournament" }),
      evidence("player", "PLAYER_STATEMENT", "本人は対空が苦手と入力した。", { sourceId: "user-input:question" }),
      evidence("inference", "AI_INFERENCE", "反応が遅れている可能性がある。"),
      evidence("candidate", "UNVERIFIED_CANDIDATE", "未確認のセットプレイ候補", { patchStatus: "PATCH_STALE", patch: "1.0" }),
    ],
    uncertainty: ["複数出典の内容が一致していないため、結論は保留します。"],
    nextActions: ["対空練習を実施"],
  };
}

function facts(answer) {
  return answer.evidenceSummary.map(({ evidenceId, kind, statement, patch, sourceReference }) => ({ evidenceId, kind, statement, patch, url: sourceReference?.url ?? null }));
}

test("composer preserves every factual claim across all four personas", () => {
  const answers = mod.COACH_PERSONAS.map((persona) => mod.composeCoachAnswer({ result: fixture(), personaId: persona.id }));
  for (const answer of answers.slice(1)) assert.deepEqual(facts(answer), facts(answers[0]));
  assert.equal(new Set(answers.map((answer) => answer.sections.map((section) => section.id).join(","))).size, 4);
});

test("verification and persona boundaries remain explicit", () => {
  const answer = mod.composeCoachAnswer({ result: fixture(), personaId: "research" });
  const labels = Object.fromEntries(answer.evidenceSummary.map((item) => [item.evidenceId, item.verificationLabel]));
  assert.equal(labels.verified, "検証済み");
  assert.equal(labels.reviewed, "出典あり・検証状態は別管理");
  assert.equal(labels.player, "本人の入力・発言");
  assert.equal(labels.inference, "AIによる分析（推定）");
  assert.equal(labels.candidate, "未確認・追加確認が必要");
});

test("source URL and patch survive composition with destination labels", () => {
  const answer = mod.composeCoachAnswer({ result: fixture(), personaId: "balanced" });
  const official = answer.evidenceSummary.find((item) => item.evidenceId === "verified");
  assert.deepEqual({ url: official.sourceReference.url, patch: official.sourceReference.patch, label: official.sourceReference.label }, { url: "https://www.streetfighter.com/6/ja-jp/character/jp", patch: "2.10", label: "CAPCOM公式を見る" });
  assert.equal(answer.evidenceSummary.find((item) => item.evidenceId === "reviewed").sourceReference.label, "大会結果の出典を見る");
});

test("conflicts stay unresolved and stale or unknown patch data adds caution", () => {
  const answer = mod.composeCoachAnswer({ result: fixture(), personaId: "competitive" });
  assert.ok(answer.uncertainties.some((item) => item.includes("結論は保留")));
  assert.ok(answer.uncertainties.some((item) => item.includes("対応Patchが不明")));
  assert.ok(answer.uncertainties.some((item) => item.includes("古いPatch")));
});

test("post-validator rejects changed provenance and a forged verified label", () => {
  const source = fixture();
  const answer = mod.composeCoachAnswer({ result: source, personaId: "research" });
  answer.evidenceSummary[0].sourceReference.url = "https://evil.example/changed";
  answer.evidenceSummary[1].verificationLabel = "検証済み";
  const errors = mod.validateCoachComposedAnswer(answer, source.evidence);
  assert.ok(errors.some((item) => item.includes("source provenance changed")));
  assert.ok(errors.some((item) => item.includes("verification label mismatch")));
});

test("empty analysis produces a useful empty state without invented evidence", () => {
  const answer = mod.composeCoachAnswer({ result: { summary: "", strengths: [], priorityIssues: [], drills: [], evidence: [], uncertainty: [], nextActions: [] } });
  assert.match(answer.summary, /情報がまだありません/);
  assert.deepEqual(answer.evidenceSummary, []);
  assert.deepEqual(answer.referencedEvidenceIds, []);
});
