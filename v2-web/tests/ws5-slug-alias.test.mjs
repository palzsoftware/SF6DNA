import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { appSlugForWs5, ws5SlugForApp, buildNameStartupCrosswalk, rescopeWs5Candidate, CROSSWALK_LINKED } from '../src/lib/ws5-slug-alias.mjs';
import { connectCanonicalTxtCandidate } from '../src/lib/canonical-txt-connection.mjs';
import { connectOfficialTxtPreviewCandidate } from '../src/lib/official-txt-device-preview-adapter.mjs';

const data = name => JSON.parse(readFileSync(new URL(`../src/data/${name}`, import.meta.url), 'utf8'));
const fixture = data('ALL_CHARACTER_RELEASE_FIXTURE_20261004.json').characters['dee-jay'];
const candidate = data('SF6DNA_WS5_DEVICE_PREVIEW_BUNDLES_R3_CANDIDATE_20261024.json').deejay;
const records = data('SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json');

test('slug alias maps only the known WS5 key and keeps the product slug', () => {
  assert.equal(appSlugForWs5('deejay'), 'dee-jay');
  assert.equal(ws5SlugForApp('dee-jay'), 'deejay');
  assert.equal(appSlugForWs5('ryu'), 'ryu');
  assert.equal(ws5SlugForApp('ryu'), 'ryu');
  assert.throws(() => rescopeWs5Candidate({ candidate: { characterSlug: 'ryu' }, records: {}, appSlug: 'ryu', existingMoves: [] }));
});

test('crosswalk links only unique normalized names whose startup agrees', () => {
  const rows = [
    { key: 'x:web:1', raw: { skill: '弱 スパイラル', startup_frame: '12' } },
    { key: 'x:web:2', raw: { skill: '中 スパイラル', startup_frame: '99' } },
    { key: 'x:web:3', raw: { skill: '同名', startup_frame: '5' } },
    { key: 'x:web:4', raw: { skill: '新技', startup_frame: '5' } },
  ];
  const existing = [
    { id: 'a', slug: 'a', name: '弱スパイラル', frame: { startup: '12' } },
    { id: 'b', slug: 'b', name: '中スパイラル', frame: { startup: '14' } },
    { id: 'c', slug: 'c', name: '同名', frame: { startup: '5' } },
    { id: 'd', slug: 'd', name: '同 名', frame: { startup: '5' } },
  ];
  const crosswalk = buildNameStartupCrosswalk(rows, existing);
  assert.deepEqual([...crosswalk.values()].map(row => row.state),
    [CROSSWALK_LINKED, 'HOLD_STARTUP_MISMATCH', 'HOLD_AMBIGUOUS_NAME', 'HOLD_NO_EXISTING_NAME']);
  assert.equal(crosswalk.get('x:web:1').moveId, 'a');
});

test('Dee Jay WS5 rows connect to all 97 existing moves without changing IDs or duplicating cards', () => {
  const before = JSON.stringify([candidate, fixture]);
  const rescoped = rescopeWs5Candidate({ candidate, records, appSlug: 'dee-jay', existingMoves: fixture.moves });
  assert.equal(JSON.stringify([candidate, fixture]), before, 'inputs must not be mutated');
  assert.equal(rescoped.candidate.characterSlug, 'dee-jay');
  assert.equal(rescoped.candidate.releaseEligible, false);
  assert.equal(Object.keys(rescoped.records).length, 106);
  assert.ok(Object.keys(rescoped.records).every(key => key.startsWith('dee-jay:web:')));
  const linked = rescoped.crosswalk.filter(row => row.state === CROSSWALK_LINKED);
  assert.equal(linked.length, 97);
  assert.equal(new Set(linked.map(row => row.moveId)).size, 97);

  const base = { guideSections: [], moves: fixture.moves, combos: [], setups: [], sequences: [], matchups: [], training: [] };
  const result = connectCanonicalTxtCandidate(base, rescoped.candidate, rescoped.records, { characterSlug: 'dee-jay',
    bundleCharacterSlug: 'dee-jay', characterId: fixture.characterId, connectExisting: connectOfficialTxtPreviewCandidate });
  assert.equal(result.mergedExisting, 97);
  assert.equal(result.appended, 9);
  assert.equal(result.releaseEligible, false);
  const ids = result.bundle.moves.map(move => move.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const move of fixture.moves) {
    const merged = result.bundle.moves.find(row => row.id === move.id);
    assert.ok(merged, move.slug);
    assert.equal(merged.slug, move.slug);
  }
});
