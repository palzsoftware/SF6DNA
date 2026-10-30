import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {youtubeThumbnail} from '../src/lib/youtube-thumbnail.ts';
import {moveCardAnchorId,resolveMoveCardReference,focusMoveCardReference} from '../src/lib/move-card-reference.ts';
const read=p=>readFileSync(new URL('../src/'+p,import.meta.url),'utf8');
test('supported YouTube viewing URLs agree with their exact video identity',()=>{
 const id='DCxaiOe37QE';
 for(const url of [`https://youtu.be/${id}`,`https://www.youtube.com/watch?v=${id}`,`https://m.youtube.com/shorts/${id}`,`https://youtube.com/live/${id}`,`https://www.youtube-nocookie.com/embed/${id}`]){
  assert.equal(youtubeThumbnail(url,id),`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  assert.equal(youtubeThumbnail(url,null),`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
 }
});
test('unsafe host protocol credentials and mismatched IDs never produce thumbnails',()=>{
 const id='DCxaiOe37QE';
 for(const url of [`https://youtube.com.evil.test/watch?v=${id}`,`https://notyoutube.com/watch?v=${id}`,`http://youtu.be/${id}`,`https://user@youtu.be/${id}`,'https://youtube.com/watch?v=bad','not a URL'])assert.equal(youtubeThumbnail(url,id),null);
 assert.equal(youtubeThumbnail(`https://youtu.be/${id}`,'abcdefghijk'),null);
});
test('all three Move renderers preserve matching slug-based link, DOM anchor and focus contract',()=>{
 for(const file of ['components/character-unified-page.tsx','components/character-detail-pilot.tsx','components/jp-character-detail.tsx']){
  const src=read(file);
  const slugExpr = file === 'components/character-unified-page.tsx' ? 'entry.move.slug' : 'move.slug';
  assert.ok(src.includes(`anchorId: moveCardAnchorId(${slugExpr})`));
  assert.ok(src.includes('id={moveCardAnchorId(move.slug)'));assert.ok(src.includes('tabIndex={-1}'));
 }
 const src=read('components/character-move-explorer.tsx');assert.ok(src.includes('resolveMoveCardReference(window.location.hash, groups)'));assert.ok(src.includes('focusMoveCardReference(current, document)'));assert.ok(src.includes('group.items.some(item => visibleTarget && item.id === visibleTarget.id && item.anchorId === visibleTarget.anchorId)'));
});
test('Luke and JP accepted slug anchors resolve uniquely; duplicate and unknown fragments are rejected',()=>{
 for(const slug of ['luke-crouching-lp','jp-crouching-mp']){
  const anchorId=moveCardAnchorId(slug),groups=[{items:[{id:slug,anchorId}]}];assert.deepEqual(resolveMoveCardReference('#'+anchorId,groups),{id:slug,anchorId});assert.equal(resolveMoveCardReference('#'+anchorId,[...groups,...groups]),null);
 }
 for(const hash of ['#other','#move-',' #%ZZ','#move-%3Cscript%3E'])assert.equal(resolveMoveCardReference(hash,[{items:[]}]),null);
});
test('target focus checks both identity and slug and opens nested details',()=>{
 const reference={id:'move-id',anchorId:'move-luke-crouching-lp'};const parent={tagName:'DETAILS',open:false,parentElement:null};let scrolled=0,focused=0;
 const target={dataset:{moveId:'move-id',moveSlug:'luke-crouching-lp'},parentElement:parent,scrollIntoView(){scrolled++;},focus(){focused++;}};
 const document={getElementById:id=>id===reference.anchorId?target:null};assert.equal(focusMoveCardReference(reference,document),true);assert.equal(parent.open,true);assert.equal(scrolled,1);assert.equal(focused,1);
 target.dataset.moveId='wrong';assert.equal(focusMoveCardReference(reference,document),false);assert.equal(focused,1);
});
test('image failure state keeps safe existing external links and permits replacement URL',()=>{
 const src=read('components/video-card.tsx');assert.ok(src.includes('videoPresentationUrl(video.url)'));assert.ok(src.includes('videoPresentationUrl(video.thumbnailUrl)'));assert.ok(src.includes('failedThumbnailUrl !== thumbnailUrl'));assert.ok(src.includes('onError={() => setFailedThumbnailUrl(thumbnailUrl)}'));assert.ok(src.includes('href={videoUrl}'));assert.ok(src.includes('rel="noopener noreferrer"'));assert.ok(src.includes('? "YOUTUBE" : "VIDEO"'));
});
