import assert from 'node:assert/strict';
import test from 'node:test';
import { environment } from './helpers/diagnosis-owner-save-harness.mjs';
const historyKey='sf6dna_v3_guest_diagnosis_history';
const records=env=>JSON.parse(env.storage.get(historyKey)||'[]');
const request=env=>[...env.storage.keys()].find(key=>key.startsWith('sf6dna_v3_guest_diagnosis_save_request:'));
function guest(){const env=environment();env.setUser(null);env.seedDraft(null);return env;}
test('guest completed draft reload retains one history identity and completion time without RPC',async()=>{
 const env=guest();await env.mount().settle();const first=records(env);assert.equal(first.length,1);assert.ok(request(env));
 await env.mount().settle();assert.deepEqual(records(env),first);assert.equal(env.calls.length,0);
});
test('explicit guest reset starts a new history attempt even when answers repeat',async()=>{
 const env=guest();const view=env.mount();await view.settle();const first=records(env)[0];view.reset();await view.settle();assert.equal(request(env),undefined);
 view.chooseFirst();await view.settle();view.finish();await view.settle();assert.equal(records(env).length,2);assert.notEqual(records(env)[0].id,first.id);assert.equal(env.calls.length,0);
});
test('a different completed guest answer set keeps a separate history record',async()=>{
 const env=guest();await env.mount().settle();const first=records(env)[0];env.seedDraft(null,{q1:'a2'});await env.mount().settle();assert.equal(records(env).length,2);assert.notEqual(records(env)[0].id,first.id);
});
test('unreadable guest request identity is reported without overwriting history or the bad identity',async()=>{
 const env=guest();await env.mount().settle();const key=request(env),before=records(env);env.storage.set(key,'broken-json');const view=env.mount();await view.settle();assert.equal(view.getHistoryFailed(),true);assert.equal(env.storage.get(key),'broken-json');assert.deepEqual(records(env),before);assert.equal(env.calls.length,0);
});
