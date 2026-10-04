import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync(new URL('../src/lib/release-character-move-resolver.ts',import.meta.url),'utf8');
const m={exports:{}};
new Function('module','exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m,m.exports);
const resolve=m.exports.resolveReleaseCharacterMoves;
const inventory=JSON.parse(readFileSync(new URL('../../scripts/data/remaining-character-intake-20261004.json',import.meta.url)));
const required=new Set(['normal','unique','target_combo','special','throw','super']);
function fixture(slug){
 const rows=inventory.moves.filter(row=>row.characterSlug===slug&&row.status!=='archived'&&required.has(row.category));
 return {characterId:rows[0].characterId,currentPatchId:'test-patch',
 moves:rows.map(row=>({id:row.id,character_id:row.characterId,slug:row.slug,name_ja:row.name,move_type:row.category,status:'published'})),
 commands:rows.map(row=>({id:'cmd-'+row.id,move_id:row.id,control_scheme:'classic',command_text:'236LP',numeric_notation:'236LP',button_notation:null,condition_text:null,sort_order:0})),
 frames:rows.map(row=>({id:'frame-'+row.id,move_id:row.id,valid_from_patch_id:'test-patch',valid_to_patch_id:null,verification_status:'verified',startup:'7',active:'3',recovery:'20',on_hit:'+2',on_block:'-3',damage:600})),
 gateReadyIds:new Set(rows.map(row=>row.id)),officialCommandIds:new Set(rows.map(row=>'cmd-'+row.id)),officialFrameIds:new Set(rows.map(row=>'frame-'+row.id))};
}
test('31-character contract retains every eligible required ID, category and frame field without media',()=>{
 const slugs=[...new Set(inventory.moves.map(row=>row.characterSlug))];assert.equal(slugs.length,31);
 for(const slug of slugs){const input=fixture(slug),out=resolve(input);
 assert.deepEqual(out.map(row=>row.id),input.moves.map(row=>row.id),slug);
 assert.deepEqual(out.map(row=>row.moveType),input.moves.map(row=>row.move_type),slug);
 for(const row of out){assert.equal(row.media,null);assert.equal(row.commands[0].commandText,'236LP');assert.equal(row.frame.startup,'7');assert.equal(row.frame.onHit,'+2');assert.equal(row.frame.onBlock,'-3');assert.equal(row.frame.damage,600);}
 }
});
test('draft, wrong character, gate rejection and unsupported exact command/frame rows are excluded',()=>{
 const input=fixture('c-viper');
 for(const mutate of [x=>x.moves[0].status='draft',x=>x.moves[0].character_id='other',x=>x.gateReadyIds.delete(x.moves[0].id),x=>x.officialCommandIds.delete(x.commands[0].id),x=>x.officialFrameIds.delete(x.frames[0].id)]){
 const x=structuredClone(input);mutate(x);assert.ok(!resolve(x).some(row=>row.id===x.moves[0].id));
 }
});
test('stale, closed, unverified or ambiguous current frames cannot be presented as verified',()=>{
 for(const change of [{valid_from_patch_id:'old'},{valid_to_patch_id:'ended'},{verification_status:'reviewed'}]){
 const x=fixture('elena');Object.assign(x.frames[0],change);assert.ok(!resolve(x).some(row=>row.id===x.moves[0].id));
 }
 const x=fixture('sagat');x.frames.push({...x.frames[0],id:'duplicate'});assert.ok(!resolve(x).some(row=>row.id===x.moves[0].id));
});
test('real zero, official Down notation and NULL are preserved without guessing applicability',()=>{
 const x=fixture('c-viper');Object.assign(x.frames[0],{damage:0,on_hit:'D',on_block:null});
 const out=resolve(x)[0];assert.equal(out.frame.damage,0);assert.equal(out.frame.onHit,'D');assert.equal(out.frame.onBlock,null);
});
test('duplicate move rows fail closed; internal fields cannot leak from the whitelist',()=>{
 const x=fixture('c-viper');x.moves[0].internal_notes='private';assert.equal(resolve(x)[0].internal_notes,undefined);
 x.moves.push({...x.moves[0]});assert.ok(!resolve(x).some(row=>row.id===x.moves[0].id));
 assert.doesNotMatch(source,/service_role|\.rpc\(|fetch\(/);
});
