import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { identities, manifestPaths, validateRecordedCharacter } from '../../scripts/validate-recorded-four-media.mjs';
const publicRoot = new URL('../public/',import.meta.url).pathname;
for (const [index, character] of Object.keys(identities).entries()) {
 const manifest = JSON.parse(readFileSync(new URL(`../src/data/${manifestPaths[index]}`,import.meta.url),'utf8'));
 test(`${character}: exact reviewed identities/assets only`, () => assert.deepEqual(validateRecordedCharacter(manifest,character,{publicRoot}).errors,[]));
 for (const [label, mutate] of [
  ['wrong character', m => {m.character_slug='alex';}],
  ['invalid ID', m => {m.clips[0].move_id='unknown';}],
  ['invalid slug', m => {m.clips[0].move_slug='alex-throw';}],
  ['category', m => {m.clips[0].category='super';}],
  ['variant', m => {m.clips[0].variant='od';}],
  ['conditional', m => {m.clips[0].condition_media=true;}],
  ['duplicate', m => {m.clips.push({...m.clips[0]});}],
  ['hold', m => {m.clips[0].verification_status='mapping_hold';}],
  ['missing poster', m => {m.clips[0].poster_url=`/media/moves/${character}/missing.webp`;}],
 ]) test(`${character}: rejects ${label}`, () => {const changed=structuredClone(manifest); mutate(changed); assert.ok(validateRecordedCharacter(changed,character,{publicRoot}).errors.length);});
}
