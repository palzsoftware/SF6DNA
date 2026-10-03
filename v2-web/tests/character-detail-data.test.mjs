import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
function load(path, requireStub = () => { throw Error("Unexpected import"); }) {
  const loadedModule = { exports: {} };
  const js = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("module", "exports", "require", js)(loadedModule, loadedModule.exports, requireStub);
  return loadedModule.exports;
}
const route = load("src/lib/character-detail-route.ts");
const slugs = [...read("src/lib/character-detail-route.ts").matchAll(/^  "([a-z-]+)",/gm)].map((match) => match[1]);
const empty = () => ({ guideSections: [], moves: [], combos: [], setups: [], sequences: [], matchups: [], training: [] });

// Synthetic rows stay in tests; no DB, status, permissions or assets are changed.
function environment({ remote = null, canonical = null, blocked = false, queryError = false, commandError = false,
  commandOfficial = true, frameOfficial = true, framePatch = "current", verification = "verified", status = "published" } = {}) {
  const calls = [];
  const row = { id: "move-id", slug: "test-move", name_ja: "test move", move_type: "normal", status };
  const command = { id: "classic-id", move_id: "move-id", control_scheme: "classic", command_text: "LP", sort_order: 0 };
  const frame = { id: "frame-id", move_id: "move-id", valid_from_patch_id: framePatch, valid_to_patch_id: null, verification_status: verification, startup: "4", on_block: "-1", damage: 100 };
  const client = { from(table) {
    const query = {};
    for (const method of ["select", "eq", "in", "is", "order"]) query[method] = (...args) => { calls.push([table, method, ...args]); return query; };
    const result = () => ({ data: table === "moves" ? [row] : table === "patches" ? { id: "current" }
      : table === "move_commands" ? [command, { ...command, id: "unofficial-id", command_text: "DO NOT RENDER" }]
      : table === "move_frame_data" ? [frame] : [], error: (queryError || (commandError && table === "move_commands")) ? { message: "query failed" } : null });
    query.maybeSingle = async () => result();
    query.then = (resolve, reject) => Promise.resolve(result()).then(resolve, reject);
    return query;
  } };
  const mod = load("src/lib/character-detail-data.ts", (name) => {
    if (name === "@/lib/alex-reviewed-media") return { getAlexReviewedBundle: () => null };
    if (name === "@/lib/yasmine-move-media-pilot") return { getYasmineMoveMediaPilot: () => process.env.VERCEL_ENV === "preview" ? canonical : null };
    if (name === "@/lib/supabase/server") return { getSupabaseServerClient: () => client };
    if (name === "@/lib/public-move-gate") return { isMovePublicReady: async slug => { calls.push(["gate", slug]); return !blocked; } };
    if (name === "@/lib/character-detail-route") return route;
    if (name === "@/lib/device-preview") return { getDevicePreviewBundle: async (_id, token) => token === "authorized-test-token" ? remote : null };
    if (name === "@/lib/character-detail-v21-fixture") return { getCharacterDetailV21Fixture: () => empty() };
    if (name === "@/lib/public-source-links") return { getPublicEntitySources: async types => {
      const official = types.includes("move_command") ? commandOfficial : frameOfficial;
      return official ? [{ entityId: types.includes("move_command") ? command.id : frame.id, reliabilityLevel: "official" }] : [];
    } };
    throw Error(`Unexpected import ${name}`);
  });
  return { ...mod, calls };
}

