import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const loaderSource = read("src/lib/daily-training-data.ts");
const pageSource = read("src/app/me/training/page.tsx");
const clientSource = read("src/components/daily-training-planner.tsx");

// Exercise the actual loader using an in-memory client. No DB, users or permissions are changed.
function loadCommonJs(source, requireStub = () => { throw new Error("Unexpected module"); }) {
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  new Function("module", "exports", "require", js)(loadedModule, loadedModule.exports, requireStub);
  return loadedModule.exports;
}
const details = loadCommonJs(read("src/lib/daily-training-details.ts"));
const pure = loadCommonJs(read("src/lib/daily-training.ts"), (name) => {
  if (name === "@/lib/daily-training-details") return details;
  throw new Error(`Unexpected pure import: ${name}`);
});
function fixture({ user = null, authError = null, row = null, queryError = null, throws = null } = {}) {
  const calls = [];
  const query = {};
  for (const method of ["select", "eq", "order", "limit"]) {
    query[method] = (...args) => { calls.push([method, ...args]); return query; };
  }
  query.maybeSingle = async () => {
    if (throws === "query") throw new Error("private DB error");
    return { data: row, error: queryError };
  };
  const client = {
    auth: { getUser: async () => {
      calls.push(["auth.getUser"]);
      if (throws === "auth") throw new Error("private auth error");
      return { data: { user }, error: authError };
    } },
    from: (table) => { calls.push(["from", table]); return query; },
  };
  const { loadDailyTrainingContext } = loadCommonJs(loaderSource, (name) => {
    if (name === "@/lib/daily-training") return pure;
    if (name === "@/lib/supabase/auth-server") return { getSupabaseAuthServerClient: async () => {
      if (throws === "env") throw new Error("configuration unavailable");
      return client;
    } };
    throw new Error(`Unexpected loader import: ${name}`);
  });
  return { calls, load: loadDailyTrainingContext };
}

