import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSource,roster} from './helpers/character-unified-ssr.mjs';
// 2026-11-20 move-master QA: product move cards come from the official TXT connection for all 32 characters.
const {getWs5TxtPreviewCandidate}=loadSource('lib/official-txt-preview-snapshot');
const conn=loadSource('lib/official-txt-character-page-connection.mjs');
const records=loadSource('data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json').default;
const slugs=[...Object.keys(roster),'arjun'].sort();
test('all 32 characters connect official TXT moves without duplicate IDs, slugs or source keys',()=>{
  assert.equal(slugs.length,32);let total=0;
  for(const slug of slugs){
    const r=conn.connectOfficialTxtCharacterPageData({character:{id:roster[slug]?.characterId??'local-'+slug,slug},resolved:{bundle:null},
      candidate:getWs5TxtPreviewCandidate(slug),records,admission:{nodeEnv:'development',enabled:'1',host:'localhost'}});
    const moves=r.bundle?.moves??[];assert.ok(moves.length>=55,slug);total+=moves.length;
    for(const key of ['id','slug','ws5CanonicalSource']){
      const values=moves.map(m=>m[key]).filter(Boolean);
      assert.equal(new Set(values).size,values.length,`${slug} duplicate ${key}`);
    }
    // Existing fixture IDs are never re-assigned to a different slug.
    const fixture=new Map((roster[slug]?.moves??[]).map(m=>[m.id,m.slug]));
    for(const m of moves) if(fixture.has(m.id)) assert.equal(m.slug,fixture.get(m.id),`${slug} id ${m.id}`);
  }
  assert.equal(total,2673);
});
