import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadSource } from './helpers/character-unified-ssr.mjs';
import { connectOfficialTxtCharacterPageData } from '../src/lib/official-txt-character-page-connection.mjs';
import { buildAliasCandidates, serialize, OUTPUT } from '../scripts/build-ws5-alias-candidates.mjs';
import { CROSSWALK_LINKED } from '../src/lib/ws5-slug-alias.mjs';

const data = name => JSON.parse(readFileSync(new URL(`../src/data/${name}`, import.meta.url), 'utf8'));
const fixture = data('ALL_CHARACTER_RELEASE_FIXTURE_20261004.json').characters['dee-jay'];
const records = data('SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json');
const mediaRegistry = data('SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json');
const loader = loadSource('lib/official-txt-preview-snapshot');
const localAdmission = { nodeEnv: 'development', vercelEnv: undefined, vercel: undefined, enabled: '1', host: 'localhost:3000' };
const nameKey = value => String(value ?? '').normalize('NFKC').replace(/\s+/g, '');

test('regenerated dee-jay candidate file is reproducible from the R3 snapshot and crosswalk rule', () => {
  assert.equal(readFileSync(new URL(`../src/data/${OUTPUT}`, import.meta.url), 'utf8'), serialize(buildAliasCandidates()));
});

test('loader resolves the product slug dee-jay and keeps every original R3 key unchanged', () => {
  const r3 = data('SF6DNA_WS5_DEVICE_PREVIEW_BUNDLES_R3_CANDIDATE_20261024.json');
  const candidate = loader.getWs5TxtPreviewCandidate('dee-jay');
  assert.equal(candidate.characterSlug, 'dee-jay');
  assert.equal(candidate.releaseEligible, false);
  for (const slug of Object.keys(r3)) assert.equal(JSON.stringify(loader.getWs5TxtPreviewCandidate(slug)), JSON.stringify(r3[slug]), slug);
  assert.equal(loader.getWs5TxtPreviewCandidate('constructor'), null);
  assert.equal(loader.getWs5TxtPreviewCandidate('unknown'), null);
});

test('page connection path (unchanged page.tsx inputs) shows each Dee Jay move once', () => {
  const character = { id: fixture.characterId, slug: 'dee-jay' };
  const base = { guideSections: [], moves: fixture.moves, combos: [], setups: [], sequences: [], matchups: [], training: [] };
  const result = connectOfficialTxtCharacterPageData({ character, resolved: { bundle: base, source: 'fixture' }, moveEvidence: {},
    candidate: loader.getWs5TxtPreviewCandidate('dee-jay'), records, admission: localAdmission, mediaRegistry });
  const connection = result.candidateConnection;
  assert.equal(connection.mergedExisting, 97);
  assert.equal(connection.appended, 9);
  assert.equal(connection.releaseEligible, false);
  assert.ok(!connection.holds.some(hold => hold.reason === 'CANONICAL_SOURCE_SCOPE_OR_ROW_MISSING'));
  const moves = result.bundle.moves;
  assert.equal(moves.length, 106);
  assert.equal(new Set(moves.map(move => move.id)).size, 106, 'duplicate move id');
  assert.equal(new Set(moves.map(move => move.slug)).size, 106, 'duplicate slug');
  assert.equal(new Set(moves.map(move => nameKey(move.name))).size, 106, 'duplicate card name');
  for (const move of fixture.moves) {
    const merged = moves.find(row => row.id === move.id);
    assert.equal(merged?.slug, move.slug);
    assert.match(merged.ws5CanonicalSource, /^deejay:web:\d+$/);
  }
  const linked = Object.values(loader.getWs5TxtPreviewCandidate('dee-jay').identityByMoveId).filter(row => row.identityState === CROSSWALK_LINKED);
  assert.equal(linked.length, 97);
});

test('page connection stays disabled outside local development', () => {
  const base = { guideSections: [], moves: fixture.moves, combos: [], setups: [], sequences: [], matchups: [], training: [] };
  for (const admission of [{ ...localAdmission, nodeEnv: 'production' }, { ...localAdmission, vercelEnv: 'preview' }, { ...localAdmission, host: 'sf6dna.example' }]) {
    const result = connectOfficialTxtCharacterPageData({ character: { id: fixture.characterId, slug: 'dee-jay' }, resolved: { bundle: base },
      candidate: loader.getWs5TxtPreviewCandidate('dee-jay'), records, admission, mediaRegistry });
    assert.equal(result.bundle, base);
    assert.equal(result.candidateConnection, null);
  }
});
