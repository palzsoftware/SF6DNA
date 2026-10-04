import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = new URL('../../docs/release-20261004-cviper-recovery/', import.meta.url);
const bindings = JSON.parse(readFileSync(new URL('SA_RECOVERY_BINDINGS.json', root)));
const manifest = JSON.parse(readFileSync(new URL('manifest.json', root)));
const storedValidation = JSON.parse(readFileSync(new URL('validation.json', root)));
const inventory = JSON.parse(readFileSync(new URL('../../scripts/data/remaining-character-intake-20261004.json', import.meta.url)));
test('four recovered SA identities agree with the stored manifest and working inventory', () => {
  assert.equal(bindings.moves.length, 4);
  for (const move of bindings.moves) {
    const db = inventory.moves.find(row => row.id === move.move_id);
    assert.equal(db.characterSlug, 'c-viper');
    assert.equal(db.category, 'super');
    assert.equal(db.slug, move.move_slug);
    assert.equal(db.name, move.name_ja);
    assert.ok(db.commands.some(command => command.scheme === 'classic' && command.text === move.command));
    assert.deepEqual(manifest.moves.find(row => row.move_id === move.move_id)?.move_slug, move.move_slug);
  }
});
test('SA3 and CA stay distinct despite their shared command', () => {
  const sa3 = bindings.moves.find(row => row.variant === 'SA3');
  const ca = bindings.moves.find(row => row.variant === 'CA');
  assert.equal(sa3.command, ca.command);
  assert.notEqual(sa3.move_id, ca.move_id);
  assert.notEqual(sa3.media_sha256, ca.media_sha256);
  assert.notEqual(sa3.poster_sha256, ca.poster_sha256);
});
test('stored assets have unique bindings and hashes with no synthetic verification grant', () => {
  for (const field of ['move_id', 'media_library_id', 'poster_library_id', 'media_sha256', 'poster_sha256']) {
    assert.equal(new Set(bindings.moves.map(row => row[field])).size, 4);
  }
  for (const row of [...storedValidation.mp4, ...storedValidation.webp]) {
    assert.ok(row.size > 0);
    assert.match(row.sha256, /^[a-f0-9]{64}$/);
  }
  assert.ok(bindings.moves.every(row => row.approved_for_public === false));
  assert.equal(bindings.runtime_bound, false);
  assert.equal(bindings.byte_validation, 'NOT_RUN_HTTP_502');
});
test('CA interval discrepancy remains visible instead of rewriting reviewed media', () => {
  const ca = bindings.moves.find(row => row.variant === 'CA');
  assert.equal(ca.source_interval_duration, 15);
  assert.equal(ca.stored_duration, 14.266667);
  assert.equal(ca.duration_status, 'CA_SOURCE_INTERVAL_METADATA_REVIEW_REQUIRED');
});
