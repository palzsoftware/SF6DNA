import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { auditAll, buttonClass, classifyFrameDiff, labelButtonClass, normalizeFrameValue, SOURCES, toMarkdown }
  from '../scripts/audit-move-data-quality.mjs';

test('frame diff classifier separates notation, corruption and real conflicts without choosing a winner', () => {
  assert.equal(classifyFrameDiff('onHit', '+4', '4'), 'FORMAT_ONLY');
  assert.equal(classifyFrameDiff('recovery', '3 (landing)', '着地後3'), 'FORMAT_ONLY');
  assert.equal(classifyFrameDiff('active', '16-until landing', '16-着地まで'), 'FORMAT_ONLY');
  assert.equal(classifyFrameDiff('damage', '900', '※900'), 'FORMAT_ONLY');
  assert.equal(classifyFrameDiff('active', '8-148-9, 11-14', '8-9, 11-14'), 'DB_CONCATENATED_ENVELOPE');
  assert.equal(classifyFrameDiff('onHit', '-1...', '-1'), 'DB_TRAILING_ELLIPSIS');
  assert.equal(classifyFrameDiff('active', '3', '4-6'), 'ACTIVE_DURATION_VS_RANGE');
  assert.equal(classifyFrameDiff('active', '5-14', '5, 7, 12-14'), 'ACTIVE_ENVELOPE_VS_MULTI_HIT');
  assert.equal(classifyFrameDiff('onHit', 'KD +37', 'D'), 'KNOCKDOWN_NOTATION');
  assert.equal(classifyFrameDiff('startup', '46', '26'), 'VALUE_CONFLICT');
  assert.equal(classifyFrameDiff('recovery', '全体 48', ''), 'TXT_BLANK_DB_HAS_VALUE');
  assert.equal(classifyFrameDiff('recovery', null, '20'), 'DB_MISSING_TXT_HAS_VALUE');
  assert.equal(normalizeFrameValue('＋３'), '3');
});

test('button family uses the last follow-up step and treats "or" alternatives as both', () => {
  assert.equal(buttonClass('214214K'), 'K');
  assert.equal(buttonClass('21424 | 24214 + LP | MP | HP'), 'P');
  assert.equal(buttonClass('236K~PP'), 'P');
  assert.equal(buttonClass('4 + LPMPHP or 4 + LKMKHK'), 'PK');
  assert.equal(buttonClass(''), null);
  assert.equal(labelButtonClass('(SA2_214214K)'), 'K');
  assert.equal(labelButtonClass('(5LP)'), null);
});

test('audit covers all 32 WS5 characters read-only and surfaces the known review items', () => {
  const hashes = Object.values(SOURCES).map(name =>
    createHash('sha256').update(readFileSync(new URL(`../src/data/${name}`, import.meta.url))).digest('hex'));
  const report = auditAll();
  assert.equal(report.readOnly, true);
  assert.equal(report.publicationGranted, false);
  assert.equal(report.characterCount, 32);
  assert.deepEqual(report.fixtureOnlyCharacters, []);
  const bySlug = Object.fromEntries(report.characters.map(row => [row.appSlug, row]));
  assert.equal(bySlug.arjun.txtRows, 77);
  assert.equal(bySlug.arjun.fixtureMoves, null);
  assert.equal(bySlug.arjun.mappedToExistingId, 0);
  assert.deepEqual(bySlug.cammy.buttonConflicts.map(row => row.sourceRecordKey), ['cammy:web:401', 'cammy:web:402']);
  assert.equal(bySlug['dee-jay'].ws5Slug, 'deejay');
  assert.equal(bySlug['dee-jay'].ws5CandidateReachableByAppSlug, false);
  assert.match(toMarkdown(report), /キラービースピン/);
  // The audit must never mutate its inputs.
  assert.deepEqual(Object.values(SOURCES).map(name =>
    createHash('sha256').update(readFileSync(new URL(`../src/data/${name}`, import.meta.url))).digest('hex')), hashes);
});
