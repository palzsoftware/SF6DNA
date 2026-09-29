import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { validateMotionMediaManifest } from "../../scripts/validate-motion-media.mjs";

const manifest = JSON.parse(readFileSync(new URL("../src/data/SF6DNA_VER1_RYU_JP_MEDIA_MANIFEST_20260923.json", import.meta.url), "utf8"));
const ryuManifest = JSON.parse(readFileSync(new URL("../src/data/SF6DNA_VER1_RYU_MEDIA_MANIFEST_20260924.json", import.meta.url), "utf8"));
const component = readFileSync(new URL("../src/components/move-motion-media.tsx", import.meta.url), "utf8");
const loader = readFileSync(new URL("../src/lib/preview-motion-media-pilot.ts", import.meta.url), "utf8");
const preview = readFileSync(new URL("../src/lib/device-preview.ts", import.meta.url), "utf8");

test("JP pilot manifest has unique, canonical move mappings and valid assets", () => {
  assert.equal(manifest.manifest_version, "1.0");
  assert.equal(manifest.character_slug, "jp");
  assert.equal(manifest.source_owner, "user_capture");
  assert.ok(manifest.clips.length >= 7);

  const allowedStatuses = new Set(["approved_for_preview", "mapping_hold"]);
  const mappingKeys = new Set();
  const mediaUrls = new Set();
  for (const clip of manifest.clips) {
    assert.ok(allowedStatuses.has(clip.verification_status), `unexpected status ${clip.verification_status}`);
    assert.equal(clip.media_type, "video");
    assert.equal(clip.width, 640);
    assert.equal(clip.height, 360);
    assert.equal(clip.fps, 60);
    const mappingKey = `${clip.move_id}::${clip.variant}`;
    assert.ok(!mappingKeys.has(mappingKey), `duplicate mapping ${mappingKey}`);
    assert.ok(!mediaUrls.has(clip.media_url), `duplicate media ${clip.media_url}`);
    mappingKeys.add(mappingKey);
    mediaUrls.add(clip.media_url);

    for (const url of [clip.media_url, clip.poster_url]) {
      const asset = new URL(`../public${url}`, import.meta.url);
      assert.ok(existsSync(asset), `${url} must exist`);
    }
    const media = new URL(`../public${clip.media_url}`, import.meta.url);
    assert.equal(statSync(media).size, clip.filesize_bytes);
  }
});

test("unverified Amnesia counter is held and excluded from Preview", () => {
  const amnesia = manifest.clips.filter((clip) => clip.move_slug.startsWith("jp-amnesia"));
  assert.equal(amnesia.length, 1);
  assert.equal(amnesia[0].move_slug, "jp-amnesia-od");
  assert.equal(amnesia[0].variant, "counter");
  assert.equal(amnesia[0].verification_status, "mapping_hold");
  assert.equal(manifest.clips.filter((clip) => clip.category === "specials" && clip.verification_status === "approved_for_preview").length, 0);
});

test("JP SA and CA clips match reviewed gauge and health states in the SHA-verified capture", () => {
  const source = manifest.source_files.find((item) => item.filename === "jp_specials_20260923_take01.mp4");
  assert.equal(source.sha256, "5b6f89ad9308ea348908e1fb1b7d04dfe710bad23ab2d07c665194dc974bb554");
  assert.equal(source.category, "super_arts");
  assert.match(source.content_note, /Filename says specials/);
  const superClips = manifest.clips.filter((clip) => clip.category === "super_arts");
  assert.deepEqual(new Map(superClips.map((clip) => [clip.move_slug, clip.move_id])), new Map([
    ["jp-sa2", "85762bb5-b5ae-4a88-b4ee-55112037774e"],
    ["jp-sa1", "7817f9e6-8542-4da1-be01-c6bd24294f22"],
    ["jp-sa3", "1845d4b9-4bac-4e4e-b6fd-3b57accfa973"],
    ["jp-ca", "2472fe66-f312-4a5d-9c7c-25e0fa2515d7"],
  ]));
  assert.ok(superClips.every((clip) => clip.source_file === source.filename && clip.verification_status === "approved_for_preview" && clip.cut_review_status === "CUT_REVIEW_PASS"));
  assert.match(superClips.find((clip) => clip.move_slug === "jp-ca").mapping_evidence, /CA indicator/);
  const publicRoot = new URL("../public/", import.meta.url).pathname;
  assert.deepEqual(validateMotionMediaManifest(manifest, { publicRoot }).errors, []);
});

test("Ryu pilot maps the reviewed normals and two distinguishable specials", () => {
  assert.equal(ryuManifest.character_slug, "ryu");
  assert.equal(ryuManifest.clips.length, 4);
  assert.deepEqual(new Map(ryuManifest.clips.map((clip) => [clip.move_slug, clip.move_id])), new Map([
    ["ryu-standing-hk", "b2362378-1411-45ae-a0f0-014e898042e0"],
    ["ryu-crouching-hk", "06cb478c-ed44-47f7-99ec-1a2dbe45e8b5"],
    ["ryu-denjin-charge", "db46db6f-26dd-4638-8397-d235750929b9"],
    ["ryu-od-high-blade-kick", "1aefba80-f15b-4bf2-b96c-a06155070371"],
  ]));
  assert.equal(ryuManifest.clips.filter((clip) => clip.category === "normals").length, 2);
  assert.equal(ryuManifest.clips.filter((clip) => clip.category === "specials").length, 2);
  assert.ok(ryuManifest.clips.every((clip) => clip.variant === "default" && clip.verification_status === "approved_for_preview"));
  assert.equal(ryuManifest.clips.filter((clip) => clip.verification_status === "mapping_hold").length, 0);
  assert.equal(ryuManifest.clips.filter((clip) => clip.category === "unique_attacks").length, 0);
  const publicRoot = new URL("../public/", import.meta.url).pathname;
  assert.deepEqual(validateMotionMediaManifest(ryuManifest, { publicRoot }).errors, []);
  const duplicate = { ...ryuManifest, clips: [...ryuManifest.clips, { ...ryuManifest.clips.at(-1) }] };
  assert.ok(validateMotionMediaManifest(duplicate, { publicRoot }).errors.some((error) => error.includes("duplicate move_id + variant")));
});

test("pilot maps JP and Ryu separately, filters held clips, and remains Preview-only", () => {
  assert.match(loader, /JP_CHARACTER_ID/);
  assert.match(loader, /RYU_CHARACTER_ID/);
  assert.match(loader, /characterId === RYU_CHARACTER_ID && ryuManifest.character_slug === "ryu"/);
  assert.match(loader, /verification_status === "approved_for_preview"/);
  assert.match(preview, /process\.env\.VERCEL_ENV !== "preview"/);
  assert.match(preview, /if \(!isDevicePreviewRequest\(previewToken\)\) return pilotMedia/);
  assert.match(preview, /getPreviewPilotMotionMedia/);
});

test("video starts only near the viewport and respects reduced motion", () => {
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /nearby = entry\.isIntersecting/);
  assert.doesNotMatch(component, /\sautoPlay\b/);
  assert.match(component, /loop/);
  assert.match(component, /muted/);
  assert.match(component, /playsInline/);
  assert.match(component, /poster=/);
  assert.match(component, /preload="none"/);
  assert.doesNotMatch(component, /\scontrols(?:\s|=)/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /video\.pause\(\)/);
});
