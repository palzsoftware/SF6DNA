import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSource,roster} from './helpers/character-unified-ssr.mjs';
// 2026-11-20: screen readers announced a bare "|" / "/" between alternative buttons/inputs.
const {getWs5TxtPreviewCandidate}=loadSource('lib/official-txt-preview-snapshot');
const conn=loadSource('lib/official-txt-character-page-connection.mjs');
const {renderUnified}=await import('./helpers/character-unified-ssr.mjs');
const records=loadSource('data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json').default;
test('alternative markers are spoken as "または" and never as a bare symbol',()=>{
  const r=conn.connectOfficialTxtCharacterPageData({character:{id:roster.ryu.characterId,slug:'ryu'},resolved:{bundle:null},candidate:getWs5TxtPreviewCandidate('ryu'),records,admission:{nodeEnv:'development',enabled:'1',host:'localhost'}});
  const html=renderUnified('ryu',{bundle:r.bundle,moveEvidence:r.moveEvidence});
  const labels=[...html.matchAll(/aria-label="([^"]+)"/g)].map(m=>m[1]).filter(l=>/パンチ|キック|攻撃/.test(l));
  assert.ok(labels.length>50);
  assert.ok(!labels.some(l=>/(^|、)[|｜/／](、|$)/.test(l)),labels.find(l=>/(^|、)[|｜/／](、|$)/.test(l)));
  assert.ok(labels.some(l=>/弱パンチ、または、中パンチ、または、強パンチ/.test(l)));
});
