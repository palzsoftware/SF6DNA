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
const now=Date.parse('2026-10-14T05:52:50Z');
const fact={label:'検証用の出典付き要約',state:'CURRENT',sourceUrl:'https://example.com/source',sourceDate:'2026-10-13',verified:true,kind:'SOURCE_SUPPORTED_SUMMARY'};
test('approved summaries and first-person statements are retained without reclassification',()=>{
 const statement={...fact,kind:'FIRST_PERSON_STATEMENT'};
 assert.deepEqual(contract.publicPlayerInsights([fact,statement],now),[fact,statement]);
 assert.deepEqual(contract.publicPlayerInsights(undefined,now),[]);
});
test('inferred or absent insight kinds are hidden even if a verified flag is supplied',()=>{
 for(const kind of ['INFERENCE_DRAFT','AI_ANALYSIS','FACT',undefined]) assert.deepEqual(contract.publicPlayerInsights([{...fact,kind}],now),[]);
});
test('draft strengths cannot promote themselves from source presence',()=>{
 assert.deepEqual(contract.publicPlayerInsights([{...fact,verified:false}],now),[]);
 assert.deepEqual(contract.publicPlayerInsights([{...fact,verified:'true'}],now),[]);
});
test('undated, future, stale current and unsafe-link insights are omitted; historical scope is preserved',()=>{
 for(const change of [{sourceDate:null},{sourceDate:''},{sourceDate:'2027-01-01'},{sourceDate:'2024-01-01'},{sourceUrl:'javascript:alert(1)'},{state:'PENDING'}]) assert.deepEqual(contract.publicPlayerInsights([{...fact,...change}],now),[]);
 const old={...fact,state:'HISTORICAL',sourceDate:'2024-01-01'};
 assert.deepEqual(contract.publicPlayerInsights([old],now),[old]);
});
test('relation confirmation is mandatory for every recommendation receiver',()=>{
 const video={...fact,title:'検証用動画',recommendationReason:'検証用の理由',published:true};
 assert.deepEqual(contract.publicRecommendedVideos([video],now),[]);
 for(const flag of [false,'true',1]) assert.deepEqual(contract.publicRecommendedVideos([{...video,relationConfirmed:flag}],now),[]);
 const confirmed={...video,relationConfirmed:true};
 assert.deepEqual(contract.publicRecommendedVideos([confirmed],now),[confirmed]);
});
test('optional missing evidence does not mutate or remove the surrounding player',()=>{
 const p={id:'QA_ONLY',displayName:'検証用選手',profileIntake:{strengths:[{...fact,verified:false}],referencePoints:[]}};
 const before=JSON.stringify(p);
 assert.deepEqual(contract.publicPlayerInsights(p.profileIntake.strengths,now),[]);
 assert.equal(JSON.stringify(p),before);assert.equal(p.displayName,'検証用選手');
});
test('the renderer labels both insight kinds and omits empty groups',()=>{
 const source=readFileSync(new URL('../src/components/player-evidence-sections.tsx',import.meta.url),'utf8');
 for(const label of ['この選手の強み','参考にしたいポイント','本人の発言に基づく情報','出典に基づく要約']) assert.ok(source.includes(label));
 assert.ok(source.includes('publicPlayerInsights(intake.strengths)'));
 assert.ok(source.includes('publicPlayerInsights(intake.referencePoints)'));
 assert.ok(source.includes('rows.length ? <section'));
 assert.equal(source.includes('dangerouslySetInnerHTML'),false);
});
