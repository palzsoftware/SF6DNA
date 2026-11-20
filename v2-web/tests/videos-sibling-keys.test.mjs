import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// QA 2026-11-19: /videos logged "Encountered two children with the same key, `{}`" (form and results shared one key).
test('/videos sibling keys are distinct while still resetting on query change',()=>{
  const page=readFileSync(new URL('../src/app/videos/page.tsx',import.meta.url),'utf8');
  const keys=[...page.matchAll(/key=\{`([a-z]+):\$\{JSON\.stringify\(params\)\}`\}/g)].map(m=>m[1]);
  assert.deepEqual(keys,['form','results']);
  assert.doesNotMatch(page,/key=\{JSON\.stringify\(params\)\}/);
});
