import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

// Execute the real loaders against synthetic published/draft rows. This checks
// application query filters; database RLS is reviewed independently.
function load(path, imports) {
  const js=ts.transpileModule(readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const loadedModule={exports:{}};
  new Function('module','exports','require',js)(loadedModule,loadedModule.exports,name=>{
    assert.ok(name in imports,`unexpected dependency ${name}`);return imports[name];
  });return loadedModule.exports;
}
const {safeExternalUrl}=load('../src/lib/safe-external-url.ts',{});
function client(tables, sources=[]) {
  return {rpc:async()=>({data:sources,error:null}),from(table){
    let rows=[...(tables[table]??[])];
    const query={select(){return query;},eq(key,value){rows=rows.filter(row=>row[key]===value);return query;},in(key,values){rows=rows.filter(row=>values.includes(row[key]));return query;},order(){return query;},limit(n){rows=rows.slice(0,n);return query;},maybeSingle:async()=>({data:rows[0]??null,error:null}),then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject);}};
    return query;
  }};
}
function loaders(tables,sources=[]) {
  const db=client(tables,sources);
  const imports={'@/lib/supabase/server':{getSupabaseServerClient:()=>db},'@/lib/safe-external-url':{safeExternalUrl},'@/lib/approved-player-images':{approvedPlayerImage:()=>null}};
  imports['@/lib/sfl2026-template-connection'] = {
    connectSfl2026Summaries: items => items,
    connectSfl2026Detail: item => item,
  };
  imports['@/lib/player-profile-contract']=load('../src/lib/player-profile-contract.ts',imports);
  imports['@/lib/player-profile-approved-intake']=load('../src/lib/player-profile-approved-intake.ts',imports);
  imports['@/lib/player-archive-display']=load('../src/lib/player-archive-display.ts',imports);
  imports['@/lib/player-profile-binding']=load('../src/lib/player-profile-binding.ts',imports);
  imports['@/lib/player-profile-release-connection']=load('../src/lib/player-profile-release-connection.ts',imports);
  const source=load('../src/lib/public-source-links.ts',imports);
  imports['@/lib/public-source-links']=source;
  imports['@/lib/youtube-thumbnail']=load('../src/lib/youtube-thumbnail.ts',imports);
  imports['@/lib/confirmed-video-relations']=load('../src/lib/confirmed-video-relations.ts',imports);
  return {...load('../src/lib/players.ts',imports),...load('../src/lib/event-media.ts',imports),...load('../src/lib/public-sources.ts',imports),...source};
}
process.env.NEXT_PUBLIC_SUPABASE_URL='https://fixture.invalid';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='fixture-only';
test('draft Player is hidden by list and direct detail while published remains accessible',async()=>{
  const api=loaders({players:[{id:'p',slug:'public',display_name:'Public',status:'published',x_url:'javascript:alert(1)',website_url:'https://example.com/store'},{id:'d',slug:'draft',display_name:'Draft',status:'draft'}]});
  assert.deepEqual((await api.listPlayers()).map(row=>row.slug),['public']);
  assert.equal(await api.getPlayerBySlug('draft'),null);
  const published=await api.getPlayerBySlug('public');assert.equal(published.xUrl,null);assert.equal(published.websiteUrl,'https://example.com/store');
});
test('draft and unsafe Video are hidden by list and direct detail',async()=>{
  const api=loaders({videos:[{id:'p',slug:'public',title:'Public',status:'published',url:'https://youtu.be/abcdefghijk'},{id:'d',slug:'draft',title:'Draft',status:'draft',url:'https://youtu.be/abcdefghijk'},{id:'x',slug:'unsafe',title:'Unsafe',status:'published',url:'data:text/html,hi'}]});
  assert.deepEqual((await api.listVideos()).map(row=>row.slug),['public']);
  assert.equal(await api.getVideoBySlug('draft'),null);assert.equal(await api.getVideoBySlug('unsafe'),null);
  assert.deepEqual((await api.getVideoBySlug('public')).externalLink,{href:'https://youtu.be/abcdefghijk',label:'YouTubeで見る'});
});
test('Source RPC projection drops unsafe links without dropping valid evidence',async()=>{
  const base={entity_type:'player',entity_id:'p',source_id:'s',title:'Evidence',source_type:'official'};
  const api=loaders({},[{...base,url:'javascript:alert(1)'},{...base,source_id:'valid',url:'https://example.com/evidence'}]);
  assert.deepEqual((await api.getPublicEntitySources(['player'],['p'])).map(row=>row.sourceId),['valid']);
});
test('Source directory independently validates external URLs',async(t)=>{
  const previousFlag = process.env.SF6DNA_PUBLIC_SOURCE_LIST_ENABLED;
  process.env.SF6DNA_PUBLIC_SOURCE_LIST_ENABLED = 'true';
  t.after(() => {
    if (previousFlag === undefined) delete process.env.SF6DNA_PUBLIC_SOURCE_LIST_ENABLED;
    else process.env.SF6DNA_PUBLIC_SOURCE_LIST_ENABLED = previousFlag;
  });
  const base={id:'s',title:'Evidence',source_type:'official',reliability_level:'official'};
  const api=loaders({},[{...base,url:'data:text/html,hi'},{...base,id:'valid',url:'https://example.com/evidence'}]);
  assert.deepEqual((await api.listPublicSources()).map(row=>row.id),['valid']);
});
