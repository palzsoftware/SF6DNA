import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSource,roster} from './helpers/character-unified-ssr.mjs';
const {getWs5TxtPreviewCandidate}=loadSource('lib/official-txt-preview-snapshot');
const conn=loadSource('lib/official-txt-character-page-connection.mjs');
const {ws5LocalCorrections:C}=loadSource('lib/ws5-local-corrections-20261120.mjs');
const records=loadSource('data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json').default;
const run=(slug,base=null)=>conn.connectOfficialTxtCharacterPageData({character:{id:roster[slug]?.characterId??'local-'+slug,slug},resolved:{bundle:base},candidate:getWs5TxtPreviewCandidate(slug),records,admission:{nodeEnv:'development',enabled:'1',host:'localhost'}}).bundle.moves;
const fixture=slug=>({guideSections:[],moves:roster[slug].moves.map(m=>({...m})),combos:[],setups:[],sequences:[],matchups:[],training:[]});
test('corrections are review-only candidates with evidence and never grant publication',()=>{
  assert.equal(C.publicationGranted,false);assert.equal(C.status,'LOCAL_CORRECTION_CANDIDATE');
  for(const c of [...C.commandCorrections,...C.identityAdoptions]) assert.ok(c.basis?.length>20);
  assert.equal(C.commandCorrections.length,30);assert.equal(C.identityAdoptions.length,7);
});
test('Cammy SA2 classic uses K per official label + DB verified, with provenance',()=>{
  for(const [key,text] of [['cammy:web:401','214214 + K'],['cammy:web:402','（前ジャンプ中に）214214 + K']]){
    const m=run('cammy').find(x=>x.ws5CanonicalSource===key);
    assert.equal(m.commands.find(c=>c.scheme==='classic').commandText,text);
    assert.equal(m.ws5CanonicalCommandProvenance.classic,'LOCAL_CORRECTION_CANDIDATE');
    assert.match(m.commands.find(c=>c.scheme==='modern').commandText,/中/); // modern untouched
  }
});
test('28 classic FILL_BLANK candidates appear only where the official TXT is blank',()=>{
  for(const c of C.commandCorrections.filter(x=>x.mode==='FILL_BLANK')){
    assert.equal(records[c.sourceRecordKey].raw.command,null,c.sourceRecordKey);
    const slug=({deejay:'dee-jay'})[c.sourceRecordKey.split(':')[0]]??c.sourceRecordKey.split(':')[0];
    const m=run(slug).find(x=>x.ws5CanonicalSource===c.sourceRecordKey);
    assert.equal(m.commands.find(x=>x.scheme==='classic').commandText,c.commandText);
  }
});
test('Ryu 7 TXT rows adopt existing IDs (not renamed) and merge with the existing move',()=>{
  const fx=new Map(roster.ryu.moves.map(m=>[m.id,m]));
  for(const base of [null,fixture('ryu')]){
    const moves=run('ryu',base);
    const ids=moves.map(m=>m.id);assert.equal(new Set(ids).size,ids.length,'no duplicate IDs');
    for(const a of C.identityAdoptions){
      const hit=moves.filter(m=>m.id===a.existingMoveId);assert.equal(hit.length,1,a.sourceRecordKey);
      assert.equal(hit[0].slug,fx.get(a.existingMoveId).slug);assert.equal(hit[0].ws5CanonicalSource,a.sourceRecordKey);
      assert.ok(!ids.includes('sf6dna-preview:ryu:'+encodeURIComponent(a.sourceRecordKey)),'candidate ID retired');
    }
  }
});

test('Ryu ID adoption retains the original media key from the real preview registry', () => {
  const mediaRegistry = loadSource('data/SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json').default;
  const result = conn.connectOfficialTxtCharacterPageData({
    character: { id: roster.ryu.characterId, slug: 'ryu' },
    resolved: { bundle: fixture('ryu') },
    candidate: getWs5TxtPreviewCandidate('ryu'), records, mediaRegistry,
    admission: { nodeEnv: 'development', enabled: '1', host: 'localhost' },
  });
  for (const adoption of C.identityAdoptions) {
    const original = mediaRegistry.find(row => row.sourceRecordKey === adoption.sourceRecordKey);
    const move = result.bundle.moves.find(row => row.id === adoption.existingMoveId);
    assert.equal(move.mediaKey, original.mediaKey, adoption.sourceRecordKey);
    assert.ok(!result.mediaKeyHolds.some(row => row.moveId === move.id));
  }
});
