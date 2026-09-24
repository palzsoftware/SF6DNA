import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";

const manifest = JSON.parse(readFileSync(new URL("../src/data/SF6DNA_VER1_RYU_JP_MEDIA_MANIFEST_20260923.json", import.meta.url), "utf8"));
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

test("pilot is JP-only, filters held clips, and remains behind the device Preview request path", () => {
  assert.match(loader, /JP_CHARACTER_ID/);
  assert.match(loader, /characterId !== JP_CHARACTER_ID/);
  assert.doesNotMatch(loader, /RYU_CHARACTER_ID|character_slug !== "ryu"/);
  assert.match(loader, /verification_status === "approved_for_preview"/);
  assert.match(preview, /process\.env\.VERCEL_ENV !== "preview"/);
  assert.match(preview, /if \(!isDevicePreviewRequest\(previewToken\)\) return pilotMedia/);
  assert.match(preview, /getPreviewPilotMotionMedia/);
});

test("video behaves like lightweight motion media without native controls", () => {
  assert.match(component, /autoPlay/);
  assert.match(component, /loop/);
  assert.match(component, /muted/);
  assert.match(component, /playsInline/);
  assert.match(component, /poster=/);
  assert.match(component, /preload="none"/);
  assert.doesNotMatch(component, /\scontrols(?:\s|=)/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /video\.pause\(\)/);
});
