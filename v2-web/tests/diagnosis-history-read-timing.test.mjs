import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

// 診断履歴の読み取り（未検証7項目のうち、DBなしで確かめられる部分）。
// 本物のDBは使わず、メモリ上の偽クライアントで「保存前／保存後／削除後／50件超え」を再現する。
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
function load(path) {
  const output = ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = { exports: {} };
  new Function("module", "exports", "require", output)(mod, mod.exports, () => ({}));
  return mod.exports;
}
const { readSupabaseDiagnosisHistory, deleteSupabaseDiagnosisHistory } = load("src/lib/diagnosis-history-supabase.ts");

const USER = "11111111-1111-4111-8111-111111111111";
const OWNER = `uid:${USER}`;
const DIAG = { id: "d-imp", slug: "improvement", title: "課題診断", diagnosis_type: "improvement" };

// 偽クライアント：rows 配列が「DBに確定済みの行」。order/limit/eq/in/delete を最小限まねる。
function fakeClient(rows) {
  const query = (table) => {
    let data = table === "diagnoses" ? [DIAG] : rows;
    let mode = "select";
    const q = {
      select() { return q; },
      eq(col, val) { data = data.filter((r) => r[col] === val); return q; },
      in(col, vals) { data = data.filter((r) => vals.includes(r[col])); return q; },
      order(col, { ascending }) { data = [...data].sort((a, b) => (a[col] < b[col] ? -1 : 1) * (ascending ? 1 : -1)); return q; },
      limit(n) { data = data.slice(0, n); return q; },
      delete() { mode = "delete"; return q; },
      then(resolve) {
        if (mode === "delete") for (const r of data) rows.splice(rows.indexOf(r), 1);
        resolve({ data, error: null });
      },
    };
    return q;
  };
  return { auth: { getUser: async () => ({ data: { user: { id: USER } }, error: null }) }, from: query };
}
const row = (i) => ({
  id: `r${i}`, user_id: USER, diagnosis_id: DIAG.id,
  created_at: new Date(Date.UTC(2026, 10, 1) + i * 60000).toISOString(),
  result_payload: { diagnosis_type: "improvement", top_results: [{ key: "anti_air", score: 3 }] },
});

test("保存の確定前に履歴を読むと新しい結果は出ず、確定後に読み直せば出る（読み取り側は正しく動く）", async () => {
  const rows = [row(1)];
  const client = fakeClient(rows);
  const before = await readSupabaseDiagnosisHistory(OWNER, client);
  assert.deepEqual(before.records.map((r) => r.id), ["r1"]);
  rows.push(row(2)); // 保存RPCが確定した時点
  const after = await readSupabaseDiagnosisHistory(OWNER, client);
  assert.deepEqual(after.records.map((r) => r.id), ["r2", "r1"]);
});

test("削除のあとに読み直すと、消した行は一覧から消える", async () => {
  const rows = [row(1), row(2)];
  const client = fakeClient(rows);
  assert.equal((await deleteSupabaseDiagnosisHistory(OWNER, "r2", client)).status, "deleted");
  assert.deepEqual((await readSupabaseDiagnosisHistory(OWNER, client)).records.map((r) => r.id), ["r1"]);
});

test("51件以上あるときは新しい順に50件だけ表示する", async () => {
  const rows = Array.from({ length: 55 }, (_, i) => row(i + 1));
  const result = await readSupabaseDiagnosisHistory(OWNER, fakeClient(rows));
  assert.equal(result.records.length, 50);
  assert.equal(result.records[0].id, "r55");
  assert.equal(result.records.at(-1).id, "r6");
});

test("ゲスト（未ログイン）はアカウント履歴を読まない", async () => {
  const result = await readSupabaseDiagnosisHistory("guest", fakeClient([row(1)]));
  assert.equal(result.status, "failed");
});

test("原因の根拠：診断結果画面は保存の完了を待たずに履歴へ移動でき、保存は本人確認→RPCの2往復かかる", () => {
  const runner = read("src/components/diagnosis-runner.tsx");
  const save = runner.slice(runner.indexOf("const saveCompletedDiagnosis"), runner.indexOf("function reset()"));
  assert.ok(save.indexOf("auth.getUser()") < save.indexOf('rpc("save_diagnosis_result_with_answers"'));
  // 履歴へのリンクは保存状態に関係なく常に表示されている（現状の仕様の記録）。
  assert.match(runner, /<Link className="button-secondary" href="\/diagnosis\/history">診断履歴を見る<\/Link>/);
});
