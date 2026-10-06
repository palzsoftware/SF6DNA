import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const read = p => readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const json = p => JSON.parse(read(p));
function load(p, stub=require){const m={exports:{}};new Function('module','exports','require',ts.transpileModule(read(p),{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m,m.exports,stub);return m.exports;}
const actual=json('src/data/CHARACTER_PRODUCTION_RELEASE_APPROVAL.json');
const gate=load('src/lib/production-character-approval.ts', n=>n==='@/data/CHARACTER_PRODUCTION_RELEASE_APPROVAL.json'?actual:require(n));
const route=load('src/lib/character-detail-route.ts');
const slugs=[...read('src/lib/character-detail-route.ts').matchAll(/^  "([a-z-]+)",/gm)].map(m=>m[1]);
const snapshot=json('src/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json');
const publicResolver=load('src/lib/release-character-move-resolver.ts');
const rawMove={id:'m',character_id:'c',slug:'move',name_ja:'技',move_type:'normal',status:'published'};
const command={id:'cmd',move_id:'m',control_scheme:'classic',command_text:'LP',numeric_notation:'5LP',button_notation:null,condition_text:null,sort_order:0};
const frame={id:'f',move_id:'m',valid_from_patch_id:'p',valid_to_patch_id:null,verification_status:'verified',startup:'4',active:null,recovery:null,on_hit:'D',on_block:null,damage:0};
const sources=[['move','m'],['move_command','cmd'],['frame','f']].map(([entityType,entityId])=>({entityType,entityId,sourceId:`s-${entityId}`,url:'https://www.streetfighter.com/6/',reliabilityLevel:'official'}));
const resolve=changes=>publicResolver.resolveReleaseCharacterMoves({characterId:'c',currentPatchId:'p',moves:[rawMove],commands:[command],frames:[frame],gateReadyIds:new Set(['m']),officialCommandIds:new Set(['cmd']),officialFrameIds:new Set(['f']),...changes});
function sample(){const proof={move:resolve({})[0],characterId:'c',patchId:'p',rawMove,commands:[command],frames:[frame],sources};const grant={characterId:'c',slug:'alex',approved:true,revoked:false,patchId:'p',approvalRef:'explicit-test-user-grant',approvedBy:'test',approvedAt:'2026-10-06T00:00:00Z',checkpointId:'test-checkpoint',checkpointHash:'a'.repeat(64),candidateHash:'b'.repeat(64),expectedCount:1,moves:[{id:'m',slug:'move',factDigest:gate.productionFactDigest(proof),identityConfirmed:true,commandEvidence:'APPROVED_CURRENT',frameEvidence:'APPROVED_CURRENT',sourceStatus:'APPROVED_CURRENT'}]};return structuredClone({proof,grant});}
const registry=g=>({...actual,characters:[g]});
function env(value,fn){const prior=process.env.VERCEL_ENV;if(value===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=value;try{return fn();}finally{if(prior===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=prior;}}
const cases = [
['T01 Preview roster',()=>env('preview',()=>{assert.equal(slugs.length,31);slugs.forEach(s=>assert.equal(route.isCharacterDetailV2Route(s),true));})],
['T02 Production default deny',()=>env('production',()=>slugs.forEach(s=>assert.equal(route.isCharacterDetailV2Route(s),false)))],
['T03 Synthetic eligible approved data',()=>{const {grant,proof}=sample();assert.equal(gate.isProductionMoveApproved(grant,proof),true);env('production',()=>assert.equal(route.isCharacterDetailV2Route('alex',true),true));}],
['T04 Development unset deny',()=>{for(const e of ['development',undefined,'staging'])env(e,()=>assert.equal(route.isCharacterDetailV2Route('alex',true),false));}],
['T05 malformed duplicate revoked grants',()=>{const {grant}=sample();for(const r of [null,{}, {...registry(grant),schemaVersion:2},{...registry(grant),characters:[grant,grant]},registry({...grant,revoked:true}),registry({...grant,moves:[grant.moves[0],grant.moves[0]]})])assert.equal(gate.validateApprovalRegistry(r),false);}],
['T06 existing gate AND release grant',()=>{assert.equal(resolve({gateReadyIds:new Set()}).length,0);const {grant,proof}=sample();grant.moves=[];assert.equal(gate.isProductionMoveApproved(grant,proof),false);}],
['T07 no preview getters in production resolver',async()=>{const calls=[];const mod=load('src/lib/character-detail-data.ts',n=>{if(n==='@/lib/production-character-approval')return gate;if(n==='@/lib/character-detail-route')return route;if(n==='@/lib/release-character-move-resolver')return publicResolver;return new Proxy({}, {get:()=>()=>{calls.push(n);throw Error('unauthorized getter');}});});const prior=process.env.VERCEL_ENV;process.env.VERCEL_ENV='production';try{assert.deepEqual(await mod.resolveCharacterDetailData('c','alex','attack'),{bundle:null,source:'unavailable'});assert.equal(calls.length,0);}finally{process.env.VERCEL_ENV=prior;}}],
['T08 query failure cannot fixture-fallback',()=>assert.match(read('src/lib/character-detail-data.ts'),/loadPublicCharacterMoves\(characterId, approval\)\.catch\(\(\) => null\)/)],
['T09 root server derived grant',()=>{const p=read('src/app/characters/[slug]/page.tsx');assert.match(p,/Boolean\(getCharacterProductionApproval\(character.id, character.slug\)\)/);assert.match(p,/production \? Promise.resolve\(\[\]\)/);}],
['T10 exact move allowlist',()=>{const {grant,proof}=sample();grant.moves[0].id='other';assert.equal(gate.isProductionMoveApproved(grant,proof),false);}],
['T11 identity variant condition stale proof',()=>{for(const field of ['id','slug','name','moveType']){const {grant,proof}=sample();proof.move[field]='changed';assert.equal(gate.isProductionMoveApproved(grant,proof),false);}}],
['T12 patch mismatch',()=>{const {grant,proof}=sample();proof.patchId='old';assert.equal(gate.isProductionMoveApproved(grant,proof),false);}],
['T13 frame verification uniqueness',()=>{for(const changes of [{frames:[frame,frame]},{frames:[{...frame,verification_status:'reviewed'}]},{frames:[]}])assert.equal(resolve(changes).length,0);}],
['T14 Classic required Modern optional',()=>{assert.equal(resolve({}).length,1);assert.equal(resolve({commands:[]}).length,0);assert.equal(resolve({commands:[{...command,control_scheme:'modern'}]}).length,0);}],
['T15 URL alone no entity proof',()=>{for(let i=0;i<3;i++){const {grant,proof}=sample();proof.sources[i].entityId='wrong';grant.moves[0].factDigest=gate.productionFactDigest(proof);assert.equal(gate.isProductionMoveApproved(grant,proof),false);}}],
['T16 no draft promotion',()=>assert.equal(resolve({moves:[{...rawMove,status:'draft'}]}).length,0)],
['T17 stale values invalidate grant',()=>{const {grant,proof}=sample();proof.move.frame.damage=999;assert.equal(gate.isProductionMoveApproved(grant,proof),false);}],
['T18 request cannot grant',()=>env('production',()=>assert.equal(gate.getCharacterProductionApproval('c','alex'),null))],
['T19 approved subset only',()=>{const {grant,proof}=sample();assert.equal(grant.expectedCount,1);assert.equal(gate.isProductionMoveApproved(grant,proof),true);assert.equal(gate.isProductionMoveApproved(grant,{...proof,move:{...proof.move,id:'other'}}),false);}],
['T20 production preview media denied',()=>assert.match(read('src/app/characters/[slug]/page.tsx'),/media: production \? null/)],
['T21 Alex full base overlay selection',()=>assert.equal(snapshot.characters.alex.moves.length,64)],
['T22 Alex frames present baseline',()=>snapshot.characters.alex.moves.forEach(m=>assert.ok(m.frame))],
['T23 Alex commands identity present',()=>snapshot.characters.alex.moves.forEach(m=>assert.ok(m.commands.some(c=>c.scheme==='classic'&&c.moveId===m.id)))],
['T24 roster exact 31',()=>assert.deepEqual(new Set(slugs),new Set(Object.keys(snapshot.characters)))],
['T25 unapproved media isolation',()=>{assert.match(read('src/lib/alex-approved-data-overlay.ts'),/candidates.length === 1/);assert.match(read('src/lib/alex-approved-data-overlay.ts'),/mediaStatus === "READY_REUSED"/);}],
['T26 overlay avoids mutating source',()=>assert.match(read('src/lib/alex-approved-data-overlay.ts'),/structuredClone\(snapshot.characters.alex.moves\)/)],
['T27 protected references exist',()=>{for(const s of ['jp','alex','ingrid'])assert.ok(snapshot.characters[s].moves.length>0);assert.ok(read('src/lib/jp-move-review-fixture.ts').length>0);}],
['T28 ID crosswalk no name-only join',()=>{const h=json('src/data/ALEX_ID_LEVEL_HANDOFF_20261006.json');assert.deepEqual(new Set(h.moves.map(m=>m.id)),new Set(snapshot.characters.alex.moves.map(m=>m.id)));}],
['T29 frozen fixture cardinality',()=>assert.equal(Object.values(snapshot.characters).reduce((n,c)=>n+c.moves.length,0),1939)],
['T30 strategy flags not exposed',()=>assert.match(read('src/lib/release-features.ts'),/publicStrategyContent: false/)],
['T31 NULL D zero preserved',()=>{const m=resolve({})[0];assert.equal(m.frame.onHit,'D');assert.equal(m.frame.onBlock,null);assert.equal(m.frame.damage,0);}],
['T32 media path and identity existing validator retained',()=>assert.ok(read('src/lib/alex-reviewed-media.ts').includes('GAME_INPUT_CROSSCHECK_CONFIRMED'))],
];
for(const [title,fn] of cases)test(title,fn);
test('T33 real 375px Preview QA',{skip:'No Preview candidate deploy authorized; MOBILE_QA remains PARTIAL'},()=>{});
test('T34 real 390px Preview QA',{skip:'No Preview candidate deploy authorized; MOBILE_QA remains PARTIAL'},()=>{});
test('T35 real Desktop Preview QA',{skip:'No Preview candidate deploy authorized'},()=>{});
test('T36 rollback requires no DB mutation',()=>{const source=read('src/lib/production-character-approval.ts')+read('src/lib/alex-approved-data-overlay.ts');assert.doesNotMatch(source,/\.from\(|\.insert\(|\.delete\(|service_role/i);assert.deepEqual(actual.characters,[]);});

// Final review: exercise the complete server resolver with synthetic grants,
// rather than only testing the registry and public projection independently.
async function productionChain({ publicReady = true, missingSource = false, dbError = false, stale = false } = {}) {
  const {grant,proof}=sample();
  proof.sources.sort((a,b)=>`${a.entityType}:${a.entityId}:${a.sourceId}`.localeCompare(`${b.entityType}:${b.entityId}:${b.sourceId}`));
  grant.moves[0].factDigest=gate.productionFactDigest(proof);
  const syntheticGate=load('src/lib/production-character-approval.ts',n=>n==='@/data/CHARACTER_PRODUCTION_RELEASE_APPROVAL.json'?registry(grant):require(n));
  const calls=[];
  const client={from(table){
    const query={};
    for(const method of ['select','eq','in','is','order'])query[method]=()=>query;
    const data=()=>({data:table==='patches'?{id:'p'}:table==='moves'?[rawMove]:table==='move_commands'?[command]:table==='move_frame_data'?[stale?{...frame,damage:999}:frame]:[],error:dbError?{message:'synthetic query failure'}:null});
    query.maybeSingle=async()=>data();query.then=(resolve,reject)=>Promise.resolve(data()).then(resolve,reject);return query;
  }};
  const mod=load('src/lib/character-detail-data.ts',n=>{
    if(n==='@/lib/production-character-approval')return syntheticGate;
    if(n==='@/lib/release-character-move-resolver')return publicResolver;
    if(n==='@/lib/character-detail-route')return route;
    if(n==='@/lib/supabase/server')return {getSupabaseServerClient:()=>client};
    if(n==='@/lib/public-move-gate')return {isMovePublicReady:async()=>{calls.push('public-gate');return publicReady;}};
    if(n==='@/lib/public-source-links')return {getPublicEntitySources:async(types,ids)=>sources.filter(s=>types.includes(s.entityType)&&ids.includes(s.entityId)&&!(missingSource&&s.entityType==='move'))};
    return new Proxy({}, {get:()=>()=>{calls.push('preview-getter');throw Error('Preview getter forbidden in Production');}});
  });
  const names=['VERCEL_ENV','NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const saved=names.map(n=>process.env[n]);
  process.env.VERCEL_ENV='production';process.env.NEXT_PUBLIC_SUPABASE_URL='https://synthetic.invalid';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='synthetic-test';
  try{return {result:await mod.resolveCharacterDetailData('c','alex','untrusted-query-token'),calls};}
  finally{names.forEach((n,i)=>{if(saved[i]===undefined)delete process.env[n];else process.env[n]=saved[i];});}
}
test('final review: exact approval plus public gate selects current official data',async()=>{
  const {result,calls}=await productionChain();assert.equal(result.source,'public');assert.equal(result.bundle.moves.length,1);
  assert.equal(result.bundle.moves[0].frame.onHit,'D');assert.equal(result.bundle.moves[0].media,null);
  assert.deepEqual(calls,['public-gate']);
});
test('final review: release approval cannot bypass existing public gate',async()=>{
  const {result,calls}=await productionChain({publicReady:false});assert.deepEqual(result,{bundle:null,source:'unavailable'});assert.deepEqual(calls,['public-gate']);
});
test('final review: source relation missing or stale facts deny approved data',async()=>{
  for(const options of [{missingSource:true},{stale:true}]){const {result}=await productionChain(options);assert.deepEqual(result,{bundle:null,source:'unavailable'});}
});
test('final review: DB failure cannot select Preview fixture',async()=>{
  const {result,calls}=await productionChain({dbError:true});assert.deepEqual(result,{bundle:null,source:'unavailable'});assert.deepEqual(calls,[]);
});
