import test from "node:test";
import assert from "node:assert/strict";
import { auditPublicText, detectPreviewAuthGate, samePath } from "../scripts/lib/preview-content-qa.mjs";
const good = (overrides = {}) => auditPublicText({ bodyText: "JPの特徴と練習方針。", title: "JP | SF6DNA", requestedPath: "/characters/jp", currentUrl: "https://preview.example/characters/jp", expectedStatus: 200, status: 200, ...overrides });
test("public body passes and trailing slash is normalized", () => {
  assert.equal(samePath("/characters/jp", "https://preview.example/characters/jp/"), true);
  assert.deepEqual(good().findings, []);
});
test("Preview SSO and 401/403 are blocked, not PASS", () => {
  assert.equal(good({ title: "Authentication Required" }).blockedAuth, true);
  assert.equal(good({ status: 401 }).blockedAuth, true);
  assert.equal(good({ status: 403 }).blockedAuth, true);
});
test("site login is distinct from Vercel SSO", () => {
  assert.equal(detectPreviewAuthGate({ title: "ログイン | SF6DNA", bodyText: "ログインしてください" }), false);
});
test("raw uninitialized and development values are detected", () => {
  const r = good({ bodyText: "TODO undefined null" });
  assert.ok(r.findings.some(f => f.code === "DEVELOPMENT_MARKER"));
  assert.ok(r.findings.some(f => f.code === "UNINITIALIZED_VALUE"));
});
test("normal placeholder is warning, not an unreviewed error", () => {
  const r = good({ bodyText: "コンテンツを準備中です。" });
  assert.equal(r.findings.length, 0);
  assert.ok(r.warnings.some(f => f.code === "PLACEHOLDER_COPY"));
});
test("unexpected redirect is flagged", () => {
  assert.ok(good({ currentUrl: "https://preview.example/auth" }).findings.some(f => f.code === "UNEXPECTED_ROUTE_REDIRECT"));
});
test("expected 404 is never a public content failure", () => {
  assert.deepEqual(good({ expectedStatus: 404, status: 404, title: "", bodyText: "" }).findings, []);
});
test("no visible page body is returned in QA report", () => {
  const r = good({ bodyText: "記事本文。準備中です。" });
  assert.equal("bodyText" in r, false);
});
