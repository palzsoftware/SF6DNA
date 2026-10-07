import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import test from 'node:test';
import ts from 'typescript';
const require=createRequire(import.meta.url);
const source=readFileSync(new URL('../src/components/diagnosis-runner.tsx',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
const diagnosis={id:'10000000-0000-4000-8000-000000000001',slug:'fixture',title:'Fixture',diagnosisType:'improvement',questions:[{id:'q',options:[{id:'o',scorePayload:{anti_air:1}}]}]};
const storage=new Map();
function harness({auth={data:{user:{id:'A'}},error:null},rpcError=null,delay=false,complete=true}={}){
 let callback,index=0,rpcCalls=[],statuses=[],logs=[];
 const values=[complete?1:0,{q:'o'},0,true,[],null,false,'idle',null];
 const react={useState:(initial)=>{const slot=index++;return [values[slot]??initial,(v)=>{if(slot===7)statuses.push(v);}]},useRef:v=>({current:v}),useEffect:()=>{},useMemo:f=>f(),useCallback:f=>{callback=f;return f;}};
 const deps={'react':react,'react/jsx-runtime':require('react/jsx-runtime'),'next/link':()=>null,'@/lib/local-user-tools':{saveDiagnosisHistory:()=>{}},'@/lib/daily-training':{buildDailyTrainingHref:()=>'/me/training'},'@/lib/release-features':{releaseFeatures:{aiCoach:false}},'@/lib/supabase/client':{getSupabaseBrowserClient:()=>({auth:{getUser:async()=>auth},rpc:async(name,args)=>{rpcCalls.push({name,args});if(delay)await Promise.resolve();return {data:'saved-id',error:rpcError};}})}};
 const loadedModule={exports:{}};
 const logger={error:(...args)=>logs.push(args)};
 const window={localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,v)=>storage.set(key,v)}};
 new Function('module','exports','require','window','console',js)(loadedModule,loadedModule.exports,n=>{if(!(n in deps))throw new Error(n);return deps[n];},window,logger);
 loadedModule.exports.DiagnosisRunner({diagnosis});
 return {save:()=>callback(),rpcCalls,statuses,logs};
}
test('guest and missing session never submit save mutation',async()=>{
 for(const auth of [{data:{user:null},error:null},{data:{user:null},error:{name:'AuthSessionMissingError'}}]){const h=harness({auth});await h.save();assert.equal(h.rpcCalls.length,0);assert.equal(h.statuses.at(-1),'idle');}
});
test('invalid or expired auth fails without anon fallback and without secret logging',async()=>{
 const secret={name:'AuthApiError',message:'fixture private email/token',session:{refresh_token:'fixture'}};
 const h=harness({auth:{data:{user:null},error:secret}});await h.save();assert.equal(h.rpcCalls.length,0);assert.equal(h.statuses.at(-1),'failed');assert.deepEqual(h.logs,[['[diagnosis] result save failed']]);
});
test('RPC error stays failed and preserves retry request identity',async()=>{
 storage.clear();const h=harness({rpcError:{code:'42501',message:'private fixture'}});await h.save();assert.equal(h.statuses.at(-1),'failed');const id=h.rpcCalls[0].args.p_request_id;await h.save();assert.equal(h.rpcCalls[1].args.p_request_id,id);assert.equal(JSON.stringify(h.logs).includes('42501'),false);
});
test('reload/re-login keeps request id and sends no client owner override',async()=>{
 storage.clear();const first=harness();await first.save();const second=harness();await second.save();assert.equal(first.rpcCalls[0].args.p_request_id,second.rpcCalls[0].args.p_request_id);assert.equal('user_id' in first.rpcCalls[0].args,false);assert.equal(second.statuses.at(-1),'saved');
});
test('incomplete diagnosis and simultaneous submissions do not duplicate requests',async()=>{
 const incomplete=harness({complete:false});await incomplete.save();assert.equal(incomplete.rpcCalls.length,0);
 const h=harness({delay:true});await Promise.all([h.save(),h.save()]);assert.equal(h.rpcCalls.length,1);
});
