import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {makeSourceLoader} from './helpers/ws12-render-contract.mjs';

const read=p=>readFileSync(new URL('../src/'+p,import.meta.url),'utf8');
const core=makeSourceLoader()('lib/latest-youtube-core.ts');
const row=(videoId,publishedAt,extra={})=>({videoId,title:'t '+videoId,channelTitle:'c',publishedAt,availability:'PUBLIC',...extra});

test('latest hits are public-only, valid-ID, de-duplicated and newest first',()=>{
  const hits=core.normalizeLatestHits([
    row('aaaaaaaaaaa','2026-11-01T00:00:00Z'), row('bbbbbbbbbbb','2026-11-10T00:00:00Z'),
    row('aaaaaaaaaaa','2026-11-12T00:00:00Z'), row('ccccccccccc','2026-11-05T00:00:00Z',{availability:'NON_PUBLIC'}),
    row('bad id','2026-11-05T00:00:00Z'), row('ddddddddddd',null), row('eeeeeeeeeee','2026-11-03T00:00:00Z'),
  ], new Set(['eeeeeeeeeee']));
  assert.deepEqual(hits.map(h=>h.videoId),['bbbbbbbbbbb','aaaaaaaaaaa']);
  assert.equal(hits[0].watchUrl,'https://www.youtube.com/watch?v=bbbbbbbbbbb');
  assert.equal(hits[0].thumbnailUrl,'https://i.ytimg.com/vi/bbbbbbbbbbb/hqdefault.jpg');
});
test('enablement is server-side and Production needs its own flag',()=>{
  const f=core.latestVideoEnabled;
  assert.equal(f({}),false);
  assert.equal(f({SF6DNA_LATEST_VIDEO_ENABLED:'1',VERCEL_ENV:'preview'}),true);
  assert.equal(f({SF6DNA_LATEST_VIDEO_ENABLED:'1',VERCEL_ENV:'production'}),false);
  assert.equal(f({SF6DNA_LATEST_VIDEO_ENABLED:'1',VERCEL_ENV:'production',SF6DNA_LATEST_VIDEO_PRODUCTION:'1'}),true);
  assert.doesNotMatch(read('lib/latest-youtube-core.ts'),/NEXT_PUBLIC/);
});
test('quota guard caps daily upstream refreshes and resets per UTC day',()=>{
  let now=Date.parse('2026-11-18T01:00:00Z');const g=core.createQuotaGuard(2,()=>now);
  assert.equal(g.tryConsume(),true);assert.equal(g.tryConsume(),true);assert.equal(g.tryConsume(),false);assert.equal(g.remaining(),0);
  now=Date.parse('2026-11-19T00:00:01Z');assert.equal(g.remaining(),2);assert.equal(g.tryConsume(),true);
  assert.ok(core.LATEST_VIDEO_DAILY_FETCH_LIMIT*101<10000);
});
test('YouTube ID extraction accepts only YouTube hosts',()=>{
  assert.equal(core.youtubeIdFromUrl('https://www.youtube.com/watch?v=DCxaiOe37QE'),'DCxaiOe37QE');
  assert.equal(core.youtubeIdFromUrl('https://youtu.be/DCxaiOe37QE'),'DCxaiOe37QE');
  assert.equal(core.youtubeIdFromUrl('https://www.youtube.com/shorts/DCxaiOe37QE'),'DCxaiOe37QE');
  assert.equal(core.youtubeIdFromUrl('https://evil.example/watch?v=DCxaiOe37QE'),null);
  assert.equal(core.youtubeIdFromUrl('not a url'),null);
});

