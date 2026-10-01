import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

// Execute the real component with deterministic React hooks and an in-memory
// implementation of the RPC's (user, diagnosis, request) uniqueness contract.
// No network or database is used by these tests.
const source = readFileSync(new URL("../src/components/diagnosis-runner.tsx", import.meta.url), "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const diagnosis = {
  id: "fixture-diagnosis", slug: "improvement", title: "fixture", diagnosisType: "improvement",
  questions: [{ id: "q1", options: [
    { id: "a1", scorePayload: { anti_air: 2 } },
    { id: "a2", scorePayload: { punish: 3 } },
  ] }],
};
const draftKey = "sf6dna_v2_diagnosis_answers:improvement";
const requestKey = "sf6dna_v2_diagnosis_save_request:improvement";

function environment() {
  const storage = new Map([[draftKey, JSON.stringify({ q1: "a1" })]]);
  const rows = new Map(); const calls = []; const errors = [];
  let counter = 0; let user = "fixture-user"; let failNext = false; let commitThenFail = false;
  let authError = null; let authThrow = null;
  const localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };
  const client = {
    auth: { getUser: async () => {
      if (authThrow) throw authThrow;
      return { data: { user: user ? { id: user } : null }, error: authError };
    } },
    rpc: async (name, payload) => {
      assert.equal(name, "save_diagnosis_result_with_answers");
      calls.push({ user, ...payload });
      if (failNext) { failNext = false; return { data: null, error: Error("fixture retry") }; }
      const key = JSON.stringify([user, payload.p_diagnosis_id, payload.p_request_id]);
      const fingerprint = JSON.stringify([payload.p_result_payload, payload.p_answers]);
      const previous = rows.get(key);
      if (previous) assert.equal(previous.fingerprint, fingerprint, "one request must retain its payload");
      else rows.set(key, { id: `row-${rows.size + 1}`, fingerprint });
      if (commitThenFail) { commitThenFail = false; throw Error("fixture response lost after commit"); }
      return { data: rows.get(key).id, error: null };
    },
  };
  function mount() {
    const slots = []; const effects = []; const timers = [];
    let cursor = 0; let dirty = true; let tree;
    const changed = (old, deps) => !old || deps.some((item, i) => !Object.is(item, old[i]));
    function memo(factory, deps) {
      const i = cursor++;
      if (!slots[i] || changed(slots[i].deps, deps)) slots[i] = { deps, value: factory() };
      return slots[i].value;
    }
    const react = {
      useState: initial => {
        const i = cursor++;
        if (!(i in slots)) slots[i] = typeof initial === "function" ? initial() : initial;
        return [slots[i], next => {
          const value = typeof next === "function" ? next(slots[i]) : next;
          if (!Object.is(value, slots[i])) { slots[i] = value; dirty = true; }
        }];
      },
      useRef: initial => { const i = cursor++; slots[i] ??= { current: initial }; return slots[i]; },
      useMemo: memo,
      useCallback: (callback, deps) => memo(() => callback, deps),
      useEffect: (callback, deps) => {
        const i = cursor++;
        if (changed(slots[i]?.deps, deps)) { slots[i] = { deps }; effects.push(callback); }
      },
    };
    const jsx = { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
    const imports = {
      react, "react/jsx-runtime": jsx, "next/link": { default: "a" },
      "@/lib/local-user-tools": { saveDiagnosisHistory: () => {} },
      "@/lib/daily-training": { buildDailyTrainingHref: () => "/daily" },
      "@/lib/release-features": { releaseFeatures: { aiCoach: false } },
      "@/lib/supabase/client": { getSupabaseBrowserClient: () => client },
    };
    const testModule = { exports: {} };
    new Function("module", "exports", "require", "window", "crypto", "console", "fetch", js)(
      testModule, testModule.exports,
      name => { assert.ok(imports[name], `unexpected import ${name}`); return imports[name]; },
      { localStorage, setTimeout: callback => { timers.push(callback); return timers.length; }, clearTimeout: () => {} },
      { randomUUID: () => `00000000-0000-4000-8000-${String(++counter).padStart(12, "0")}` },
      { error: (...args) => errors.push(args) },
      () => { throw Error("network is forbidden in this fixture"); },
    );
    function findNode(predicate, node = tree) {
      if (!node || typeof node !== "object") return undefined;
      if (predicate(node)) return node;
      for (const child of Object.values(node)) {
        if (child && typeof child === "object") {
          const found = findNode(predicate, child);
          if (found) return found;
        }
      }
      return undefined;
    }
    const findProp = name => findNode(node => Boolean(node.props?.[name]))?.props[name];
    return {
      async settle() {
        for (let i = 0; i < 16; i++) {
          if (dirty) { dirty = false; cursor = 0; tree = testModule.exports.DiagnosisRunner({ diagnosis }); }
          while (effects.length) effects.shift()();
          while (timers.length) timers.shift()();
          await Promise.resolve();
        }
        assert.equal(dirty, false, "component should settle");
      },
      retry: () => findProp("onRetry")(),
      reset: () => findProp("onReset")(),
      chooseFirst: () => findNode(node => node.type === "button" && node.props?.className?.startsWith("diagnosis-option")).props.onClick(),
      finish: () => findNode(node => node.type === "button" && node.props?.children === "結果を見る").props.onClick(),
      getStatus: () => findProp("status"),
      getMessage: () => findProp("message"),
    };
  }
  return { storage, rows, calls, errors, mount,
    setUser: value => { user = value; },
    setAuthError: value => { authError = value; },
    setAuthThrow: value => { authThrow = value; },
    failNext: () => { failNext = true; },
    loseNextResponse: () => { commitThenFail = true; },
  };
}

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
  const env = environment(); env.setUser(null);
  const view = env.mount(); await view.settle();
  assert.equal(view.getStatus(), "idle"); assert.equal(env.calls.length, 0); assert.equal(env.rows.size, 0);
  assert.equal(env.storage.has(requestKey), false);
});

test("account switch keeps uniqueness scoped to each user", async () => {
  const env = environment(); await env.mount().settle();
  env.setUser("second-fixture-user"); await env.mount().settle();
  assert.equal(env.rows.size, 2);
  env.setUser("fixture-user"); await env.mount().settle(); assert.equal(env.rows.size, 2);
});

test("a missing session is a normal guest without an account save error", async () => {
  const env = environment(); env.setUser(null);
  env.setAuthError(Object.assign(Error("missing session fixture"), { name: "AuthSessionMissingError" }));
  const view = env.mount(); await view.settle();
  assert.equal(view.getStatus(), "idle");
  assert.equal(env.calls.length, 0); assert.equal(env.errors.length, 0);
  assert.equal(env.storage.has(requestKey), false);
});

test("an unexpected auth error stays visible and does not become a guest", async () => {
  const env = environment(); env.setUser(null);
  env.setAuthError(Object.assign(Error("unexpected auth fixture"), { name: "AuthApiError" }));
  const view = env.mount(); await view.settle();
  assert.equal(view.getStatus(), "failed");
  assert.match(view.getMessage(), /アカウントに保存できませんでした/);
  assert.equal(env.calls.length, 0); assert.equal(env.errors.length, 1);
  env.setAuthError(null); env.setUser("fixture-user");
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
