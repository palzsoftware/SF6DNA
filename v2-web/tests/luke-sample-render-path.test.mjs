import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const fs=require('node:fs'),path=require('node:path');
const app=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),ts=require('typescript');
const fixtureCharacters=[];
function loader(sourceRoot, extra = {}){
 const cache=new Map(),css=[],modules=new Set();let state='filled';
 const adapters={
  'react':React,'react/jsx-runtime':require(path.join(app,'node_modules/react/jsx-runtime')),
  'next/link':{__esModule:true,default:({href,children,...props})=>React.createElement('a',{href,...props},children)},
  'next/image':{__esModule:true,default:({priority,unoptimized,fill,onError,src,...props})=>React.createElement('img',{...props,src:typeof src==='string'?'qa-character.svg':src})},
  '@/lib/characters':{listCharacters:async()=>{if(state==='error')throw Error('QA unavailable, must not leak');return state==='empty'?[]:fixtureCharacters}},
  '@/lib/supabase/client':{getSupabaseBrowserClient:()=>{throw Error('No DB allowed in layout QA')}},
  '@/lib/event-media':{formatVideoPublishedDate:v=>v},
  'server-only':{}, ...extra,
 };
 function find(p){for(const f of [p,p+'.ts',p+'.tsx',p+'.mjs',p+'.json'])if(fs.existsSync(f)&&fs.statSync(f).isFile())return f;throw Error('Missing '+p)}
 function load(input){
  const f=find(input);if(cache.has(f))return cache.get(f).exports;
  const m={exports:{}};cache.set(f,m);modules.add(path.relative(sourceRoot,f));
  if(f.endsWith('.json')){m.exports={__esModule:true,default:JSON.parse(fs.readFileSync(f,'utf8'))};return m.exports}
  if(f.endsWith('.module.css')){
   const raw=fs.readFileSync(f,'utf8'),prefix='qa-'+path.basename(f,'.module.css')+'__';
   const keys=[...new Set([...raw.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(x=>x[1]))];
   m.exports={__esModule:true,default:Object.fromEntries(keys.map(k=>[k,prefix+k]))};
   css.push(raw.replace(/:global\(([^)]+)\)/g,'$1').replace(/\.([a-zA-Z_][\w-]*)/g,(_,k)=>'.'+prefix+k));return m.exports;
  }
  const js=ts.transpileModule(fs.readFileSync(f,'utf8'),{fileName:f.replace(/\.mjs$/,'.js'),compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,allowJs:true}}).outputText;
  new Function('module','exports','require',js)(m,m.exports,name=>{
   if(name in adapters)return adapters[name];
   if(name.startsWith('@/'))return load(path.join(sourceRoot,'src',name.slice(2)));
   if(name.startsWith('.'))return load(path.resolve(path.dirname(f),name));
   return require(require.resolve(name,{paths:[path.join(app,'node_modules')]}));
  });return m.exports;
 }
 return {load,state:v=>{state=v},css,modules};
}

const character={id:'qa-luke',slug:'luke',name:'ルーク',nameEn:'LUKE',shortDescription:'表示検証',imageUrl:null,difficulty:2,rangeLabel:'中距離',archetypeLabel:'スタンダード',strengthsSummary:'既存本文',weaknessesSummary:'既存本文',guideSections:[],sources:[]};
function setup(slug){return loader(app,{
 'next/headers':{headers:async()=>new Headers({host:'localhost'})},
 '@/components/auto-youtube-videos':{AutoYouTubeVideos:()=>null,AutoVideoLoading:()=>null},
 '@/lib/characters':{getCharacterBySlug:async()=>({...character,slug}),listCharacters:async()=>[]},
 '@/lib/character-sections':{listCharacterSectionItems:async()=>[]},
 '@/lib/event-media':{listVideos:async()=>[],formatVideoPublishedDate:v=>v},
 '@/lib/players':{getPlayerBySlug:async()=>null},
 '@/lib/character-detail-data':{resolveCharacterDetailData:async()=>({bundle:null,source:'test'}),resolveCharacterRelatedVideos:()=>[]},
 '@/lib/device-preview':{normalizeDevicePreviewToken:()=>null,getDevicePreviewMoveMotionMedia:async()=>[],appendDevicePreviewToken:p=>p},
 '@/lib/character-unified-evidence':{characterUnifiedEvidence:async()=>({})},
 '@/lib/official-txt-character-page-connection.mjs':{isWs5LocalCardRequest:()=>false},
});}
async function renderRoute(env,sample,slug='luke'){
 const prior=process.env.VERCEL_ENV;
 try { process.env.VERCEL_ENV=env;
  const l=setup(slug),Page=l.load(path.join(app,'src/app/characters/[slug]/page.tsx')).default;
  return renderToStaticMarkup(await Page({params:Promise.resolve({slug}),searchParams:Promise.resolve({sample})}));
 } finally {if(prior===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=prior;}
}
for(const env of ['preview','development']) for(const sample of [undefined,'luke','invalid',['luke']]) {
 test(`${env} ${JSON.stringify(sample)} renders one existing combo through actual route and common component`,async()=>{
  const html=await renderRoute(env,sample);
  assert.equal((html.match(/<h3(?: [^>]*)?>しゃがみ中K始動・キャンセルラッシュ<\/h3>/g)||[]).length,1);
  assert.ok(html.includes('/media/qa/luke/combo-clean-20261011.mp4'));
  assert.ok(!html.includes('combo-reference.mp4'));
  assert.equal(html.includes('id="luke-sample-cards"'),sample==='luke');
  assert.ok(html.includes('別録画'));
  const comboIndex=html.indexOf('id="combo-luke-crmk-rush-20261011"');
  assert.ok(comboIndex>html.indexOf('id="pilot-combos"'));
  assert.ok(comboIndex<html.indexOf('id="pilot-setplay"'));
  assert.equal((html.match(/data-combo-id=/g)||[]).length,1);
  assert.ok(html.indexOf('aria-label="コンボの数値と終了状況"')<html.indexOf('コンボの説明'));
  assert.ok(html.includes('<svg'));
  for(const id of ['pilot-moves','character-players','character-videos','sources'])assert.ok(html.includes(`id="${id}"`),id);
 });
}
for(const sample of [undefined,'luke'])test(`production hides sample ${sample}`,async()=>{
 const html=await renderRoute('production',sample);
 assert.ok(!html.includes('qa-sample:luke'));
 assert.ok(!html.includes('/media/qa/luke/'));
 assert.ok(!html.includes('id="luke-sample-cards"'));
});
test('other character cannot receive Luke sample',async()=>{
 const html=await renderRoute('preview','luke','ryu');
 assert.ok(!html.includes('qa-sample:luke'));
 assert.ok(!html.includes('/media/qa/luke/'));
});

for(const [env,slug,expected] of [['production','luke',false],['unknown','luke',false],['preview','ryu',false],['preview','luke',true]]) test(`common outlet gate ${env}/${slug}`,()=>{
 const prior=process.env.VERCEL_ENV;
 try{process.env.VERCEL_ENV=env;
 const l=setup(slug),Component=l.load(path.join(app,'src/components/character-unified-page.tsx')).CharacterUnifiedPage;
 const html=renderToStaticMarkup(React.createElement(Component,{character:{...character,slug},bundle:null,players:[],videos:[],showPreferences:false,localReferences:React.createElement('aside',{'data-local-probe':'yes'},'local probe')}));
 assert.equal(html.includes('data-local-probe="yes"'),expected);
 }finally{if(prior===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=prior;}
});
