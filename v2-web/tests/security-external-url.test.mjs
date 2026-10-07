import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
const js=ts.transpileModule(readFileSync(new URL('../src/lib/safe-external-url.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const loadedModule={exports:{}};new Function('module','exports',js)(loadedModule,loadedModule.exports);const {safeExternalUrl}=loadedModule.exports;
test('external URL rejects executable, malformed, credential and control input',()=>{
 for(const input of [null,{},'javascript:alert(1)','data:text/html,hi','//evil.test','https:evil.test','https://user:pass@example.com','https://example.com/\nhi','https://example.com/\\evil','https://','https://example.com/'+ 'a'.repeat(2048)])assert.equal(safeExternalUrl(input),null);
});
test('official social/store/book style URLs stay navigable without affiliation inference',()=>{
 for(const input of ['https://www.youtube.com/@fixture','https://www.twitch.tv/fixture','https://x.com/fixture','https://example.com/store?q=book#item','http://example.com/archive'])assert.equal(safeExternalUrl(input),new URL(input).href);
});
