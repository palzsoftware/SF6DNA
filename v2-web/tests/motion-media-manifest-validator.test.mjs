import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validateMotionMediaManifest } from '../../scripts/validate-motion-media.mjs';

function validManifest() {
  return {
    manifest_version: '1.0',
    character_slug: 'jp',
    source_owner: 'user_capture',
    captured_patch: '2026.08.03',
    capture_date: '2026-09-23',
    source_files: [{ category: 'unique_attacks', filename: 'jp_unique.mp4', sha256: 'a'.repeat(64) }],
    clips: [{
      move_id: 'move-1',
      move_slug: 'jp-test',
      category: 'unique_attacks',
      variant: 'default',
      media_url: '/media/moves/jp/jp-test.mp4',
      media_type: 'video',
      poster_url: '/media/moves/jp/jp-test.webp',
      verification_status: 'approved_for_preview',
      loop_start_ms: 0,
      loop_end_ms: 1000,
      duration_ms: 1000,
      width: 640,
      height: 360,
      fps: 60,
      filesize_bytes: 4,
    }],
  };
}

test('accepts a valid manifest and matching files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'motion-media-'));
  const assetDir = path.join(root, 'media/moves/jp');
  mkdirSync(assetDir, { recursive: true });
  writeFileSync(path.join(assetDir, 'jp-test.mp4'), '1234');
  writeFileSync(path.join(assetDir, 'jp-test.webp'), 'poster');
  const result = validateMotionMediaManifest(validManifest(), { publicRoot: root });
  assert.deepEqual(result.errors, []);
  assert.equal(result.stats.clips, 1);
  assert.equal(result.stats.mediaBytes, 4);
});

test('accepts mapping_hold for an ambiguous clip without publishing it', () => {
  const manifest = validManifest();
  manifest.clips[0].verification_status = 'mapping_hold';
  const result = validateMotionMediaManifest(manifest, { checkFiles: false });
  assert.deepEqual(result.errors, []);
});

test('rejects duplicate move variant mapping', () => {
  const manifest = validManifest();
  manifest.clips.push({ ...manifest.clips[0], media_url: '/media/moves/jp/other.mp4' });
  const result = validateMotionMediaManifest(manifest, { checkFiles: false });
  assert.ok(result.errors.some((error) => error.includes('duplicate move_id + variant')));
});

test('allows distinct variants for one canonical move', () => {
  const manifest = validManifest();
  manifest.clips.push({
    ...manifest.clips[0],
    variant: 'counter',
    media_url: '/media/moves/jp/jp-test-counter.mp4',
    poster_url: '/media/moves/jp/jp-test-counter.webp',
  });
  const result = validateMotionMediaManifest(manifest, { checkFiles: false });
  assert.deepEqual(result.errors, []);
});

test('rejects unsafe asset paths and loop beyond duration', () => {
  const manifest = validManifest();
  manifest.clips[0].media_url = '/../escape.mp4';
  manifest.clips[0].loop_end_ms = 1001;
  const result = validateMotionMediaManifest(manifest, { publicRoot: '/tmp' });
  assert.ok(result.errors.some((error) => error.includes('path traversal')));
  assert.ok(result.errors.some((error) => error.includes('exceeds duration_ms')));
});
