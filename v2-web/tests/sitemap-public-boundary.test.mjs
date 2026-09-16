import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function fixture(environment) {
  let queries = 0;
  const rows = {
    characters: [
      { slug: "playable", status: "published", is_playable: true },
      { slug: "npc", status: "published", is_playable: false },
      { slug: "draft-character", status: "draft", is_playable: true },
    ],
    players: [{ slug: "public-player", status: "published" }, { slug: "draft-player", status: "draft" }],
    videos: [{ slug: "public-video", status: "published" }, { slug: "draft-video", status: "draft" }],
    diagnoses: [{ slug: "public-diagnosis", status: "published" }],
  };
  const client = { from(table) {
    queries++;
    let result = rows[table];
    assert.ok(result, `Unexpected table: ${table}`);
    const query = {
      select() { return query; },
      eq(key, value) { result = result.filter(row => row[key] === value); return query; },
      then(resolve) { return Promise.resolve({ data: result, error: null }).then(resolve); },
    };
    return query;
  } };
  const loadedModule = { exports: {} };
  new Function("module", "exports", "require", "process", js)(loadedModule, loadedModule.exports,
    name => {
      assert.equal(name, "@/lib/supabase/server");
      return { getSupabaseServerClient: () => client };
    }, { env: { VERCEL_ENV: environment, NEXT_PUBLIC_SITE_URL: "https://example.test",
      NEXT_PUBLIC_SUPABASE_URL: "https://fixture.invalid", NEXT_PUBLIC_SUPABASE_ANON_KEY: "fixture" } });
  return { run: loadedModule.exports.default, queryCount: () => queries };
}

test("production sitemap includes only published playable characters and published related entities", async () => {
  const f = fixture("production");
  const urls = (await f.run()).map(row => row.url);
  assert.ok(urls.includes("https://example.test/characters/playable"));
  assert.ok(urls.includes("https://example.test/videos/public-video"));
  assert.ok(urls.includes("https://example.test/players/public-player"));
  assert.ok(!urls.some(url => /npc|draft-|\/me\/training|\/moves|\/combos|\/setups|\/coach/.test(url)));
});

test("preview sitemap is empty and does not query the database", async () => {
  const f = fixture("preview");
  assert.deepEqual(await f.run(), []);
  assert.equal(f.queryCount(), 0);
});
