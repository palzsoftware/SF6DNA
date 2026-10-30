import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source=readFileSync(new URL('../src/lib/personalization-storage.ts', import.meta.url), 'utf8');
const out=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}});
assert.equal(out.diagnostics?.length||0,0);
const mod={exports:{}};
new Function('module','exports',out.outputText)(mod,mod.exports);
const m=mod.exports;
const A='11111111-1111-4111-8111-111111111111';
const B='22222222-2222-4222-8222-222222222222';
const scopeA=m.personalOwnerFromAuth(A,null);
const scopeB=m.personalOwnerFromAuth(B,null);
let map=new Map();
globalThis.window={localStorage:{getItem:key=>map.get(key)??null,setItem:(key,value)=>{map.set(key,value)}}};
const reset=()=>{map=new Map();globalThis.window.localStorage.setItem=(key,value)=>{map.set(key,value);};};
const rec=(id,value,date='2026-10-18')=>({id,date,characterSlug:'jp',characterName:'JP',metric:'MR',value,note:'',createdAt:`${date}T09:00:00Z`});

test('owner IDs and every category are non-overlapping',()=>{
 assert.equal(scopeA,`uid:${A}`); assert.equal(scopeB,`uid:${B}`);
 for(const kind of ['favorite_characters','character_status','rank_history']){
  const ks=['guest',scopeA,scopeB].map(owner=>m.personalStorageKey(owner,kind));
  assert.equal(new Set(ks).size,3);
  assert.ok(ks.every(k=>k?.startsWith('sf6dna_v3_')));
 }
});
test('Auth missing session maps guest; other errors fail closed',()=>{
 assert.equal(m.personalOwnerFromAuth(null,null),'guest');
 assert.equal(m.personalOwnerFromAuth(null,{name:'AuthSessionMissingError'}),'guest');
 assert.equal(m.personalOwnerFromAuth(null,{name:'AuthApiError'}),null);
 assert.equal(m.personalOwnerFromAuth('fake',null),null);
 assert.equal(m.personalStorageKey(null,'rank_history'),null);
 assert.equal(m.personalStorageKey('uid:fake','rank_history'),null);
});
test('favorites are separated for A/B/guest and legacy key is ignored',()=>{
 reset(); map.set('sf6dna_v2_favorite_characters',JSON.stringify(['ken']));
 assert.deepEqual(m.getFavoriteCharacterSlugs(scopeA),[]);
 assert.equal(m.setFavoriteCharacter(scopeA,'jp',true),true);
 assert.equal(m.setFavoriteCharacter(scopeB,'ryu',true),true);
 assert.equal(m.setFavoriteCharacter('guest','luke',true),true);
 assert.deepEqual(m.getFavoriteCharacterSlugs(scopeA),['jp']);
 assert.deepEqual(m.getFavoriteCharacterSlugs(scopeB),['ryu']);
 assert.deepEqual(m.getFavoriteCharacterSlugs('guest'),['luke']);
 assert.deepEqual(JSON.parse(map.get('sf6dna_v2_favorite_characters')),['ken']);
});
test('character status is sanitized and belongs to owner',()=>{
 reset();assert.equal(m.setCharacterStatus(scopeA,'jp','main'),true);
 assert.deepEqual(m.getCharacterStatuses(scopeA),{jp:'main'});
 assert.deepEqual(m.getCharacterStatuses(scopeB),{});
 map.set(m.personalStorageKey(scopeB,'character_status'),JSON.stringify({jp:'invalid',ryu:'learning'}));
 assert.deepEqual(m.getCharacterStatuses(scopeB),{ryu:'learning'});
});
test('rank history is separated and sorted and legacy is never read',()=>{
 reset();map.set('sf6dna_v2_rank_history',JSON.stringify([rec('old',1299)]));
 assert.equal(m.saveRankRecord(scopeA,rec('a2',1500,'2026-10-19')),true);
 assert.equal(m.saveRankRecord(scopeA,rec('a1',1400,'2026-10-18')),true);
 assert.equal(m.saveRankRecord(scopeB,rec('b1',1700)),true);
 assert.deepEqual(m.getRankHistory(scopeA).map(x=>x.id),['a1','a2']);
 assert.deepEqual(m.getRankHistory(scopeB).map(x=>x.id),['b1']);
 assert.deepEqual(m.getRankHistory('guest'),[]);
 assert.equal(m.deleteRankRecord(scopeA,'a1'),true);
 assert.deepEqual(m.getRankHistory(scopeA).map(x=>x.id),['a2']);
 assert.deepEqual(m.getRankHistory(scopeB).map(x=>x.id),['b1']);
 assert.deepEqual(JSON.parse(map.get('sf6dna_v2_rank_history')).map(x=>x.id),['old']);
});
test('invalid/corrupt storage never crashes or accepts invalid rank rows',()=>{
 reset(); const k=m.personalStorageKey(scopeA,'rank_history');
 map.set(k,'{garbled'); assert.deepEqual(m.getRankHistory(scopeA),[]);
 map.set(k,JSON.stringify([rec('ok',1500),{...rec('bad',Infinity),value:'1500'},null,{}]));
 assert.deepEqual(m.getRankHistory(scopeA).map(x=>x.id),['ok']);
 assert.equal(m.saveRankRecord(scopeA,{...rec('bad',1500),metric:'fake'}),false);
});
test('no writes for unknown identity; storage quota failure reports false',()=>{
 reset(); assert.equal(m.setFavoriteCharacter(null,'jp',true),false);
 assert.equal(m.saveRankRecord(null,rec('x',1400)),false);
 assert.equal(map.size,0);
 globalThis.window.localStorage.setItem=()=>{throw new Error('QuotaExceededError')};
 assert.equal(m.setFavoriteCharacter(scopeA,'jp',true),false);
 assert.equal(m.saveRankRecord(scopeA,rec('x',1400)),false);
});
test('invalid slug and malformed payload do not poison writes',()=>{
 reset();assert.equal(m.setFavoriteCharacter(scopeA,'../../other',true),false);
 assert.equal(m.setCharacterStatus(scopeA,'jp','other'),false);
 assert.equal(m.setCharacterStatus(scopeA,'jp','learning'),true);
 assert.deepEqual(m.getFavoriteCharacterSlugs(scopeA),[]);
});
