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
    publicSources: [{ sourceId: "source-1", url: "https://example.com/move", sourceType: "official" }],
    ...overrides,
  };
}

test("exact public Move gains explicit verification Patch and Source metadata", () => {
  const result = adapter.mergePublicMoveMetadata([move()], new Map([["move-1", metadata()]]));
  assert.equal(result.items[0].verificationStatus, "verified");
  assert.equal(result.items[0].verificationSource, "public_move_gate");
  assert.equal(result.items[0].patch, "2026.08.03");
  assert.equal(result.items[0].availabilityStatus, "unknown");
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

for (const [label, itemOverride, metadataOverride] of [
  ["metadata ID mismatch", {}, { entityId: "other" }],
  ["character mismatch", { characterSlug: "jp" }, {}],
  ["missing character", {}, { characterSlug: null }],
  ["old patch", { patch: "old" }, {}],
  ["patch ID conflict", { patchId: "other" }, {}],
  ["missing patch", {}, { patchVersion: "" }],
  ["missing patch ID", {}, { patchId: "" }],
  ["source ID mismatch", { sourceId: "other" }, {}],
  ["source URL mismatch", { sourceUrl: "https://example.com/other" }, {}],
  ["source type mismatch", { sourceType: "community" }, {}],
  ["cross-paired sources", { sourceUrl: "https://example.com/other" }, { publicSources: [
    { sourceId: "source-1", url: "https://example.com/move", sourceType: "official" },
    { sourceId: "source-2", url: "https://example.com/other", sourceType: "official" },
  ] }],
  ["draft publication", { publicationStatus: "draft" }, {}],
  ["unknown publication", { publicationStatus: "unknown" }, {}],
  ["draft verification", { verificationStatus: "draft" }, {}],
  ["internal reliability", { reliabilityLevel: "internal" }, {}],
  ...["inaccessible", "restricted", "private", "internal"].map((status) => [status, { availabilityStatus: status }, {}]),
]) {
  test(`enrichment rejects ${label} without modifying the original`, () => {
    const original = move(itemOverride);
    const result = adapter.mergePublicMoveMetadata([original], new Map([["move-1", metadata(metadataOverride)]]));
    assert.deepEqual(result.items, [original]);
    assert.ok(result.uncertainty.length);
  });
}

test("confirmed availability is retained, never inferred from a public relation", () => {
  const result = adapter.mergePublicMoveMetadata([move({ availabilityStatus: "public" })], new Map([["move-1", metadata()]]));
  assert.equal(result.items[0].availabilityStatus, "public");
});

test("reviewed-only without explicit frame provenance remains reviewed", () => {
  const result = adapter.mergePublicMoveMetadata([move({ verificationStatus: "reviewed" })], new Map());
  assert.equal(result.items[0].verificationStatus, "reviewed");
});

const trustedJs = ts.transpileModule(readFileSync(new URL("../src/lib/coach-trusted-retrieval.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const trusted = await import(`data:text/javascript;base64,${Buffer.from(trustedJs).toString("base64")}`);

test("unknown URL availability cannot produce VERIFIED_GAME_FACT after enrichment", () => {
  const result = adapter.mergePublicMoveMetadata([move()], new Map([["move-1", metadata()]]));
  const evidence = trusted.buildRetrievalEvidence(result.items[0], { versionLabel: "2026.08.03" });
  assert.equal(evidence.evidence.kind, "UNVERIFIED_CANDIDATE");
});

for (const entityType of ["move", "combo", "setup", "sequence", "counter"]) {
  test(`${entityType} stays excluded at the existing closed retrieval gate`, () => {
    const result = adapter.mergePublicMoveMetadata([move({ entityType })], new Map([["move-1", metadata()]]));
    const bundle = trusted.buildRetrievalEvidenceList(result.items, { versionLabel: "2026.08.03" }, { publicStrategyContent: false, training: false });
    assert.equal(bundle.evidence.length, 0);
    assert.equal(bundle.excludedIds.length, 1);
  });
}

function mockAdapter({ fail = false, frames = [{ id: "frame-1", move_id: "move-1" }], patch = { id: "patch-1", version_label: "2026.08.03" }, sourceFail = false } = {}) {
  const calls = [];
  const tables = {
    patches: patch,
    moves: [{ id: "move-1", slug: "hadoken", characters: { slug: "ryu" } }],
    move_commands: [{ id: "command-1", move_id: "move-1" }],
    move_frame_data: frames,
  };
  const client = {
    from(table) {
      calls.push(table);
      const query = {
        select() { return query; }, in() { return query; }, eq() { return query; }, is() { return query; }, maybeSingle() { return query; },
        then(resolve, reject) { return (fail ? Promise.reject(new Error("private detail")) : Promise.resolve({ data: tables[table], error: null })).then(resolve, reject); },
      };
      return query;
    },
  };
  const sources = [
    { entityType: "move", entityId: "move-1" },
    { entityType: "move_command", entityId: "command-1" },
    { entityType: "frame", entityId: "frame-1" },
  ].map((relation) => ({ ...relation, sourceId: "source-1", url: "https://example.com/move", sourceType: "official", reliabilityLevel: "official" }));
  const executable = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  new Function("exports", "getSupabaseServerClient", "getPublicEntitySources", executable)(exports, () => client, async () => {
    calls.push("sources");
    if (sourceFail) throw new Error("private source error");
    return sources;
  });
  return { adapter: exports, calls };
}

test("batch loader uses a fixed five lookups and preserves partial missing results", async () => {
  const mock = mockAdapter();
  const missing = move({ entityId: "missing" });
  const result = await mock.adapter.enrichRetrievalItemsWithPublicEntityMetadata([move(), move(), missing]);
  assert.equal(result.items[0].verificationStatus, "verified");
  assert.deepEqual(result.items[2], missing);
  assert.equal(mock.calls.length, 5);
});

for (const [label, options] of [
  ["database exception", { fail: true }],
  ["source exception", { sourceFail: true }],
  ["unknown current patch", { patch: null }],
  ["reviewed-only/no verified frame", { frames: [] }],
  ["ambiguous active frames", { frames: [{ id: "frame-1", move_id: "move-1" }, { id: "frame-2", move_id: "move-1" }] }],
]) {
  test(`batch loader falls back on ${label}`, async () => {
    const mock = mockAdapter(options);
    const original = move();
    const result = await mock.adapter.enrichRetrievalItemsWithPublicEntityMetadata([original]);
    assert.deepEqual(result.items, [original]);
    assert.ok(result.uncertainty.length);
    assert.doesNotMatch(result.uncertainty.join(""), /private detail|private source error/);
  });
}
