import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/player-analysis.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

function evidence(kind, overrides = {}) {
  return {
    id: "e1",
    kind,
    statement: "sample",
    sourceId: "source-1",
    sourceUrl: "https://example.com",
    patch: null,
    confidence: 0.8,
    verificationStatus: kind === "AI_INFERENCE" ? "unverified" : "reviewed",
    characterSlug: null,
    playerId: "player-1",
    createdAt: null,
    ...overrides,
  };
}

function item(kind, overrides = {}) {
  return {
    id: "a1",
    category: "strength",
    title: "確認できる強み",
    detail: "Evidenceを伴う分析だけを扱う。",
    evidence: [evidence(kind)],
    ...overrides,
  };
}

test("player analysis exposes only the five approved evidence kinds", () => {
  assert.deepEqual(
    mod.PLAYER_ANALYSIS_EVIDENCE_KINDS,
    ["PLAYER_STATEMENT", "OBSERVED_BEHAVIOR", "OBSERVED_PATTERN", "AI_INFERENCE", "SOURCE_BACKED_FACT"],
  );
});

test("source-backed facts stay reviewed and sourced", () => {
  const candidate = item("SOURCE_BACKED_FACT");
  assert.deepEqual(mod.validatePlayerAnalysisItem(candidate), []);
  candidate.evidence[0].verificationStatus = "verified";
  assert.ok(mod.validatePlayerAnalysisItem(candidate).some((x) => x.includes("cannot be presented as verified")));
  assert.equal(mod.playerAnalysisEvidenceLabel("SOURCE_BACKED_FACT"), "出典確認済み情報");
});

test("source-backed player statement and observations require provenance", () => {
  for (const kind of ["PLAYER_STATEMENT", "OBSERVED_BEHAVIOR", "OBSERVED_PATTERN"]) {
    const candidate = item(kind);
    candidate.evidence[0].sourceId = null;
    candidate.evidence[0].sourceUrl = null;
    assert.ok(mod.validatePlayerAnalysisItem(candidate).some((x) => x.includes("requires a source reference")));
  }
});

test("AI inference remains an explicit inference and cannot become verified", () => {
  const candidate = item("AI_INFERENCE");
  assert.deepEqual(mod.validatePlayerAnalysisItem(candidate), []);
  candidate.evidence[0].verificationStatus = "verified";
  assert.ok(mod.validatePlayerAnalysisItem(candidate).some((x) => x.includes("cannot be presented as verified")));
  assert.equal(mod.playerAnalysisEvidenceLabel("AI_INFERENCE"), "AIによる分析");
});

test("unsupported gameplay facts are not silently treated as player analysis attribution", () => {
  const candidate = item("VERIFIED_GAME_FACT");
  assert.ok(mod.validatePlayerAnalysisItem(candidate).some((x) => x.includes("unsupported player-analysis evidence kind")));
});

test("duplicate analysis ids and empty evidence are rejected", () => {
  const first = item("AI_INFERENCE", { evidence: [] });
  const second = item("AI_INFERENCE");
  assert.ok(mod.validatePlayerAnalysis([first, second]).some((x) => x.includes("duplicate player analysis id")));
  assert.ok(mod.validatePlayerAnalysis([first, second]).some((x) => x.includes("evidence is required")));
});
