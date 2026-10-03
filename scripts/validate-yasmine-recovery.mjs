import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateMotionMediaManifest } from './validate-motion-media.mjs';

/** Structural checks cannot certify video identity; approval needs a separate visual review. */
export function validateYasmineRecovery(manifest, snapshot, options = {}) {
  const result = validateMotionMediaManifest(manifest, options);
  const moves = new Map(snapshot.moves.map(move => [move.id, move]));
  if (manifest.character_id !== snapshot.characterId || manifest.character_slug !== snapshot.characterSlug) result.errors.push('character identity mismatch');
  const files = new Set();
  for (const clip of manifest.clips) {
    const move = moves.get(clip.move_id);
    if (!move || move.slug !== clip.move_slug || move.moveType !== clip.db_move_type) result.errors.push(`${clip.move_slug}: DB move identity/category mismatch`);
    if (files.has(clip.media_url)) result.errors.push(`${clip.move_slug}: duplicate file mapping`);
    files.add(clip.media_url);
    if (clip.verification_status !== 'approved_for_preview' || !move) continue;
    const review = clip.visual_review;
    if (clip.cut_review_status !== 'CUT_REVIEW_PASS' || !review || review.status !== 'PASS'
      || review.sourceFile !== clip.source_file || review.startMs !== clip.source_start_ms || review.endMs !== clip.source_end_ms
      || review.moveId !== move.id || review.moveSlug !== move.slug || review.strengthVariant !== move.strengthVariant
      || !move.commands.some(command => command.commandText === review.observedCommand)
      || review.observedCommand !== clip.command_snapshot) result.errors.push(`${clip.move_slug}: visual identity/command/strength review required`);
    if (move.moveType === 'special' && !['observedStrength', 'observedOD', 'observedFollowUp'].every(key => typeof review?.[key] === 'string' && review[key].trim())) result.errors.push(`${clip.move_slug}: special strength/OD/follow-up visual evidence required`);
    if (move.moveType === 'super' && review?.observedSuper !== move.slug) result.errors.push(`${clip.move_slug}: SA identity review required`);
  }
  result.stats.approved = manifest.clips.filter(clip => clip.verification_status === 'approved_for_preview').length;
  result.stats.held = manifest.clips.filter(clip => clip.verification_status === 'mapping_hold').length;
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = new URL('../', import.meta.url);
  const read = relative => JSON.parse(readFileSync(new URL(relative, root), 'utf8'));
  const result = validateYasmineRecovery(read('v2-web/src/data/SF6DNA_VER1_YASMINE_MEDIA_MANIFEST_20261003.json'), read('v2-web/src/data/YASMINE_PREVIEW_MOVE_SNAPSHOT_20261003.json'), { publicRoot: fileURLToPath(new URL('v2-web/public/', root)) });
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exitCode = 1;
}
