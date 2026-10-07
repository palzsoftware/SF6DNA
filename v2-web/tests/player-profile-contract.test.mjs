import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
function load(file, overrides={}) {
 const loaded={exports:{}};
 const code=ts.transpileModule(readFileSync(new URL(`../src/lib/${file}.ts`,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 new Function('module','exports','require',code)(loaded,loaded.exports,name=>overrides[name]);return loaded.exports;
}
const contract=load('player-profile-contract',{'@/lib/safe-external-url':load('safe-external-url')});
const now=Date.parse('2026-10-07T00:00:00Z');
const fact={label:'確認済みデバイス',state:'CURRENT',sourceUrl:'https://example.com/device',sourceDate:'2026-10-01',verified:true};
test('current evidence requires freshness; historical evidence is retained without promotion',()=>{
 assert.deepEqual(contract.publicPlayerFacts([fact],now),[fact]);
 assert.deepEqual(contract.publicPlayerFacts([{...fact,sourceDate:'2024-01-01'}],now),[]);
 const old={...fact,state:'HISTORICAL',sourceDate:'2024-01-01'};
 assert.deepEqual(contract.publicPlayerFacts([old],now),[old]);
 for(const change of [{state:'PENDING'},{state:'UNVERIFIED'},{verified:false},{sourceUrl:'javascript:alert(1)'},{sourceDate:'not a date'},{sourceDate:'2027-01-01'}]) assert.deepEqual(contract.publicPlayerFacts([{...fact,...change}],now),[]);
});
test('recommendation needs verification, public status and a meaningful reason',()=>{
 const video={...fact,state:'HISTORICAL',title:'公式試合',recommendationReason:'キャラの立ち回りを見る',published:true};
 assert.deepEqual(contract.publicRecommendedVideos([video]),[video]);
 for(const change of [{published:false},{recommendationReason:''},{title:''},{verified:false}]) assert.deepEqual(contract.publicRecommendedVideos([{...video,...change}]),[]);
 assert.deepEqual(contract.publicRecommendedVideos(),[]);
});
test('long biography gets a short summary without replacing its full source text',()=>{
 const {playerBioSummary}=load('player-presentation');
 const bio='第一文。第二文。第三文。';assert.equal(playerBioSummary(bio),'第一文。第二文。');assert.equal(playerBioSummary(null),null);assert.ok(playerBioSummary('長'.repeat(1000)).length<=221);
});
