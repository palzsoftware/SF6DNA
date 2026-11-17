import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Plan A: existing Production-public players stay public; new SFL2026 and
// major-tournament Top8 players need an individual approval row. DB
// status=published is still required. Matching is exact UUID+slug.
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
function load(path, imports = {}) {
  const js = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', 'process', js)(mod, mod.exports, name => {
    assert.ok(name in imports, `unexpected dependency ${name}`);
    return imports[name];
  }, process);
  return mod.exports;
}
const gate = load('../src/lib/player-publication-gate.ts');
const snapshot = JSON.parse(read('../../docs/release-20260930-publication/PLAYER_PUBLICATION_AUDIT.json'));
const snapshotPublic = snapshot.rows.filter(r => r.current_status === 'published').map(r => `${r.id}:${r.slug}`).sort();

const TOKIDO = { id: '24f7c815-946f-49f0-aede-7b8f42fdfebb', slug: 'tokido' };          // legacy + SFL48
const BLAZ = { id: '830621f4-38aa-49e3-a320-31621e983fb5', slug: 'blaz' };              // legacy, outside SFL48
const RYUKICHI_DEV = { id: 'b3f67376-cb75-4b44-8b2d-ef50058a1b98', slug: 'ryukichi' };  // new SFL2026, unapproved
const RYUSEI_DEV = { id: 'fa32345b-a9a5-4113-b584-49009f54639d', slug: 'ryusei' };      // Development ID differs from Production
const KAKERU_DEV = { id: 'b1d6c5b4-9157-455a-84b5-6b5c2ecb80ee', slug: 'kakeru' };      // Top8 candidate, unapproved
const PROD_URL = 'https://wnuxaxbrpudyypzdbdho.supabase.co';
const DEV_URL = 'https://vvsknbmlfvvnrmgtyhbf.supabase.co';
const prodKeys = () => gate.publicPlayerIdentityKeys('production');
const devKeys = () => gate.publicPlayerIdentityKeys('development');

test('legacy list equals the 2026-09-30 Production published snapshot exactly', () => {
  const rows = gate.LEGACY_PRODUCTION_PUBLIC_PLAYERS;
  assert.deepEqual(rows.map(r => `${r.playerId}:${r.playerSlug}`).sort(), snapshotPublic);
  assert.equal(snapshotPublic.length, 41);
  assert.ok(rows.every(r => r.environment === 'production' && r.basis === 'LEGACY_PRODUCTION_PUBLIC' && r.evidence.includes('73d8c321')));
  assert.deepEqual(gate.INDIVIDUALLY_APPROVED_PLAYERS, [], 'no new player is approved by this change');
});

test('Development mirrors only legacy rows whose Development UUID+slug is identical', () => {
  const mirror = gate.LEGACY_DEVELOPMENT_MIRROR_PLAYERS;
  assert.equal(mirror.length, 9);
  assert.ok(mirror.every(r => r.environment === 'development' && snapshotPublic.includes(`${r.playerId}:${r.playerSlug}`)));
});

test('environment is resolved only from the exact known Supabase project URL', () => {
  assert.equal(gate.playerPublicationEnvironment(PROD_URL), 'production');
  assert.equal(gate.playerPublicationEnvironment(`${PROD_URL}/`), 'production');
  assert.equal(gate.playerPublicationEnvironment(DEV_URL), 'development');
  // undefined means "read NEXT_PUBLIC_SUPABASE_URL" (default parameter), so it is not listed here.
  for (const url of ['', 'https://fixture.invalid', 'http://wnuxaxbrpudyypzdbdho.supabase.co', `${PROD_URL}:443x`, `${PROD_URL}/rest`, `${PROD_URL}?a=1`,
    'https://wnuxaxbrpudyypzdbdho.supabase.co.evil.example', 'https://user@wnuxaxbrpudyypzdbdho.supabase.co', 'https://abcdefghijklmnopqrst.supabase.co']) {
    assert.equal(gate.playerPublicationEnvironment(url), null, String(url));
  }
  assert.equal(gate.publicPlayerIdentityKeys(null).size, 0, 'unknown environment shows no player');
});

