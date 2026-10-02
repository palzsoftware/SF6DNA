import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/move-publication-levels.ts', import.meta.url),'utf8');
const m = {exports:{}};
new Function('module','exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m,m.exports);
const {projectMovePublication: project}=m.exports;
const base = {id:'test-id',slug:'test-move',name:'テスト技',category:'normal',strengthVariant:null,status:'published',identityOfficial:true,commands:[{scheme:'classic',text:'テスト入力',official:true}],detail:null,media:[]};
const detail={current:true,active:true,unique:true,verificationStatus:'verified',frameOfficial:true,damageOfficial:true,values:{startup:'7',active:'3',recovery:'20',onHit:'+2',onBlock:'-3',damage:600,driveDamage:0}};
test('identity survives absent frame in the proposed projection, without a card-wide verified claim',()=>{
 const out=project(base);assert.equal(out.name,base.name);assert.equal(out.frames.startup.value,null);assert.equal(out.frames.startup.state,'unavailable');assert.equal(out.verificationStatus,undefined);
});
test('draft and unsubstantiated identity never become public from a projection',()=>{
 assert.equal(project({...base,status:'draft'}),null);assert.equal(project({...base,identityOfficial:false}),null);
});
test('unverified, stale, closed and ambiguous detail rows never expose numbers',()=>{
 for(const change of [{verificationStatus:'reviewed'},{current:false},{active:false},{unique:false}]){const out=project({...base,detail:{...detail,...change}});assert.equal(out.frames.onHit.value,null);assert.equal(out.damage.damage.value,null);}
});
test('current verified values require their own field-level evidence',()=>{
 const out=project({...base,detail});assert.equal(out.frames.onBlock.value,'-3');assert.equal(out.damage.driveDamage.value,0);
 assert.equal(project({...base,detail:{...detail,frameOfficial:false}}).frames.startup.value,null);
 assert.equal(project({...base,detail:{...detail,damageOfficial:false}}).damage.damage.value,null);
 assert.equal(project({...base,detail:{...detail,frameOfficial:false}}).damage.damage.value,600);
});
test('command evidence is checked per Classic or Modern row, without cross-scheme inference',()=>{
 const out=project({...base,commands:[{scheme:'classic',text:'unsupported',official:false},{scheme:'modern',text:'supported',official:true}]});assert.deepEqual(out.commands,[{scheme:'modern',text:'supported'}]);
});
test('missing damage stays unavailable and never becomes zero',()=>{
 const out=project({...base,detail:{...detail,values:{...detail.values,damage:null}}});assert.deepEqual(out.damage.damage,{state:'unavailable',value:null});
});
test('throw NULL needs explicit applicability evidence; category alone cannot imply N/A',()=>{
 const input={...base,category:'throw',detail:{...detail,values:{...detail.values,onBlock:null}}};assert.equal(project(input).frames.onBlock.state,'unavailable');
 assert.equal(project({...input,detail:{...input.detail,notApplicable:{onBlock:true}}}).frames.onBlock.state,'not_applicable');
});
test('projection omits internal notes and unapproved media, and has no acquisition bypass',()=>{
 const out=project({...base,notes:'internal',detail:{...detail,notes:'private'},media:[{url:'/private.mp4',poster:null,status:'draft',identityApproved:true}]});assert.equal(out.notes,undefined);assert.equal(out.frames.notes,undefined);assert.deepEqual(out.media,[]);
 assert.doesNotMatch(source,/service_role|fetch\(|\.rpc\(|supabase|localStorage/);
});
