import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import { validateMotionMediaManifest } from "../../scripts/validate-motion-media.mjs";

const manifest = JSON.parse(readFileSync(new URL("../src/data/SF6DNA_VER1_YASMINE_MEDIA_MANIFEST_20261003.json", import.meta.url), "utf8"));
const publicRoot = new URL("../public/", import.meta.url).pathname;
const source = readFileSync(new URL("../src/lib/yasmine-move-media-pilot.ts", import.meta.url), "utf8");
function pilot(data = manifest) {
  const mod = { exports: {} };
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  new Function("module", "exports", "require", js)(mod, mod.exports, () => data);
  return mod.exports.getYasmineMoveMediaPilot;
}
function withEnvironment(value, action) {
  const previous = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = value;
  try { return action(); } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = previous;
  }
}

test("Yasmine capture mappings have independent clips, posters, review evidence and bounded nonoverlapping cuts", () => {
  assert.equal(manifest.source_files.length, 6);
  assert.equal(manifest.clips.length, 26);
  assert.deepEqual(validateMotionMediaManifest(manifest, { publicRoot }).errors, []);
  const intervals = new Map();
  for (const clip of manifest.clips) {
    assert.equal(clip.cut_review_status, "CUT_REVIEW_PASS");
    assert.ok(clip.mapping_evidence.trim().length > 0);
    assert.ok(clip.source_start_ms < clip.poster_source_ms && clip.poster_source_ms < clip.source_end_ms);
    const previous = intervals.get(clip.source_file) ?? [];
    assert.ok(previous.every(([start, end]) => clip.source_end_ms <= start || clip.source_start_ms >= end));
    previous.push([clip.source_start_ms, clip.source_end_ms]); intervals.set(clip.source_file, previous);
  }
  assert.equal(new Set(manifest.clips.map(c => c.move_id)).size, manifest.clips.length);
  assert.equal(new Set(manifest.clips.map(c => c.sha256)).size, manifest.clips.length);
  const supers = manifest.clips.filter(c => c.db_move_type === "super");
  assert.equal(supers.length, 4);
  assert.equal(new Set(supers.map(c => c.media_url)).size, 4);
  assert.equal(supers.filter(c => c.move_slug.includes("-ca-")).length, 1);
  assert.equal(manifest.clips.some(c => c.move_slug.includes("jumping-")), false, "unrecorded jumping normals must not reuse standing clips");
});

test("Yasmine draft capture fixture cannot render in Production or masquerade as verified frames", () => {
  assert.equal(withEnvironment("production", () => pilot()()), null);
  assert.equal(withEnvironment("development", () => pilot()()), null);
  const bundle = withEnvironment("preview", () => pilot()());
  assert.equal(bundle.moves.length, manifest.clips.length);
  assert.ok(bundle.moves.every(m => m.status === "draft" && m.frame === null));
  assert.deepEqual(bundle.combos, []); assert.deepEqual(bundle.setups, []);
  for (const move of bundle.moves) {
    const clip = manifest.clips.find(c => c.move_id === move.id);
    assert.equal(move.slug, clip.move_slug);
    assert.equal(move.name, clip.move_name);
    assert.equal(move.moveType, clip.db_move_type);
    assert.equal(move.commands[0].commandText, clip.command_snapshot);
  }
});

test("held or wrong-character mappings fail closed; duplicate mappings and missing files are rejected", () => {
  const held = { ...manifest, clips: [{ ...manifest.clips[0], verification_status: "mapping_hold" }] };
  assert.deepEqual(withEnvironment("preview", () => pilot(held)()).moves, []);
  assert.equal(withEnvironment("preview", () => pilot({ ...manifest, character_slug: "ryu" })()), null);
  const duplicate = { ...manifest, clips: [...manifest.clips, manifest.clips[0]] };
  assert.ok(validateMotionMediaManifest(duplicate, { checkFiles: false }).errors.some(e => e.includes("duplicate move_id + variant")));
  const wrong = { ...manifest, clips: [{ ...manifest.clips[0], move_slug: "ryu-standing-light-punch" }] };
  assert.deepEqual(withEnvironment("preview", () => pilot(wrong)()).moves, []);
  const missing = { ...manifest, clips: [{ ...manifest.clips[0], poster_url: "/media/moves/yasmine/missing.webp" }] };
  assert.ok(validateMotionMediaManifest(missing, { publicRoot }).errors.some(e => e.includes("missing asset")));
});
