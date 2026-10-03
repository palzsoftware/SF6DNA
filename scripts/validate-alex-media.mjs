import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { validateMotionMediaManifest } from './validate-motion-media.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifestPath = path.join(root, 'v2-web/src/data/ALEX_REVIEWED_MEDIA_20261003.json');
// Exact reviewed identities; edits to a manifest cannot grant a new identity by themselves.
const identities = [
 ['198b2771-cd99-415b-9181-643335438cfb','alex-flash-chop-236hp','フラッシュチョップ','236HP','HEAVY','special'],
 ['df42445a-7291-48a3-98a6-0b7bea16b05c','alex-flash-chop-236pp','フラッシュチョップ','236PP','OD','special'],
 ['3073d9fd-49df-451d-9c8c-93a51bf34e40','alex-aerial-knee-smash-623kk','エアニースマッシュ','623KK','OD','special'],
 ['86136a6f-495e-4ecb-b34e-c0c66aab81c1','alex-raging-spear-236236k','レイジングスピアー','236236K','SA1','super'],
 ['fd27f911-987b-4ba0-b727-e73301ffeb69','alex-sledgecross-hammer-214214p','スレッジクロスハンマー','214214P','SA2','super'],
 ['9e860acc-4183-42c6-8071-28a50656d749','alex-the-final-prison-236236p','ファイナルキャプチュード','236236P','SA3','super'],
 ['9c0ca2ef-2b05-4832-b9d0-667400e56919','alex-the-final-prison-ca-236236p','ファイナルキャプチュード（CA）','236236P','CA','super'],
];
export function validateAlexMedia(manifest, { checkFiles = true, decode = false, publicRoot = path.join(root,'v2-web/public') } = {}) {
 const result = validateMotionMediaManifest(manifest, { publicRoot, checkFiles });
 const { errors } = result;
 if (manifest.character_slug !== 'alex' || manifest.character_id !== '0a82075f-b2c3-4a3d-9267-89f3da1543dd') errors.push('wrong character');
 if (manifest.publication !== 'PREVIEW_ONLY' || manifest.approved_for_public !== 0) errors.push('production publication forbidden');
 if (manifest.clips?.length !== 7 || manifest.moves?.length !== 7) errors.push('expected seven reviewed default identities');
 const posters = new Set();
 for (const clip of manifest.clips ?? []) {
  const identity = identities.find(row => row[0] === clip.move_id);
  if (!identity || [clip.move_id,clip.move_slug,clip.name_snapshot,clip.command_snapshot,clip.variant,clip.category].some((value,i) => value !== identity[i])) errors.push(`identity/category/variant conflict: ${clip.move_slug}`);
  const move = manifest.moves?.find(row => row.id === clip.move_id);
  if (!move || [move.id,move.slug,move.name,move.command,move.variant,move.moveType].some((value,i) => value !== identity?.[i])) errors.push(`move snapshot conflict: ${clip.move_slug}`);
  if (clip.media_role !== 'DEFAULT' || clip.verification_status !== 'approved_for_preview' || clip.cut_review_status !== 'CUT_REVIEW_PASS' || clip.visual_review_status !== 'PASS' || clip.other_attack_contamination !== false) errors.push(`unreviewed or conditional default: ${clip.move_slug}`);
  if (!(clip.source_end_ms > clip.source_start_ms) || clip.time_basis !== 'FFMPEG_INPUT_RELATIVE_SECONDS') errors.push(`invalid interval: ${clip.move_slug}`);
  if (posters.has(clip.poster_url)) errors.push('duplicate poster assignment');posters.add(clip.poster_url);
  for (const url of [clip.media_url,clip.poster_url]) {
   if (!url?.startsWith('/media/alex/20261003/')) {errors.push('wrong asset scope');continue;}
   if (decode && checkFiles) {
    const decoded = spawnSync('ffmpeg',['-v','error','-xerror','-i',path.join(publicRoot,url),'-f','null','-'],{encoding:'utf8'});
    if (decoded.status !== 0) errors.push(`decode failed: ${url}: ${decoded.stderr}`);
   }
  }
 }
 return result;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 const result = validateAlexMedia(JSON.parse(readFileSync(manifestPath,'utf8')),{decode:process.argv.includes('--decode')});
 console.log(JSON.stringify(result,null,2));if(result.errors.length)process.exitCode=1;
}
