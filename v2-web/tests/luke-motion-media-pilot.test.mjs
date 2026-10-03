import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateMotionMediaManifest } from "../../scripts/validate-motion-media.mjs";

const manifest = JSON.parse(readFileSync(new URL("../src/data/SF6DNA_VER1_LUKE_MEDIA_MANIFEST_20260924.json", import.meta.url), "utf8"));
const publicRoot = new URL("../public/", import.meta.url).pathname;
const loader = readFileSync(new URL("../src/lib/preview-motion-media-pilot.ts", import.meta.url), "utf8");
const fixture = readFileSync(new URL("../src/lib/character-detail-v21-fixture.ts", import.meta.url), "utf8");

test("Luke's reviewed target combo maps to its existing Move and has playable media and poster", () => {
  assert.equal(manifest.character_slug, "luke");
  assert.equal(manifest.clips.length, 6);
  assert.deepEqual(manifest.clips.map(({ move_id, move_slug, variant, verification_status }) =>
    [move_id, move_slug, variant, verification_status]), [
    ["aab86b9c-f501-4928-8818-114f5fc0574a", "luke-nose-breaker", "default", "approved_for_preview"],
    ["42cfd8d8-a47b-4d89-8fd6-95e758b07e0d", "luke-triple-impact", "default", "approved_for_preview"],
    ["a6088794-0ed1-4ee9-9d4a-ee4cbe159e37", "luke-snapback-combo", "default", "approved_for_preview"],
    ["9e34282d-9da4-43fb-a47c-dfdd72eda6ee", "luke-sa1-vulcan-blast", "default", "approved_for_preview"],
    ["a1931623-d8f1-47e4-9f18-ef4fde632b4b", "luke-sa2-eraser", "default", "approved_for_preview"],
    ["03dc215b-fe91-445b-9089-9a9d090ac1a0", "luke-sa3-pale-rider", "default", "approved_for_preview"],
  ]);
  assert.deepEqual(validateMotionMediaManifest(manifest, { publicRoot }).errors, []);
  assert.match(loader, /characterId === LUKE_CHARACTER_ID && lukeManifest.character_slug === "luke"/);
  assert.match(fixture, /slug === "ryu" \|\| slug === "jp" \|\| slug === "luke"/);
  assert.match(fixture, /aab86b9c-f501-4928-8818-114f5fc0574a/);
});

test("duplicate variants, held clips, and missing posters cannot silently enter the Luke pilot", () => {
  const duplicate = { ...manifest, clips: [...manifest.clips, { ...manifest.clips[0], media_url: "/other.mp4" }] };
  assert.ok(validateMotionMediaManifest(duplicate, { publicRoot }).errors.some((error) => error.includes("duplicate move_id + variant")));
  const variant = { ...manifest, clips: [...manifest.clips, { ...manifest.clips[0], variant: "od", media_url: "/other.mp4" }] };
  assert.ok(!validateMotionMediaManifest(variant, { publicRoot, checkFiles: false }).errors.some((error) => error.includes("duplicate move_id + variant")));
  const missing = { ...manifest, clips: [{ ...manifest.clips[0], poster_url: "/media/moves/luke/missing.webp" }] };
  assert.ok(validateMotionMediaManifest(missing, { publicRoot }).errors.some((error) => error.includes("missing asset")));
  assert.match(loader, /filter\(\(clip\) => clip.verification_status === "approved_for_preview"\)/);
});
