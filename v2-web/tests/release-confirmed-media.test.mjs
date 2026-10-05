import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,statSync} from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const root=new URL('..',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('../src/data/CONFIRMED_RELEASE_MEDIA_20261005.json',import.meta.url)));
const snapshot=JSON.parse(readFileSync(new URL('../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json',import.meta.url)));
const page=readFileSync(new URL('../src/app/characters/[slug]/page.tsx',import.meta.url),'utf8');
const source=readFileSync(new URL('../src/lib/release-confirmed-media.ts',import.meta.url),'utf8');
test('exact confirmed identities, assets, hashes, no duplicates and no speculative Sagat/C.Viper mapping',()=>{
 assert.equal(manifest.length,5);
 assert.equal(new Set(manifest.map(row=>row.moveId)).size,5);
 assert.equal(new Set(manifest.map(row=>row.mediaUrl)).size,5);
 for(const row of manifest){
  assert.equal(row.characterSlug,'elena');
  assert.equal(row.identityStatus,'CONFIRMED_PRIOR_EVIDENCE_REUSED');
  assert.equal(snapshot.characters.elena.moves.find(m=>m.id===row.moveId)?.slug,row.moveSlug);
  for(const [url,hash] of [[row.mediaUrl,row.mediaHash],[row.posterUrl,row.posterHash]]){
   const name=path.join(new URL('./public',root).pathname,url);
   assert.ok(statSync(name).size>0);
   assert.equal(createHash('sha256').update(readFileSync(name)).digest('hex'),hash);
  }
 }
 assert.ok(!manifest.some(row=>['c-viper','sagat'].includes(row.characterSlug)));
 assert.match(page,/generatedCandidate \? null : mediaByMove\.get/);
 assert.match(source,/process\.env\.VERCEL_ENV !== "preview"/);
});
test('Preview media resolver uses only exact move ID and slug, production returns empty',async()=>{
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const mod={exports:{}};
 new Function('require','module','exports',compiled)(()=>({__esModule:true,default:manifest}),mod,mod.exports);
 const saved=process.env.VERCEL_ENV;
 try{
  process.env.VERCEL_ENV='preview';
  const moves=snapshot.characters.elena.moves;
  const result=await mod.exports.getReleaseConfirmedMedia('elena',moves);
  assert.equal(result.size,5);
  assert.equal((await mod.exports.getReleaseConfirmedMedia('elena',moves.map(m=>({...m,slug:'wrong'})))).size,0);
  assert.equal((await mod.exports.getReleaseConfirmedMedia('sagat',snapshot.characters.sagat.moves)).size,0);
  process.env.VERCEL_ENV='production';
  assert.equal((await mod.exports.getReleaseConfirmedMedia('elena',moves)).size,0);
 }finally{if(saved===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=saved;}
});