test('approvals never cross environments', () => {
  assert.equal(gate.isPublicPlayerIdentity(BLAZ.id, BLAZ.slug, prodKeys()), true);
  assert.equal(gate.isPublicPlayerIdentity(BLAZ.id, BLAZ.slug, devKeys()), false, 'Production-only legacy row is not a Development approval');
  assert.equal(gate.isPublicPlayerIdentity(TOKIDO.id, TOKIDO.slug, devKeys()), true, 'explicit Development mirror');
  const devOnly = gate.publicPlayerIdentityKeys('production', [
    { environment: 'development', playerId: RYUKICHI_DEV.id, playerSlug: RYUKICHI_DEV.slug, basis: 'INDIVIDUAL_APPROVAL', evidence: 'approval-ref' }]);
  assert.equal(devOnly.size, 0);
});

test('legacy players stay visible; new SFL2026 / Top8 players stay hidden until approved', () => {
  for (const keys of [prodKeys(), devKeys()]) {
    assert.equal(gate.isPublicPlayerIdentity(TOKIDO.id, TOKIDO.slug, keys), true);
    assert.equal(gate.isPublicPlayerIdentity(RYUKICHI_DEV.id, RYUKICHI_DEV.slug, keys), false);
    assert.equal(gate.isPublicPlayerIdentity(KAKERU_DEV.id, KAKERU_DEV.slug, keys), false);
  }
  assert.equal(gate.isPublicPlayerIdentity(BLAZ.id, BLAZ.slug, prodKeys()), true);
});

test('ID mismatch never falls back to slug, ID or name', () => {
  assert.equal(gate.isPublicPlayerIdentity(RYUSEI_DEV.id, RYUSEI_DEV.slug, devKeys()), false, 'Development UUID needs its own row');
  assert.equal(gate.isPublicPlayerIdentity(RYUSEI_DEV.id, RYUSEI_DEV.slug, prodKeys()), false);
  assert.equal(gate.isPublicPlayerIdentity(TOKIDO.id, 'tokido-alt', prodKeys()), false);
  assert.equal(gate.isPublicPlayerIdentity('00000000-0000-4000-8000-000000000000', TOKIDO.slug, prodKeys()), false);
  assert.equal(gate.isPublicPlayerIdentity(undefined, TOKIDO.slug, prodKeys()), false);
  assert.equal(gate.isPublicPlayerIdentity('ときど', 'ときど', prodKeys()), false);
});

test('approval rows need a UUID, slug and evidence reference', () => {
  const keys = gate.publicPlayerIdentityKeys('development', [
    { environment: 'development', ...{ playerId: RYUKICHI_DEV.id, playerSlug: RYUKICHI_DEV.slug }, basis: 'INDIVIDUAL_APPROVAL', evidence: 'approval-ref' },
    { environment: 'development', playerId: KAKERU_DEV.id, playerSlug: KAKERU_DEV.slug, basis: 'INDIVIDUAL_APPROVAL', evidence: ' ' },
    { environment: 'development', playerId: 'not-a-uuid', playerSlug: 'x', basis: 'INDIVIDUAL_APPROVAL', evidence: 'approval-ref' },
  ]);
  assert.equal(gate.isPublicPlayerIdentity(RYUKICHI_DEV.id, RYUKICHI_DEV.slug, keys), true);
  assert.equal(gate.isPublicPlayerIdentity(KAKERU_DEV.id, KAKERU_DEV.slug, keys), false);
  assert.equal(gate.isPublicPlayerIdentity('not-a-uuid', 'x', keys), false);
});

// --- Integration with the real loaders, using a fake read-only client. ---
function client(tables, rpcRows = [], calls = []) {
  return {
    rpc: async (name, args) => { calls.push(name); return { data: name === 'search_sf6dna' ? rpcRows : [], error: null }; },
    from(table) {
      let rows = [...(tables[table] ?? [])];
      const q = { select() { return q; }, eq(k, v) { rows = rows.filter(r => r[k] === v); return q; }, in(k, vs) { rows = rows.filter(r => vs.includes(r[k])); return q; },
        order() { return q; }, limit(n) { rows = rows.slice(0, n); return q; }, neq() { return q; },
        maybeSingle: async () => ({ data: rows[0] ?? null, error: null }), then(res, rej) { return Promise.resolve({ data: rows, error: null }).then(res, rej); } };
      return q;
    },
  };
}
const players = [
  { ...TOKIDO, display_name: 'ときど', status: 'published' },
  { ...BLAZ, display_name: 'Blaz', status: 'published' },
  { ...RYUKICHI_DEV, display_name: 'りゅうきち', status: 'published' },   // published in DB but unapproved
  { id: '0a8aacc8-3feb-42c4-88e5-3dd5d3a9efe6', slug: 'dogura', display_name: 'どぐら', status: 'draft' }, // legacy but draft now
];
process.env.NEXT_PUBLIC_SUPABASE_URL = PROD_URL;   // integration runs as Production
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fixture-only';

