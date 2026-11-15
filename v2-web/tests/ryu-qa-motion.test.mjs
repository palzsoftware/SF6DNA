import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const manifest = JSON.parse(read('src/data/ryu-qa-gifs.json'));
const fixture = read('src/lib/ryu-move-review-fixture.ts');
const moves = JSON.parse(fixture.slice(fixture.indexOf('= [') + 2).trim().replace(/;$/, ''));
function load(path, imports) {
  const loaded = { exports: {} };
  const source = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('require', 'module', 'exports', source)(name => {
    assert.ok(name in imports, name);
    return imports[name];
  }, loaded, loaded.exports);
  return loaded.exports;
}
const motion = load('src/lib/ryu-qa-motion.ts', {
  '@/data/ryu-qa-gifs.json': { default: manifest },
  '@/lib/ryu-move-review-fixture': { ryuMoveReviewFixture: moves },
});
test('57 current Ryu identities each have one primary GIF with verified bytes', () => {
  assert.equal(manifest.length, 76);
  assert.equal(motion.ryuQaClips.length, 57);
  assert.equal(new Set(motion.ryuQaClips.map(clip => clip.key)).size, 57);
  for (const move of moves) {
    const matched = motion.ryuQaClips.filter(clip => clip.moveId === move.id && clip.slug === move.slug);
    assert.equal(matched.length, 1, move.slug);
    const clip = matched[0];
    const bytes = readFileSync(new URL(`../src/data/ryu-qa-gifs/${clip.key}.gif`, import.meta.url));
    const entry = manifest.find(item => item.key === clip.key);
    assert.equal(bytes.length, entry.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.previewSha256);
    assert.equal(bytes.readUInt16LE(6), entry.width);
    assert.equal(bytes.readUInt16LE(8), entry.height);
  }
});
const validToken = 'test-only-valid-preview-token-0123456789';
const invalidToken = 'test-only-invalid-preview-token-0123456789';
const { normalizeDevicePreviewToken } = load('src/lib/device-preview.ts', {
  '@/lib/supabase/server': {},
});

test('API checks Preview RPC authorization before reading all 57 GIFs', async () => {
  const names = ['VERCEL', 'VERCEL_ENV', 'SF6DNA_RYU_MEDIA_PREVIEW', 'VERCEL_URL'];
  const saved = Object.fromEntries(names.map(name => [name, process.env[name]]));
  const host = 'ryu-preview.example';
  Object.assign(process.env, { VERCEL: '1', VERCEL_ENV: 'preview', SF6DNA_RYU_MEDIA_PREVIEW: '1', VERCEL_URL: host });
  let reads = 0;
  let rpcCalls = 0;
  let rpcMode = 'normal';
  const api = load('src/app/api/ryu-qa-motion/[clip]/route.ts', {
    'node:fs/promises': { readFile: async file => { reads++; return readFileSync(file); } },
    'node:path': { default: { join: (...parts) => parts.join('/') } },
    '@/lib/ryu-qa-motion': motion,
    '@/lib/device-preview': { normalizeDevicePreviewToken },
    '@/lib/supabase/server': { getSupabaseServerClient: () => ({ rpc: async (name, args) => {
      rpcCalls++;
      assert.equal(name, 'get_phase23_character_preview');
      assert.equal(args.target_character_id, '9c3a7aaa-e090-40a6-b598-f63afb761b77');
      if (rpcMode === 'throw') throw new Error('unavailable');
      if (rpcMode === 'error') return { data: { moves }, error: { message: 'denied' } };
      if (rpcMode === 'malformed') return { data: { moves: {} }, error: null };
      if (rpcMode === 'mismatch') return { data: { moves: [{ ...moves[0], slug: 'wrong' }] }, error: null };
      return { data: args.preview_token === validToken ? { moves } : null, error: null };
    } }) },
  });
  const request = (key, token = validToken, requestHost = host, suffix = '') => api.GET(
    new Request(`https://${host}/api/ryu-qa-motion/${key}${token === null ? '' : `?preview=${encodeURIComponent(token)}${suffix}`}`,
      { headers: { host: requestHost } }), { params: Promise.resolve({ clip: key }) });
  try {
    for (const token of [null, '', 'short', 'x'.repeat(201)]) assert.equal((await request('ryu-300', token)).status, 404);
    assert.equal(rpcCalls, 0);
    assert.equal((await request('ryu-300', invalidToken)).status, 404);
    assert.equal(reads, 0);
    assert.equal((await request('ryu-300', validToken, host, '&preview=duplicate')).status, 404);
    for (const clip of motion.ryuQaClips) {
      const response = await request(clip.key);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('content-type'), 'image/gif');
      assert.equal(response.headers.get('cache-control'), 'private, no-store');
      const bytes = Buffer.from(await response.arrayBuffer());
      const entry = manifest.find(item => item.key === clip.key);
      assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.previewSha256);
    }
    assert.equal(reads, 57);
    for (const key of ['ryu-401', 'ryu-drive-impact', 'unknown', '../ryu-300']) assert.equal((await request(key)).status, 404);
    const beforeHostCheck = rpcCalls;
    assert.equal((await request('ryu-300', validToken, 'other.example')).status, 404);
    assert.equal(rpcCalls, beforeHostCheck);
    for (rpcMode of ['error', 'throw', 'malformed', 'mismatch']) assert.equal((await request('ryu-300')).status, 404);
    rpcMode = 'normal';
    for (const [name, value] of [['VERCEL_ENV', 'production'], ['SF6DNA_RYU_MEDIA_PREVIEW', '0'], ['VERCEL', '0'], ['VERCEL_URL', '']]) {
      const original = process.env[name];
      const before = rpcCalls;
      process.env[name] = value;
      assert.equal(motion.connectRyuQaMotion('ryu', moves, host, validToken), moves);
      assert.equal((await request('ryu-300')).status, 404);
      assert.equal(rpcCalls, before);
      process.env[name] = original;
    }
    assert.equal(reads, 57);
  } finally {
    for (const name of names) saved[name] === undefined ? delete process.env[name] : process.env[name] = saved[name];
  }
});

