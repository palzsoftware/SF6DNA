import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createHash } from 'node:crypto';
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

// Immutable rollout baseline: no re-encode or decode of the nine reused pairs.
const reusedAssets = [
  {
    "file": "/media/moves/luke/luke-nose-breaker.mp4",
    "sha256": "95deed7a445b27cb7a75ab39877b4daba50f98c346efa11e1dd50a37028773b6"
  },
  {
    "file": "/media/moves/luke/luke-nose-breaker.webp",
    "sha256": "2b7fad48c4d67f7a5e3427d5e787969dcbcd6c1267babca69f632c99b7a89acb"
  },
  {
    "file": "/media/moves/luke/20261003/luke-triple-impact.mp4",
    "sha256": "4f021afbc7a56f95b4b4a7f0ef9b3a51b9d0e863b111ddf3f43ee80615952e66"
  },
  {
    "file": "/media/moves/luke/20261003/luke-triple-impact.webp",
    "sha256": "463cce4434059347fa015e123cb97bb2e79fdcddd0137c268374c5cd39d359eb"
  },
  {
    "file": "/media/moves/luke/20261003/luke-snapback-combo.mp4",
    "sha256": "711c7a2e716b2aa4b002e493ad9f66040baa48ee5247f3443ad2231807c18a8e"
  },
  {
    "file": "/media/moves/luke/20261003/luke-snapback-combo.webp",
    "sha256": "67a1ec6775ffb975ce0120788f66f3c160115d3dcc7ae436804c5f2937a548a8"
  },
  {
    "file": "/media/moves/manon/manon-a-terre.mp4",
    "sha256": "a4e7f0dc07127a0789536be812b82f363f0049705188be1c4ce744c7a9c95a8c"
  },
  {
    "file": "/media/moves/manon/manon-a-terre.webp",
    "sha256": "9a8587a23207c0e88ae9bae9b6a2d5bc73c6d087cd46beaa11a2d1068bfbcc9f"
  },
  {
    "file": "/media/moves/manon/manon-en-haut.mp4",
    "sha256": "982458cddeab45910f3e7d13da5c741a84cebb97157509f5929a1d154ffb90af"
  },
  {
    "file": "/media/moves/manon/manon-en-haut.webp",
    "sha256": "68ad01c21f93819aae789ede1bbc8427f52743548d8390cf4c23148dc9130c61"
  },
  {
    "file": "/media/moves/manon/manon-temps-lie-hp.mp4",
    "sha256": "d581d71ff4727a6940541c54a9110c6091e2782e0424aaaf37276fb5d7270d1f"
  },
  {
    "file": "/media/moves/manon/manon-temps-lie-hp.webp",
    "sha256": "beb96c348ae9a080afbb92b76d4b22c5e877c84a9607873cf7a076f6624c7570"
  },
  {
    "file": "/media/moves/jamie/20261003/jamie-tensei-kick.mp4",
    "sha256": "6440243397d016507992923ecfdce047a1b96bbf228ac16705c67c96f42c4ca5"
  },
  {
    "file": "/media/moves/jamie/20261003/jamie-tensei-kick.webp",
    "sha256": "0ac2254d2a2893dbea92121ca0c5b5fb9e0ed506f678f30c4e0494e1d7baefed"
  },
  {
    "file": "/media/moves/marisa/20261003/marisa-forward-throw.mp4",
    "sha256": "05e98a1c38f92ff2bd841ab250d8eb6b3ea7db61dde3f9a73b7e4a7cda14fcad"
  },
  {
    "file": "/media/moves/marisa/20261003/marisa-forward-throw.webp",
    "sha256": "f14ccb8f84ad399832d27d03734c5ddd7d57fa9d53ba8590100480f7c513d0f5"
  },
  {
    "file": "/media/moves/marisa/20261003/marisa-back-throw.mp4",
    "sha256": "a1f34859bf9849ed67d96d8357e2f5cd6a3e0cd4202c32cfc06e09388f98c996"
  },
  {
    "file": "/media/moves/marisa/20261003/marisa-back-throw.webp",
    "sha256": "b57f927cb1fa264b95fedbf7dcc6958a51c8e3203d1c58df783dd7cca17038dc"
  }
];
test("the nine reused pairs remain byte-identical", () => {
 for (const {file,sha256} of reusedAssets) assert.equal(createHash("sha256").update(readFileSync(publicRoot + file)).digest("hex"),sha256,file);
});

test("Luke CA cannot replace the normal SA3 clip", () => {
 const m = JSON.parse(readFileSync(new URL("../src/data/SF6DNA_VER1_LUKE_MEDIA_MANIFEST_20260924.json",import.meta.url),"utf8"));
 m.clips.find(c => c.move_slug === "luke-sa3-pale-rider").condition = "low-life critical art";
 assert.ok(validateRecordedCharacter(m,"luke",{publicRoot}).errors.includes("SA3 / CA identity conflict"));
});
