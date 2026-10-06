import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {generate} from '../../scripts/generate-character-release-fixtures.mjs';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const snapshot=JSON.parse(read('../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json'));
const route=read('../src/lib/character-detail-route.ts');
test('generator uses route roster, whitelists data and preserves NULL, zero, notation and verification',()=>{
 const input={patches:[{id:'current'}],totals:{},characters:Object.keys(snapshot.characters).map(slug=>({id:slug,slug,moves:[{id:slug,slug,name:slug,moveType:'normal',status:'draft',commands:[{control_scheme:'classic',command_text:'2MK',sort_order:0}],frames:[{id:slug,valid_from_patch_id:'current',valid_to_patch_id:null,startup:'7',on_hit:'D',on_block:null,damage:0,verification_status:'unverified'}],internal_notes:'SECRET'}]}))};
 const result=generate(input,route);
 assert.equal(Object.keys(result.characters).length,31);
 const move=result.characters.jp.moves[0];
 assert.equal(move.frame.verificationStatus,'unverified');assert.equal(move.status,'draft');
 assert.equal(move.frame.damage,0);assert.equal(move.frame.onHit,'D');assert.equal(move.frame.onBlock,null);
 assert.equal(move.internal_notes,undefined);assert.ok(!JSON.stringify(result).includes('SECRET'));
 input.characters[0].moves[0].frames[0].valid_from_patch_id='old';
 assert.equal(generate(input,route).characters[input.characters[0].slug].moves[0].frame,null);
 input.patches.push({id:'second'});assert.throws(()=>generate(input,route));
});
test('real snapshot has exact route coverage, unique identity, 1939 rows and priority counts',()=>{
 assert.equal(Object.keys(snapshot.characters).length,31);
 const rows=Object.values(snapshot.characters).flatMap(c=>c.moves);
 assert.equal(rows.length,1939);assert.equal(new Set(rows.map(m=>m.id)).size,rows.length);
 for(const [slug,total] of [['c-viper',61],['elena',72],['sagat',60]])assert.equal(snapshot.characters[slug].moves.length,total);
 for(const m of rows){assert.ok(m.commands.some(c=>c.scheme==='classic'));assert.ok(m.releaseFixture);assert.equal(m.media,null);assert.ok(['normal','unique','target_combo','special','throw','super'].includes(m.moveType));}
});
test('Preview fallback preserves public gate, character binding and existing references',()=>{
 const loader=read('../src/lib/generated-release-fixture.ts');
 assert.match(loader,/process.env.VERCEL_ENV !== "preview"/);assert.match(loader,/entry.characterId !== characterId/);
 for(const slug of ['jp','ryu','alex','yasmine'])assert.ok(loader.includes('slug === "'+slug+'"'));
 const resolver=read('../src/lib/character-detail-data.ts');
 assert.ok(resolver.indexOf('if (publicMoves?.length)')<resolver.indexOf('const generated ='));
 assert.ok(resolver.indexOf('if (remote)')<resolver.indexOf('const generated ='));
 assert.match(resolver,/hasNineCharacterIntegrationCandidate\(slug\) && process.env.VERCEL_ENV === "preview"/);
 assert.ok(resolver.indexOf('getNineCharacterIntegrationCandidate(characterId, slug)')<resolver.indexOf('const generated ='));
 assert.match(resolver,/candidate \? \{ bundle: candidate.bundle, source: "fixture" \} : \{ bundle: null, source: "unavailable" \}/);
 assert.doesNotMatch(loader,/service_role|SUPABASE|fetch\(/);
});