test('existing cards retain 57 GIFs and pass the authorized Preview token', async () => {
  const { renderUnified, bundle } = await import('./helpers/character-unified-ssr.mjs');
  const saved = { ...process.env };
  const host = 'ryu-preview.example';
  Object.assign(process.env, { VERCEL: '1', VERCEL_ENV: 'preview', SF6DNA_RYU_MEDIA_PREVIEW: '1', VERCEL_URL: host });
  try {
    const connected = motion.connectRyuQaMotion('ryu', moves, host, validToken);
    assert.equal(motion.connectRyuQaMotion('ryu', moves, host, null), moves);
    assert.equal(motion.connectRyuQaMotion('ken', moves, host, validToken), moves);
    assert.equal(motion.connectRyuQaMotion('ryu', moves, 'other.example', validToken), moves);
    const mismatch = [{ ...moves[0], slug: 'wrong' }];
    assert.equal(motion.connectRyuQaMotion('ryu', mismatch, host, validToken)[0], mismatch[0]);
    const html = renderUnified('ryu', { bundle: bundle(connected) });
    for (const clip of motion.ryuQaClips) assert.ok(html.includes(`src="/api/ryu-qa-motion/${clip.key}?preview=${validToken}"`), clip.key);
    assert.equal((html.match(/data-has-media="true"/g) ?? []).length, 57);
    assert.equal((html.match(/data-move-id=/g) ?? []).length, 57);
    const route = read('src/app/characters/[slug]/page.tsx');
    assert.match(route, /data\.source === "device-preview" \? previewToken : null/);
    const escaped = new URL(motion.ryuQaClipUrl('ryu-300', 'abc&extra=1+#?'), 'https://example.com');
    assert.deepEqual([...escaped.searchParams], [['preview', 'abc&extra=1+#?']]);
  } finally {
    for (const name of ['VERCEL', 'VERCEL_ENV', 'SF6DNA_RYU_MEDIA_PREVIEW', 'VERCEL_URL']) saved[name] === undefined ? delete process.env[name] : process.env[name] = saved[name];
  }
});
