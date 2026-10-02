import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import test from 'node:test';
import { validateMotionMediaManifest } from '../../scripts/validate-motion-media.mjs';

const manifest = JSON.parse(readFileSync(new URL('../src/data/SF6DNA_VER1_RYU_JP_MEDIA_MANIFEST_20260923.json', import.meta.url), 'utf8'));
const hash = (url) => createHash('sha256').update(readFileSync(new URL(`../public${url}`, import.meta.url))).digest('hex');

// Identities were inspected from exported MP4 frames on 2026-10-02:
// SA1: gauge 3 -> 2, projectile; SA2: gauge 3 -> 1, portals/spheres.
// Hashes prevent the same two valid files from silently reversing again.
for (const [slug, moveId, expectedHash, duration, size, posterHash] of [
  ['jp-sa1', '7817f9e6-8542-4da1-be01-c6bd24294f22', '7cc436d994eecb24d1def02e2aeac6fd28ad832100e674d109f0cfe2ef0411d8', 4350, 852298, '843df7b99bdfbef5981f0bd6eca6eeb9c10bd8068de459d1860b00ec6a42c67d'],
  ['jp-sa2', '85762bb5-b5ae-4a88-b4ee-55112037774e', 'c0c574c716ae554eb3c9c985b1aff8c5b62b8fdb84f946b93c4e57405cbaf94f', 7000, 1079850, '27218e5a97f02b2a392faa0add731de4656b6c6e91f6a158c053f7df1b441c05'],
]) {
  test(`${slug} binds its inspected video bytes and unchanged poster to the canonical move`, () => {
    const clips = manifest.clips.filter((clip) => clip.move_slug === slug);
    assert.equal(clips.length, 1);
    const clip = clips[0];
    assert.equal(clip.move_id, moveId);
    assert.equal(clip.media_url, `/media/moves/jp/${slug}.mp4`);
    assert.equal(clip.poster_url, `/media/moves/jp/${slug}.webp`);
    assert.equal(hash(clip.media_url), expectedHash);
    assert.equal(hash(clip.poster_url), posterHash);
    assert.equal(clip.duration_ms, duration);
    assert.equal(clip.loop_end_ms, duration);
    assert.equal(clip.filesize_bytes, size);
    assert.equal(statSync(new URL(`../public${clip.media_url}`, import.meta.url)).size, size);
    assert.equal(clip.verification_status, 'approved_for_preview');
  });
}

test('JP corrected super media remain distinct and SA3/CA bytes remain unchanged', () => {
  assert.notEqual(hash('/media/moves/jp/jp-sa1.mp4'), hash('/media/moves/jp/jp-sa2.mp4'));
  assert.equal(hash('/media/moves/jp/jp-sa3.mp4'), '96b3223e3f77f7222ff28c49eab61544f0cc97463f5cee057ff82e5304f72255');
  assert.equal(hash('/media/moves/jp/jp-ca.mp4'), 'fdda0948f87bbb5a6f8dc0e06a003d9611ddb49faec19e1030c2433f9e561729');
  assert.deepEqual(validateMotionMediaManifest(manifest, { publicRoot: new URL('../public/', import.meta.url).pathname }).errors, []);
});
