import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyAll, subclassifyConflict } from '../scripts/classify-frame-value-conflicts.mjs';

const row = (field, db, txt) => ({ field, db, txt });

test('value conflicts are sub-classified by explanation before being treated as real conflicts', () => {
  assert.equal(subclassifyConflict(row('recovery', '33', '21+着地後12')), 'NOTATION_TOTAL_EQUALS_SPLIT');
  assert.equal(subclassifyConflict(row('startup', '6', '6+0')), 'NOTATION_PLUS_ZERO');
  assert.equal(subclassifyConflict(row('onHit', '-2... (+1)...', '-2')), 'DB_ANNOTATED_PREFIX_MATCH');
  assert.equal(subclassifyConflict(row('recovery', 'variable', '着地後18')), 'DB_VARIABLE_PLACEHOLDER');
  assert.equal(subclassifyConflict(row('active', '23-33', '23--33')), 'TXT_MALFORMED_SUSPECTED');
  assert.equal(subclassifyConflict(row('onBlock', '-4...+2', '-4～2')), 'NOTATION_RANGE');
  assert.equal(subclassifyConflict(row('active', '2,3', '4-5, 12-14')), 'ACTIVE_DURATIONS_VS_RANGES');
  assert.equal(subclassifyConflict(row('startup', '6,5,17', '5')), 'DB_MULTI_STEP_ROW');
  assert.equal(subclassifyConflict(row('startup', '7', '10'), 5), 'SUSPECTED_MAPPING_ERROR');
  assert.equal(subclassifyConflict(row('startup', '46', '26')), 'NUMERIC_CONFLICT');
});

test('all 87 value conflicts are classified and the Mai step-3 copy is traced to the step-2 official row', () => {
  const rows = classifyAll();
  assert.equal(rows.length, 87);
  assert.ok(rows.every(item => item.priority && item.subclass));
  const mai = rows.filter(item => item.slug === 'mai-hien-ren-kyaku-2-5lk-lk-lk');
  assert.equal(mai.length, 5);
  assert.ok(mai.every(item => item.subclass === 'SUSPECTED_MAPPING_ERROR' && item.dbValuesMatchTxtRows.startsWith('mai:web:202 ')));
});
