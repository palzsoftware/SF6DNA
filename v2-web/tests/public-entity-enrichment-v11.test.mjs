import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/public-entity-enrichment.ts", import.meta.url), "utf8")
  .replace(/^import .*;\n/gm, "");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const adapter = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

function move(overrides = {}) {
  return {
    id: "move:1:source-1", entityType: "move", entityId: "move-1", slug: "hadoken",
    characterSlug: null, playerId: null, title: "波動拳", statement: "波動拳",
    sourceId: "source-1", sourceUrl: "https://example.com/move", sourceType: "official",
    reliabilityLevel: "official", patch: null, patchId: null, patchName: null,
    verificationStatus: "unknown", verificationSource: null, publicationStatus: "published",
    reviewedAt: null, verifiedAt: null, publishedAt: null, sourceAccessedAt: null,
    relevanceScore: 1, availabilityStatus: "unknown", patchSensitive: true,
    factDomain: "game", conflictKey: "move:move-1", patchCompatible: false, ...overrides,
  };
}

function metadata(overrides = {}) {
  return {
    entityId: "move-1", slug: "hadoken", characterSlug: "ryu", patchId: "patch-1",
    patchName: "Year 3", patchVersion: "2026.08.03", verifiedAt: "2026-09-18",
    publicSourceIds: new Set(["source-1"]), publicSourceUrls: new Set(["https://example.com/move"]),
    ...overrides,
  };
}

test("exact public Move gains explicit verification Patch and Source metadata", () => {
  const result = adapter.mergePublicMoveMetadata([move()], new Map([["move-1", metadata()]]));
  assert.equal(result.items[0].verificationStatus, "verified");
  assert.equal(result.items[0].verificationSource, "public_move_gate");
  assert.equal(result.items[0].patch, "2026.08.03");
  assert.equal(result.items[0].availabilityStatus, "public");
  assert.equal(result.items[0].characterSlug, "ryu");
});

test("source-only Move stays unverified", () => {
  const result = adapter.mergePublicMoveMetadata([move()], new Map());
  assert.equal(result.items[0].verificationStatus, "unknown");
  assert.ok(result.uncertainty.length > 0);
});

test("identity mismatch refuses enrichment", () => {
  const result = adapter.mergePublicMoveMetadata([move()], new Map([["move-1", metadata({ slug: "shoryuken" })]]));
  assert.equal(result.items[0].verificationStatus, "unknown");
  assert.match(result.uncertainty[0], /一致しない/);
});

test("inexact or internal-looking Source cannot become public verified evidence", () => {
  const result = adapter.mergePublicMoveMetadata(
    [move({ sourceId: "internal-1", sourceUrl: "https://example.com/internal" })],
    new Map([["move-1", metadata()]]),
  );
  assert.equal(result.items[0].verificationStatus, "unknown");
  assert.match(result.uncertainty[0], /公開Source関係/);
});

test("Strategy entities are never enriched by the Move adapter", () => {
  const strategy = move({ entityType: "combo" });
  const result = adapter.mergePublicMoveMetadata([strategy], new Map([["move-1", metadata()]]));
  assert.deepEqual(result.items[0], strategy);
});

test("application keeps all current public Strategy search gates closed", () => {
  const search = readFileSync(new URL("../src/lib/search.ts", import.meta.url), "utf8");
  const trusted = readFileSync(new URL("../src/lib/coach-trusted-retrieval.ts", import.meta.url), "utf8");
  assert.match(search, /\["move", "combo", "setup", "sequence", "counter"\]/);
  assert.match(trusted, /STRATEGY_ENTITY_TYPES = new Set\(\["move", "combo", "setup", "sequence", "counter"\]\)/);
});
