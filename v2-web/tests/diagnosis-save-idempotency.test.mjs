import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const runner = readFileSync(new URL("../src/components/diagnosis-runner.tsx", import.meta.url), "utf8");
const addMigration = readFileSync(
  new URL("../../supabase/migrations/20260902085136_add_diagnosis_save_idempotency.sql", import.meta.url),
  "utf8",
);
const aclMigration = readFileSync(
  new URL("../../supabase/migrations/20260902085538_fix_diagnosis_save_idempotent_retry_acl.sql", import.meta.url),
  "utf8",
);

test("local migrations mirror the applied diagnosis idempotency changes", () => {
  assert.match(addMigration, /add column request_id uuid/i);
  assert.match(addMigration, /create unique index diagnosis_results_user_diagnosis_request_key/i);
  assert.match(addMigration, /p_request_id uuid default null/i);
  assert.match(addMigration, /on conflict \(user_id, diagnosis_id, request_id\)/i);
  assert.match(addMigration, /idempotency_key_reused_with_different_payload/i);
  assert.match(aclMigration, /replace\(v_definition, E'    FOR UPDATE;\\n'/);
  assert.doesNotMatch(aclMigration, /grant\s+update/i);
});

test("the diagnosis client persists one request id before the RPC and clears it only after success", () => {
  assert.match(runner, /crypto\.randomUUID\(\)/);
  assert.match(runner, /stored\?\.fingerprint === fingerprint\s*\? stored\s*:\s*\{ requestId: createRequestId\(\), fingerprint \}/);
  assert.match(runner, /p_request_id: pending\.requestId/);

  const persistIndex = runner.indexOf("window.localStorage.setItem(storageKey, JSON.stringify(pending))");
  const rpcIndex = runner.indexOf('supabase.rpc("save_diagnosis_result_with_answers"');
  const clearIndex = runner.indexOf("window.localStorage.removeItem(storageKey)", rpcIndex);
  assert.ok(persistIndex >= 0 && persistIndex < rpcIndex);
  assert.ok(rpcIndex < clearIndex);
  assert.match(runner, /onRetry=\{\(\) => void saveCompletedDiagnosis\(\)\}/);
});
