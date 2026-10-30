import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
const lib=fileURLToPath(new URL('../src/lib/',import.meta.url));const cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);const js=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('module','exports','require',js)(m,m.exports,name=>{assert.ok(name.startsWith('.'),'no external data adapters in reference selector');return load(path.resolve(path.dirname(file),name+'.ts'))});return m.exports;}
const {DAILY_TRAINING_DETAILS:details}=load(path.join(lib,'daily-training-details.ts'));
const {getPracticeReferences:select}=load(path.join(lib,'daily-training-references.ts'));
test('current anti-air practice points to the reviewed author article and its own setup video',()=>{
 const r=select(details.anti_air);assert.equal(r.references.length,2);assert.equal(r.references[0].url,'https://note.com/st6noob/n/n0af96b881272');assert.equal(r.references[1].url,'https://www.youtube.com/watch?v=XDkNYtSbKLA');assert.equal(r.references[1].reviewScope,'article_embedding_and_metadata');assert.match(r.reason,/対空/);
});
test('guard references and search requests match the individual practice issue',()=>{
 assert.match(select(details.defense).references[0].url,/n99dc45986f78/);assert.match(select(details.corner_defense).searchHref,/q=/);assert.equal(new URL(select(details.impact_response).searchHref,'https://example.invalid').searchParams.get('q'),'インパクト返し');assert.equal(select(details.impact_response).references.length,0);
});
test('old or modified snapshots and empty detail arrays do not receive new reference guidance',()=>{
 const old=structuredClone(details.anti_air);old.setup=[];assert.equal(select(old),null);const changed=structuredClone(details.anti_air);changed.why+='old';assert.equal(select(changed),null);
});
test('all current details retain only safe reference destinations and site-local searches',()=>{
 for(const d of Object.values(details)){const r=select(d);assert.ok(r);assert.ok(r.searchHref.startsWith('/videos?'));for(const source of r.references){const u=new URL(source.url);assert.equal(u.protocol,'https:');assert.ok(['note.com','www.youtube.com'].includes(u.hostname));assert.ok(source.relevance);assert.equal(source.reviewedAt,'2026-10-30');}}
});
