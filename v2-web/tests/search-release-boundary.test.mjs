import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/search.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

test("disabled strategy and library results are hidden even when RPC returns eligible rows", async () => {
  const types = ["character", "player", "video", "glossary", "move", "combo", "setup", "sequence", "counter", "training"];
  const loadedModule = { exports: {} };
  let moveChecks = 0;
  const imports = {
    "@/lib/supabase/server": { getSupabaseServerClient: () => ({ rpc: async () => ({
      data: types.map(type => ({ entity_type: type, entity_id: type, slug: type, title: type })), error: null,
    }) }) },
    "@/lib/public-move-gate": { isMovePublicReady: async () => { moveChecks++; return true; } },
    "@/lib/release-features": { releaseFeatures: { publicStrategyContent: false, training: false } },
  };
  new Function("module", "exports", "require", "process", js)(loadedModule, loadedModule.exports,
    name => { assert.ok(imports[name], name); return imports[name]; },
    { env: { NEXT_PUBLIC_SUPABASE_URL: "https://fixture.invalid", NEXT_PUBLIC_SUPABASE_ANON_KEY: "fixture" } });
  const result = await loadedModule.exports.searchAcrossContent("test");
  assert.deepEqual(result.map(row => row.type), ["character", "player", "video", "glossary"]);
  assert.equal(moveChecks, 0);
});
