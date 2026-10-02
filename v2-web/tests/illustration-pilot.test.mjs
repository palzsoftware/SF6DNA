import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const nodeRequire = createRequire(import.meta.url);
function load(file, overrides={}) {
  const mod={exports:{}};
  const js=ts.transpileModule(readFileSync(new URL(`../src/${file}`,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  new Function('module','exports','require',js)(mod,mod.exports,name=>{
    if(name in overrides)return overrides[name];
    if(name.startsWith('@/lib/'))return load(`lib/${name.slice(6)}.ts`,overrides);
    if(name.startsWith('@/components/'))return load(`components/${name.slice(13)}.tsx`,overrides);
    if(name.endsWith('.module.css'))return {default:new Proxy({},{get:(_,key)=>key}),__esModule:true};
    return nodeRequire(name);
  });return mod.exports;
}
const api=load('lib/illustration-pilot.ts');
test('derivative pilot only permits three known slugs in Preview; all other environments fail closed',()=>{
  for(const environment of ['production','development','',undefined])for(const slug of ['jp','ryu','luke']) assert.equal(api.getPilotIllustration(slug,environment),null);
  for(const slug of ['ken','../jp','constructor','__proto__'])assert.equal(api.getPilotIllustration(slug,'preview'),null);
  for(const slug of ['jp','ryu','luke'])assert.equal(api.getPilotIllustration(slug,'preview').rightsStatus,'UNVERIFIED_FOR_PRODUCTION');
});
test('asset handler denies Production before filesystem access and serves only image bytes in Preview',async()=>{
  let reads=0;const before=process.env.VERCEL_ENV;const oldUrl=process.env.VERCEL_URL;process.env.VERCEL_URL="example.test";
  const route=load('app/api/illustration-pilot/[slug]/route.ts',{'node:fs/promises':{readFile:async()=>{reads++;return Buffer.from('webp');}}});
  try{
    process.env.VERCEL_ENV='production';let res=await route.GET(new Request('https://example.test'),{params:Promise.resolve({slug:'jp'})});assert.equal(res.status,404);assert.equal(reads,0);assert.match(res.headers.get('cache-control'),/no-store/);
    process.env.VERCEL_ENV='preview';res=await route.GET(new Request('https://example.test'),{params:Promise.resolve({slug:'jp'})});assert.equal(res.status,200);assert.equal(res.headers.get('content-type'),'image/webp');assert.equal(reads,1);
    const promoted=await route.GET(new Request('https://production.example'),{params:Promise.resolve({slug:'jp'})});assert.equal(promoted.status,404);assert.equal(reads,1);
    res=await route.GET(new Request('https://example.test'),{params:Promise.resolve({slug:'../jp'})});assert.equal(res.status,404);assert.equal(reads,1);
  }finally{if(before===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=before;if(oldUrl===undefined)delete process.env.VERCEL_URL;else process.env.VERCEL_URL=oldUrl;}
});
test('Quick Start adds a decorative lazy guide only in Preview and preserves anchors and Daily15',()=>{
 const before=process.env.VERCEL_ENV;
 const {CharacterQuickStart}=load('components/character-quick-start.tsx',{'next/image':{default:props=>React.createElement('img',{src:props.src,alt:props.alt,width:props.width,height:props.height,loading:props.loading}),__esModule:true},'next/link':{default:props=>React.createElement('a',props),__esModule:true}});
 try{process.env.VERCEL_ENV='preview';for(const slug of ['jp','ryu','luke']){const html=renderToStaticMarkup(React.createElement(CharacterQuickStart,{characterSlug:slug}));assert.match(html,new RegExp(`src="/api/illustration-pilot/${slug}"`));assert.match(html,/alt=""/);assert.match(html,/loading="lazy"/);assert.equal([...html.matchAll(/href="#/g)].length,5);assert.match(html,/href="\/me\/training"/);}
 process.env.VERCEL_ENV='production';assert.doesNotMatch(renderToStaticMarkup(React.createElement(CharacterQuickStart,{characterSlug:'jp'})),/illustration-pilot/);
 }finally{if(before===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=before;}
});
test('three optimized pilot assets are distinct valid WebP files outside public',()=>{
 const hashes=new Set();for(const slug of ['jp','ryu','luke']){const bytes=readFileSync(new URL(`../src/data/illustration-pilot/${slug}.webp`,import.meta.url));assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');assert.ok(bytes.length>0);hashes.add(createHash('sha256').update(bytes).digest('hex'));}assert.equal(hashes.size,3);
});
test('original mini illustrations keep decorative semantics and no animation or image download',()=>{
 const {MiniIllustration}=load('components/mini-illustration.tsx');for(const kind of ['training','saved','history']){const html=renderToStaticMarkup(React.createElement(MiniIllustration,{kind}));assert.match(html,/aria-hidden="true"/);assert.match(html,/focusable="false"/);assert.doesNotMatch(html,/<img|<animate|<script/);}
});
