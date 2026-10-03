import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { validateAlexMedia } from '../../scripts/validate-alex-media.mjs';
const manifest = JSON.parse(readFileSync(new URL('../src/data/ALEX_REVIEWED_MEDIA_20261003.json',import.meta.url)));
function load(data = manifest) {
 const loadedModule = {exports:{}};
 const source = readFileSync(new URL('../src/lib/alex-reviewed-media.ts',import.meta.url),'utf8');
 new Function('module','exports','require',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(loadedModule,loadedModule.exports,()=>({default:data}));
 return loadedModule.exports;
}
function preview(fn) { const old=process.env.VERCEL_ENV;process.env.VERCEL_ENV='preview';try{return fn();}finally{if(old===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=old;}}
test('seven exact default mappings and nonempty local assets pass validator',()=>assert.deepEqual(validateAlexMedia(manifest).errors,[]));
test('Preview resolver exposes seven media and never exports frames or strategy',()=>preview(()=>{
 const api=load();const bundle=api.getAlexReviewedBundle(manifest.character_id);
 assert.equal(bundle.moves.length,7);assert.equal(bundle.moves.filter(row=>row.media).length,7);
 assert.ok(bundle.moves.every(row=>row.frame===null && row.status==='draft'));
 assert.deepEqual(bundle.combos,[]);assert.deepEqual(bundle.setups,[]);
 assert.deepEqual(api.getAlexReviewedMedia('other-character'),[]);
}));
test('production receives neither reviewed bundle nor media',()=>{
 const old=process.env.VERCEL_ENV;process.env.VERCEL_ENV='production';try{assert.equal(load().getAlexReviewedBundle(manifest.character_id),null);assert.deepEqual(load().getAlexReviewedMedia(manifest.character_id),[]);}finally{if(old===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=old;}
});
for(const [name,mutate] of [
 ['wrong character',m=>m.character_slug='ryu'],['invalid ID',m=>m.clips[0].move_id='unknown'],
 ['wrong slug',m=>m.clips[0].move_slug='alex-unknown'],['wrong category',m=>m.clips[0].category='normal'],
 ['variant/SA conflict',m=>m.clips[0].variant='CA'],['duplicate mapping',m=>m.clips.push(m.clips[0])],
 ['duplicate file',m=>m.clips[1].media_url=m.clips[0].media_url],
 ['conditional replaces default',m=>m.clips[0].media_role='CONDITIONAL'],
 ['missing file',m=>m.clips[0].media_url='/media/alex/20261003/missing.mp4'],
 ])test(`reject ${name}`,()=>{const m=structuredClone(manifest);mutate(m);assert.ok(validateAlexMedia(m).errors.length);});
test('runtime refuses changed command or duplicate identity',()=>preview(()=>{
 const m=structuredClone(manifest);m.clips[0].command_snapshot='236LP';assert.equal(load(m).getAlexReviewedMedia(m.character_id).length,6);
 m.clips.push(m.clips[1]);assert.equal(load(m).getAlexReviewedMedia(m.character_id).length,5);
}));
