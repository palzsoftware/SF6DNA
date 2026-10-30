import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {makeSourceLoader} from './helpers/ws12-render-contract.mjs';

const read=p=>readFileSync(new URL('../src/'+p,import.meta.url),'utf8');
const ID='DCxaiOe37QE', OTHER='abcdefghijk', KEY='SYNTHETIC_PRIVATE_KEY';
function load(path,{key=KEY,fetchImpl=()=>{throw Error('unexpected network');},enabled='false'}={}){
 const output={exports:{}};
 const js=ts.transpileModule(read(path),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 new Function('module','exports','require','process','fetch',js)(output,output.exports,name=>{
  if(name==='server-only')return {};
  if(name==='next/server')return {NextResponse:{json:(body,init)=>Response.json(body,init)}};
  throw Error('unexpected import '+name);
 },{env:{YOUTUBE_DATA_API_KEY:key,ENABLE_YOUTUBE_RESEARCH:enabled}},fetchImpl);
 return output.exports;
}
const json=items=>Response.json({items});
const publicRow=(id=ID)=>({id,snippet:{title:'JP と選手の試合 <script>',channelTitle:'fixture',description:'大会候補',publishedAt:'2026-10-13T00:00:00Z',thumbnails:{medium:{url:`https://i.ytimg.com/vi/${id}/mqdefault.jpg`}}},status:{privacyStatus:'public'}});

test('missing key fails without external communication',async()=>{
 let calls=0;const lib=load('lib/youtube-research.ts',{key:'',fetchImpl:()=>{calls++;}});
 await assert.rejects(lib.searchYouTubeResearch('スト6 JP'),/YOUTUBE_API_UNCONFIGURED/);assert.equal(calls,0);
});
test('invalid queries, limits and IDs fail before any external communication',async()=>{
 let calls=0;const lib=load('lib/youtube-research.ts',{fetchImpl:()=>{calls++;}});
 for(const q of ['','x','<script>','a'.repeat(101)])await assert.rejects(lib.searchYouTubeResearch(q),/INVALID_QUERY/);
 for(const n of [NaN,Infinity])await assert.rejects(lib.searchYouTubeResearch('スト6',n),/INVALID_LIMIT/);
 for(const ids of [[],['bad'],[ID,'https://evil.test'],Array(51).fill(ID)])await assert.rejects(lib.checkYouTubeResearch(ids),/INVALID_VIDEO_IDS/);
 assert.equal(calls,0);
});
test('official search plus videos status check keep key out of URLs/results and relations unreviewed',async()=>{
 const calls=[];const lib=load('lib/youtube-research.ts',{fetchImpl:async(url,init)=>{
  calls.push({url,init});return url.includes('/search?')?json([{id:{videoId:ID}},{id:{videoId:ID}},{id:{videoId:'bad'}},{id:{videoId:OTHER}}]):json([publicRow()]);
 }});
 const candidates=await lib.searchYouTubeResearch('Street Fighter 6 JP',100);
 assert.equal(calls.length,2);assert.equal(new URL(calls[0].url).searchParams.get('maxResults'),'25');
 for(const {url,init} of calls){assert.equal(new URL(url).hostname,'www.googleapis.com');assert.ok(!url.includes(KEY));assert.equal(init.headers['X-Goog-Api-Key'],KEY);assert.equal(init.cache,'no-store');assert.equal(init.redirect,'error');assert.ok(init.signal);}
 assert.equal(candidates.length,2);assert.equal(candidates[0].availability,'PUBLIC');assert.equal(candidates[1].availability,'UNAVAILABLE');assert.equal(candidates[1].title,null);
 for(const c of candidates){assert.equal(c.verification,'RESEARCH_ONLY');assert.equal(c.publicationAllowed,false);assert.deepEqual(c.relatedCharacters,[]);assert.deepEqual(c.relatedPlayers,[]);assert.equal(c.tournament,null);assert.equal(c.relationVerification,'UNREVIEWED');assert.ok(Number.isFinite(Date.parse(c.fetchedAt)));}
 assert.ok(!JSON.stringify(candidates).includes(KEY));
});
test('empty search makes no second request',async()=>{
 let calls=0;const lib=load('lib/youtube-research.ts',{fetchImpl:async()=>{calls++;return json([]);}});
 assert.deepEqual(await lib.searchYouTubeResearch('スト6'),[]);assert.equal(calls,1);
});
test('nonpublic, omitted and unknown status remain distinct without inventing deletion reason',async()=>{
 for(const privacyStatus of ['private','unlisted',undefined]){
  const row=publicRow();row.status={privacyStatus};const lib=load('lib/youtube-research.ts',{fetchImpl:async()=>json([row])});
  const [c]=await lib.checkYouTubeResearch([ID]);assert.equal(c.availability,privacyStatus?'NON_PUBLIC':'UNKNOWN');assert.equal(c.publicationAllowed,false);
 }
});
test('thumbnail hosts credentials ports and arbitrary URLs are rejected',async()=>{
 for(const url of ['http://i.ytimg.com/x','https://evil.test/x','https://i.ytimg.com.evil.test/x','https://user@i.ytimg.com/x','https://i.ytimg.com:8443/x']){
  const row=publicRow();row.snippet.thumbnails.medium.url=url;const lib=load('lib/youtube-research.ts',{fetchImpl:async()=>json([row])});
  assert.equal((await lib.checkYouTubeResearch([ID]))[0].thumbnailUrl,`https://i.ytimg.com/vi/${ID}/hqdefault.jpg`);
 }
});
test('quota upstream timeout invalid JSON and malformed response errors contain no secrets',async()=>{
 for(const fetchImpl of [async()=>new Response('secret body '+KEY,{status:403}),async()=>{throw Error('timeout '+KEY);},async()=>new Response('not-json'),async()=>Response.json({unexpected:true})]){
  const lib=load('lib/youtube-research.ts',{fetchImpl});await assert.rejects(lib.checkYouTubeResearch([ID]),error=>{assert.ok(!error.message.includes(KEY));return /^YOUTUBE_(UPSTREAM_ERROR|NETWORK_ERROR|INVALID_RESPONSE)$/.test(error.message);});
 }
});
test('HTTP intake remains closed when disabled or enabled; no API key or fetch exposed',async()=>{
 for(const enabled of ['false','true']){
  const route=load('app/api/youtube/research/route.ts',{enabled});const response=await route.GET();assert.equal(response.status,enabled==='true'?403:404);assert.equal(response.headers.get('cache-control'),'private, no-store');assert.ok(!(await response.text()).includes(KEY));
 }
});
test('existing VideoCard renders trusted thumbnail and direct YouTube links without changing catalog',()=>{
 const loader=makeSourceLoader({'@/lib/use-owned-video-preferences': { useOwnedVideoPreferences: () => ({ status: 'ready', favorites: new Set(), watched: new Set(), refresh: () => {}, toggle: () => false, message: '' }) },'next/link':{__esModule:true,default:props=>React.createElement('a',props)}});
 const {VideoCard}=loader('components/video-card');
 const video={id:'local-fixture',slug:'local-fixture',title:'確認済みIDの表示試験',platform:'youtube',url:`https://www.youtube.com/watch?v=${ID}`,thumbnailUrl:`https://i.ytimg.com/vi/${ID}/hqdefault.jpg`,events:['大会fixture'],characters:['JP'],players:['選手fixture'],categories:[],controlTypes:[],durationSeconds:null,videoType:'tournament',channelName:'fixture'};
 const before=structuredClone(video);const html=renderToStaticMarkup(React.createElement(VideoCard,{video,publishedDate:null}));
 assert.ok(html.includes(video.thumbnailUrl));assert.ok(html.includes(video.url));assert.match(html,/YouTubeで再生/);assert.match(html,/rel="noopener noreferrer"/);assert.deepEqual(video,before);
});
