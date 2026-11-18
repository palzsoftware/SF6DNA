import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { loadSource, assertUniqueAnchors } from './helpers/character-unified-ssr.mjs';
import { serializeCardDraft, CARD_DRAFT_DATA } from '../scripts/build-arjun-intake-candidate.mjs';

const pre = loadSource('lib/pre-release-character');
const local = { nodeEnv: 'development', vercelEnv: undefined, vercel: undefined, enabled: '1', host: 'localhost:3000' };
const nameKey = value => String(value ?? '').normalize('NFKC').replace(/\s+/g, '');

test('card draft data file is reproducible from the official TXT builder', () => {
  assert.equal(readFileSync(new URL(`../src/data/${CARD_DRAFT_DATA}`, import.meta.url), 'utf8'), serializeCardDraft());
});

test('local admission replaces the 9 Preview placeholders with 72 unique candidate cards', async () => {
  const record = await pre.getPreReleaseLocalCardCharacter('arjun', local);
  const moves = record.bundle.moves;
  assert.equal(record.localCardDraft, true);
  assert.equal(moves.length, 72);
  assert.ok(!moves.some(move => /^arjun-official-\d+$/.test(move.id)), 'placeholders must not be duplicated');
  assert.equal(new Set(moves.map(move => move.id)).size, 72);
  assert.equal(new Set(moves.map(move => nameKey(move.name))).size, 72);
  assert.ok(moves.every(move => move.status === 'draft' && move.media === null && move.frame.verificationStatus === 'candidate_only'));
  assert.ok(moves.every(move => typeof move.mediaKey === 'string' && move.mediaKey.startsWith('arjun__')), 'GIF table media keys attached');
  const props = pre.preReleaseUnifiedProps(record);
  assert.ok(Object.values(props.moveEvidence).every(row => row.patch === null && /承認待ち/.test(row.verification)));
  const html = renderToStaticMarkup(React.createElement(loadSource('components/character-unified-page').CharacterUnifiedPage, props));
  assertUniqueAnchors(assert, html);
  assert.match(html, /立ち弱P（ぶつ）/);
});

test('public gate is unchanged outside localhost development', async () => {
  for (const admission of [{ ...local, nodeEnv: 'production' }, { ...local, vercelEnv: 'preview' }, { ...local, vercel: '1' },
    { ...local, enabled: undefined }, { ...local, host: 'sf6dna.example' }])
    assert.equal(await pre.getPreReleaseLocalCardCharacter('arjun', admission), null);
  assert.equal(await pre.getPreReleaseLocalCardCharacter('ryu', local), null);
  assert.equal(pre.getPreReleaseCharacter('arjun'), null, 'non-Preview env keeps the existing null');
  const route = readFileSync(new URL('../src/app/internal/character-preview/[slug]/page.tsx', import.meta.url), 'utf8');
  assert.match(route, /getPreReleaseCharacter\(slug\) \?\? await getPreReleaseLocalCardCharacter\(slug,/);
  assert.match(route, /robots: \{ index: false, follow: false, noarchive: true \}/);
});
