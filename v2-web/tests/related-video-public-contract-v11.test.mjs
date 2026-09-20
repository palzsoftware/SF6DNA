import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/related-video-public-contract.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const candidate = (overrides = {}) => ({ status: "published", availability: "PUBLIC_CONFIRMED", availabilityCheckedAt: "2026-09-20T00:00:00Z", url: "https://youtube.com/watch?v=sample1", playerIds: ["p1"], ...overrides });

test("exact confirmed public video passes", () => assert.equal(mod.isRelatedVideoPublic(candidate(), "p1"), true));
test("UNKNOWN and every non-public availability fail closed", () => {
  for (const availability of ["UNKNOWN", "MEMBERS_ONLY", "PRIVATE", "DELETED", "RESTRICTED"]) assert.equal(mod.isRelatedVideoPublic(candidate({ availability }), "p1"), false);
});
test("missing availability check or exact relation fails closed", () => {
  assert.equal(mod.isRelatedVideoPublic(candidate({ availabilityCheckedAt: null }), "p1"), false);
  assert.equal(mod.isRelatedVideoPublic(candidate({ playerIds: ["p2"] }), "p1"), false);
});
test("draft and non-HTTPS video fail closed", () => {
  assert.equal(mod.isRelatedVideoPublic(candidate({ status: "draft" }), "p1"), false);
  assert.equal(mod.isRelatedVideoPublic(candidate({ url: "http://example.com" }), "p1"), false);
});
