import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const cache = new Map();
function load(path) {
 const file = resolve(root, path);
 if (cache.has(file)) return cache.get(file);
 if (file.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, name) => String(name) }) };
 const source = readFileSync(file, 'utf8');
 const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
 const m = { exports: {} };
 new Function('module','exports','require',js)(m,m.exports,(name) => {
  if (name === 'next/image') return { __esModule: true, default: (props) => React.createElement('img', props) };
  if (name === 'next/link') return { __esModule: true, default: ({ children, href, ...props }) => React.createElement('a', { href, ...props }, children) };
  if (name.startsWith('@/')) return load(`src/${name.slice(2)}.tsx`);
  if (name.startsWith('.')) return load(resolve(dirname(file), name.endsWith('.css') ? name : `${name}${existsSync(resolve(dirname(file), `${name}.tsx`)) ? '.tsx' : '.ts'}`));
  return require(name);
 });
 cache.set(file,m.exports); return m.exports;
}
const route = load('src/app/beginner/page.tsx');
const html = renderToStaticMarkup(React.createElement(route.default));
const source = readFileSync(resolve(root,'src/app/beginner/page.tsx'),'utf8');
const content = readFileSync(resolve(root,'src/app/beginner/content.ts'),'utf8');
const css = readFileSync(resolve(root,'src/app/beginner/page.module.css'),'utf8');

