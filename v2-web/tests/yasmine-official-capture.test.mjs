import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
const capture = JSON.parse(readFileSync(new URL('../src/data/YASMINE_OFFICIAL_CAPTURE_PREVIEW_20261003.json', import.meta.url)));
const source = readFileSync(new URL('../src/lib/character-move-filter.ts', import.meta.url), 'utf8');
const mod = { exports: {} };
new Function('module', 'exports', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(mod, mod.exports);
const { matchesMoveSearch } = mod.exports;

test('official capture has distinct combat rows and excludes common system and taunts', () => {
  assert.equal(capture.moves.length, 71);
  assert.equal(new Set(capture.moves.map(move => move.id)).size, 71);
  assert.equal(new Set(capture.moves.map(move => move.slug)).size, 71);
  const count = type => capture.moves.filter(move => move.moveType === type).length;
  assert.deepEqual(['normal', 'unique', 'special', 'throw', 'super'].map(count), [18, 7, 40, 2, 4]);
  assert.equal(capture.moves.filter(move => move.slug.includes('jumping-')).length, 6);
  assert.equal(capture.patchStatus, 'PATCH_UNRESOLVED');
  assert.ok(capture.moves.every(move => move.frame.verificationStatus === 'reviewed'));
});

test('strength, stage and state conditions retain distinct fields without invented follow-up input', () => {
  const move = key => capture.moves.find(move => move.slug === `yasmine-${key}`);
  assert.equal(move('alon-2-236lp-6p-p').frame.startup, '16');
  assert.equal(move('alon-2-236lp-6p-p').commands[0].commandText, '—');
  assert.match(move('alon-2-236lp-6p-p').condition, /自動派生/);
  assert.equal(move('alon-bayani-236mp-6p').frame.onBlock, '-2');
  assert.equal(move('alon-2-od-bayani-sa2').frame.onBlock, '-1');
  assert.equal(move('talim-ng-hangin-214mp').frame.onBlock, '-3');
  assert.equal(move('talim-ng-hangin-214lp').frame.damage, 0);
  assert.equal(move('talim-ng-hangin-214lp').frame.startup, '—');
  assert.equal(move('ulan-236k-p').frame.onHit, '3～6');
});

test('SA/CA and throw identities preserve official distinct values and nonnumeric notation', () => {
  const sa = capture.moves.filter(move => move.moveType === 'super');
  assert.deepEqual(sa.map(move => move.frame.damage), [2000, 0, 4000, 4500]);
  assert.deepEqual(sa.map(move => move.frame.onBlock), ['-34', '—', '-48', '-45']);
  assert.ok(capture.moves.filter(move => move.moveType === 'throw').every(move => move.frame.onHit === 'D' && move.frame.onBlock === '—'));
});

test('canonical corrected category and command search use the same move identities', () => {
  const directional = capture.moves.find(move => move.slug.endsWith('hiwang-pababa-6mp'));
  assert.equal(directional.moveType, 'unique');
  assert.equal(matchesMoveSearch({ name: directional.name, commands: directional.commands.map(c => c.commandText) }, 'ヒワン'), true);
  assert.equal(matchesMoveSearch({ name: directional.name, commands: directional.commands.map(c => c.commandText) }, '6MP'), true);
});
