#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ALLOWED_MEDIA_TYPES = new Set(['video', 'gif']);
const ALLOWED_STATUSES = new Set([
  'capture_received',
  'cut_reviewed',
  'game_verified_candidate',
  'approved_for_preview',
  'mapping_hold',
  'rejected',
]);
const SHA256_RE = /^[a-f0-9]{64}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function requireString(value, label, errors) {
  if (typeof value !== 'string' || value.length === 0) errors.push(`${label}: expected non-empty string`);
}

function publicAssetPath(publicRoot, url, label, errors) {
  requireString(url, label, errors);
  if (typeof url !== 'string' || !url.startsWith('/')) return null;
  if (url.includes('..')) {
    errors.push(`${label}: path traversal is not allowed`);
    return null;
  }
  const root = path.resolve(publicRoot);
  const resolved = path.resolve(root, `.${url}`);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    errors.push(`${label}: asset resolves outside public root`);
    return null;
  }
  return resolved;
}

export function validateMotionMediaManifest(manifest, { publicRoot, checkFiles = true } = {}) {
  const errors = [];
  const warnings = [];
  const stats = { clips: 0, mediaBytes: 0, sourceFiles: 0 };

  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    return { errors: ['manifest: expected object'], warnings, stats };
  }

  if (manifest.manifest_version !== '1.0') errors.push('manifest_version: expected "1.0"');
  requireString(manifest.character_slug, 'character_slug', errors);
  if (typeof manifest.character_slug === 'string' && !SLUG_RE.test(manifest.character_slug)) {
    errors.push('character_slug: invalid slug');
  }
  if (manifest.source_owner !== 'user_capture') errors.push('source_owner: expected "user_capture"');
  requireString(manifest.captured_patch, 'captured_patch', errors);
  requireString(manifest.capture_date, 'capture_date', errors);

  if (!Array.isArray(manifest.source_files) || manifest.source_files.length === 0) {
    errors.push('source_files: expected non-empty array');
  } else {
    const filenames = new Set();
    for (const [index, source] of manifest.source_files.entries()) {
      const prefix = `source_files[${index}]`;
      requireString(source?.category, `${prefix}.category`, errors);
      requireString(source?.filename, `${prefix}.filename`, errors);
      if (typeof source?.filename === 'string') {
        if (filenames.has(source.filename)) errors.push(`${prefix}.filename: duplicate ${source.filename}`);
        filenames.add(source.filename);
      }
      if (typeof source?.sha256 !== 'string' || !SHA256_RE.test(source.sha256)) {
        errors.push(`${prefix}.sha256: expected lowercase SHA-256`);
      }
    }
    stats.sourceFiles = manifest.source_files.length;
  }

  if (!Array.isArray(manifest.clips)) {
    errors.push('clips: expected array');
    return { errors, warnings, stats };
  }

  const mappingKeys = new Set();
  const mediaUrls = new Set();
  const posterUrls = new Set();

  for (const [index, clip] of manifest.clips.entries()) {
    const prefix = `clips[${index}]`;
    stats.clips += 1;
    for (const key of ['move_id', 'move_slug', 'category', 'variant', 'media_url', 'media_type', 'verification_status']) {
      requireString(clip?.[key], `${prefix}.${key}`, errors);
    }
    if (typeof clip?.move_slug === 'string' && !SLUG_RE.test(clip.move_slug)) {
      errors.push(`${prefix}.move_slug: invalid slug`);
    }
    if (!ALLOWED_MEDIA_TYPES.has(clip?.media_type)) {
      errors.push(`${prefix}.media_type: unsupported value ${String(clip?.media_type)}`);
    }
    if (!ALLOWED_STATUSES.has(clip?.verification_status)) {
      errors.push(`${prefix}.verification_status: unsupported value ${String(clip?.verification_status)}`);
    }

    const mappingKey = `${clip?.move_id ?? ''}::${clip?.variant ?? ''}`;
    if (mappingKeys.has(mappingKey)) errors.push(`${prefix}: duplicate move_id + variant (${mappingKey})`);
    mappingKeys.add(mappingKey);

    if (typeof clip?.media_url === 'string') {
      if (mediaUrls.has(clip.media_url)) errors.push(`${prefix}.media_url: duplicate ${clip.media_url}`);
      mediaUrls.add(clip.media_url);
    }
    if (typeof clip?.poster_url === 'string') {
      if (posterUrls.has(clip.poster_url)) warnings.push(`${prefix}.poster_url: reused ${clip.poster_url}`);
      posterUrls.add(clip.poster_url);
    } else if (clip?.media_type === 'video') {
      errors.push(`${prefix}.poster_url: required for video`);
    }

    for (const key of ['loop_start_ms', 'loop_end_ms', 'duration_ms', 'width', 'height', 'filesize_bytes']) {
      if (!Number.isInteger(clip?.[key]) || clip[key] < (key === 'loop_start_ms' ? 0 : 1)) {
        errors.push(`${prefix}.${key}: expected positive integer${key === 'loop_start_ms' ? ' or zero' : ''}`);
      }
    }
    if (typeof clip?.fps !== 'number' || !Number.isFinite(clip.fps) || clip.fps <= 0) {
      errors.push(`${prefix}.fps: expected positive number`);
    }
    if (Number.isInteger(clip?.loop_start_ms) && Number.isInteger(clip?.loop_end_ms) && clip.loop_start_ms >= clip.loop_end_ms) {
      errors.push(`${prefix}: loop_start_ms must be less than loop_end_ms`);
    }
    if (Number.isInteger(clip?.loop_end_ms) && Number.isInteger(clip?.duration_ms) && clip.loop_end_ms > clip.duration_ms) {
      errors.push(`${prefix}: loop_end_ms exceeds duration_ms`);
    }
    if (Number.isInteger(clip?.filesize_bytes) && clip.filesize_bytes > 0) stats.mediaBytes += clip.filesize_bytes;

    if (checkFiles) {
      if (!publicRoot) {
        errors.push('validator: publicRoot is required when checkFiles=true');
        break;
      }
      const mediaPath = publicAssetPath(publicRoot, clip?.media_url, `${prefix}.media_url`, errors);
      if (mediaPath) {
        if (!existsSync(mediaPath)) errors.push(`${prefix}.media_url: missing asset ${clip.media_url}`);
        else if (Number.isInteger(clip?.filesize_bytes) && statSync(mediaPath).size !== clip.filesize_bytes) {
          errors.push(`${prefix}.filesize_bytes: manifest=${clip.filesize_bytes}, actual=${statSync(mediaPath).size}`);
        }
      }
      if (clip?.poster_url) {
        const posterPath = publicAssetPath(publicRoot, clip.poster_url, `${prefix}.poster_url`, errors);
        if (posterPath && !existsSync(posterPath)) errors.push(`${prefix}.poster_url: missing asset ${clip.poster_url}`);
      }
    }
  }

  return { errors, warnings, stats };
}

