import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const read = name => JSON.parse(readFileSync(new URL(`../src/data/${name}`, import.meta.url), 'utf8'));
const manifest = read('SF6DNA_VER1_YASMINE_MEDIA_MANIFEST_20261003.json');
const canonical = read('YASMINE_OFFICIAL_CAPTURE_PREVIEW_20261003.json');
const source = readFileSync(new URL('../src/lib/yasmine-confirmed-media.ts', import.meta.url), 'utf8');
function loader(data = manifest, identities = canonical) {
  const mod = { exports: {} };
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  new Function('module', 'exports', 'require', js)(mod, mod.exports, id => id.includes('MANIFEST') ? data : identities);
  return mod.exports.getYasmineConfirmedMedia;
}
function preview(action) {
  const old = process.env.VERCEL_ENV; process.env.VERCEL_ENV = 'preview';
  try { return action(); } finally { if (old === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = old; }
}
test('only twelve scoped Canonical normal approvals resolve; every other card survives without media', () => preview(() => {
  const resolve = loader();
  const media = canonical.moves.map(move => resolve(move.id)).filter(Boolean);
  assert.equal(media.length, 12);
  assert.equal(new Set(media.map(row => row.moveId)).size, 12);
  assert.ok(media.every(row => canonical.moves.find(move => move.id === row.moveId).moveType === 'normal'));
  assert.ok(canonical.moves.filter(move => move.moveType !== 'normal').every(move => resolve(move.id) === null));
}));
test('blanket reapproval, changed canonical identity, duplicate mapping and altered timestamps fail closed', () => preview(() => {
  const approved = manifest.clips.find(row => row.verification_status === 'approved_for_preview');
  for (const mutate of [
    data => { data.identity_approval_status = 'HOLD_UNTIL_CANONICAL'; },
    data => { data.clips.push(structuredClone(approved)); },
    data => { data.clips.find(row => row.move_id === approved.move_id).canonical_review.command = '6HP'; },
    data => { data.clips.find(row => row.move_id === approved.move_id).source_start_ms += 1; },
  ]) { const data = structuredClone(manifest); mutate(data); assert.equal(loader(data)(approved.move_id), null); }
  const identities = structuredClone(canonical); identities.moves.find(row => row.id === approved.move_id).name = 'wrong';
  assert.equal(loader(manifest, identities)(approved.move_id), null);
  const blanket = structuredClone(manifest); blanket.clips.forEach(row => { row.verification_status = 'approved_for_preview'; });
  assert.equal(canonical.moves.map(row => loader(blanket)(row.id)).filter(Boolean).length, 12);
}));
test('Production cannot obtain confirmed Preview media', () => {
  const old = process.env.VERCEL_ENV; process.env.VERCEL_ENV = 'production';
  try { assert.ok(canonical.moves.every(row => loader()(row.id) === null)); }
  finally { if (old === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = old; }
});
