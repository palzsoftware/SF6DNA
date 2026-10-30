import assert from 'node:assert/strict';
import test from 'node:test';
import { environment, A, draftKey, requestKey } from './helpers/diagnosis-owner-save-harness.mjs';

test('guest and missing session never submit save mutation',async()=>{
 for(const error of [null,{name:'AuthSessionMissingError'}]){
  const e=environment();e.setUser(null);e.seedDraft(null);e.setAuthError(error);
  const v=e.mount();await v.settle();assert.equal(v.getStatus(),'idle');assert.equal(e.calls.length,0);assert.equal(e.rows.size,0);assert.equal(e.storage.has(requestKey),false);
 }
});
test('invalid or expired save-time auth fails without anon fallback and without secret logging',async()=>{
 const e=environment();e.setAuthError({name:'AuthApiError',message:'fixture private email/token',session:{refresh_token:'fixture'}});
 const v=e.mount();await v.settle();assert.equal(v.getStatus(),'failed');assert.equal(e.calls.length,0);assert.equal(e.storage.has(requestKey),false);assert.deepEqual(e.errors,[['[diagnosis] result save failed']]);
});
test('RPC error stays failed and preserves retry request identity',async()=>{
 const e=environment();e.failNext();const v=e.mount();await v.settle();assert.equal(v.getStatus(),'failed');const id=e.calls[0].p_request_id;
 await v.retry();await v.settle();assert.equal(v.getStatus(),'saved');assert.equal(e.calls[1].p_request_id,id);assert.equal(e.rows.size,1);assert.deepEqual(e.errors,[['[diagnosis] result save failed']]);
});
test('reload/re-login keeps request id and sends no client owner override',async()=>{
 const e=environment();const first=e.mount();await first.settle();e.setUser(null);await e.mount().settle();assert.equal(e.calls.length,1);
 e.setUser(A);const second=e.mount();await second.settle();assert.equal(second.getStatus(),'saved');assert.equal(e.calls[0].p_request_id,e.calls[1].p_request_id);assert.equal(e.rows.size,1);
 for(const call of e.calls){assert.equal('user_id' in call,false);assert.equal('p_user_id' in call,false);assert.equal(call.user,A);}
});
test('incomplete diagnosis and simultaneous submissions do not duplicate requests',async()=>{
 const incomplete=environment();incomplete.storage.delete(draftKey);await incomplete.mount().settle();assert.equal(incomplete.calls.length,0);
 const e=environment();e.failNext();const v=e.mount();await v.settle();assert.equal(v.getStatus(),'failed');assert.equal(e.calls.length,1);
 await Promise.all([v.retry(),v.retry()]);await v.settle();assert.equal(e.calls.length,2,'only one additional RPC for simultaneous retries');assert.equal(e.rows.size,1);assert.equal(v.getStatus(),'saved');
});
