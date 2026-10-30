import {renderUnified} from './helpers/character-unified-ssr.mjs';
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("personal tools preserve the high-value legacy feature set", () => {
  const tools = read("src/app/tools/page.tsx");
  for (const route of ["/favorites", "/my-characters", "/compare", "/rank-tracker", "/diagnosis/history"]) {
    assert.ok(tools.includes(route), `missing tool route ${route}`);
  }
});

test("local user data remains browser-only and does not bypass Supabase gates", () => {
  const storage = read("src/lib/local-user-tools.ts");
  assert.ok(storage.includes("window.localStorage"));
  assert.ok(storage.includes("sf6dna_v2_favorite_characters"));
  assert.ok(storage.includes("sf6dna_v2_character_status"));
  assert.ok(storage.includes("sf6dna_v2_rank_history"));
  assert.ok(!storage.includes("sf6dna_v2_diagnosis_history"));
  const calls = [];
  const windowStub = { localStorage: { getItem: key => { calls.push(key); return null; } } };
  function compile(source, requireStub) {
    const mod = { exports: {} };
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    new Function('module', 'exports', 'require', 'window', js)(mod, mod.exports, requireStub, windowStub);
    return mod.exports;
  }
  const unexpected = name => { throw Error('Unexpected import: ' + name); };
  const keys = compile(read('src/lib/personalization-storage.ts'), unexpected);
  const api = compile(storage, name => name === './personalization-storage' ? keys : unexpected(name));
  assert.equal(api.getDiagnosisHistory(null), null);
  assert.equal(api.getDiagnosisHistory('uid:11111111-1111-4111-8111-111111111111'), null);
  assert.deepEqual(calls, [], 'unresolved/account owners must not read Guest browser history');
  assert.deepEqual(api.getDiagnosisHistory('guest'), []);
  assert.deepEqual(calls, ['sf6dna_v3_guest_diagnosis_history']);
  assert.ok(!storage.includes("getSupabase"));
});

test("character detail exposes favorite and usage status controls", () => {
  const html=renderUnified('ryu');
  assert.match(html,/aria-label="キャラクター個人設定"/);
  assert.match(html,/<button[^>]*aria-pressed="false"[^>]*>☆ お気に入り<\/button>/);
  assert.match(html,/使用状況/);
  for(const label of ['未設定','メイン','サブ','練習中'])assert.ok(html.includes(label));
  const controls=read('src/components/character-preference-actions.tsx');
  assert.match(controls,/setFavoriteCharacter\(slug, next\)/);
  assert.match(controls,/setCharacterStatus\(slug, normalized/);
  const storage=read('src/lib/local-user-tools.ts');assert.match(storage,/window.localStorage/);assert.doesNotMatch(storage,/getSupabase/);

});

test("diagnosis completion stores history without changing recommendation gates", () => {
  const runner = read("src/components/diagnosis-runner.tsx");
  assert.ok(runner.includes("saveDiagnosisHistory"));
  assert.ok(runner.includes("/api/diagnosis/recommend"));
});

test("public source directory excludes internal candidate evidence", () => {
  const sources = read("src/lib/public-sources.ts");
  assert.ok(sources.includes("list_public_sources"));
  assert.ok(!sources.includes('"internal_candidate"'));
});
