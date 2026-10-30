import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

function loadPersonalizationStorage() {
  const source = read("src/lib/personalization-storage.ts");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loaded = { exports: {} };
  new Function("module", "exports", compiled)(loaded, loaded.exports);
  return loaded.exports;
}

test("diagnosis draft and save request keys are isolated by Guest and UUID owner", () => {
  const { personalStorageKey } = loadPersonalizationStorage();
  const userA = "uid:11111111-1111-4111-8111-111111111111";
  const userB = "uid:22222222-2222-4222-8222-222222222222";

  for (const kind of ["diagnosis_draft", "diagnosis_save_request"]) {
    const keys = [
      personalStorageKey("guest", kind),
      personalStorageKey(userA, kind),
      personalStorageKey(userB, kind),
    ].map((key) => `${key}:daily`);
    assert.equal(new Set(keys).size, 3, `${kind}: every owner must have a different key`);
    assert.ok(keys.every((key) => key.startsWith("sf6dna_v3_")));
    assert.ok(keys.every((key) => !key.startsWith("sf6dna_v2_")));
  }
});

test("diagnosis runner gates storage and DB save on the current hydrated owner", () => {
  const source = read("src/components/diagnosis-runner.tsx");
  assert.match(source, /function draftKey\(owner: PersonalOwner \| null, slug: string\)/);
  assert.match(source, /function saveRequestKey\(owner: PersonalOwner \| null, slug: string\)/);
  assert.match(source, /if \(!currentOwner \|\| !isHistoryOwnerCurrent\(\) \|\| !hydrated \|\| hydratedOwner !== currentOwner\) return;/);
  assert.match(source, /authData\.user\?\.id\?\.toLowerCase\(\) !== expectedUserId/);
  assert.match(source, /const isSaveCurrent = \(\) => generation === databaseSaveGeneration\.current/);
  const parent = source.slice(source.indexOf('export function DiagnosisRunner'), source.indexOf('function DiagnosisSession'));
  assert.match(parent, /state\.status === "ready" \? state\.owner : null/);
  assert.match(parent, /state\.status === "ready" \? state\.version : null/);
  assert.match(parent, /<DiagnosisSession key=\{sessionKey\}/);
  assert.match(source, /\[answers, setAnswers\] = useState<Record<string, string>>\(\{\}\)/);
  assert.match(source, /\[hydratedOwner, setHydratedOwner\] = useState<PersonalOwner \| null>\(null\)/);
  assert.doesNotMatch(source, /sf6dna_v2_diagnosis_(?:answers|save_request)/);
});
