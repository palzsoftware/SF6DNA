import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderUnified, character, assertUniqueAnchors } from './helpers/character-unified-ssr.mjs';
import { buildArjunLedger, buildArjunCardDraft, buildArjunMediaIdTable, buildArjunIntakeCandidate, modernInputMerges, loadArjunRows }
  from '../scripts/build-arjun-intake-candidate.mjs';

const registry = JSON.parse(readFileSync(new URL('../src/data/SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json', import.meta.url), 'utf8'));
const nameKey = value => String(value ?? '').normalize('NFKC').replace(/\s+/g, '');

test('ledger keeps all 77 official rows with every frame/command field and a display plan', () => {
  const ledger = buildArjunLedger();
  assert.equal(ledger.length, 77);
  assert.equal(new Set(ledger.map(row => row.sourceRecordKey)).size, 77);
  for (const row of ledger) for (const key of ['classic', 'modern', 'startup', 'active', 'recovery', 'onHit', 'onBlock', 'damage', 'displayPlan', 'reviewFlags'])
    assert.ok(Object.prototype.hasOwnProperty.call(row, key), `${row.sourceRecordKey}:${key}`);
  const count = plan => ledger.filter(row => row.displayPlan === plan).length;
  assert.equal(count('REGISTER_AS_MOVE_CARD'), 62);
  assert.equal(count('SHOW_AS_LOCAL_SYSTEM_CARD'), 10);
  assert.equal(count('ATTACH_TO_PARENT_CARDS'), 4);
  assert.equal(count('MERGE_AS_MODERN_INPUT_OF'), 1);
  assert.ok(ledger.every(row => row.formalMoveId === null && row.publicationApproved === false && row.patchVerified === false));
  assert.deepEqual([...modernInputMerges(loadArjunRows())], [['arjun:web:201', 'arjun:web:111']]);
  // Round-2 intake artifact is protected (63 rows, unchanged builder).
  assert.equal(buildArjunIntakeCandidate().intake.moves.length, 63);
});

test('card draft uses existing card shape, no duplicates, and media-registry-bound preview IDs', () => {
  const draft = buildArjunCardDraft();
  assert.equal(draft.moves.length, 72);
  assert.equal(new Set(draft.moves.map(move => move.id)).size, 72);
  assert.equal(new Set(draft.moves.map(move => nameKey(move.name))).size, 72);
  assert.ok(draft.moves.every(move => move.status === 'draft' && move.media === null && move.frame.verificationStatus === 'candidate_only'));
  const crouchHk = draft.moves.find(move => move.sourceRecordKey === 'arjun:web:111');
  assert.deepEqual(crouchHk.commands.map(row => [row.scheme, row.commandText]), [['classic', '2 + HK'], ['modern', '3 + 強']]);
  const shinki = draft.moves.find(move => move.sourceRecordKey === 'arjun:web:322');
  assert.deepEqual(shinki.officialSupplementaryRows.map(row => row.sourceRecordKey), ['arjun:web:325']);
  assert.equal(draft.moves.find(move => move.sourceRecordKey === 'arjun:web:205').frameFieldStatus.onBlock, 'OFFICIAL_NA');
  const table = buildArjunMediaIdTable(buildArjunLedger(), registry);
  assert.equal(table.length, 77);
  assert.ok(table.every(row => row.registryConsistent && row.mediaKey), 'every row joins the existing media key registry');
  for (const move of draft.moves) assert.ok(table.some(row => row.currentPreviewMoveId === move.id && row.currentPreviewMoveSlug === move.slug));
});

test('card draft renders through the existing CharacterUnifiedPage without anchor collisions', () => {
  const draft = buildArjunCardDraft();
  const html = renderUnified('ryu', { character: character('ryu', { id: 'local-pre-release-arjun', slug: 'arjun', name: 'アルジュン' }), bundle: draft });
  assertUniqueAnchors(assert, html);
  assert.match(html, /立ち弱P（ぶつ）/);
  assert.match(html, /SA3 秩序の鬼神/);
});