function playersApi(db, sourceCalls) {
  const pass = x => x;
  const imports = {
    '@/lib/supabase/server': { getSupabaseServerClient: () => db },
    '@/lib/player-publication-gate': gate,
    '@/lib/safe-external-url': { safeExternalUrl: v => (typeof v === 'string' && v.startsWith('https://') ? v : null) },
    '@/lib/approved-player-images': { approvedPlayerImage: () => null },
    '@/lib/player-archive-display': { attachPlayerArchiveDisplay: pass },
    '@/lib/player-profile-release-connection': { attachReleasePlayerProfile: pass },
    '@/lib/player-profile-approved-intake': { attachApprovedPlayerIntake: pass },
    '@/lib/public-source-links': { getPublicEntitySources: async (types, ids) => { sourceCalls.push(...ids); return []; } },
  };
  return load('../src/lib/players.ts', imports);
}

test('directory list shows DB-published legacy players only', async () => {
  const api = playersApi(client({ players }), []);
  assert.deepEqual((await api.listDirectoryPlayers()).map(p => p.slug).sort(), ['blaz', 'tokido']);
});

test('detail URL: legacy published opens; unapproved published and legacy draft are 404 with no Source lookup', async () => {
  const sourceCalls = [];
  const api = playersApi(client({ players }), sourceCalls);
  assert.equal((await api.getPlayerBySlug('blaz'))?.id, BLAZ.id);
  assert.equal(await api.getPlayerBySlug('ryukichi'), null);
  assert.equal(await api.getPlayerBySlug('dogura'), null);
  assert.deepEqual(sourceCalls, [BLAZ.id], 'Source links are fetched only after the gate passes');
});

test('sitemap lists only gated player URLs', async () => {
  const db = client({ players, characters: [], videos: [], diagnoses: [] });
  const js = ts.transpileModule(read('../src/app/sitemap.ts'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', 'process', js)(mod, mod.exports, name => {
    if (name === '@/lib/player-publication-gate') return gate;
    assert.equal(name, '@/lib/supabase/server');
    return { getSupabaseServerClient: () => db };
  }, { env: { VERCEL_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://example.test', NEXT_PUBLIC_SUPABASE_URL: PROD_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY: 'fixture' } });
  const urls = (await mod.exports.default()).map(r => r.url).filter(u => u.includes('/players/'));
  // The gate reads the same process environment as the app.
  assert.deepEqual(urls.sort(), ['https://example.test/players/blaz', 'https://example.test/players/tokido']);
});

test('search results and suggestions drop unapproved players', async () => {
  const rpcRows = [
    { entity_type: 'player', entity_id: TOKIDO.id, slug: TOKIDO.slug, title: 'ときど' },
    { entity_type: 'player', entity_id: RYUKICHI_DEV.id, slug: RYUKICHI_DEV.slug, title: 'りゅうきち' },
  ];
  const db = client({ players }, rpcRows);
  const search = load('../src/lib/search.ts', {
    '@/lib/supabase/server': { getSupabaseServerClient: () => db },
    '@/lib/public-move-gate': { isMovePublicReady: async () => true },
    '@/lib/player-publication-gate': gate,
    '@/lib/release-features': { releaseFeatures: { publicStrategyContent: false, training: false } },
  });
  assert.deepEqual((await search.searchAcrossContent('test')).map(r => r.title), ['ときど']);
  const labels = (await search.getPublicSearchSuggestionCandidates()).filter(r => r.type === 'プレイヤー').map(r => r.label).sort();
  assert.deepEqual(labels, ['Blaz', 'ときど']);
});

test('unknown connection target hides every player in list and detail', async () => {
  const saved = process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fixture.invalid';
  try {
    const api = playersApi(client({ players }), []);
    assert.deepEqual(await api.listDirectoryPlayers(), []);
    assert.equal(await api.getPlayerBySlug('tokido'), null);
  } finally { process.env.NEXT_PUBLIC_SUPABASE_URL = saved; }
});

test('Development connection shows only explicit Development rows', async () => {
  const saved = process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_URL = DEV_URL;
  try {
    const api = playersApi(client({ players }), []);
    assert.deepEqual((await api.listDirectoryPlayers()).map(p => p.slug), ['tokido']);
    assert.equal(await api.getPlayerBySlug('blaz'), null);
  } finally { process.env.NEXT_PUBLIC_SUPABASE_URL = saved; }
});
