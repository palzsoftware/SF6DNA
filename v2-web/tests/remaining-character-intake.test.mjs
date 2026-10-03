import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { templates, recordingQueue, validateCandidate, youtubeId, requiredCategories } from '../../scripts/prepare-character-media-intake.mjs';
const inventory = JSON.parse(readFileSync(new URL('../../scripts/data/remaining-character-intake-20261004.json', import.meta.url), 'utf8'));
test('fresh 31-character inventory has the existing Preview route and preserves Production boundary', () => {
  const source = readFileSync(new URL('../src/lib/character-detail-route.ts', import.meta.url), 'utf8');
  const mod = { exports: {} };
  new Function('module','exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(mod,mod.exports);
  const previous = process.env.VERCEL_ENV;
  try {
    assert.equal(inventory.characters.length,31);
    process.env.VERCEL_ENV='preview';
    for(const c of inventory.characters) assert.equal(mod.exports.isCharacterDetailV2Route(c.slug),true,c.slug);
    process.env.VERCEL_ENV='production';
    for(const c of inventory.characters) assert.equal(mod.exports.isCharacterDetailV2Route(c.slug),false,c.slug);
  } finally {
    if(previous===undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV=previous;
  }
});
test('every remaining active required-category DB row has an unconfirmed intake row', () => {
  const rows = templates(inventory);
  assert.equal(new Set(rows.map(r => r.Character_slug)).size, 22);
  assert.equal(new Set(rows.map(r => r.Move_ID)).size, rows.length);
  for (const row of rows) {
    const move = inventory.moves.find(m => m.id === row.Move_ID);
    assert.deepEqual(validateCandidate(row, move), []);
    assert.equal(row.Media_status, 'UNRESOLVED');
    assert.equal(row.Source_file, '');
    assert.ok(requiredCategories.has(row.Category));
  }
  for (const c of inventory.characters.filter(c => !['ryu','jp','luke','jamie','manon','marisa','yasmine','ingrid','alex'].includes(c.slug))) {
    assert.deepEqual(rows.filter(r => r.Character_slug === c.slug).map(r => r.Move_ID).sort(), inventory.moves.filter(m => m.characterSlug === c.slug && m.status !== 'archived' && requiredCategories.has(m.category)).map(m => m.id).sort());
  }
});
test('cross-character fallback and duplicate inventory are rejected', () => {
  const changed = structuredClone(inventory);
  changed.moves.find(m => m.characterSlug === 'ed').characterId = inventory.characters.find(c => c.slug === 'jp').id;
  assert.throws(() => templates(changed), /Invalid character/);
  const row = templates(inventory)[0];
  assert.deepEqual(validateCandidate({...row, Character_slug:'jp'}, inventory.moves.find(m => m.id === row.Move_ID)), ['identity mismatch']);
});
test('order and timestamp alone cannot approve media', () => {
  const row = templates(inventory)[0];
  const move = inventory.moves.find(m => m.id === row.Move_ID);
  assert.ok(validateCandidate({...row, Media_status:'CONFIRMED',Source_file:'ed-normals.mp4', Start:0,End:2,Mapping_evidence:'ORDER_ONLY'}, move).includes('capture and visual evidence required'));
  assert.ok(validateCandidate({...row, Media_status:'CONFIRMED',Source_file:'ed-normals.mp4',Start:2,End:1,Game_label:'shown',Visual_review:'PASS'}, move).includes('invalid interval'));
});
test('recording queue excludes previous work and user-reported recordings', () => {
  assert.deepEqual(recordingQueue(inventory).map(c => c.slug), ['aki','rashid','cammy','lily','zangief','dee-jay','e-honda','dhalsim','blanka','ken','juri','kimberly','guile','chun-li']);
});
test('YouTube forms dedupe by ID and unrelated hosts are rejected', () => {
  const id = 'VTWNWpdNyWc';
  for (const url of [`https://youtu.be/${id}`, `https://www.youtube.com/watch?v=${id}&t=2`, `https://youtube.com/shorts/${id}`, `https://youtube.com/live/${id}`]) assert.equal(youtubeId(url), id);
  for (const url of [`https://youtube.com.evil.test/watch?v=${id}`,`http://youtube.com/watch?v=${id}`,'invalid']) assert.equal(youtubeId(url), null);
});
