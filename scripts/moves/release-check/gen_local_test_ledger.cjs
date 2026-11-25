// LOCAL-TEST-ONLY: build a verification approval registry by running the app's own public loader
// (src/lib/character-detail-data.ts) against the isolated DB. The grant check is wrapped only to capture each
// move's proof; the digest is the app's productionFactDigest of that exact proof. Not an approval.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const APP=process.argv[2], OUT=process.argv[3], ROWS=process.argv[4], CHARS=process.argv[5], KEYFILE=process.argv[6];
const ts=require(APP+'/node_modules/typescript');
const {createClient}=require(APP+'/node_modules/@supabase/supabase-js');
const K=fs.readFileSync(KEYFILE,'utf8').trim();
process.env.NEXT_PUBLIC_SUPABASE_URL='http://127.0.0.1:54321'; process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=K;
const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,K,{auth:{persistSession:false}});
const cache={}; let captured=null;
function load(spec){
  if(spec==='@/lib/supabase/server') return {getSupabaseServerClient:()=>client};
  if(spec.startsWith('@/')){
    let p=path.join(APP,'src',spec.slice(2));
    if(p.endsWith('.json')) return JSON.parse(fs.readFileSync(p,'utf8'));
    for(const ext of ['.ts','.tsx','.mjs']) if(fs.existsSync(p+ext)){p=p+ext;break;}
    if(cache[p]) return cache[p].exports;
    const m={exports:{}};cache[p]=m;
    const out=p.endsWith('.mjs')?fs.readFileSync(p,'utf8'):ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,jsx:ts.JsxEmit.ReactJSX}}).outputText;
    new Function('module','exports','require',out)(m,m.exports,load);
    if(spec==='@/lib/production-character-approval'){
      const real=m.exports.isProductionMoveApproved;
      m.exports={...m.exports, real, isProductionMoveApproved:(grant,proof)=>{ captured.set(proof.move.id,proof); return true; }};
      cache[p]=m;
    }
    return m.exports;
  }
  return require(spec);
}
const gate=load('@/lib/production-character-approval');
const {loadPublicCharacterMoves}=load('@/lib/character-detail-data');
const rows=fs.readFileSync(ROWS,'utf8').replace(/^﻿/,'').split('\n');
const head=rows[0].split(','); const modernOnly=new Set();
for(const line of rows.slice(1)){ if(!line) continue; const cells=line.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map(c=>c.replace(/,$/,'').replace(/^"|"$/g,'').replace(/""/g,'"'));
  if(cells[head.indexOf('kind')]==='modern_only') modernOnly.add(cells[head.indexOf('moveId')]); }
const h=x=>crypto.createHash('sha256').update(x).digest('hex');
(async()=>{
 const {data:patch}=await client.from('patches').select('id').eq('is_current',true).maybeSingle();
 const characters=[];
 for(const [slug,characterId] of JSON.parse(fs.readFileSync(CHARS,'utf8'))){
  const {data:pub}=await client.from('moves').select('id,slug').eq('character_id',characterId).eq('status','published');
  const provisional={characterId,slug,approved:true,revoked:false,patchId:String(patch.id),approvalRef:'LOCAL-TEST-ONLY-NOT-AN-APPROVAL',approvedBy:'local-verify',approvedAt:'2026-11-25T00:00:00Z',
    checkpointId:'LOCAL_VERIFY_'+slug,checkpointHash:h('local-checkpoint-'+slug),candidateHash:h('local-candidate-'+slug),expectedCount:pub.length,
    moves:pub.map(m=>({id:m.id,slug:m.slug,factDigest:'0'.repeat(64),identityConfirmed:true,commandEvidence:'APPROVED_CURRENT',frameEvidence:'APPROVED_CURRENT',sourceStatus:'APPROVED_CURRENT',...(modernOnly.has(m.id)?{commandScheme:'modern_only'}:{})}))};
  captured=new Map();
  const shown=await loadPublicCharacterMoves(characterId,provisional);
  const moves=[...captured.entries()].map(([id,proof])=>({id,slug:proof.move.slug,factDigest:gate.productionFactDigest(proof),identityConfirmed:true,commandEvidence:'APPROVED_CURRENT',frameEvidence:'APPROVED_CURRENT',sourceStatus:'APPROVED_CURRENT',...(modernOnly.has(id)?{commandScheme:'modern_only'}:{})}));
  characters.push({...provisional,expectedCount:moves.length,moves});
  console.error(slug,'published',pub.length,'passed gate',(shown||[]).length,'granted',moves.length,'modern_only',moves.filter(m=>m.commandScheme).length);
 }
 const reg={schemaVersion:1,releaseId:'SF6DNA_VER1_0',baseRcSha:'d929501ee45b86e2f2b18d7efc09381e7b4d8cb6',characters};
 console.error('valid',gate.validateApprovalRegistry(reg),'total',characters.reduce((s,c)=>s+c.moves.length,0));
 fs.writeFileSync(OUT,JSON.stringify(reg,null,1));
})().catch(e=>{console.error(e);process.exit(1)});
