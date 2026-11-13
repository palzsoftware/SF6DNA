import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = new URL('../', import.meta.url);
const path = name => new URL(name, root);
const elements = (type, props) => ({type, props:props??{}});
const jsx = {jsx:elements,jsxs:elements};
function compile(name, modules) {
 const source=fs.readFileSync(path(name),'utf8');
 const code=ts.transpileModule(source,{fileName:name,compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
 const result={exports:{}};
 const fakeRequire=id=>id==='react/jsx-runtime'?jsx:id==='react'?modules.react:id.endsWith('.module.css')?{__esModule:true,default:new Proxy({},{get:(_,prop)=>String(prop)})}:modules[id]??(()=>{throw Error('Unknown import '+id)})();
 new Function('require','module','exports',code)(fakeRequire,result,result.exports);
 return result.exports;
}
function renderTree(node){
 if(node==null||typeof node==='boolean')return '';
 if(typeof node==='string'||typeof node==='number')return String(node);
 if(Array.isArray(node))return node.map(renderTree).join(' ');
 if(typeof node.type==='function')return renderTree(node.type(node.props));
 return `<${node.type}>${renderTree(node.props.children)}</${node.type}>`;
}
function all(node,tag){let result=[];const walk=x=>{if(!x||typeof x!=='object')return;if(Array.isArray(x)){x.forEach(walk);return;}if(x.type===tag)result.push(x);walk(x.props?.children)};walk(node);return result}
const search=await import('../src/lib/strategy-card-search.mjs');
function instance(kind, items){
 const state=[];let cursor=0;
 const react={useId:()=>`field-${kind}`,useState:initial=>{const slot=cursor++;if(!(slot in state))state[slot]=initial;return[state[slot],next=>state[slot]=next]},useMemo:fn=>fn()};
 const {StrategyCardExplorer}=compile('src/components/strategy-card-explorer.tsx',{react,'@/lib/strategy-card-search.mjs':search});
 return {render:()=>{cursor=0;return StrategyCardExplorer({kind,items})},state};
}
const fixtures=[
 {id:'combo1',kind:'combo',title:'SA3サンプル',category:'sa',driveCost:3,saCost:3,searchTerms:['強昇龍拳'],content:'combo card'},
 {id:'combo2',kind:'combo',title:'ノーゲージ',driveCost:0,saCost:0,content:'gauge free'},
 {id:'setup1',kind:'setplay',title:'安全飛び検証用',searchTerms:['画面端','F式'],content:'setplay card'},
 {id:'seq1',kind:'sequence',title:'固め検証用',searchTerms:['暴れ潰し'],content:'sequence card'},
 {id:'counter1',kind:'counter',title:'相手技対策検証用',searchTerms:['百鬼'],content:'counter card'},
];
test('4 isolated sections render cards, counts, and independent search',()=>{
 const sessions=Object.fromEntries(['combo','setplay','sequence','counter'].map(kind=>[kind,instance(kind,fixtures.filter(x=>x.kind===kind))]));
 for(const kind of Object.keys(sessions)){const html=renderTree(sessions[kind].render());assert.match(html,/<input>/);assert.match(html,/検索結果/);assert.match(html,/<div>/);assert.ok(html.includes('card'));}
 const combo=sessions.combo;const input=all(combo.render(),'input')[0];input.props.onChange({target:{value:'SA3'}});
 assert.match(renderTree(combo.render()),/combo card/);assert.doesNotMatch(renderTree(combo.render()),/gauge free/);
 assert.match(renderTree(sessions.setplay.render()),/setplay card/);
 assert.match(renderTree(sessions.sequence.render()),/sequence card/);
 assert.match(renderTree(sessions.counter.render()),/counter card/);
});
test('zero results and gauge-free only confirmed 0/0',()=>{
 const combo=instance('combo',fixtures.filter(x=>x.kind==='combo'));
 all(combo.render(),'input')[0].props.onChange({target:{value:'ゲージなし'}});
 const filtered=renderTree(combo.render());assert.match(filtered,/gauge free/);assert.doesNotMatch(filtered,/combo card/);
 all(combo.render(),'input')[0].props.onChange({target:{value:'存在しない技'}});
 assert.match(renderTree(combo.render()),/該当するカードはありません/);
});
test('shared detail card offers accessible <details> and media fallback',()=>{
 const {StrategyCardContent}=compile('src/components/strategy-card-content.tsx',{});
 const card=StrategyCardContent({title:'安全飛び',tag:'起き攻め',facts:[{label:'開始条件',value:'要確認'}],description:'検証用の説明',media:null});
 const html=renderTree(card);
 assert.match(html,/動作メディア未登録/);assert.match(html,/<details>/);assert.match(html,/<summary>カードの詳細を見る/);assert.match(html,/検証用の説明/);
});
test('publication path remains closed without explicit authorization',()=>{
 const page=fs.readFileSync(path('src/components/character-unified-page.tsx'),'utf8');
 assert.match(page,/strategyCardsAuthorized = false/);
 assert.match(page,/strategyCardsAuthorized && process\.env\.VERCEL_ENV !== "production"/);
 assert.equal((page.match(/visibleStrategyCards\.filter/g)||[]).length,4);
 assert.match(fs.readFileSync(path('src/lib/release-features.ts'),'utf8'),/publicStrategyContent:\s*false/);
});
test('authorized Preview bundle projects four real card component types and preserves field values',()=>{
 const {StrategyCardContent}=compile('src/components/strategy-card-content.tsx',{});
 const {projectPreviewStrategyCards}=compile('src/lib/strategy-card-projection.tsx',{
   '@/components/strategy-card-content':{StrategyCardContent},
   '@/components/pilot-combo-card':{PilotComboCard:({combo})=>elements('article',{children:`combo:${combo.name} damage:${combo.damage}`})},
   '@/lib/public-copy':{normalizePublicCopy:v=>v},
 });
 const bundle={
   combos:[{id:'1',slug:'test-combo',name:'SA3コンボ',purpose:'検証用',damage:6000,driveCost:2,saCost:3,difficulty:'3',verificationStatus:'verified',category:'sa',command:'強P → SA3',status:'published'}],
   setups:[{id:'2',slug:'test-setup',name:'安全飛び',setupType:'safejump',description:'確認用',startCondition:'ダウン',verificationStatus:'verified'}],
   sequences:[{id:'3',slug:'test-sequence',name:'固め',sequenceType:'pressure',sequenceText:'弱P → 投げ',verificationStatus:'verified'}],
   matchups:[{id:'4',slug:'test-counter',title:'百鬼対策',summary:'見てから対空',counterType:'anti-air',opponentCharacterId:'opponent-id',verificationStatus:'verified'}],
 };
 const cards=projectPreviewStrategyCards(bundle);
 assert.deepEqual(cards.map(c=>c.kind),['combo','setplay','sequence','counter']);
 for(const c of cards){const session=instance(c.kind,[c]);const html=renderTree(session.render());assert.match(html,/検索結果\s+1\s+件/);assert.match(html,/(<article>|動作メディア未登録)/);}
 assert.match(renderTree(cards[0].content),/damage:6000/);
 assert.match(renderTree(cards[1].content),/安全飛び/);
 assert.match(renderTree(cards[2].content),/連携手順/);
 assert.match(renderTree(cards[3].content),/百鬼対策/);
});
test('route only projects from authenticated Preview RPC, never fixture or Production',()=>{
 const route=fs.readFileSync(path('src/app/characters/[slug]/page.tsx'),'utf8');
 assert.match(route,/process\.env\.VERCEL_ENV === "preview" && Boolean\(previewToken\) && data\.source === "device-preview"/);
 assert.match(route,/strategyCardsAuthorized && finalBundle \? projectPreviewStrategyCards\(finalBundle\) : \[\]/);
 assert.match(route,/strategyCards=\{strategyCards\} strategyCardsAuthorized=\{strategyCardsAuthorized\}/);
});
