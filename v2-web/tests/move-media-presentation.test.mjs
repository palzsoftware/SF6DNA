import test from 'node:test';
import assert from 'node:assert/strict';
import { selectMoveMotionMedia as select } from '../src/lib/move-media-presentation.ts';
const ready = (overrides={}) => ({media:'hit.webp',moveId:'a',variantKey:'',outcome:'HIT',confidence:'HIGH',identity:'CONFIRMED',quality:'PASS',decode:'PASS',animation:'PASS',loop:'PASS',hash:'PASS',...overrides});
const move = (p={}) => ({id:'a',moveType:'normal',media:'existing.webp',motionMediaPresentation:p});
test('legacy media remains visible without new metadata',()=>assert.equal(select(move()).media,'existing.webp'));
test('verified same-move HIT wins',()=>assert.equal(select(move({candidates:[ready()]})).media,'hit.webp'));
test('wrong move, variant or failed validation never replaces valid existing media',()=>{
 for(const overrides of [{moveId:'b'},{variantKey:'stock'},{confidence:'REVIEW'},{identity:'REVIEW'},{quality:'HOLD'},{decode:'HOLD'},{animation:'HOLD'},{loop:'HOLD'},{hash:'HOLD'}]) assert.equal(select(move({candidates:[ready(overrides)]})).media,'existing.webp');
});
test('stock variant is selected only with an explicit matching identity',()=>assert.equal(select(move({variantKey:'stock',candidates:[ready({variantKey:'stock'})]})).media,'hit.webp'));
test('whiff stays visible while upgrade state is internal',()=>{
 const result=select(move({existingOutcome:'WHIFF',upgradePending:true}));
 assert.equal(result.media,'existing.webp');assert.equal(result.state,'MEDIA_PENDING_UPGRADE');
 assert.equal(select(move({existingOutcome:'WHIFF'})).state,'MEDIA_LOW_INFORMATION');
});
test('super, CA, throw and target combo are not rerecord priority',()=>{
 for(const moveType of ['super_art','ca','throw','target_combo']){
  const result=select({...move({existingOutcome:'WHIFF'}),moveType});assert.equal(result.media,'existing.webp');assert.equal(result.upgradePriority,false);assert.equal(result.state,'MEDIA_READY');
 }
});
test('normal, unique, special are explicit upgrade priorities',()=>{
 for(const moveType of ['normal','unique_attack','special'])assert.equal(select({...move(),moveType}).upgradePriority,true);
});
test('missing media has no placeholder asset',()=>{const r=select({id:'a'});assert.equal(r.media,null);assert.equal(r.state,'MEDIA_MISSING');});
test('existing valid media beats a newly offered whiff',()=>assert.equal(select(move({candidates:[ready({outcome:'WHIFF'})]})).media,'existing.webp'));
test('validated media can fill an empty slot',()=>assert.equal(select({...move({candidates:[ready()]}),media:null}).media,'hit.webp'));
test('known invalid existing media is excluded',()=>assert.equal(select(move({existingValidation:'HOLD'})).media,null));
