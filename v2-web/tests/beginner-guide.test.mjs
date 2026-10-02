import assert from 'node:assert/strict';
import test from 'node:test';
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
test('eight pending media mappings render no empty slots, requests or fake playback controls', () => {
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
 media.beginnerMediaManifest.push({...clip,status:'approved_for_public'});
 try {
  const rendered = renderToStaticMarkup(React.createElement(mediaComponent.BeginnerMedia,{id:'impact'}));
  assert.match(rendered,/<video[^>]*controls=""/); assert.match(rendered,/preload="none"/);
  assert.match(rendered,/poster="\/media\/beginner\/beginner-drive-impact.webp"/);
  assert.match(rendered,/type="video\/mp4"/); assert.match(rendered,/<figcaption>/);
  assert.doesNotMatch(rendered,/autoplay|autoPlay/);
 } finally { media.beginnerMediaManifest.pop(); }
 assert.equal(renderToStaticMarkup(React.createElement(mediaComponent.BeginnerMedia,{id:'impact'})),'');
});
test('every installed beginner asset and poster exists and no manifest references character motion media', () => {
 assert.deepEqual(media.validateBeginnerMedia(media.beginnerMediaManifest),[]);
 for (const asset of media.beginnerMediaManifest) for (const url of [asset.mediaUrl,asset.posterUrl].filter(Boolean)) assert.ok(existsSync(resolve(root,'public',url.slice(1))),url);
});
