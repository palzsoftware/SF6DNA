import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url);
const fixture={id:'583a687e-c1f4-439d-ac6d-5bb3994549f1',slug:'official-ryu-character-guide',title:'Ryu guide',url:'https://www.youtube.com/watch?v=iAs1p3LVdAs',thumbnailUrl:'https://i.ytimg.com/vi/iAs1p3LVdAs/hqdefault.jpg',events:[],characters:['リュウ'],players:[],platform:'youtube',videoType:'official_guide',durationSeconds:null};
function load(preferences){
 const m={exports:{}};
 const overrides={
 'next/link':{__esModule:true,default:({children,...props})=>React.createElement('a',props,children)},
 './visual-icon':{VisualIcon:()=>null},
 '@/lib/video-presentation':{videoPresentationUrl:value=>typeof value==='string'&&value.startsWith('https://')?value:null},
 '@/lib/video-library':{formatVideoDuration:()=>null,VIDEO_CATEGORY_LABELS:{}},
 '@/lib/use-owned-video-preferences':{useOwnedVideoPreferences:()=>preferences},
 };
 const js=ts.transpileModule(readFileSync(new URL('../src/components/video-card.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 new Function('module','exports','require',js)(m,m.exports,n=>n==='react'?{...React,useState:x=>[x,()=>{}]}:n in overrides?overrides[n]:require(n));
 return m.exports.VideoCard;
}
function nodes(value){if(Array.isArray(value))return value.flatMap(nodes);if(!React.isValidElement(value))return [];return [value,...nodes(value.props.children)];}
test('shared card thumbnail opens YouTube and offers favorite, watched and share actions',async()=>{
 const calls=[];const Card=load({status:'ready',favorites:new Set(),watched:new Set(),message:'',toggle:(...args)=>{calls.push(args);return true;}});
 const tree=Card({video:fixture,publishedDate:null});const ns=nodes(tree);
 const thumbnail=ns.find(n=>n.props.className==='video-card__thumbnail');assert.equal(thumbnail.props.href,fixture.url);assert.equal(thumbnail.props.target,'_blank');
 const buttons=ns.filter(n=>n.type==='button');assert.equal(buttons.length,3);
 buttons.find(n=>n.props['aria-label']?.endsWith('お気に入りに追加')).props.onClick();buttons.find(n=>n.props.children==='視聴済みにする').props.onClick();
 assert.deepEqual(calls,[['favorite',fixture.id],['watched',fixture.id]]);
 const original=Object.getOwnPropertyDescriptor(globalThis,'navigator');let shared;
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{share:async value=>{shared=value;}}});
 try{buttons.find(n=>n.props.children==='共有').props.onClick();await Promise.resolve();assert.equal(shared.url,fixture.url);}finally{if(original)Object.defineProperty(globalThis,'navigator',original);else delete globalThis.navigator;}
 const html=renderToStaticMarkup(tree);assert.ok(html.includes('お気に入り'));assert.ok(html.includes('視聴済みにする'));
});
test('shared card keeps owner-not-ready preference actions disabled',()=>{
 const Card=load({status:'loading',favorites:new Set(),watched:new Set(),message:'',toggle:()=>{throw Error('must not write');}});
 const buttons=nodes(Card({video:fixture,publishedDate:null})).filter(n=>n.type==='button');
 assert.equal(buttons.filter(n=>n.props.disabled).length,2);
});
