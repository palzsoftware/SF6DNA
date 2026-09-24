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
  assert.equal(manifest.clips.length, 1);
  assert.deepEqual(manifest.clips.map(({ move_id, move_slug, variant, verification_status }) =>
    [move_id, move_slug, variant, verification_status]), [
    ["aab86b9c-f501-4928-8818-114f5fc0574a", "luke-nose-breaker", "default", "approved_for_preview"],
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
