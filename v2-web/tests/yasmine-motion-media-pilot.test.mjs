import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { validateYasmineRecovery } from '../../scripts/validate-yasmine-recovery.mjs';
const read = relative => JSON.parse(readFileSync(new URL(relative, import.meta.url), 'utf8'));
const manifest = read('../src/data/SF6DNA_VER1_YASMINE_MEDIA_MANIFEST_20261003.json');
const snapshot = read('../src/data/YASMINE_PREVIEW_MOVE_SNAPSHOT_20261003.json');
const canonical = read('../src/data/YASMINE_OFFICIAL_CAPTURE_PREVIEW_20261003.json');
const publicRoot = new URL('../public/', import.meta.url).pathname;
const source = readFileSync(new URL('../src/lib/yasmine-move-media-pilot.ts', import.meta.url), 'utf8');
function pilot(data = canonical) {
  const mod = { exports: {} };
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  new Function('module', 'exports', 'require', js)(mod, mod.exports, id => id === '@/lib/yasmine-confirmed-media' ? { getYasmineConfirmedMedia: () => null } : data);
  return mod.exports.getYasmineMoveMediaPilot;
}
function environment(value, action) {
  const old = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = value;
  try { return action(); } finally {
    if (old === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = old;
  }
}
test('canonical review restores only twelve visually reviewed normals while keeping other assets held', () => {
  const result = validateYasmineRecovery(manifest, snapshot, { publicRoot, canonical });
  assert.deepEqual(result.errors, []);
  assert.equal(result.stats.approved, 12);
  assert.equal(result.stats.held, manifest.clips.length - 12);
  assert.equal(manifest.identity_approval_status, 'PARTIAL_CANONICAL_APPROVAL');
  assert.equal(manifest.clips.filter(clip => clip.cut_review_status === 'CUT_REVIEW_PASS').length, 12);
  const formerApproval = manifest.clips.find(clip => clip.cut_review_status === 'CUT_REVIEW_PASS');
  const reapproved = { ...manifest, identity_approval_status: 'HOLD_UNTIL_CANONICAL', clips: [{ ...formerApproval, verification_status: 'approved_for_preview' }] };
  assert.ok(validateYasmineRecovery(reapproved, snapshot, { checkFiles: false }).errors.some(e => e.includes('canonical identity approval is held')));
});
test('normal approvals require motion evidence and cannot use a normals source for another category', () => {
  const clip = { ...manifest.clips.find(row => row.cut_review_status === 'CUT_REVIEW_PASS'), verification_status: 'approved_for_preview' };
  const validate = row => validateYasmineRecovery({ ...manifest, clips: [row] }, snapshot, { checkFiles: false }).errors;
  assert.ok(validate({ ...clip, visual_review: { ...clip.visual_review, observedMotion: '' } }).some(e => e.includes('motion/command evidence')));
  assert.ok(validate({ ...clip, source_end_ms: clip.source_start_ms }).some(e => e.includes('cut interval')));
  assert.ok(validate({ ...clip, category: 'special' }).some(e => e.includes('another category')));
  assert.ok(validate({ ...clip, source_file: 'missing-source.mp4' }).some(e => e.includes('reviewed source')));
});
test('all DB identities survive suspended media, including all special and SA rows', () => {
  const bundle = environment('preview', () => pilot()());
  assert.deepEqual(new Set(bundle.moves.map(move => move.id)), new Set(canonical.moves.map(move => move.id)));
  assert.equal(bundle.moves.length, 71);
  assert.equal(bundle.moves.filter(move => move.moveType === 'special').length, 40);
  assert.equal(bundle.moves.filter(move => move.moveType === 'super').length, 4);
  assert.ok(bundle.moves.every(move => move.commands.length && move.status === 'draft'));
  assert.deepEqual(bundle.combos, []); assert.deepEqual(bundle.setups, []);
  assert.equal(environment('production', () => pilot()()), null);
  assert.equal(environment('development', () => pilot()()), null);
  assert.equal(environment('preview', () => pilot({ ...snapshot, characterSlug: 'ryu' })()), null);
});
test('official capture frames are reviewed only, guarded by provenance and Preview environment', () => {
  const bundle = environment('preview', () => pilot()());
  assert.ok(bundle.moves.every(move => move.frame?.verificationStatus === 'reviewed'));
  for (const move of bundle.moves) {
    const stored = canonical.moves.find(row => row.id === move.id);
    assert.equal(move.frame.onHit, stored.frame.onHit);
    assert.equal(move.frame.onBlock, stored.frame.onBlock);
    assert.equal(move.frame.damage, stored.frame.damage);
  }
  const original = canonical.moves[0];
  for (const frame of [
    { ...original.frame, verificationStatus: 'verified' },
    { ...original.frame, verificationStatus: 'unverified' },
    { ...original.frame, patchStatus: 'incorrect-patch' },
    { ...original.frame, sourceFile: 'unknown.png' },
  ]) {
    const move = environment('preview', () => pilot({ ...canonical, moves: [{ ...original, frame }] })()).moves[0];
    assert.equal(move.frame, null);
    assert.equal(move.id, original.id);
  }
  assert.equal(environment('production', () => pilot()()), null);
});
test('validator rejects wrong identities, duplicate files and unreviewed special/SA approvals', () => {
  const validate = clip => validateYasmineRecovery({ ...manifest, clips: [clip] }, snapshot, { checkFiles: false }).errors;
  assert.ok(validate({ ...manifest.clips[0], move_slug: 'ryu-standing-light-punch' }).some(e => e.includes('identity/category')));
  for (const type of ['special', 'super']) {
    const clip = manifest.clips.find(row => row.db_move_type === type);
    assert.ok(validate({ ...clip, verification_status: 'approved_for_preview' }).some(e => e.includes('review required')));
  }
  const duplicate = { ...manifest, clips: [...manifest.clips, manifest.clips[0]] };
  assert.ok(validateYasmineRecovery(duplicate, snapshot, { checkFiles: false }).errors.some(e => e.includes('duplicate file mapping')));
  assert.ok(validateYasmineRecovery({ ...manifest, character_id: 'wrong' }, snapshot, { checkFiles: false }).errors.includes('character identity mismatch'));
});