test('beginner route SSR has one h1, grouped headings and twelve uniquely identified steps', () => {
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 assert.equal((html.match(/<h3>/g)||[]).length,12);
 const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(ids.length,new Set(ids).size);
 for (const id of ['move','guard','normal','throw','anti-air','impact','parry','rush','cancel-rush','super','combo','wakeup']) assert.ok(ids.includes(id),id);
 assert.match(route.metadata.title,/スト6を始めたら/);
 assert.ok(route.metadata.description.length>20);
});
test('every page jump resolves; core destination links use existing routes rather than gated combo pages', () => {
 const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
 for (const [,id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(id),id);
 for (const path of ['/diagnosis','/me/training','/characters']) { assert.ok(html.includes(`href="${path}"`)); assert.ok(existsSync(resolve(root,`src/app${path}/page.tsx`))); }
 assert.doesNotMatch(html,/href="\/(combos|setups|coach|training)(?:\/|\")/);
});
test('DI, DR and CDR remain distinct and cancel restrictions survive rendering', () => {
 assert.match(html,/data-system="DI"/); assert.match(html,/data-system="DR"/); assert.match(html,/data-system="CDR"/);
 assert.match(html,/すべての通常技で使えるわけではありません/);
 assert.match(html,/パリィからのラッシュよりDriveゲージを多く使います/);
 assert.match(html,/動ける状態で/);
});
test('preview-only captures render no empty slots or media in the non-preview fallback', () => {
 assert.equal((html.match(/data-media-slot=/g)||[]).length,0);
 assert.doesNotMatch(html,/<(video|source|iframe|img)\b|src=""|autoplay|<button\b/);
 assert.match(css,/\.gameplayMedia/);
});
test('system disclosures start closed, remain native keyboard controls, and glossary stays short', () => {
 assert.equal((html.match(/<details\b/g)||[]).length,6);
 assert.doesNotMatch(html,/<details[^>]*\bopen[=> ]/);
 assert.equal((html.match(/<dt>/g)||[]).length,7);
 assert.match(css,/min-height: 68px/);
 assert.match(css,/:focus-visible/);
 assert.match(css,/prefers-reduced-motion: reduce/);
});
test('tutorial contains no invented character recipe, numeric frames/damage or shared publication changes', () => {
 assert.doesNotMatch(content,/リュウ|ルーク|JP|昇龍|波動拳|\d+F|\d+ダメージ|verified|published/);
 assert.match(content,/ゲーム内コンボトライアル/);
 assert.match(content,/ガードも投げには負けます/);
 assert.match(content,/投げ抜けができるのは通常投げ/);
 assert.doesNotMatch(source,/supabase|localStorage|useEffect|useState|fetch\(|use client/);
});
test('responsive layout uses shrinkable tracks and local wrapping rather than hiding document overflow', () => {
 assert.match(css,/minmax\(0,1fr\)/);
 assert.match(css,/overflow-wrap: anywhere/);
 assert.match(css,/@media \(max-width: 720px\)/);
 assert.match(css,/@media \(max-width: 360px\)/);
 assert.doesNotMatch(css,/width:\s*100vw|overflow-x:\s*(hidden|clip)|min-width:\s*\d{3,}px/);
});
test('source links are explicit external references with safe new-tab semantics', () => {
 const links = [...html.matchAll(/<a[^>]*href="(https:[^"]+)"[^>]*>/g)]; assert.equal(links.length,3);
 for (const [tag,url] of links) { assert.match(tag,/rel="noopener noreferrer"/); assert.ok(/capcom\.com|streetfighter\.com|capcomusa\.com/.test(new URL(url).hostname)); }
});

const media = load('src/app/beginner/media-manifest.ts');
const mediaComponent = load('src/app/beginner/media.tsx');
const clip = { id: 'impact', tutorialStep: 'impact', mediaType: 'video', mediaUrl: '/media/beginner/beginner-drive-impact.mp4', posterUrl: '/media/beginner/beginner-drive-impact.webp', width: 960, height: 540, alt: 'ドライブインパクトの実演', caption: 'ユーザー撮影の操作例', source: 'USER_CAPTURED_GAMEPLAY', status: 'approved_for_preview' };
test('beginner manifest rejects duplicate ids, wrong DI/DR/CDR mapping and unsafe paths', () => {
 assert.deepEqual(media.validateBeginnerMedia([clip]), []);
 for (const change of [{tutorialStep:'rush'}, {mediaUrl:'https://example.com/video.mp4'}, {posterUrl:undefined}, {width:0}, {mediaType:'image',mediaUrl:'/media/beginner/demo.gif'}, {status:'unknown'}, {alt:''}]) assert.ok(media.validateBeginnerMedia([{...clip,...change}]).length);
 assert.ok(media.validateBeginnerMedia([clip,clip]).some(x=>x.startsWith('duplicate:')));
 assert.deepEqual(media.beginnerMediaIds, ['guard','anti-air','impact','parry','rush','cancel-rush','super','combo']);
});
test('draft and preview captures cannot auto-promote to production; unknown or corrupt manifests fail closed', () => {
 assert.equal(media.resolveBeginnerMedia('impact','production',[clip]),null);
 assert.equal(media.resolveBeginnerMedia('impact',undefined,[clip]),null);
 assert.equal(media.resolveBeginnerMedia('impact','preview',[{...clip,status:'draft'}]),null);
 assert.equal(media.resolveBeginnerMedia('rush','preview',[clip]),null);
 assert.equal(media.resolveBeginnerMedia('impact','preview',[clip,clip]),null);
 assert.equal(media.resolveBeginnerMedia('impact','preview',[clip]),clip);
 assert.ok(media.resolveBeginnerMedia('impact','production',[{...clip,status:'approved_for_public'}]));
});
test('approved clip SSR retains pause controls, poster and no eager load or autoplay under any motion preference', () => {
 const original = [...media.beginnerMediaManifest];
 media.beginnerMediaManifest.splice(0, media.beginnerMediaManifest.length, {...clip,status:'approved_for_public'});
 try {
  const rendered = renderToStaticMarkup(React.createElement(mediaComponent.BeginnerMedia,{id:'impact'}));
  assert.match(rendered,/<video[^>]*controls=""/); assert.match(rendered,/preload="none"/);
  assert.match(rendered,/poster="\/media\/beginner\/beginner-drive-impact.webp"/);
  assert.match(rendered,/type="video\/mp4"/); assert.match(rendered,/<figcaption>/);
  assert.doesNotMatch(rendered,/autoplay|autoPlay/);
 } finally { media.beginnerMediaManifest.splice(0,media.beginnerMediaManifest.length,...original); }
 assert.equal(renderToStaticMarkup(React.createElement(mediaComponent.BeginnerMedia,{id:'impact'})),'');
});
test('every installed beginner asset and poster exists and no manifest references character motion media', () => {
 assert.deepEqual(media.validateBeginnerMedia(media.beginnerMediaManifest),[]);
 for (const asset of media.beginnerMediaManifest) for (const url of [asset.mediaUrl,asset.posterUrl].filter(Boolean)) assert.ok(existsSync(resolve(root,'public',url.slice(1))),url);
});

test('eight user clips map each tutorial step to distinct local video and poster paths', () => {
 assert.equal(media.beginnerMediaManifest.length,8);
 assert.deepEqual(new Set(media.beginnerMediaManifest.map(x=>x.id)),new Set(media.beginnerMediaIds));
 assert.equal(new Set(media.beginnerMediaManifest.map(x=>x.mediaUrl)).size,8);
 assert.equal(new Set(media.beginnerMediaManifest.map(x=>x.posterUrl)).size,8);
 for(const asset of media.beginnerMediaManifest){assert.equal(asset.status,'approved_for_preview');assert.equal(media.resolveBeginnerMedia(asset.id,'preview'),asset);assert.equal(media.resolveBeginnerMedia(asset.id,'production'),null);}
 for(const [id,file] of [['impact','drive-impact'],['rush','drive-rush'],['cancel-rush','cancel-drive-rush']]) assert.equal(media.resolveBeginnerMedia(id,'preview').mediaUrl,`/media/beginner/beginner-${file}.mp4`);
});
test('Preview tutorial SSR renders eight native players; missing and unknown media still collapse safely',()=>{
 const old=process.env.VERCEL_ENV;process.env.VERCEL_ENV='preview';
 try {const page=renderToStaticMarkup(React.createElement(route.default));assert.equal((page.match(/<video\b/g)||[]).length,8);assert.equal((page.match(/preload="none"/g)||[]).length,8);assert.doesNotMatch(page,/autoplay|autoPlay/);assert.equal(renderToStaticMarkup(React.createElement(mediaComponent.BeginnerMedia,{id:'unknown'})),'');}
 finally {if(old===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=old;}
});

test('reviewed tutorial videos and posters retain distinct inspected content identities',()=>{
 const expected={"guard": ["07f8a27083833eec23be86f11875b1da7d0c2e295ebb096023d0196077f92578", "a18a97be0315806282ae6426d929cfbfc998225fca6d7680f14f3d37eca19cfb"], "anti-air": ["d72dba13efcfdc93e91179875aac987ea746d381125d27f67c5cd354c5633a87", "c011d3d9b08b90304dfd52a0905bff903871878c75c26da0cbc3342bfd82fab4"], "impact": ["7a66bfd8dfcb4549cc891b6ac18b0bf5621ffb9f0dab070acf608385bb8b4d28", "4618164c5cf2bfa4618745ef677af807998addd518f9dccaa6893ad3ae6badd4"], "parry": ["7a5f1d982d0b15d795e9ffdbc779106118322bff7a72688622a5ef0724bc84f6", "41d8418af7e6abb2ccab262c0b7308ad7f2980163edf2e900050cc1e97c804ef"], "rush": ["68413e3b94a34958ee0d88305ea4cb79fe5e36131aa7018166a8a6bee66a10de", "6d8960ded65ab33d1425a8cd8b7b5093f6585d6e4372e1890e93e5457804bcfa"], "cancel-rush": ["22433b679a5d7b08c897d46680e328fd708adfe51e5e67b5f16ee68e586cf8ab", "8f2a16f32e4054d478e33058b64b51bbb80283864414e9ff5c3412def4b234df"], "super": ["80e1db9876ef84a6c858f2120849dd143914c85cf0173937fefd4a0885e64382", "7dae7d0ebe846cea3f1d83917a186533dd67d114a3763360e4c7b67dbac57e61"], "combo": ["b4876f9e5a310202a19ef2303ee6676a00cf4c61be0dac37c791abd41b19b793", "0a418867e3d51ede2ddeafeaf9a66557f4e615c92f94207bf92f2cde1f56142b"]};
 for(const asset of media.beginnerMediaManifest){for(const [index,url] of [asset.mediaUrl,asset.posterUrl].entries()){const bytes=readFileSync(resolve(root,'public',url.slice(1)));assert.ok(bytes.length>0);assert.equal(createHash('sha256').update(bytes).digest('hex'),expected[asset.id][index]);}}
});
