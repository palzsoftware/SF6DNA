import assert from "node:assert/strict";
import test from "node:test";
import { environment, A, B, draftKey, requestKey } from "./helpers/diagnosis-owner-save-harness.mjs";

test("successful completed diagnosis reload reuses its request and creates one account row", async () => {
  const env = environment();
  const first = env.mount(); await first.settle(); assert.equal(first.getStatus(), "saved");
  const second = env.mount(); await second.settle(); assert.equal(second.getStatus(), "saved");
  assert.equal(env.calls.length, 2);
  assert.equal(env.rows.size, 1, "reloading the same completed draft must not insert a second row");
  assert.equal(env.calls[0].p_request_id, env.calls[1].p_request_id);
});

test("failed save retries the same request without losing the completed draft", async () => {
  const env = environment(); env.failNext();
  const view = env.mount(); await view.settle(); assert.equal(view.getStatus(), "failed");
  assert.equal(env.rows.size, 0); assert.ok(env.storage.get(requestKey));
  await view.retry(); await view.settle(); assert.equal(view.getStatus(), "saved");
  assert.equal(env.rows.size, 1); assert.equal(env.calls[0].p_request_id, env.calls[1].p_request_id);
  assert.deepEqual(JSON.parse(env.storage.get(draftKey)), { q1: "a1" });
});

test("lost response after commit retries idempotently and stays idempotent after reload", async () => {
  const env = environment(); env.loseNextResponse();
  const view = env.mount(); await view.settle(); assert.equal(view.getStatus(), "failed");
  assert.equal(env.rows.size, 1);
  await view.retry(); await view.settle(); assert.equal(view.getStatus(), "saved");
  await env.mount().settle();
  assert.equal(env.rows.size, 1); assert.equal(new Set(env.calls.map(call => call.p_request_id)).size, 1);
});

test("failed save can reload and succeed using the original request", async () => {
  const env = environment(); env.failNext();
  const first = env.mount(); await first.settle(); assert.equal(first.getStatus(), "failed");
  const second = env.mount(); await second.settle(); assert.equal(second.getStatus(), "saved");
  assert.equal(env.rows.size, 1); assert.equal(env.calls[0].p_request_id, env.calls[1].p_request_id);
});

test("explicit reset clears request identity so the next completed attempt is new", async () => {
  const env = environment(); const view = env.mount(); await view.settle();
  view.reset(); await view.settle(); assert.equal(env.storage.has(requestKey), false);
  view.chooseFirst(); await view.settle(); view.finish(); await view.settle();
  assert.equal(view.getStatus(), "saved");
  assert.equal(env.rows.size, 2); assert.notEqual(env.calls[0].p_request_id, env.calls[1].p_request_id);
});

test("changed completed answers produce a fresh request and preserve different result payloads", async () => {
  const env = environment(); await env.mount().settle();
  env.storage.set(draftKey, JSON.stringify({ q1: "a2" })); await env.mount().settle();
  assert.equal(env.rows.size, 2); assert.notEqual(env.calls[0].p_request_id, env.calls[1].p_request_id);
  assert.deepEqual(env.calls[1].p_result_payload.scores, { punish: 3 });
});

test("guest completed diagnosis does not invoke the account RPC", async () => {
  const env = environment(); env.setUser(null); env.seedDraft(null);
  const view = env.mount(); await view.settle();
  assert.equal(view.getStatus(), "idle"); assert.equal(env.calls.length, 0); assert.equal(env.rows.size, 0);
  assert.equal(env.storage.has(requestKey), false);
});

test("account switch keeps uniqueness scoped to each user", async () => {
  const env = environment(); await env.mount().settle();
  env.setUser(B); await env.mount().settle();
  assert.equal(env.calls.length,1,"B must not restore A draft or submit it");
  env.seedDraft(B); await env.mount().settle();
  assert.equal(env.rows.size, 2);
  env.setUser(A); await env.mount().settle(); assert.equal(env.rows.size, 2);
});

test("a missing session is a normal guest without an account save error", async () => {
  const env = environment(); env.setUser(null); env.seedDraft(null);
  env.setAuthError(Object.assign(Error("missing session fixture"), { name: "AuthSessionMissingError" }));
  const view = env.mount(); await view.settle();
  assert.equal(view.getStatus(), "idle");
  assert.equal(env.calls.length, 0); assert.equal(env.errors.length, 0);
  assert.equal(env.storage.has(requestKey), false);
});

test("an unexpected auth error stays visible and does not become a guest", async () => {
  const env = environment();
  env.setAuthError(Object.assign(Error("unexpected auth fixture"), { name: "AuthApiError" }));
  const view = env.mount(); await view.settle();
  assert.equal(view.getStatus(), "failed");
  assert.match(view.getMessage(), /アカウントに保存できませんでした/);
  assert.equal(env.calls.length, 0); assert.equal(env.errors.length, 1);
  env.setAuthError(null); env.setUser(A);
  await view.retry(); await view.settle();
  assert.equal(view.getStatus(), "saved"); assert.equal(env.rows.size, 1);
});

test("a network exception during auth check remains retryable without an RPC", async () => {
  const env = environment(); env.setAuthThrow(TypeError("network fixture"));
  const view = env.mount(); await view.settle();
  assert.equal(view.getStatus(), "failed");
  assert.match(view.getMessage(), /もう一度お試しください/);
  assert.equal(env.calls.length, 0); assert.equal(env.storage.has(requestKey), false);
  env.setAuthThrow(null); await view.retry(); await view.settle();
  assert.equal(view.getStatus(), "saved"); assert.equal(env.rows.size, 1);
});
