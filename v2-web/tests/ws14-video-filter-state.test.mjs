import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const ids = { v:'00000000-0000-4000-8000-000000000001', c:'00000000-0000-4000-8000-000000000002', p:'00000000-0000-4000-8000-000000000003', t:'00000000-0000-4000-8000-000000000004', m:'00000000-0000-4000-8000-000000000005', c2:'00000000-0000-4000-8000-000000000006', t2:'00000000-0000-4000-8000-000000000007' };
function load(file, overrides={}) {
 const mod={exports:{}};
 const js=ts.transpileModule(readFileSync(new URL('../src/'+file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 new Function('require','module','exports',js)(name=>{
  if(name in overrides) return overrides[name];
  if(name.startsWith('@/lib/'))return load('lib/'+name.slice(6)+'.ts',overrides);
  if(name==='next/link')return {__esModule:true,default:props=>require('react').createElement('a',props)};
  return require(name);
 },mod,mod.exports);return mod.exports;
}
const proof=(type,id,extra={})=>({videoId:ids.v,entityType:type,entityId:id,evidenceId:'fixture-proof',sourceUrl:'https://example.test/source',status:'CONFIRMED',publishApproved:true,...extra});
const fixture={id:ids.v,slug:'one',title:'Test JP',platform:'youtube',url:'https://youtu.be/abcdefghijk',external_id:'abcdefghijk',thumbnailUrl:null,publishedAt:null,videoType:'guide',description:null,channelName:null,durationSeconds:null,language:null,controlTypes:[],characters:['JP','リュウ'],players:['ときど'],events:['EVO'],categories:['guide'],level:'unknown',viewCount:null,viewCountCheckedAt:null,
 entityRefs:{characters:[{id:ids.c,label:'JP'},{id:ids.c2,label:'リュウ'}],players:[{id:ids.p,label:'ときど'}],tournaments:[{id:ids.t,label:'EVO'}]},matchBindings:[{matchId:ids.m,playerId:ids.p,characterId:ids.c,tournamentId:ids.t}]};
function setup({failure,rows={},proofs=[]}={}) {
 const calls=[];
 const tables={videos:[{id:ids.v,status:'published',slug:'one',title:'Test JP',platform:'youtube',url:'https://youtu.be/abcdefghijk',external_id:'abcdefghijk'},{id:'draft',status:'draft',url:'https://example.test'}],entity_videos:[{video_id:ids.v,entity_type:'character',entity_id:ids.c},{video_id:ids.v,entity_type:'player',entity_id:ids.p}],characters:[{id:ids.c,name_ja:'JP',status:'published'}],players:[{id:ids.p,display_name:'ときど',status:'published'}],matches:[{id:ids.m,video_id:ids.v,tournament_id:ids.t,status:'published'}],match_participants:[{match_id:ids.m,player_id:ids.p,character_id:ids.c}],tournaments:[{id:ids.t,name:'EVO',status:'published'}],...rows};
 const client={from(table){const filters=[];let cap;const q={select(){return q},eq(k,v){filters.push([k,v]);return q},in(k,v){filters.push([k,v]);return q},order(){return q},limit(v){cap=v;return q},then(resolve,reject){calls.push({table,filters,cap});if(failure==='throw')return Promise.reject(new Error('fixture network')).then(resolve,reject);const data=(tables[table]??[]).filter(r=>filters.every(([k,v])=>Array.isArray(v)?v.includes(r[k]):r[k]===v));return Promise.resolve({data:cap?data.slice(0,cap):data,error:failure===table?{message:'fixture failure'}:null}).then(resolve,reject)}};return q}};
 const confirmed=load('lib/confirmed-video-relations.ts');
 const api=load('lib/event-media.ts',{'@/lib/supabase/server':{getSupabaseServerClient:()=>client},'@/lib/public-source-links':{getPublicEntitySources:async()=>[]},'@/lib/confirmed-video-relations':{...confirmed,PUBLIC_CONFIRMED_VIDEO_RELATIONS:proofs}});
 return {...api,calls};
}
process.env.NEXT_PUBLIC_SUPABASE_URL='https://example.test';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='fixture-only';
test('state loader preserves published Character IDs, excludes drafts and unconfirmed tags',async()=>{
 const r=await setup().listVideosResult();assert.equal(r.state,'SUCCESS_WITH_RESULTS');assert.equal(r.items.length,1);assert.deepEqual(r.items[0].entityRefs.characters,[{id:ids.c,label:'JP'}]);assert.deepEqual(r.items[0].players,[]);assert.deepEqual(r.items[0].events,[]);
});
test('normal empty, unavailable and unresolved are separate states',async()=>{
 assert.equal((await setup({rows:{videos:[]}}).listVideosResult()).state,'SUCCESS_EMPTY');
 assert.equal((await setup().listVideosResult({playerId:ids.p})).state,'RELATION_UNRESOLVED');
 assert.equal((await setup().listVideosResult({tournamentId:ids.t})).state,'RELATION_UNRESOLVED');
 const old=process.env.NEXT_PUBLIC_SUPABASE_URL;delete process.env.NEXT_PUBLIC_SUPABASE_URL;try{assert.equal((await setup().listVideosResult()).state,'UNAVAILABLE')}finally{process.env.NEXT_PUBLIC_SUPABASE_URL=old}
});
for(const table of ['videos','entity_videos','characters','players','matches','match_participants','tournaments','throw'])test('failure is API_ERROR: '+table,async()=>{const r=await setup({failure:table}).listVideosResult();assert.equal(r.state,'API_ERROR');assert.deepEqual(r.items,[])});
test('malformed exact IDs never become an unfiltered query',async()=>{const api=setup();const r=await api.listVideosResult({tournamentId:'invalid'});assert.equal(r.state,'RELATION_UNRESOLVED');assert.equal(api.calls.length,0)});
test('Tournament ID query requires published same match and confirmed evidence',async()=>{
 const api=setup({proofs:[proof('tournament',ids.t)]});assert.equal((await api.listVideosResult({tournamentId:ids.t})).items.length,1);assert.ok(api.calls.some(c=>c.table==='matches'&&c.filters.some(([k,v])=>k==='tournament_id'&&v===ids.t)));assert.equal((await setup({rows:{matches:[{id:ids.m,video_id:ids.v,tournament_id:ids.t,status:'draft'}]},proofs:[proof('tournament',ids.t)]}).listVideosResult({tournamentId:ids.t})).items.length,0);
});
test('Player Character Tournament use one participant and match; opponent/other event excluded',async()=>{
 const proofs=[proof('player',ids.p,{matchId:ids.m,characterId:ids.c}),proof('tournament',ids.t)];const api=setup({proofs});
 assert.equal((await api.listVideosResult({playerId:ids.p,characterId:ids.c,tournamentId:ids.t})).items.length,1);
 assert.equal((await setup({proofs}).listVideosResult({playerId:ids.p,characterId:ids.c2,tournamentId:ids.t})).items.length,0);
 assert.equal((await setup({proofs}).listVideosResult({playerId:ids.p,characterId:ids.c,tournamentId:ids.t2})).items.length,0);
});
test('HOLD, missing public approval or evidence cannot enable Player tags',()=>{
 const {applyConfirmedVideoRelations}=load('lib/confirmed-video-relations.ts');
 for(const extra of [{status:'HOLD'},{publishApproved:false},{evidenceId:''},{sourceUrl:'javascript:alert(1)'}])assert.deepEqual(applyConfirmedVideoRelations(fixture,[proof('player',ids.p,extra)]).players,[]);
 assert.deepEqual(applyConfirmedVideoRelations(fixture,[proof('player',ids.p)]).matchBindings,[]);
});
test('stable IDs distinguish names and prevent cross-participant and cross-event attribution',()=>{
 const lib=load('lib/video-library.ts');const sets=(c,p,t)=>({characters:new Set(c),players:new Set(p),events:new Set(t)});
 assert.equal(lib.videoMatchesRelationFilters(fixture,sets([ids.c],[ids.p],[ids.t])),true);
 assert.equal(lib.videoMatchesRelationFilters(fixture,sets([ids.c2],[ids.p],[ids.t])),false);
 assert.equal(lib.videoMatchesRelationFilters(fixture,sets(['JP'],[],[])),false);
 const another={...fixture,id:'second',entityRefs:{...fixture.entityRefs,players:[{id:'different-player',label:'ときど'}]}};
 assert.equal(lib.videoEntityOptions([fixture,another],'players').length,2);
 const intent=load('lib/video-intent.ts').parseVideoIntent('ときど リュウ');assert.equal(lib.videoMatchesIntent(fixture,intent),false);
});
test('query parser rejects repeated keys and canonicalizes UUID case',()=>{const lib=load('lib/video-player-filter.ts');assert.equal(lib.videoEntityIdFromQuery([ids.c,ids.p]),null);assert.equal(lib.videoEntityIdFromQuery(ids.c.toUpperCase()),ids.c)});
test('state component renders all six states without collapsing errors into empty copy',()=>{
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');const {VideoRetrievalStatus}=load('components/video-retrieval-status.tsx');
 for(const state of ['LOADING','SUCCESS_WITH_RESULTS','SUCCESS_EMPTY','UNAVAILABLE','API_ERROR','RELATION_UNRESOLVED']){const html=renderToStaticMarkup(React.createElement(VideoRetrievalStatus,{state}));if(state==='SUCCESS_WITH_RESULTS')assert.equal(html,'');else assert.ok(html.includes('data-video-state="'+state+'"'));if(state==='API_ERROR')assert.match(html,/role="alert"/)}
});
test('legacy array callers retain listVideos return shape',async()=>{assert.equal(Array.isArray(await setup().listVideos()),true);assert.deepEqual(await setup({failure:'throw'}).listVideos(),[])});

test('legacy Player label cannot match a title or fall back to all videos without confirmed identity',()=>{
 const lib=load('lib/video-library.ts');const video={...fixture,title:'Unknown Player',players:[],entityRefs:{...fixture.entityRefs,players:[]}};
 const selected=new Set(lib.videoInitialPlayerIds([video],'Unknown Player'));
 assert.equal(selected.size,1);assert.equal(lib.videoMatchesRelationFilters(video,{players:selected,characters:new Set(),events:new Set()}),false);
 assert.deepEqual(lib.videoInitialPlayerIds([fixture],'ときど'),[ids.p]);
});
