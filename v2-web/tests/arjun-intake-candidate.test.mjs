import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSource } from './helpers/character-unified-ssr.mjs';
import { ARJUN_PREVIEW_MOVES, arjunRowScope, arjunSlugProposal, buildArjunIntakeCandidate, previewFamily, splitCondition }
  from '../scripts/build-arjun-intake-candidate.mjs';

const intakeModule = loadSource('lib/arjun-official-intake');

test('row scope, slug proposal and condition split follow existing DB conventions', () => {
  assert.equal(arjunRowScope({ webId: '605', skill: 'ドライブパリィ' }), 'EXCLUDE_COMMON_SYSTEM');
  assert.equal(arjunRowScope({ webId: '316', skill: '息吹の震撼(飛び道具)' }), 'EXCLUDE_PROJECTILE_SPLIT_ROW');
  assert.equal(arjunRowScope({ webId: '300', skill: '弱 大義の巨腕' }), 'REGISTER_CANDIDATE');
  assert.equal(arjunSlugProposal({ webId: '106', name: '(2LP)' }), 'arjun-crouching-lp');
  assert.equal(arjunSlugProposal({ webId: '201', name: '(2HK)' }), 'arjun-capcom-web-201');
  assert.deepEqual(splitCondition('（ジャンプ中に）LP'), { command: 'LP', condition: 'ジャンプ中に' });
  assert.deepEqual(splitCondition('（厳酷な岩肩で岩に触れると自動派生）'), { command: '（厳酷な岩肩で岩に触れると自動派生）', condition: null });
  assert.deepEqual(previewFamily('SA2 忘却の一槌'), { family: '忘却の一鎚', relation: 'VARIANT_KANJI_CONFLICT' });
  assert.deepEqual(previewFamily('OD 追撃'), { family: '大義の巨腕', relation: 'DERIVED' });
});

test('77 official TXT rows become 63 unreviewed registration candidates covering all 9 Preview moves', () => {
  const { intake, mapping } = buildArjunIntakeCandidate();
  assert.equal(mapping.length, 77);
  assert.equal(intake.moves.length, 63);
  assert.equal(mapping.filter(row => row.scope === 'EXCLUDE_COMMON_SYSTEM').length, 10);
  assert.equal(mapping.filter(row => row.scope === 'EXCLUDE_PROJECTILE_SPLIT_ROW').length, 4);
  assert.equal(new Set(intake.moves.map(move => move.localKey)).size, 63);
  for (const name of ARJUN_PREVIEW_MOVES) assert.ok(mapping.some(row => row.previewFamily === name), name);
  assert.ok(intake.moves.every(move => move.canonicalMoveId === null && !move.canonicalIdentityVerified));
  const fields = ['name', 'classic', 'modern', 'classicCondition', 'modernCondition', 'startup', 'active', 'recovery', 'onHit', 'onBlock', 'damage', 'notes'];
  assert.ok(intake.moves.every(move => fields.every(key => move[key].status === 'UNCONFIRMED' && move[key].reviewedBy === null)));
  // Values are verbatim TXT text (no inferred frame data).
  const lp = intake.moves.find(move => move.localKey === 'arjun-standing-lp');
  assert.deepEqual([lp.startup.value, lp.active.value, lp.onBlock.value, lp.damage.value], ['4', '4-6', '1', '300']);
});

test('existing intake gate accepts the candidate structurally but admits no move before review', () => {
  const { intake } = buildArjunIntakeCandidate();
  const result = intakeModule.validateArjunIntake(intake);
  assert.deepEqual(result.errors, []);
  assert.equal(result.readiness, 'LOCAL_INTAKE_ONLY_NOT_PUBLIC');
  assert.ok(result.gaps.includes('PATCH_UNCONFIRMED'));
  assert.equal(intakeModule.arjunIntakeToDraftBundle(intake).moves.length, 0);
});
