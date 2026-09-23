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
  assert.equal(manifest.clips.length, 7);

  const moveIds = new Set();
  const mediaUrls = new Set();
  for (const clip of manifest.clips) {
    assert.equal(clip.verification_status, "approved_for_preview");
    assert.equal(clip.media_type, "video");
    assert.equal(clip.width, 640);
    assert.equal(clip.height, 360);
    assert.equal(clip.fps, 60);
    assert.ok(!moveIds.has(clip.move_id), `duplicate move ${clip.move_id}`);
    assert.ok(!mediaUrls.has(clip.media_url), `duplicate media ${clip.media_url}`);
    moveIds.add(clip.move_id);
    mediaUrls.add(clip.media_url);

    for (const url of [clip.media_url, clip.poster_url]) {
      const asset = new URL(`../public${url}`, import.meta.url);
      assert.ok(existsSync(asset), `${url} must exist`);
    }
    const media = new URL(`../public${clip.media_url}`, import.meta.url);
    assert.equal(statSync(media).size, clip.filesize_bytes);
  }
});

test("pilot is JP-only and remains behind the device Preview request path", () => {
  assert.match(loader, /JP_CHARACTER_ID/);
  assert.match(loader, /characterId !== JP_CHARACTER_ID/);
  assert.doesNotMatch(loader, /RYU_CHARACTER_ID|character_slug !== "ryu"/);
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
