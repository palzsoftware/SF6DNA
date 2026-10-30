import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
function load(name, deps={}) {
 const loaded={exports:{}};
 const code=ts.transpileModule(readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 new Function('module','exports','require',code)(loaded,loaded.exports,n=>deps[n]);return loaded.exports;
}
const filters=load('player-directory-filter',{'@/lib/player-labels':load('player-labels')});
const player={id:'qa-only',slug:'qa-only',displayName:'ときど',aliases:['Tokido'],teamName:'REJECT',playerType:'pro',countryCode:'JP',region:'Japan',imageUrl:null,characters:[{characterId:'qa-jp',characterSlug:'jp',characterName:'JP',role:'historical'}]};
const empty={categories:[],characters:[],teams:[]};
test('name search supports aliases, full-width Latin and Japanese partial matches',()=>{
 for(const q of ['とき','ＴＯＫＩＤＯ','toki-do','REJECT','ＪＰ','japan','プロ']) assert.equal(filters.playerMatchesQuery(player,q),true,q);
 assert.equal(filters.playerMatchesQuery(player,'不存在'),false);
 assert.equal(filters.playerMatchesQuery(player,'   '),true);
});
test('team selection uses OR within a group and AND between all filter groups',()=>{
 assert.equal(filters.playerMatchesFilters(player,{...empty,teams:['DFM','REJECT']}),true);
 assert.equal(filters.playerMatchesFilters(player,{...empty,teams:['DFM']}),false);
 assert.equal(filters.playerMatchesFilters(player,{categories:['pro'],characters:['jp'],teams:['REJECT']}),true);
 assert.equal(filters.playerMatchesFilters(player,{categories:['pro'],characters:['ken'],teams:['REJECT']}),false);
 assert.equal(filters.playerMatchesFilters(player,{categories:['streamer'],characters:['jp'],teams:['REJECT']}),false);
 assert.equal(filters.playerMatchesFilters(player,{categories:[],characters:[]}),true);
});
test('unknown team and empty character data are excluded by active filters, retained when cleared',()=>{
 const unknown={...player,teamName:null,characters:[]};
 assert.equal(filters.playerMatchesFilters(unknown,{...empty,teams:['REJECT']}),false);
 assert.equal(filters.playerMatchesFilters(unknown,{...empty,characters:['jp']}),false);
 assert.equal(filters.playerMatchesFilters(unknown,empty),true);
});
test('search and filters never mutate roles or received data',()=>{
 const before=JSON.stringify(player);
 filters.playerMatchesQuery(player,'JP');filters.playerMatchesFilters(player,{...empty,characters:['jp']});
 assert.equal(JSON.stringify(player),before);assert.equal(player.characters[0].role,'historical');
});
