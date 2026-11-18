import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { connectCanonicalTxtCandidate } from '../src/lib/canonical-txt-connection.mjs';

const data = name => JSON.parse(readFileSync(new URL(`../src/data/${name}`, import.meta.url), 'utf8'));
const candidates = data('SF6DNA_WS5_DEVICE_PREVIEW_BUNDLES_R3_CANDIDATE_20261024.json');
const records = data('SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json');

function project(slug) {
  let staged = null;
  connectCanonicalTxtCandidate(null, candidates[slug], records, { characterSlug: slug, bundleCharacterSlug: slug,
    characterId: null, connectExisting: (base, candidate) => { staged = candidate; return { bundle: base, moveEvidence: {}, holds: [] }; } });
  const bySource = new Map(staged.bundle.moves.map(move => [move.ws5CanonicalSource, move]));
  return key => bySource.get(key);
}

test('official TXT long-dash placeholders are treated as official N/A, like "-"', () => {
  const terry = project('terry'), yasmine = project('yasmine'), arjun = project('arjun');
  assert.equal(terry('terry:web:402').frameFieldStatus.onBlock, 'OFFICIAL_NA'); // ー
  assert.equal(terry('terry:web:204').frameFieldStatus.onBlock, 'OFFICIAL_NA'); // ―
  assert.equal(yasmine('yasmine:web:301').frameFieldStatus.onHit, 'OFFICIAL_NA');
  assert.equal(arjun('arjun:web:205').frameFieldStatus.onBlock, 'OFFICIAL_NA');
  // Numeric values and knockdown notation are unaffected.
  assert.equal(terry('terry:web:402').frameFieldStatus.onHit, 'LOCAL_OFFICIAL_TXT_CANONICAL');
  assert.equal(terry('terry:web:402').frameFieldStatus.startup, 'LOCAL_OFFICIAL_TXT_CANONICAL');
  // The raw official text is preserved (only the state changes).
  assert.equal(terry('terry:web:402').frame.onBlock, 'ー');
});
