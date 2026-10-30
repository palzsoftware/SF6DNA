import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Execute the real component with deterministic React hooks and an in-memory
// implementation of the RPC's (user, diagnosis, request) uniqueness contract.
// No network or database is used by these tests.
const source = readFileSync(new URL("../../src/components/diagnosis-runner.tsx", import.meta.url), "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const diagnosisDefinition = {
  id: "fixture-diagnosis", slug: "improvement", title: "fixture", diagnosisType: "improvement",
  questions: [{ id: "q1", options: [
    { id: "a1", scorePayload: { anti_air: 2 } },
    { id: "a2", scorePayload: { punish: 3 } },
  ] }],
};
const A = "11111111-1111-4111-8111-111111111111";
const B = "22222222-2222-4222-8222-222222222222";
const storageModule={exports:{}};
new Function("module","exports",ts.transpileModule(readFileSync(new URL("../../src/lib/personalization-storage.ts",import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(storageModule,storageModule.exports);
const {personalStorageKey}=storageModule.exports;
const scopedKey=(user,kind)=>personalStorageKey(user ? `uid:${user}` : "guest",kind)+":improvement";
const draftKey = scopedKey(A,"diagnosis_draft");
const requestKey = scopedKey(A,"diagnosis_save_request");

function environment(options = {}) {
  const diagnosis = { ...diagnosisDefinition, diagnosisType: options.diagnosisType ?? diagnosisDefinition.diagnosisType };
  let historyWritesBlocked = false;
  const storage = new Map([[draftKey, JSON.stringify({ q1: "a1" })]]);
  const rows = new Map(); const calls = []; const errors = [];
  let counter = 0; let user = A; let failNext = false; let commitThenFail = false;
  let authError = null; let authThrow = null;
  const localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => {
      if (historyWritesBlocked && key.endsWith("_diagnosis_history")) throw Error("fixture history storage blocked");
      return storage.set(key, value);
    },
    removeItem: key => storage.delete(key),
  };
  const localHistoryModule = { exports: {} };
  const localHistoryJs = ts.transpileModule(readFileSync(new URL("../../src/lib/local-user-tools.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function("module", "exports", "require", "window", localHistoryJs)(localHistoryModule, localHistoryModule.exports,
    name => { assert.equal(name, "./personalization-storage"); return storageModule.exports; }, { localStorage });
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
    // Owner resolution is stubbed here; these cases exercise the later save-time
    // auth recheck. Actual Owner hook lifecycle is a separate verification scope.
    const mountUser = user;
    const ownerContext={state:{status:"ready",owner:mountUser ? `uid:${mountUser}` : "guest",version:1},isCurrent:()=>user===mountUser};
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
      "@/lib/use-personalization-owner": {usePersonalizationOwner:()=>ownerContext},
      "@/lib/personalization-storage": storageModule.exports,
      react, "react/jsx-runtime": jsx, "next/link": { default: "a" },
      "@/lib/local-user-tools": localHistoryModule.exports,
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
      options.fetch ?? (() => { throw Error("network is forbidden in this fixture"); }),
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
          if (dirty) { dirty = false; cursor = 0; const wrapper = testModule.exports.DiagnosisRunner({ diagnosis }); tree = wrapper.type(wrapper.props); }
          while (effects.length) effects.shift()();
          while (timers.length) timers.shift()();
          await Promise.resolve();
        }
        assert.equal(dirty, false, "component should settle");
      },
      retry: () => findNode(node => node.props?.status !== undefined && typeof node.props?.onRetry === "function").props.onRetry(),
      reset: () => findProp("onReset")(),
      chooseFirst: () => findNode(node => node.type === "button" && node.props?.className?.startsWith("diagnosis-option")).props.onClick(),
      finish: () => findNode(node => node.type === "button" && node.props?.children === "結果を見る").props.onClick(),
      getTree: () => tree,
      getStatus: () => findProp("status"),
      getHistoryFailed: () => Boolean(findNode(node => typeof node.props?.failed === "boolean")?.props.failed),
      getMessage: () => findProp("message"),
    };
  }
  return { storage, rows, calls, errors, mount,
    setHistoryWritesBlocked: value => { historyWritesBlocked = value; },
    setUser: value => { user = value; },
    seedDraft: (id,answers={q1:"a1"}) => storage.set(scopedKey(id,"diagnosis_draft"),JSON.stringify(answers)),
    setAuthError: value => { authError = value; },
    setAuthThrow: value => { authThrow = value; },
    failNext: () => { failNext = true; },
    loseNextResponse: () => { commitThenFail = true; },
  };
}


export { environment, A, B, draftKey, requestKey };
