import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';
const require=createRequire(import.meta.url),root=new URL('../../src/',import.meta.url),cache=new Map();
export const roster=JSON.parse(fs.readFileSync(new URL('../../src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json',import.meta.url))).characters;
export function loadSource(relative){
 const full=path.resolve(fileURLToPath(root),relative);
 if(!full.startsWith(path.resolve(fileURLToPath(root))+path.sep))throw new Error('Source boundary');
 const file=[full,full+'.ts',full+'.tsx',full+'.json'].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());
 if(!file)throw new Error('Missing source '+relative);
 if(cache.has(file))return cache.get(file);
 if(file.endsWith('.json'))return {__esModule:true,default:JSON.parse(fs.readFileSync(file,'utf8'))};
 const loaded={exports:{}};cache.set(file,loaded.exports);
 const output=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 new Function('module','exports','require',output)(loaded,loaded.exports,name=>{
  if(name.endsWith('.css'))return {__esModule:true,default:new Proxy({},{get:(_,k)=>String(k)})};
  if(name==='next/link')return {__esModule:true,default:({children,href,...props})=>React.createElement('a',{href,...props},children)};
  if(name==='next/image')return {__esModule:true,default:({priority,unoptimized,fill,onError,...props})=>React.createElement('img',props)};
  if(name==='@/lib/event-media')return {formatVideoPublishedDate:v=>v};
  if(name==='@/components/video-card')return {VideoCard:({video})=>React.createElement('article',{'data-video-id':video.id},video.title)};
  if(name==='@/components/character-player-card')return {CharacterPlayerCard:({player})=>React.createElement('article',{'data-player-id':player.id},player.displayName)};
  if(name.startsWith('@/'))return loadSource(name.slice(2));
  if(name.startsWith('.'))return loadSource(path.relative(fileURLToPath(root),path.resolve(path.dirname(file),name)));
  return require(name);
 });return loaded.exports;
}
export function character(slug,overrides={}){return {id:roster[slug].characterId,slug,name:slug,nameEn:null,shortDescription:null,imageUrl:null,difficulty:null,rangeLabel:null,archetypeLabel:null,releaseDate:null,updatedAt:null,strengthsSummary:null,weaknessesSummary:null,guideSections:[],sources:[],...overrides};}
export function bundle(moves=[],overrides={}){return {guideSections:[],moves,combos:[],setups:[],sequences:[],matchups:[],training:[],...overrides};}
export function renderUnified(slug,props={}){return renderToStaticMarkup(React.createElement(loadSource('components/character-unified-page').CharacterUnifiedPage,{character:character(slug),bundle:bundle(),players:[],videos:[],...props}));}
export function assertUniqueAnchors(assert,html){const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);for(const href of [...html.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]))assert.equal(ids.filter(id=>id===href).length,1,href);}
export function assertQuarterCirclePunch(assert,html){
 // This is the explicit accessible motion sequence for 236 + generic P.
 // SVG icons need not place literal arrow characters in visible HTML text.
 assert.match(html,/role="img"[^>]*aria-label="[^"]*下[^"]*右下[^"]*右[^"]*パンチ[^"]*"/);
 assert.doesNotMatch(html,/>\s*236P\s*</);
}
