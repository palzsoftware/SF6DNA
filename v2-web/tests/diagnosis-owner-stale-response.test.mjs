import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/components/diagnosis-runner.tsx", import.meta.url), "utf8").replace(/\r\n/g, "\n");
const start = source.indexOf("const saveCompletedDiagnosis = useCallback(async () => {");
const end = source.indexOf("\n  useEffect(() => {\n    if (!completed || !currentOwner", start);
assert.notEqual(start, -1, "save callback should be present");
assert.notEqual(end, -1, "save callback should have a stable boundary");
const save = source.slice(start, end);

test("late account-save success or failure is ignored after diagnosis ownership becomes stale", () => {
  const authAwait = save.indexOf("await supabase.auth.getUser()");
  const authGuard = save.indexOf("if (!isSaveCurrent()) return;", authAwait);
  const rpcAwait = save.indexOf("await supabase.rpc(");
  const rpcGuard = save.indexOf("if (!isSaveCurrent()) return;", rpcAwait);
  const successUpdate = save.indexOf('setDatabaseSaveStatus("saved")', rpcGuard);
  const catchStart = save.indexOf("} catch {");
  const failureGuard = save.indexOf("if (!isSaveCurrent()) return;", catchStart);
  const failureUpdate = save.indexOf('setDatabaseSaveStatus("failed")', failureGuard);
  const finallyStart = save.indexOf("} finally {");
  const finallyGuard = save.indexOf("if (isSaveCurrent())", finallyStart);
  const inFlightClear = save.indexOf("databaseSaveInFlight.current = false", finallyGuard);

  for (const [label, position] of Object.entries({
    authAwait, authGuard, rpcAwait, rpcGuard, successUpdate,
    catchStart, failureGuard, failureUpdate, finallyStart, finallyGuard, inFlightClear,
  })) assert.notEqual(position, -1, `${label} should be present in the save flow`);
  assert.ok(authAwait < authGuard && authGuard < rpcAwait);
  assert.ok(rpcAwait < rpcGuard && rpcGuard < successUpdate);
  assert.ok(catchStart < failureGuard && failureGuard < failureUpdate);
  assert.ok(finallyStart < finallyGuard && finallyGuard < inFlightClear);
  assert.match(save, /const isSaveCurrent = \(\) => generation === databaseSaveGeneration\.current &&\s*isHistoryOwnerCurrent\(\) && currentOwner === saveOwner && hydratedOwner === saveOwner/);
});

test("owner identity and version key a fresh diagnosis session", () => {
  const runner = source.slice(source.indexOf("export function DiagnosisRunner"), source.indexOf("function DiagnosisSession"));
  assert.match(runner, /state\.status === "ready" \? state\.owner : null/);
  assert.match(runner, /state\.status === "ready" \? state\.version : null/);
  assert.match(runner, /<DiagnosisSession key=\{sessionKey\}/);
});
