import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const safeModule = { exports: {} };
new Function("module", "exports", ts.transpileModule(readFileSync(new URL("../src/lib/safe-external-url.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(safeModule, safeModule.exports);
const code = ts.transpileModule(readFileSync(new URL('../src/lib/event-media.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function setup(rows, failure) {
  const calls = [];
  const client = { from(table) {
    const filters = []; let cap;
    const query = {
      select() { return query; },
      eq(key, value) { filters.push([key, value]); return query; },
      in(key, value) { filters.push([key, value]); return query; },
      order() { return query; }, limit(value) { cap = value; return query; },
      then(resolve, reject) {
        calls.push({ table, filters, cap });
        if (failure === 'throw') return Promise.reject(new Error('offline')).then(resolve, reject);
        const data = (rows[table] ?? []).filter(row => filters.every(([key, value]) => Array.isArray(value) ? value.includes(row[key]) : row[key] === value));
        return Promise.resolve({ data: cap ? data.slice(0, cap) : data, error: failure === table ? { message: 'unavailable' } : null }).then(resolve, reject);
      }
    }; return query;
  }};
  const loaded = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => name.includes("safe-external-url") ? safeModule.exports : name.includes('supabase/server') ? { getSupabaseServerClient: () => client } : { getPublicEntitySources: async () => [] }, loaded, loaded.exports);
  return { list: loaded.exports.listVideos, calls };
}
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.test';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-only';
const data = {
  videos: [{ id: 'v1', status: 'published', slug: 'one', title: 'Match', url: 'https://youtu.be/abcdefghijk' }, { id: 'draft', status: 'draft', slug: 'draft', title: 'Draft', url: 'https://example.test' }],
  entity_videos: [{ video_id: 'v1', entity_type: 'player', entity_id: 'p1' }, { video_id: 'draft', entity_type: 'player', entity_id: 'p1' }],
  matches: [{ id: 'm1', video_id: 'v1', status: 'published' }],
  match_participants: [{ match_id: 'm1', player_id: 'p1', character_id: 'c1' }, { match_id: 'm1', player_id: 'p2', character_id: 'c2' }],
  players: [{ id: 'p1', display_name: 'Same name', status: 'published' }], characters: [{ id: 'c1', name_ja: 'キャラ', status: 'published' }]
};
test('player ID query deduplicates relation IDs, excludes drafts and limits video fetch', async () => {
  const { list, calls } = setup(data); const result = await list({ playerId: 'p1', limit: 8 });
  assert.deepEqual(result.map(v => v.id), ['v1']);
  assert.equal(calls.find(c => c.table === 'videos').cap, 8);
});
test('player × character does not attribute opponent character to the player', async () => {
  assert.deepEqual(await setup(data).list({ playerId: 'p1', characterId: 'c2' }), []);
  assert.deepEqual((await setup(data).list({ playerId: 'p1', characterId: 'c1' })).map(v => v.id), ['v1']);
});
test('character query includes match-only relations', async () => {
  assert.deepEqual((await setup(data).list({ characterId: 'c1' })).map(v => v.id), ['v1']);
});
test('missing relation does not fall back to all videos', async () => {
  const { list, calls } = setup(data); assert.deepEqual(await list({ playerId: 'missing' }), []);
  assert.equal(calls.some(c => c.table === 'videos'), false);
});
test('relation error and network exception are localized to video section', async () => {
  assert.deepEqual(await setup(data, 'match_participants').list({ playerId: 'p1' }), []);
  assert.deepEqual(await setup(data, 'throw').list({ playerId: 'p1' }), []);
});
test('video links preserve legacy player label and add exact ID filters; malformed IDs are rejected', () => {
  const result = { exports: {} };
  const js = ts.transpileModule(readFileSync(new URL('../src/lib/video-player-filter.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('module', 'exports', js)(result, result.exports);
  const id = '0a8aacc8-3feb-42c4-88e5-3dd5d3a9efe6';
  const url = new URL(result.exports.videoPlayerHref('名前 & 別名', id, id), 'https://example.test');
  assert.equal(url.searchParams.get('player'), '名前 & 別名');
  assert.equal(url.searchParams.get('playerId'), id);
  assert.equal(url.searchParams.get('characterId'), id);
  assert.equal(result.exports.videoEntityIdFromQuery(id), id);
  assert.equal(result.exports.videoEntityIdFromQuery('invalid'), null);
});
