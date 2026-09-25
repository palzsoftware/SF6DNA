import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateMotionMediaManifest } from "../../scripts/validate-motion-media.mjs";

const manifest = JSON.parse(readFileSync(new URL("../src/data/SF6DNA_VER1_MANON_MEDIA_MANIFEST_20260925.json", import.meta.url), "utf8"));
const publicRoot = new URL("../public/", import.meta.url).pathname;
const loader = readFileSync(new URL("../src/lib/preview-motion-media-pilot.ts", import.meta.url), "utf8");
const fixture = readFileSync(new URL("../src/lib/character-detail-v21-fixture.ts", import.meta.url), "utf8");
const component = readFileSync(new URL("../src/components/move-motion-media.tsx", import.meta.url), "utf8");

test("Manon's reviewed target combos match the current Move IDs and have valid media and posters", () => {
  assert.equal(manifest.character_slug, "manon");
  assert.equal(manifest.source_files.length, 1);
  assert.deepEqual(manifest.clips.map(({ move_id, move_slug, category }) => [move_id, move_slug, category]), [
    ["1a11e706-08e7-4a29-a656-84ac942d5a18", "manon-a-terre", "target_combos"],
    ["ee465bb0-22b4-41d2-9b26-a2fa733c3d06", "manon-en-haut", "target_combos"],
    ["20ab47b8-49bd-4bc0-b54e-ae8cb55aa7b2", "manon-temps-lie-hp", "target_combos"],
  ]);
  assert.deepEqual(validateMotionMediaManifest(manifest, { publicRoot }).errors, []);
  assert.ok(manifest.clips.every((clip) => clip.verification_status === "approved_for_preview" && clip.cut_review_status === "CUT_REVIEW_PASS"));
  assert.match(loader, /characterId === MANON_CHARACTER_ID && manonManifest.character_slug === "manon"/);
  assert.match(fixture, /slug === "manon"/);
  for (const clip of manifest.clips) assert.match(fixture, new RegExp(clip.move_id));
  assert.match(component, /<video/);
  assert.match(component, /poster=\{media\.posterUrl/);
});

test("held mappings and duplicate variants cannot enter the Manon pilot", () => {
  const duplicate = { ...manifest, clips: [...manifest.clips, { ...manifest.clips[0], media_url: "/other.mp4" }] };
  assert.ok(validateMotionMediaManifest(duplicate, { publicRoot, checkFiles: false }).errors.some((error) => error.includes("duplicate move_id + variant")));
  const missingPoster = { ...manifest, clips: [{ ...manifest.clips[0], poster_url: "/media/moves/manon/missing.webp" }] };
  assert.ok(validateMotionMediaManifest(missingPoster, { publicRoot }).errors.some((error) => error.includes("missing asset")));
  assert.match(loader, /filter\(\(clip\) => clip.verification_status === "approved_for_preview"\)/);
  assert.equal(manifest.clips.some((clip) => clip.verification_status === "mapping_hold"), false);
  assert.equal(manifest.clips.some((clip) => clip.move_slug === "manon-temps-lie-2hp"), false);
});
