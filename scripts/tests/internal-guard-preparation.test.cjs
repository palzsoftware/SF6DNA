const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const ts=require(path.join(root,'v2-web/node_modules/typescript'));
const meta=JSON.parse(fs.readFileSync(path.join(root,'docs/release-20260930-publication/INTERNAL_GUARD_PRECONDITIONS.json'),'utf8'));
const base=fs.readFileSync(path.join(root,meta.ROUTE),'utf8');
const prepared='import { requireAdmin } from "@/lib/admin";\n'+base.replace('}) {\n  const { slug } = await params;','}) {\n  await requireAdmin();\n  const { slug } = await params;');
function compile(source,mocks){
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
 const exports={};vm.runInNewContext(js,{exports,require:(name)=>{assert.ok(name in mocks,`Unexpected import ${name}`);return mocks[name];}});return exports;
}
function scenario(user,profile,error,exists=true){
 const events=[];
 const redirect=(url)=>{events.push(`redirect:${url}`);throw new Error(`REDIRECT ${url}`);};
 const client={auth:{getUser:async()=>{events.push('getUser');return {data:{user}};}},from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>{events.push('profile');return {data:profile,error};}})})})};
 const admin=compile(fs.readFileSync(path.join(root,'v2-web/src/lib/admin.ts'),'utf8'),{'next/navigation':{redirect},'@/lib/supabase/auth-server':{getSupabaseAuthServerClient:async()=>client}});
 const jsx={jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};
 const route=compile(prepared,{'@/lib/admin':admin,'next/link':{default:()=>null},'next/navigation':{notFound:()=>{events.push('404');throw new Error('NOT_FOUND');}},'react/jsx-runtime':jsx,'@/components/character-detail-pilot':{CharacterDetailPilot:()=>null},'@/lib/pre-release-character':{getPreReleaseCharacter:()=>{events.push('data');return exists?{nameJa:'Ryu',slug:'ryu',source:{url:'https://example.com',title:'fixture'}}:null;}}});
 const params={then:(resolve)=>{events.push('params');resolve({slug:'ryu'});}};
 return {events,run:()=>route.default({params})};
}
test('live route stays byte-identical and patch remains unapplied',()=>{assert.equal(meta.APPLIED,false);assert.equal(meta.APPROVAL,'NO');assert.equal(crypto.createHash('sha256').update(base).digest('hex'),meta.ROUTE_SHA256);assert.ok(!base.includes('await requireAdmin()'));assert.equal(prepared.split('await requireAdmin()').length,2);});
for(const [label,user,profile,error,target] of [['anonymous',null,null,null,'/auth?next=/admin'],['nonadmin',{id:'u'},{role:'user'},null,'/admin'],['profile error',{id:'u'},null,{message:'failed'},'/admin']]){
 test(`${label} blocked before params and character data`,async()=>{const s=scenario(user,profile,error);await assert.rejects(s.run(),new RegExp(`REDIRECT ${target.replace(/[?]/g,'\\?')}`));assert.ok(!s.events.includes('params'));assert.ok(!s.events.includes('data'));});
}
test('admin reaches character data after profile validation',async()=>{const s=scenario({id:'u'},{role:'admin'},null);await s.run();assert.deepEqual(s.events,['getUser','profile','params','data']);});
test('admin unknown character uses existing 404',async()=>{const s=scenario({id:'u'},{role:'admin'},null,false);await assert.rejects(s.run(),/NOT_FOUND/);assert.deepEqual(s.events,['getUser','profile','params','data','404']);});
