import {createHash} from "node:crypto";
import * as relatedContract from "../src/lib/character-related-video-contract.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const req=createRequire(import.meta.url);
function load(path){
 const m={exports:{}};
 const js=ts.transpileModule(readFileSync(new URL('../src/'+path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 new Function('module','exports','require',js)(m,m.exports,n=>{
 if(n.endsWith('character-related-video-contract.mjs'))return relatedContract;
 if(n.endsWith('.module.css'))return {__esModule:true,default:new Proxy({},{get:(_,key)=>String(key)})};
 if(n==='next/link')return {__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};
 if(n==='./video-card')return {VideoCard:({video})=>React.createElement('article',{'data-shared-card':video.id},video.title)};
 if(n.startsWith('@/lib/'))return load('lib/'+n.slice(6)+'.ts');
 if(n.startsWith('./'))return load('lib/'+n.slice(2)+'.ts');return req(n);
 });return m.exports;
}
const {groupCharacterVideos}=load('lib/character-video-categories.ts');
const row=(id,fields={})=>({id,slug:id,title:'MR2000 プラチナ ダイヤ 初心者 コンボ',url:'https://www.youtube.com/watch?v='+createHash('sha256').update(id).digest('base64url').slice(0,11),level:'unknown',categories:[],videoType:'guide',players:[],events:[],characters:[],...fields});
test('structured difficulty is used, title alone remains pending',()=>{
 const {groups,unclassified}=groupCharacterVideos([row('b',{level:'beginner'}),row('i',{level:'intermediate'}),row('a',{categories:['counter']}),row('u')]);
 assert.deepEqual(groups.beginner.map(v=>v.id),['b']);assert.deepEqual(groups.intermediate.map(v=>v.id),['i']);assert.deepEqual(groups.advanced.map(v=>v.id),['a']);assert.deepEqual(unclassified.map(v=>v.id),['u']);
});
test('replays require registered player identity; tournament archives are accepted',()=>{
 const {groups,unclassified}=groupCharacterVideos([row('t',{videoType:'tournament'}),row('r',{videoType:'replay',entityRefs:{players:[{id:'p',label:'登録選手'}],characters:[],tournaments:[]}}),row('u',{videoType:'replay',players:['名前だけ']})]);assert.deepEqual(groups.match.map(v=>v.id),['t','r']);assert.equal(unclassified[0].id,'u');
});
test('unsafe URLs and duplicate IDs are rejected without source mutation',()=>{
 const videos=[row('b',{level:'beginner'}),row('b',{level:'beginner'}),row('bad',{url:'javascript:alert(1)'}),row('x',{url:'https://example.com'})];const before=structuredClone(videos);assert.equal(groupCharacterVideos(videos).groups.beginner.length,1);assert.deepEqual(videos,before);
});
test('all four rails preserve every card and unknown metadata stays visible',()=>{
 const {CharacterRelatedVideos}=load('components/character-related-videos.tsx');
 const videos=['beginner','intermediate','advanced','match'].flatMap(kind=>Array.from({length:4},(_,i)=>row(`${kind}-${i}`,kind==='match'?{videoType:'tournament'}:{level:kind}))).concat(row('u'));
 const html=renderToStaticMarkup(React.createElement(CharacterRelatedVideos,{videos,state:'SUCCESS_WITH_RESULTS'}));for(const label of ['初心者用','中級者用','上級者用','対戦動画'])assert.ok(html.includes(label));assert.equal((html.match(/data-shared-card=/g)||[]).length,17);assert.equal((html.match(/tabindex="0"/g)||[]).length,5);assert.ok(html.includes('分類確認中'));
});
test('retrieval failure is visible; empty categories do not fabricate videos',()=>{
 const {CharacterRelatedVideos}=load('components/character-related-videos.tsx');const html=renderToStaticMarkup(React.createElement(CharacterRelatedVideos,{videos:[],state:'API_ERROR'}));assert.ok(html.includes('role="alert"'));assert.ok(html.includes('取得に失敗'));assert.equal((html.match(/このカテゴリで表示できる動画はまだありません/g)||[]).length,4);
});
