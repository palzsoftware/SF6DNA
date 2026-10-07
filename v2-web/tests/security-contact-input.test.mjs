import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
function load(path) {
  const js = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loadedModule = { exports: {} };
  new Function('module', 'exports', js)(loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const { validateContactPayload } = load('../src/lib/contact-form.ts');
const { readBoundedJson, RequestBodyTooLargeError } = load('../src/lib/bounded-json.ts');
const valid = { category: '不具合報告', message: '表示が崩れる状態を確認しました。', email: 'user@example.com' };
test('untrusted JSON types never throw and are rejected', () => {
  for (const value of [null, false, 1, [], 'text', {}, ...['category','message','email','targetUrl','website'].flatMap(key => [null, 42, {}, []].map(value => ({...valid, [key]:value})))]) {
    assert.equal(validateContactPayload(value).ok, false);
  }
});
test('URL scheme and length limits match database boundary', () => {
  for (const targetUrl of ['javascript:alert(1)', 'data:text/html,hi', 'https://example.com/' + 'a'.repeat(2048)]) assert.equal(validateContactPayload({...valid, targetUrl}).ok, false);
  assert.equal(validateContactPayload(valid).ok, true);
});
test('actual UTF-8 bytes enforce limit without Content-Length', async () => {
  const body = JSON.stringify({message:'あ'.repeat(10)});
  const size = new TextEncoder().encode(body).length;
  assert.deepEqual(await readBoundedJson(new Request('https://example.com', {method:'POST',body}), size), {message:'あ'.repeat(10)});
  await assert.rejects(readBoundedJson(new Request('https://example.com', {method:'POST',body}), size - 1), RequestBodyTooLargeError);
});
test('chunked oversized input cancels before reading remaining chunks', async () => {
  let cancelled = false;
  const body = new ReadableStream({ start(c) { c.enqueue(new Uint8Array(10)); c.enqueue(new Uint8Array(10)); }, cancel() { cancelled = true; } });
  await assert.rejects(readBoundedJson(new Request('https://example.com', {method:'POST',body,duplex:'half'}), 15), RequestBodyTooLargeError);
  assert.equal(cancelled, true);
});
test('malformed JSON and invalid UTF-8 fail safely', async () => {
  await assert.rejects(readBoundedJson(new Request('https://example.com', {method:'POST',body:'{'}), 100), SyntaxError);
  await assert.rejects(readBoundedJson(new Request('https://example.com', {method:'POST',body:new Uint8Array([255])}), 100), TypeError);
});