export function loadManifest(manifestPath) {
  return JSON.parse(readFileSync(manifestPath, 'utf8'));
}

function parseArgs(argv) {
  const args = {
    manifest: 'v2-web/src/data/SF6DNA_VER1_RYU_JP_MEDIA_MANIFEST_20260923.json',
    publicRoot: 'v2-web/public',
    checkFiles: true,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === '--manifest') args.manifest = argv[++i];
    else if (value === '--public-root') args.publicRoot = argv[++i];
    else if (value === '--manifest-only') args.checkFiles = false;
    else if (value === '--help') args.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('Usage: node scripts/validate-motion-media.mjs [--manifest PATH] [--public-root PATH] [--manifest-only]');
    return;
  }
  const manifestPath = path.resolve(args.manifest);
  const publicRoot = path.resolve(args.publicRoot);
  const manifest = loadManifest(manifestPath);
  const result = validateMotionMediaManifest(manifest, { publicRoot, checkFiles: args.checkFiles });

  for (const warning of result.warnings) console.warn(`WARN ${warning}`);
  for (const error of result.errors) console.error(`ERROR ${error}`);
  console.log(`Motion media validation: ${result.errors.length ? 'FAIL' : 'PASS'} (${result.stats.clips} clips, ${result.stats.sourceFiles} source files, ${result.stats.mediaBytes} media bytes)`);
  if (result.errors.length) process.exitCode = 1;
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) main();
