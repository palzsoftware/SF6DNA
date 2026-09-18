import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/coach-foundation.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

function fixture() {
  return {
    summary: "対空の確認を優先する。",
    strengths: [{ id: "s1", title: "観察", detail: "飛びを見る時間を作れている。", evidenceIds: ["e1"] }],
    priorityIssues: [{ id: "p1", title: "対空", detail: "遅れた対空を減らす。", evidenceIds: ["e2"] }],
    drills: [{ id: "d1", title: "対空5分", purpose: "反応確認", steps: ["飛びを録画", "10回確認"], successCondition: "8回成功", evidenceIds: ["e2"] }],
    evidence: [
      { id: "e1", kind: "AI_INFERENCE", statement: "観察時間を作れている可能性がある。", sourceId: null, sourceUrl: null, patch: null, confidence: 0.7, verificationStatus: "unverified", characterSlug: "jp", playerId: null, createdAt: null },
      { id: "e2", kind: "VERIFIED_GAME_FACT", statement: "対象の対空情報", sourceId: "source-1", sourceUrl: "https://example.com/source", patch: "1.0", confidence: 1, verificationStatus: "verified", characterSlug: "jp", playerId: null, createdAt: "2026-09-18T00:00:00Z" },
    ],
    uncertainty: ["実リプレイ全体は未確認"],
    nextActions: ["対空練習を実施"],
  };
}

function factSnapshot(response) {
  return response.evidence.map(({ id, kind, statement, sourceId, sourceUrl, patch, verificationStatus, characterSlug, playerId }) => ({ id, kind, statement, sourceId, sourceUrl, patch, verificationStatus, characterSlug, playerId }));
}

test("four active personas exist and balanced is default", () => {
  assert.deepEqual(mod.COACH_PERSONAS.map((p) => p.id), ["balanced", "competitive", "supportive", "research"]);
  assert.equal(mod.DEFAULT_COACH_PERSONA_ID, "balanced");
  assert.ok(mod.COACH_PERSONAS.every((p) => p.active && p.mascotAsset === null));
});

test("verified/source-backed evidence cannot silently lose provenance", () => {
  const missingSource = { ...fixture().evidence[1], sourceId: null, sourceUrl: null };
  assert.ok(mod.validateCoachEvidence(missingSource).some((x) => x.includes("requires a source reference")));
  const badCandidate = { ...fixture().evidence[1], kind: "UNVERIFIED_CANDIDATE", verificationStatus: "verified" };
  assert.ok(mod.validateCoachEvidence(badCandidate).some((x) => x.includes("cannot be verified")));
});

test("persona formatting preserves factual evidence across all personas", () => {
  const result = fixture();
  const responses = mod.COACH_PERSONAS.map((p) => mod.formatCoachAnalysis(result, p.id));
  const expected = factSnapshot(responses[0]);
  for (const response of responses.slice(1)) assert.deepEqual(factSnapshot(response), expected);
  assert.equal(new Set(responses.map((r) => r.lead)).size, 4);
  assert.ok(responses.some((r) => r.sectionOrder[0] !== responses[0].sectionOrder[0]));
});

test("formatter preserves source URL, patch, character, kind and verification status", () => {
  const response = mod.formatCoachAnalysis(fixture(), "research");
  const evidence = response.evidence.find((item) => item.id === "e2");
  assert.deepEqual(
    { sourceUrl: evidence.sourceUrl, patch: evidence.patch, characterSlug: evidence.characterSlug, kind: evidence.kind, verificationStatus: evidence.verificationStatus },
    { sourceUrl: "https://example.com/source", patch: "1.0", characterSlug: "jp", kind: "VERIFIED_GAME_FACT", verificationStatus: "verified" },
  );
});

test("analysis validation catches unknown evidence references", () => {
  const result = fixture();
  result.priorityIssues[0].evidenceIds = ["missing"];
  assert.ok(mod.validateCoachAnalysisResult(result).some((x) => x.includes("unknown evidence missing")));
});

test("AI inference stays explicitly labeled and does not acquire a fabricated source", () => {
  const response = mod.formatCoachAnalysis(fixture(), "supportive");
  const inference = response.evidence.find((item) => item.id === "e1");
  assert.equal(inference.kind, "AI_INFERENCE");
  assert.equal(inference.sourceId, null);
  assert.equal(inference.sourceUrl, null);
  assert.equal(mod.coachEvidenceKindLabel(inference.kind), "AIによる分析");
});

test("v1.0 coach hard gates remain fail-closed in the v1.1 branch", () => {
  const flags = readFileSync(new URL("../src/lib/release-features.ts", import.meta.url), "utf8");
  const page = readFileSync(new URL("../src/app/coach/page.tsx", import.meta.url), "utf8");
  const api = readFileSync(new URL("../src/app/api/coach/retrieve/route.ts", import.meta.url), "utf8");
  const diagnosis = readFileSync(new URL("../src/components/diagnosis-runner.tsx", import.meta.url), "utf8");
  assert.match(flags, /aiCoach:\s*false/);
  assert.ok(page.indexOf("releaseFeatures.aiCoach") < page.indexOf("await searchParams"));
  assert.ok(api.indexOf("releaseFeatures.aiCoach") < api.indexOf("request.json"));
  assert.equal((diagnosis.match(/releaseFeatures\.aiCoach\s*&&\s*topQuery/g) ?? []).length, 2);
});

test("persona selector is wired to the safe shared config", () => {
  const ui = readFileSync(new URL("../src/components/coach-retrieval-demo.tsx", import.meta.url), "utf8");
  assert.match(ui, /COACH_PERSONAS\.map/);
  assert.match(ui, /aria-pressed/);
  assert.match(ui, /DEFAULT_COACH_PERSONA_ID/);
  assert.match(ui, /生成回答はまだ無効/);
});