test("Yasmine Preview capture takes precedence over unconfirmed remote identities", () => withEnv(async () => {
  const capture = { ...empty(), moves: [{ id: 'reviewed-capture' }] };
  const env = environment({ canonical: capture, remote: { ...empty(), moves: [{ id: 'unconfirmed-remote' }] } });
  const resolved = await env.resolveCharacterDetailData('yasmine-id', 'yasmine', 'authorized-test-token');
  assert.equal(resolved.bundle, capture);
  assert.equal(env.calls.length, 0);
}));
function withEnv(fn) {
  const saved = [process.env.VERCEL_ENV, process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY];
  process.env.VERCEL_ENV = "preview"; process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.invalid"; process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test";
  return Promise.resolve().then(fn).finally(() => {
    for (const [index, name] of ["VERCEL_ENV", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"].entries()) {
      if (saved[index] === undefined) delete process.env[name]; else process.env[name] = saved[index];
    }
  });
}

test("all 31 character slugs resolve gated DB moves before an empty overview fixture", () => withEnv(async () => {
  assert.equal(slugs.length, 31);
  for (const slug of slugs) {
    const env = environment();
    assert.equal(route.isCharacterDetailV2Route(slug), true);
    const result = await env.resolveCharacterDetailData("character-id", slug, null);
    assert.equal(result.source, "public", slug);
    assert.equal(result.bundle.moves.length, 1, slug);
    assert.deepEqual(result.bundle.combos, []);
    assert.equal(result.bundle.moves[0].commands.length, 1);
    assert.equal(result.bundle.moves[0].commands[0].commandText, "LP");
    assert.ok(env.calls.some(call => call[0] === "moves" && call[1] === "eq" && call[2] === "character_id"));
    assert.deepEqual(env.calls.find(call => call[0] === "gate"), ["gate", "test-move"]);
  }
}));
test("authorized remote bundle, including deliberately empty moves, wins over public and fixture", () => withEnv(async () => {
  const remote = empty(); const env = environment({ remote });
  const result = await env.resolveCharacterDetailData("character-id", "ken", "authorized-test-token");
  assert.equal(result.source, "device-preview"); assert.equal(result.bundle, remote); assert.equal(env.calls.length, 0);
}));
test("token-free request cannot use draft remote bundle", () => withEnv(async () => {
  const env = environment({ remote: { ...empty(), moves: [{ status: "draft" }] } });
  assert.equal((await env.resolveCharacterDetailData("id", "ken", null)).source, "public");
}));
test("publication gate rejection keeps DB move out of the bundle", () => withEnv(async () => {
  const env = environment({ blocked: true });
  assert.deepEqual(await env.loadPublicCharacterMoves("id"), []);
}));
test("unpublished row stays excluded even if a client mock returns it", () => withEnv(async () => {
  assert.deepEqual(await environment({ status: "draft" }).loadPublicCharacterMoves("id"), []);
}));
test("each rendered Classic command and frame needs its own official evidence", () => withEnv(async () => {
  for (const options of [{ commandOfficial: false }, { frameOfficial: false }]) {
    assert.deepEqual(await environment(options).loadPublicCharacterMoves("id"), []);
  }
}));
test("old patch or reviewed frame cannot leak into verified fields", () => withEnv(async () => {
  for (const options of [{ framePatch: "old" }, { verification: "reviewed" }]) {
    assert.deepEqual(await environment(options).loadPublicCharacterMoves("id"), []);
  }
}));
test("query failure differs from successful empty publication and stays safe", () => withEnv(async () => {
  for (const options of [{ queryError: true }, { commandError: true }]) {
    const env = environment(options);
    assert.equal(await env.loadPublicCharacterMoves("id"), null);
    const result = await env.resolveCharacterDetailData("id", "ken", null);
    assert.equal(result.source, "unavailable"); assert.deepEqual(result.bundle.moves, []);
  }
}));
test("Production never falls back to Preview fixture drafts", () => withEnv(async () => {
  process.env.VERCEL_ENV = "production";
  const result = await environment({ blocked: true }).resolveCharacterDetailData("id", "ryu", null);
  assert.equal(result.bundle, null); assert.equal(route.isCharacterDetailV2Route("ryu"), false);
}));
test("related videos use explicit entity IDs, stable order and deduplication, not names", () => {
  const env = environment();
  const linked = { id: "related", characters: ["different display name"] };
  const unrelated = { id: "unrelated", characters: ["JP"] };
  assert.deepEqual(env.resolveCharacterRelatedVideos([unrelated, linked], ["related", "related", "draft-or-missing"]), [linked]);
});
