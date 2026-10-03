import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';

const yasmineId = 'a9f61f3f-d6e0-4f98-8f1f-6fb94fae7baa';
const jpId = '87077ba6-e9da-48b7-b3bd-2499ea4f6d86';
const ryuId = '9c3a7aaa-e090-40a6-b598-f63afb761b77';
function load(relative, requireMock) {
  const source = readFileSync(new URL(relative, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', js)(mod, mod.exports, requireMock);
  return mod.exports;
}
function mediaLoader(reapprove = false) {
  return load('../src/lib/preview-motion-media-pilot.ts', id => {
    const data = JSON.parse(readFileSync(new URL(`../src/data/${path.basename(id)}`, import.meta.url), 'utf8'));
    if (reapprove && data.character_slug === 'yasmine') data.clips.forEach(clip => { clip.verification_status = 'approved_for_preview'; });
    return data;
  });
}
test('canonical hold rejects local Yasmine media even if clip approval is accidentally restored', () => {
  for (const reapprove of [false, true]) {
    const loader = mediaLoader(reapprove);
    assert.equal(loader.isPreviewPilotMotionMediaHeld(yasmineId), true);
    assert.deepEqual(loader.getPreviewPilotMotionMedia(yasmineId), []);
    assert.equal(loader.isPreviewPilotMotionMediaHeld(jpId), false);
    assert.ok(loader.getPreviewPilotMotionMedia(jpId).length > 0);
    assert.ok(loader.getPreviewPilotMotionMedia(ryuId).length > 0);
  }
});
test('canonical hold prevents remote Preview media retrieval while JP still uses its existing path', async () => {
  const previous = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = 'preview';
  let rpcCalls = 0;
  const local = mediaLoader();
  const preview = load('../src/lib/device-preview.ts', id => {
    if (id === '@/lib/preview-motion-media-pilot') return local;
    if (id === '@/lib/supabase/server') return { getSupabaseServerClient: () => ({ rpc: async () => { rpcCalls += 1; return { data: [], error: null }; } }) };
    throw new Error(`Unexpected import ${id}`);
  });
  try {
    assert.deepEqual(await preview.getDevicePreviewMoveMotionMedia(yasmineId, 'test-preview-token'), []);
    assert.equal(rpcCalls, 0);
    assert.ok((await preview.getDevicePreviewMoveMotionMedia(jpId, 'test-preview-token')).length > 0);
    assert.equal(rpcCalls, 1);
    process.env.VERCEL_ENV = 'production';
    assert.deepEqual(await preview.getDevicePreviewMoveMotionMedia(yasmineId, 'test-preview-token'), []);
    assert.equal(rpcCalls, 1);
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = previous;
  }
});

test('a remote character bundle cannot reintroduce held Yasmine media inline', async () => {
  const previous = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = 'preview';
  const local = mediaLoader();
  const preview = load('../src/lib/device-preview.ts', id => {
    if (id === '@/lib/preview-motion-media-pilot') return local;
    if (id === '@/lib/supabase/server') return { getSupabaseServerClient: () => ({ rpc: async name => ({
      data: name === 'get_phase23_character_preview' ? { moves: [{ id: 'test-move', commands: [], media: { mediaUrl: '/unconfirmed.mp4' } }] } : [], error: null,
    }) }) };
    throw new Error(`Unexpected import ${id}`);
  });
  try {
    const yasmine = await preview.getDevicePreviewBundle(yasmineId, 'test-preview-token');
    assert.equal(yasmine.moves.length, 1);
    assert.equal(yasmine.moves[0].media, null);
    const jp = await preview.getDevicePreviewBundle(jpId, 'test-preview-token');
    assert.equal(jp.moves[0].media.mediaUrl, '/unconfirmed.mp4');
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = previous;
  }
});
