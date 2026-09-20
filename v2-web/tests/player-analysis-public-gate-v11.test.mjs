import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/player-analysis-public-gate.ts", import.meta.url), "utf8").replace(/import type[^;]+;\n/g, "");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const evidence = (id, url, kind = "OBSERVED_BEHAVIOR", playerId = "p1") => ({ id, kind, playerId, sourceUrl: url, sourceType: "official", sourceReliability: "primary" });
const item = (...entries) => ({ id: "a1", category: "strength", title: "強み", detail: "根拠付き", evidence: entries });

test("two exact public sources permit a published player analysis", () => {
  const result = mod.canPublishPlayerAnalysis({ playerId: "p1", playerPublished: true, identityConflict: false, items: [item(evidence("e1", "https://one.example"), evidence("e2", "https://two.example", "SOURCE_BACKED_FACT"))] });
  assert.equal(result.publishable, true);
  assert.deepEqual(result.reasons, []);
});

test("unpublished or conflicting identity fails closed", () => {
  const base = { playerId: "p1", items: [item(evidence("e1", "https://one.example"), evidence("e2", "https://two.example"))] };
  assert.ok(mod.canPublishPlayerAnalysis({ ...base, playerPublished: false, identityConflict: false }).reasons.includes("player_not_published"));
  assert.ok(mod.canPublishPlayerAnalysis({ ...base, playerPublished: true, identityConflict: true }).reasons.includes("identity_conflict"));
});

test("wrong player, internal sources and insufficient source count fail closed", () => {
  const wrong = evidence("e1", "https://one.example", "OBSERVED_BEHAVIOR", "p2");
  const internal = { ...evidence("e2", "https://two.example"), sourceType: "internal" };
  const result = mod.canPublishPlayerAnalysis({ playerId: "p1", playerPublished: true, identityConflict: false, items: [item(wrong, internal)] });
  assert.ok(result.reasons.includes("non_exact_player_evidence"));
  assert.ok(result.reasons.includes("non_public_source"));
  assert.ok(mod.canPublishPlayerAnalysis({ playerId: "p1", playerPublished: true, identityConflict: false, items: [item(evidence("e1", "https://one.example"))] }).reasons.includes("insufficient_public_sources"));
});

test("inference-only analysis is never public", () => {
  const result = mod.canPublishPlayerAnalysis({ playerId: "p1", playerPublished: true, identityConflict: false, items: [item(evidence("e1", "https://one.example", "AI_INFERENCE"), evidence("e2", "https://two.example", "AI_INFERENCE"))] });
  assert.ok(result.reasons.includes("inference_only"));
});
