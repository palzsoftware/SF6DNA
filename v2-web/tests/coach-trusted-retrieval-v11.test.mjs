import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const trustedSource = readFileSync(new URL("../src/lib/coach-trusted-retrieval.ts", import.meta.url), "utf8");
const trustedJs = ts.transpileModule(trustedSource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const trusted = await import(`data:text/javascript;base64,${Buffer.from(trustedJs).toString("base64")}`);

function currentPatch() {
  return { versionLabel: "2026.08.03", name: null, releasedAt: null, officialUrl: null };
}

function item(overrides = {}) {
  return {
    id: "r1",
    entityType: "move",
    entityId: "move-1",
    slug: "move",
    characterSlug: "jp",
    playerId: null,
    title: "対象技",
    statement: "対象技は+3F",
    sourceId: "source-1",
    sourceUrl: "https://example.com/source",
    sourceType: "official",
    reliabilityLevel: "official",
    patch: "2026.08.03",
    verificationStatus: "unknown",
    publicationStatus: "published",
    reviewedAt: null,
    verifiedAt: null,
    publishedAt: null,
    sourceAccessedAt: null,
    relevanceScore: 0.9,
    availabilityStatus: "public",
    patchSensitive: true,
    factDomain: "game",
    conflictKey: "move:move-1:frame",
    patchCompatible: false,
    ...overrides,
  };
}

test("source exists but reviewed only becomes SOURCE_BACKED_FACT", () => {
  const adapted = trusted.buildRetrievalEvidence(item({ verificationStatus: "reviewed" }), currentPatch());
  assert.equal(adapted.evidence.kind, "SOURCE_BACKED_FACT");
  assert.equal(adapted.evidence.verificationStatus, "reviewed");
});

test("explicit verified game fact requires source availability and compatible patch", () => {
  const adapted = trusted.buildRetrievalEvidence(item({ verificationStatus: "verified" }), currentPatch());
  assert.equal(adapted.evidence.kind, "VERIFIED_GAME_FACT");
  assert.equal(adapted.evidence.verificationStatus, "verified");
  assert.equal(adapted.evidence.patchStatus, "PATCH_MATCH");
});

test("source alone, published status and high relevance never imply verified", () => {
  const adapted = trusted.buildRetrievalEvidence(item({ verificationStatus: "unknown", relevanceScore: 1 }), currentPatch());
  assert.equal(adapted.evidence.kind, "UNVERIFIED_CANDIDATE");
  assert.notEqual(adapted.evidence.verificationStatus, "verified");
});

test("patch match, unknown, stale and non-sensitive states stay distinct", () => {
  assert.equal(trusted.retrievalPatchStatus(item(), currentPatch()), "PATCH_MATCH");
  assert.equal(trusted.retrievalPatchStatus(item({ patch: null }), currentPatch()), "PATCH_UNKNOWN");
  assert.equal(trusted.retrievalPatchStatus(item({ patch: "2025.01.01" }), currentPatch()), "PATCH_STALE");
  assert.equal(trusted.retrievalPatchStatus(item({ patchSensitive: false, patch: null }), currentPatch()), "PATCH_NOT_APPLICABLE");
});

test("stale verified game fact is downgraded and creates uncertainty", () => {
  const adapted = trusted.buildRetrievalEvidence(item({ verificationStatus: "verified", patch: "2025.01.01" }), currentPatch());
  assert.equal(adapted.evidence.kind, "UNVERIFIED_CANDIDATE");
  assert.ok(adapted.uncertainty.some((message) => message.includes("Current Patch")));
});

test("non-patch-sensitive verified profile remains source-backed rather than game fact", () => {
  const adapted = trusted.buildRetrievalEvidence(item({
    entityType: "player",
    factDomain: "profile",
    patchSensitive: false,
    patch: null,
    verificationStatus: "verified",
  }), currentPatch());
  assert.equal(adapted.evidence.kind, "SOURCE_BACKED_FACT");
});

test("filter excludes draft internal restricted and disabled strategy", () => {
  const rows = [
    item({ id: "draft", publicationStatus: "draft" }),
    item({ id: "internal", sourceType: "internal_audit" }),
    item({ id: "restricted", availabilityStatus: "restricted" }),
    item({ id: "strategy", entityType: "combo" }),
    item({ id: "keep", entityType: "player", factDomain: "profile", patchSensitive: false }),
  ];
  const filtered = trusted.filterTrustedRetrievalItems(rows, { publicStrategyContent: false, training: false });
  assert.deepEqual(filtered.kept.map((row) => row.id), ["keep"]);
  assert.equal(filtered.excludedIds.length, 4);
});

test("exact direct character/player isolation rejects mismatched identity", () => {
  const rows = [
    item({ id: "c1", entityType: "character", entityId: "other", factDomain: "profile", patchSensitive: false }),
    item({ id: "p1", entityType: "player", entityId: "other-player", factDomain: "profile", patchSensitive: false }),
  ];
  const filtered = trusted.filterTrustedRetrievalItems(rows, {
    publicStrategyContent: true,
    training: true,
    exactCharacterId: "character-1",
    exactPlayerId: "player-1",
  });
  assert.equal(filtered.kept.length, 0);
});

test("conflicting source statements generate uncertainty instead of choosing a winner", () => {
  const bundle = trusted.buildRetrievalEvidenceList([
    item({ id: "a", statement: "A" }),
    item({ id: "b", statement: "B" }),
  ], currentPatch(), { publicStrategyContent: true, training: true });
  assert.ok(bundle.uncertainty.some((message) => message.includes("一致していません")));
});

test("ranking prefers verified patch match over reviewed and relevance alone", () => {
  const bundle = trusted.buildRetrievalEvidenceList([
    item({ id: "high-relevance", verificationStatus: "unknown", relevanceScore: 1 }),
    item({ id: "reviewed", verificationStatus: "reviewed", relevanceScore: 0.1 }),
    item({ id: "verified", verificationStatus: "verified", relevanceScore: 0 }),
  ], currentPatch(), { publicStrategyContent: true, training: true });
  assert.match(bundle.evidence[0].id, /verified/);
  assert.match(bundle.evidence[1].id, /reviewed/);
});

test("query sanitizer removes user_id request_id email uuid and long numeric ids", () => {
  const sanitized = trusted.sanitizeRetrievalText("JP user_id=abc request_id=123e4567-e89b-12d3-a456-426614174000 test@example.com 123456789");
  assert.equal(sanitized.omittedSensitiveInput, true);
  assert.doesNotMatch(sanitized.text, /user_id|request_id|@|123e4567|123456789/);
});

test("query builder uses safe product context and keeps exact public entity scope", () => {
  const plan = trusted.buildRetrievalQuery({
    locale: "ja-JP",
    requestedPersona: "balanced",
    characterContext: { id: "character-1", slug: "jp", name: "JP", sourceBackedFacts: [], source: "character" },
    playerContext: { id: "player-1", slug: "player", displayName: "Player", sourceBackedFacts: [], source: "player" },
    diagnosisResult: { diagnosisType: "improvement", resultKey: "anti_air", primaryIssues: [{ key: "anti_air", label: "対空", score: 8 }], secondaryIssues: [], strengths: [], resultText: null, source: "diagnosis" },
  });
  assert.match(plan.query, /JP/);
  assert.match(plan.query, /対空/);
  assert.equal(plan.exactCharacterId, "character-1");
  assert.equal(plan.exactPlayerId, "player-1");
});

test("runtime normalization preserves source provenance but leaves verification unknown", () => {
  const normalized = trusted.normalizeTrustedRetrievalItems([{
    id: "entity-1",
    type: "character",
    title: "JP",
    subtitle: "公開プロフィール",
    href: "/characters/jp",
    matchedBy: "name",
    relevanceScore: 0.8,
    sources: [{ sourceId: "source-1", title: "Official", url: "https://example.com", sourceType: "official", publisher: "Example", reliabilityLevel: "official", publishedAt: "2026-01-01", accessedAt: "2026-09-18" }],
  }]);
  assert.equal(normalized[0].sourceId, "source-1");
  assert.equal(normalized[0].verificationStatus, "unknown");
  assert.equal(normalized[0].availabilityStatus, "unknown");
});

test("shared analysis source contains retrieval evidence and uncertainty integration", () => {
  const shared = readFileSync(new URL("../src/lib/coach-shared-analysis.ts", import.meta.url), "utf8");
  assert.match(shared, /retrievalEvidence\?: CoachEvidenceItem\[\]/);
  assert.match(shared, /retrievalUncertainty\?: string\[\]/);
  assert.match(shared, /\.\.\.\(context\.retrievalEvidence \?\? \[\]\)/);
});

test("coach API keeps hard gate and returns normalized retrieval evidence", () => {
  const api = readFileSync(new URL("../src/app/api/coach/retrieve/route.ts", import.meta.url), "utf8");
  assert.ok(api.indexOf("releaseFeatures.aiCoach") < api.indexOf("request.json"));
  assert.match(api, /normalizeTrustedRetrievalItems/);
  assert.match(api, /buildRetrievalEvidenceList/);
  assert.match(api, /retrievalEvidence:/);
  assert.match(api, /generationEnabled:\s*false/);
});
