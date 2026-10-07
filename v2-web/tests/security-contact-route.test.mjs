import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
function load(path, deps = {}) {
 const js = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const loadedModule = {exports:{}};
 new Function('module','exports','require',js)(loadedModule,loadedModule.exports,name=>{if (!(name in deps)) throw new Error(name); return deps[name];});
 return loadedModule.exports;
}
let calls=0;
const {POST}=load('../src/app/api/contact/route.ts',{
 'next/server':{NextResponse:{json:(body,options)=>Response.json(body,options)}},
 '@/lib/contact-form':load('../src/lib/contact-form.ts'),
 '@/lib/bounded-json':load('../src/lib/bounded-json.ts'),
 '@/lib/supabase/auth-server':{getSupabaseAuthServerClient:async()=>({rpc:async()=>{calls++;return {data:'test-request',error:null};}})}
});
const valid={category:'不具合報告',message:'表示が崩れる状態を確認しました。',email:'user@example.com'};
const request=(body,headers={})=>new Request('https://example.com/api/contact',{method:'POST',headers,body:JSON.stringify(body)});
test('wrong JSON types and malformed JSON return 400 before RPC',async()=>{
 for(const body of [null,[],{}, {...valid,message:42}])assert.equal((await POST(request(body))).status,400);
 assert.equal((await POST(new Request('https://example.com/api/contact',{method:'POST',body:'{'}))).status,400);
 assert.equal(calls,0);
});
test('same host with different scheme is a foreign origin',async()=>{
 assert.equal((await POST(request(valid,{origin:'http://example.com'}))).status,403);
 assert.equal(calls,0);
});
test('oversized body with absent or understated length returns 413',async()=>{
 for(const headers of [{},{'content-length':'1'}])assert.equal((await POST(request({...valid,message:'a'.repeat(17000)},headers))).status,413);
 assert.equal(calls,0);
});
test('valid same-origin contact is forwarded exactly once',async()=>{
 assert.equal((await POST(request(valid,{origin:'https://example.com'}))).status,201);
 assert.equal(calls,1);
});