test('search sends order=date/publishedAfter with the key in a header only',async()=>{
  let url,init;const out={exports:{}};
  const js=ts.transpileModule(read('lib/youtube-research.ts'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  new Function('module','exports','require','process','fetch',js)(out,out.exports,()=>({}),{env:{YOUTUBE_DATA_API_KEY:'SYNTHETIC_KEY'}},async(u,i)=>{url=u;init=i;return Response.json({items:[]});});
  await out.exports.searchYouTubeResearch('スト6',25,{order:'date',publishedAfter:'2026-10-19T00:00:00Z'});
  const params=new URL(url).searchParams;
  assert.equal(params.get('order'),'date');assert.equal(params.get('publishedAfter'),'2026-10-19T00:00:00.000Z');
  assert.doesNotMatch(url,/SYNTHETIC_KEY/);assert.equal(init.headers['X-Goog-Api-Key'],'SYNTHETIC_KEY');
  await assert.rejects(out.exports.searchYouTubeResearch('スト6',5,{publishedAfter:'nope'}),/INVALID_PUBLISHED_AFTER/);
});

function server({search,videos}){
  return makeSourceLoader({
    'server-only':{}, 'next/cache':{unstable_cache:fn=>fn},
    '@/lib/youtube-research':{searchYouTubeResearch:search},
    '@/lib/event-media':{listVideosResult:videos},
  })('lib/latest-youtube-videos.ts');
}
const registered={state:'SUCCESS_WITH_RESULTS',items:[{title:'掲載動画',url:'https://www.youtube.com/watch?v=rrrrrrrrrrr',channelName:'SF6DNA',publishedAt:'2026-09-01T00:00:00Z'}]};
async function withEnv(env,fn){const old={...process.env};Object.assign(process.env,env);try{return await fn();}finally{for(const k of Object.keys(env))if(old[k]===undefined)delete process.env[k];else process.env[k]=old[k];}}

test('shelves keep auto-fetched and registered videos separate',async()=>withEnv({SF6DNA_LATEST_VIDEO_ENABLED:'1',YOUTUBE_DATA_API_KEY:'k',VERCEL_ENV:'preview'},async()=>{
  const calls=[];
  const lib=server({search:async(q,n,o)=>{calls.push([q,o.order]);return [row('aaaaaaaaaaa','2026-11-10T00:00:00Z'),row('rrrrrrrrrrr','2026-11-11T00:00:00Z')];},videos:async()=>registered});
  const shelves=await lib.getLatestVideoShelves();
  assert.deepEqual(shelves.map(s=>s.category),['latest','pro','guide','curated']);
  assert.deepEqual(shelves[0].items.map(h=>h.videoId),['aaaaaaaaaaa']);
  assert.deepEqual(shelves[3].items.map(h=>h.videoId),['rrrrrrrrrrr']);
  assert.ok(calls.every(([,order])=>order==='date'));assert.equal(calls.length,3);
}));
test('API failure falls back to registered videos; disabled renders nothing',async()=>{
  await withEnv({SF6DNA_LATEST_VIDEO_ENABLED:'1',YOUTUBE_DATA_API_KEY:'k',VERCEL_ENV:'preview'},async()=>{
    const lib=server({search:async()=>{throw Error('YOUTUBE_UPSTREAM_ERROR');},videos:async()=>registered});
    const shelves=await lib.getLatestVideoShelves();
    assert.ok(shelves.slice(0,3).every(s=>s.state==='FALLBACK'&&s.items[0].videoId==='rrrrrrrrrrr'));
    const view=makeSourceLoader({'@/lib/latest-youtube-videos':{getLatestVideoShelves:async()=>shelves}})('components/latest-youtube-videos.tsx');
    const html=renderToStaticMarkup(React.createElement(view.LatestVideoShelfView,{shelf:shelves[0]}));
    assert.match(html,/新着動画を取得できなかったため、SF6DNA掲載動画を表示しています/);
    assert.doesNotMatch(html,/\bk\b.*key|YOUTUBE_DATA_API_KEY/);
  });
  await withEnv({SF6DNA_LATEST_VIDEO_ENABLED:'0'},async()=>{
    const lib=server({search:async()=>{throw Error('must not call');},videos:async()=>{throw Error('must not call');}});
    assert.equal(await lib.getLatestVideoShelves(),null);
  });
});
test('refresh route is scheduled-only, secret-gated and separate from user search',()=>{
  const src=read('app/api/youtube/latest/refresh/route.ts');
  assert.match(src,/timingSafeEqual/);assert.match(src,/CRON_SECRET/);assert.match(src,/revalidateTag\(LATEST_VIDEO_CACHE_TAG, "max"\)/);
  assert.match(read('lib/latest-youtube-videos.ts'),/^import "server-only";/);
  assert.notEqual(read('lib/latest-youtube-videos.ts').match(/"sf6dna-latest-youtube-v1"/),null);
  assert.doesNotMatch(read('lib/auto-youtube-videos.ts'),/latest-youtube/);
});

test('a failure starts a per-instance cooldown before any retry',()=>{
  let now=Date.parse('2026-11-18T01:00:00Z');const g=core.createQuotaGuard(30,()=>now,1000);
  assert.equal(g.tryConsume(),true);g.noteFailure();assert.equal(g.tryConsume(),false);
  now+=1001;assert.equal(g.tryConsume(),true);
});
test('reference-card switch is closed by default and supports all 32 or a slug list',()=>{
  const c=makeSourceLoader()('lib/strategy-research-contract.ts');
  const prod={VERCEL_ENV:'production',NODE_ENV:'production'};
  assert.equal(c.isStrategyReferenceVisible(prod,'luke'),false);
  assert.equal(c.isStrategyReferenceVisible({...prod,SF6DNA_PUBLIC_STRATEGY_REFERENCE:''},'luke'),false);
  assert.equal(c.isStrategyReferenceVisible({...prod,SF6DNA_PUBLIC_STRATEGY_REFERENCE:'bogus slug!'},'luke'),false);
  const slugs=[...new Set(c.listStrategyResearchCards('luke','combo').length?JSON.parse(readFileSync(new URL('../src/lib/strategy-research-cards-20261118.json',import.meta.url),'utf8')).map(x=>x.characterSlug):[])];
  assert.equal(slugs.length,32);
  assert.ok(slugs.every(s=>c.isStrategyReferenceVisible({...prod,SF6DNA_PUBLIC_STRATEGY_REFERENCE:'all'},s)));
  assert.equal(c.isStrategyReferenceVisible({...prod,SF6DNA_PUBLIC_STRATEGY_REFERENCE:'luke, jp'},'jp'),true);
  assert.equal(c.isStrategyReferenceVisible({...prod,SF6DNA_PUBLIC_STRATEGY_REFERENCE:'luke'},'ryu'),false);
  assert.equal(c.isStrategyReferenceVisible({VERCEL_ENV:'preview'},'ryu'),true);
  assert.match(read('lib/release-features.ts'),/publicStrategyContent: false/);
  assert.doesNotMatch(read('lib/strategy-research-contract.ts'),/NEXT_PUBLIC/);
});
test('Production slot shows reference cards only with the switch; DB strategy stays CLOSED',async()=>{
  const old={...process.env};
  try{
    Object.assign(process.env,{VERCEL_ENV:'production',NODE_ENV:'production'});delete process.env.SF6DNA_PUBLIC_STRATEGY_REFERENCE;
    const slot=()=>makeSourceLoader({'server-only':{}})('components/character-strategy-slot.tsx').CharacterStrategySlot;
    const html=k=>renderToStaticMarkup(React.createElement(slot(),{kind:k,characterSlug:'luke',previewContent:React.createElement('i',null,'DB_PILOT')}));
    let h=html('combo');assert.match(h,/data-strategy-reference="HIDDEN"/);assert.match(h,/今後のアップデートで追加予定です/);assert.doesNotMatch(h,/DB_PILOT/);
    process.env.SF6DNA_PUBLIC_STRATEGY_REFERENCE='all';
    for(const k of ['combo','setplay','sequence','counter']){h=html(k);
      assert.match(h,/data-strategy-publication="CLOSED"/);assert.match(h,/data-strategy-reference="VISIBLE"/);
      const allCards=JSON.parse(readFileSync(new URL('../src/lib/strategy-research-cards-20261118.json',import.meta.url),'utf8'));const held=new Set(JSON.parse(readFileSync(new URL('../src/lib/strategy-reference-source-hold-20261120.json',import.meta.url),'utf8')).holdCardIds);const cat={combo:'combo',setplay:'setplay',sequence:'pressure',counter:'counter'}[k];const expected=allCards.filter(c=>c.characterSlug==='luke'&&c.category===cat&&!held.has(c.id)).length;assert.equal(allCards.filter(c=>c.characterSlug==='luke'&&c.category===cat).length,3);assert.equal((h.match(/data-strategy-kind=/g)||[]).length,expected);assert.doesNotMatch(h,/DB_PILOT/);assert.match(h,/参考攻略（実機未検証）/);}
  } finally { for(const k of Object.keys(process.env)) if(!(k in old)) delete process.env[k]; Object.assign(process.env,old); }
});
test('without an API key the shelves fall back to registered videos without calling YouTube',async()=>withEnv({SF6DNA_LATEST_VIDEO_ENABLED:'1',YOUTUBE_DATA_API_KEY:'',VERCEL_ENV:'preview'},async()=>{
  const lib=server({search:async()=>{throw Error('must not call');},videos:async()=>registered});
  const shelves=await lib.getLatestVideoShelves();
  assert.ok(shelves.slice(0,3).every(s=>s.state==='FALLBACK'));assert.equal(shelves[3].state,'RESULTS');
  const none=server({search:async()=>{throw Error('must not call');},videos:async()=>({state:'SUCCESS_EMPTY',items:[]})});
  assert.ok((await none.getLatestVideoShelves()).slice(0,3).every(s=>s.state==='UNAVAILABLE'));
}));
