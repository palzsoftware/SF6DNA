import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validateMotionMediaManifest } from './validate-motion-media.mjs';
export const identities = {
 luke: {
 'aab86b9c-f501-4928-8818-114f5fc0574a': ['luke-nose-breaker','target_combos'],
 '42cfd8d8-a47b-4d89-8fd6-95e758b07e0d': ['luke-triple-impact','target_combos'],
 'a6088794-0ed1-4ee9-9d4a-ee4cbe159e37': ['luke-snapback-combo','target_combos'],
 },
 manon: {
 '1a11e706-08e7-4a29-a656-84ac942d5a18': ['manon-a-terre','target_combos'],
 'ee465bb0-22b4-41d2-9b26-a2fa733c3d06': ['manon-en-haut','target_combos'],
 '20ab47b8-49bd-4bc0-b54e-ae8cb55aa7b2': ['manon-temps-lie-hp','target_combos'],
 },
 jamie: {'b4cdaafd-615b-4a96-a615-2204c2928ece': ['jamie-tensei-kick','unique']},
 marisa: {
 '3eb3f810-dc04-40dd-82a6-dcad8a5eb0c1': ['marisa-forward-throw','throw'],
 '3d782d80-90d2-4dac-a551-7d1440154270': ['marisa-back-throw','throw'],
 },
};
export const manifestPaths = ['SF6DNA_VER1_LUKE_MEDIA_MANIFEST_20260924.json','SF6DNA_VER1_MANON_MEDIA_MANIFEST_20260925.json','SF6DNA_VER1_JAMIE_MEDIA_MANIFEST_20261003.json','SF6DNA_VER1_MARISA_MEDIA_MANIFEST_20261003.json'];
export function validateRecordedCharacter(manifest, expectedCharacter, options = {}) {
 const result = validateMotionMediaManifest(manifest, options);
 if (manifest.character_slug !== expectedCharacter) result.errors.push('wrong character');
 const expected = identities[expectedCharacter];
 if (!expected) result.errors.push('unknown character');
 for (const clip of manifest.clips ?? []) {
  const row = expected?.[clip.move_id];
  if (!row || clip.move_slug !== row[0]) result.errors.push('invalid move ID / slug');
  if (row && clip.category !== row[1]) result.errors.push('wrong category');
  if (clip.variant !== 'default') result.errors.push('variant conflict');
  if (clip.verification_status !== 'approved_for_preview' || clip.cut_review_status !== 'CUT_REVIEW_PASS') result.errors.push('unapproved mapping');
  if (!clip.mapping_evidence || /ORDER_ONLY|CONDITIONAL_VARIANT/.test(clip.mapping_evidence)) result.errors.push('unsafe evidence');
  if (!clip.media_url?.startsWith(`/media/moves/${expectedCharacter}/`) || !clip.poster_url?.startsWith(`/media/moves/${expectedCharacter}/`)) result.errors.push('wrong character file');
  if (clip.condition_media || clip.parent_move_id) result.errors.push('conditional media cannot replace default');
 }
 if ((manifest.clips ?? []).length !== Object.keys(expected ?? {}).length) result.errors.push('unexpected approved coverage');
 return result;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); let errors = []; let clips = 0; let bytes = 0;
 for (const [index, character] of Object.keys(identities).entries()) {
  const manifest = JSON.parse(readFileSync(path.join(root,'v2-web/src/data',manifestPaths[index]),'utf8'));
  const result = validateRecordedCharacter(manifest, character, { publicRoot: path.join(root,'v2-web/public') });
  errors.push(...result.errors.map(error => `${character}: ${error}`)); clips += result.stats.clips; bytes += result.stats.mediaBytes;
  if (process.argv.includes('--decode')) for (const clip of manifest.clips) for (const url of [clip.media_url,clip.poster_url]) {
   const decoded = spawnSync('ffmpeg',['-v','error','-i',path.join(root,'v2-web/public',url),'-f','null','-'],{encoding:'utf8'});
   if (decoded.status !== 0) errors.push(`${character}: decode ${url}: ${decoded.stderr}`);
  }
 }
 console.log(JSON.stringify({ clips, mediaBytes: bytes, errors, decode: process.argv.includes('--decode') ? 'ALL_OUTPUTS' : 'NOT_RUN' },null,2));
 process.exitCode = errors.length ? 1 : 0;
}
