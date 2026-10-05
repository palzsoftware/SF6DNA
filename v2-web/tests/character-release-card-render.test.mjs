import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';
const require=createRequire(import.meta.url),cache=new Map();
const load=path=>{if(cache.has(path))return cache.get(path);const m={exports:{}};const js=ts.transpileModule(readFileSync(new URL('../src/'+path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;new Function('module','exports','require',js)(m,m.exports,stub);cache.set(path,m.exports);return m.exports;};
function stub(name){
 if(name==='react'||name==='react/jsx-runtime')return require(name);
 if(name.endsWith('.module.css'))return {default:new Proxy({},{get:(_,key)=>String(key)})};
 if(name==='next/link')return {default:({children,href,...props})=>React.createElement('a',{...props,href},children)};
 if(name==='next/image')return {default:({unoptimized,onError,...props})=>React.createElement('img',props)};
 const real={'@/lib/move-command-format':'lib/move-command-format.ts','@/lib/character-move-filter':'lib/character-move-filter.ts','@/lib/release-features':'lib/release-features.ts','@/components/character-move-explorer':'components/character-move-explorer.tsx','@/components/move-motion-media':'components/move-motion-media.tsx'};
 if(real[name])return load(real[name]);
 if(name==='@/lib/device-preview')return {isDevicePreviewRequest:()=>false,appendDevicePreviewToken:x=>x};
 if(name==='@/lib/public-copy')return {isInternalMoveNote:()=>false,normalizePublicCopy:x=>x};
 if(name==='@/lib/character-video-references')return {uniqueCharacterVideos:()=>[],characterVideoReferences:()=>[]};
 if(name==='@/lib/character-learning-structure')return {CHARACTER_VIDEO_GROUP_ORDER:[],CHARACTER_VIDEO_GROUP_LABELS:{}};
 if(name==='@/lib/event-media')return {formatVideoPublishedDate:x=>x};
 if(name==='@/lib/source-presentation')return {};
 const components={'@/components/character-game-guide':['CharacterGamePlan','CharacterRangeGuide'],'@/components/character-quick-start':['CharacterQuickStart'],'@/components/pilot-combo-card':['PilotComboCard'],'@/components/character-player-card':['CharacterPlayerCard'],'@/components/character-video-reference-card':['CharacterVideoReferenceCard'],'@/components/video-card':['VideoCard']};
 if(components[name])return Object.fromEntries(components[name].map(key=>[key,()=>null]));
 throw new Error('Unexpected import '+name);
}
const {CharacterDetailPilot}=load('components/character-detail-pilot.tsx');
const slugs=[...readFileSync(new URL('../src/lib/character-detail-route.ts',import.meta.url),'utf8').matchAll(/^  "([a-z-]+)",/gm)].map(x=>x[1]);
function render(slug,moves){return renderToStaticMarkup(React.createElement(CharacterDetailPilot,{characterSlug:slug,characterName:slug,previewToken:null,bundle:{moves,combos:[],setups:[],sequences:[],guideSections:[],matchups:[],training:[]},players:[],videos:[],sources:[],archetypeLabel:null,rangeLabel:null,difficulty:null,profile:{tagline:'test',winPath:'test',firstLesson:'test',strength:'test',weakness:'test',gameplan:[],ranges:[]}}));}
const categories=['normal','unique','target_combo','special','throw','super'];
const moves=categories.map((moveType,i)=>({id:'test-'+i,slug:'test-'+i,name:'テスト技'+i,moveType,status:'published',usageSummary:null,commands:[{scheme:'classic',commandText:'236LP'}],frame:{startup:'7',onHit:'+2',onBlock:'-3',damage:600,verificationStatus:'verified'}}));
test('shared card SSR keeps every required category and field with no-media fallback for all 31 slugs',()=>{
 assert.equal(slugs.length,31);
 for(const slug of slugs){const html=render(slug,moves);assert.equal((html.match(/<article/g)||[]).length,moves.length,slug);assert.equal((html.match(/動作映像は未掲載/g)||[]).length,moves.length,slug);for(const text of ['通常技','特殊技','必殺技','投げ','SA','発生','ヒット時','ガード時','ダメージ','600','↓↘→ + 弱P'])assert.ok(html.includes(text),slug+':'+text);}
});
test('existing video and GIF media render through the existing component without mandatory media on other cards',()=>{
 const media={id:'media',moveId:'test-0',mediaType:'video',mediaUrl:'/test.mp4',posterUrl:'/test.webp',sourceUrl:null,sourceLabel:null,status:'published'};
 const html=render('c-viper',[{...moves[0],media}]);assert.ok(html.includes('/test.mp4'));assert.ok(html.includes('preload="none"'));assert.ok(html.includes('/test.webp'));assert.ok(!html.includes('動作映像は未掲載'));
 const gif=render('sagat',[{...moves[0],media:{...media,mediaType:'gif',mediaUrl:'/test.gif'}}]);assert.ok(gif.includes('/test.gif'));
});

const releaseSnapshot=JSON.parse(readFileSync(new URL('../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json',import.meta.url),'utf8'));
test('generated DB fixtures SSR renders exact IDs, real commands and frame values for all 31 characters',()=>{
 for(const [slug,entry] of Object.entries(releaseSnapshot.characters)){
  const html=render(slug,entry.moves);
  assert.equal((html.match(/<article/g)||[]).length,entry.moves.length,slug);
  assert.equal((html.match(/DB収録データ・公開審査前/g)||[]).length,entry.moves.length,slug);
  for(const move of entry.moves){
   assert.ok(html.includes('data-move-id="'+move.id+'"'),slug+':'+move.slug);
   for(const field of ['startup','onHit','onBlock','damage']){
    const value=move.frame?.[field];
    if(value!==null&&value!==undefined&&value!=='')assert.ok(html.includes(String(value)),slug+':'+move.slug+':'+field);
   }
  }
  assert.equal((html.match(/動作映像は未掲載/g)||[]).length,entry.moves.length,slug);
 }
});

test('confirmed Elena media renders on the exact five cards while 67 others retain fallback',()=>{
 const confirmed=JSON.parse(readFileSync(new URL('../src/data/CONFIRMED_RELEASE_MEDIA_20261005.json',import.meta.url),'utf8'));
 const byId=new Map(confirmed.map(row=>[row.moveId,row]));
 const moves=releaseSnapshot.characters.elena.moves.map(move=>{
   const row=byId.get(move.id);
   return {...move,media:row?{id:'release-'+row.moveId,moveId:row.moveId,mediaType:'video',mediaUrl:row.mediaUrl,posterUrl:row.posterUrl,sourceUrl:null,sourceLabel:null,status:'draft',displayOrder:null}:null};
 });
 const html=render('elena',moves);
 assert.equal((html.match(/<article/g)||[]).length,72);
 assert.equal((html.match(/<video/g)||[]).length,5);
 assert.equal((html.match(/動作映像は未掲載/g)||[]).length,67);
 for(const row of confirmed)assert.ok(html.includes(row.mediaUrl)&&html.includes(row.posterUrl));
});