test("guest does not query private match rows or redirect", async () => {
  const f = fixture();
  assert.deepEqual(await f.load(), { primaryIssue: null, state: "guest" });
  assert.deepEqual(f.calls, [["auth.getUser"]]);
});
test("missing session is a guest context, not a training-page failure", async () => {
  const f = fixture({ authError: { name: "AuthSessionMissingError" } });
  assert.deepEqual(await f.load(), { primaryIssue: null, state: "guest" });
  assert.equal(f.calls.some(([method]) => method === "from"), false);
});
test("non-session auth failure suppresses all private queries", async () => {
  const f = fixture({ user: { id: "fixture-a" }, authError: { name: "AuthApiError" } });
  assert.deepEqual(await f.load(), { primaryIssue: null, state: "unavailable" });
  assert.equal(f.calls.some(([method]) => method === "from"), false);
});
test("logged-in context requests only latest own issue with a bounded select", async () => {
  const f = fixture({ user: { id: "fixture-a" }, row: { primary_issue: "execution", played_at: "2026-09-07" } });
  assert.deepEqual(await f.load(), { primaryIssue: "execution", state: "match" });
  assert.deepEqual(f.calls, [
    ["auth.getUser"], ["from", "user_match_logs"], ["select", "primary_issue, played_at"],
    ["eq", "user_id", "fixture-a"], ["order", "played_at", { ascending: false }],
    ["order", "id", { ascending: false }], ["limit", 1],
  ]);
});
test("different authenticated users retain independent ownership filters", async () => {
  for (const id of ["fixture-a", "fixture-b"]) {
    const f = fixture({ user: { id }, row: { primary_issue: "habit" } });
    const output = await f.load();
    assert.deepEqual(f.calls.find(([method]) => method === "eq"), ["eq", "user_id", id]);
    assert.doesNotMatch(JSON.stringify(output), /fixture-a|fixture-b|user_id/);
  }
});
test("empty match history remains a usable fallback", async () => {
  assert.deepEqual(await fixture({ user: { id: "fixture-a" } }).load(), { primaryIssue: null, state: "empty" });
});
test("unknown or malformed issue does not claim personalization", async () => {
  for (const primary_issue of ["unknown", "not-an-issue", null, {}]) {
    assert.deepEqual(await fixture({ user: { id: "fixture-a" }, row: { primary_issue } }).load(), { primaryIssue: null, state: "empty" });
  }
});
test("database read error falls back without returning private error details", async () => {
  const output = await fixture({ user: { id: "fixture-a" }, queryError: { message: "sensitive detail" } }).load();
  assert.deepEqual(output, { primaryIssue: null, state: "unavailable" });
  assert.doesNotMatch(JSON.stringify(output), /sensitive/);
});
for (const throws of ["env", "auth", "query"]) {
  test(`unexpected ${throws} error returns safe fallback`, async () => {
    assert.deepEqual(await fixture({ user: { id: "fixture-a" }, throws }).load(), { primaryIssue: null, state: "unavailable" });
  });
}
test("loader contains no write, training-library, source, diagnosis-result or privileged-client access", () => {
  assert.match(loaderSource, /getSupabaseAuthServerClient/);
  assert.doesNotMatch(loaderSource, /\.insert\(|\.update\(|\.delete\(|\.upsert\(|\.rpc\(/);
  assert.doesNotMatch(loaderSource, /service[_-]?role|trainings|listTrainingLibrary|diagnosis_results|entity_sources|issue_detail|notes/);
  assert.doesNotMatch(loaderSource, /redirect\(|searchParams/);
});
test("route is dynamic, noindex, and independent of disabled library flags", () => {
  assert.match(pageSource, /dynamic\s*=\s*"force-dynamic"/);
  assert.match(pageSource, /index:\s*false/);
  assert.match(pageSource, /follow:\s*false/);
  assert.doesNotMatch(pageSource, /releaseFeatures|user_id|service[_-]?role|redirect\(/);
  assert.match(pageSource, /parseDailyTrainingRequest\(await searchParams\)/);
});
test("diagnosis link with valid focus skips the optional private loader", () => {
  assert.match(pageSource, /request\?\.focus\s*\?\s*\{\s*primaryIssue:\s*null,\s*state:\s*"empty"\s*\}\s*:\s*await loadDailyTrainingContext\(\)/);
});
test("browser storage read is protected and contains no new writes", () => {
  assert.match(clientSource, /try\s*\{/);
  assert.match(clientSource, /getDiagnosisHistory\(\)/);
  assert.match(clientSource, /catch\s*\{/);
  assert.doesNotMatch(clientSource, /localStorage\.setItem|sessionStorage\.setItem|\.insert\(|fetch\(/);
  assert.match(clientSource, /window\.clearTimeout/);
});
test("client uses three-card plan, safe explanatory text, and existing design classes", () => {
  assert.match(clientSource, /今日の15分練習/);
  assert.match(clientSource, /5分 × 3課題/);
  assert.match(clientSource, /plan\.items\.map/);
  assert.doesNotMatch(clientSource, /<table|dangerouslySetInnerHTML|user_id|AIコーチ|listTrainingLibrary/);
  assert.match(clientSource, /完了状態はこのページ内だけで使い、保存しません/);
});

test("client exposes accessible accordion and page-only fifteen-minute progress", () => {
  assert.match(clientSource, /aria-expanded/);
  assert.match(clientSource, /aria-controls/);
  assert.match(clientSource, /role="progressbar"/);
  assert.match(clientSource, /aria-valuemax=\{15\}/);
  assert.match(clientSource, /このトレーニングを完了にする/);
  assert.match(clientSource, /今日のメニュー完了/);
  assert.doesNotMatch(clientSource, /localStorage\.setItem|sessionStorage\.setItem|fetch\(|\.insert\(/);
});
test("error boundary does not expose internal error messages", () => {
  const source = read("src/app/me/training/error.tsx");
  assert.match(source, /reset/);
  assert.doesNotMatch(source, /error\.message|error\.stack/);
});
