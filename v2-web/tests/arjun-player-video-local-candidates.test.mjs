import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read = file => fs.readFileSync(new URL(file, import.meta.url), "utf8");
test("additive page retains strict local-only route gate", () => {
  const code = read("../src/app/arjun-research-local/page.tsx");
  assert.match(code, /NODE_ENV !== "development"/);
  assert.match(code, /process\.env\.VERCEL_ENV/);
  assert.match(code, /SF6DNA_ARJUN_LOCAL_PREVIEW !== "1"/);
  assert.match(code, /ArjunPlayerVideoLocalPreview/);
});
test("reuses indexed video source with no invented claims", () => {
  const code = read("../src/lib/arjun-player-video-local-candidates.ts");
  assert.match(code, /CHARACTER_VIDEO_ARJUN_RESEARCH/);
  assert.match(code, /IDENTITY_AND_CHARACTER_RELATION_UNVERIFIED/);
  assert.doesNotMatch(code,/getSupabaseServerClient|service_role|CREATE|INSERT|UPDATE/);
});
test("VideoCard receives Preview-only and non-persistent preference flags", () => {
  const code = read("../src/components/arjun-player-video-local-preview.tsx");
  assert.match(code, /<VideoCard/);
  assert.match(code, /previewCandidate previewLocalOnly/);
  assert.match(code, /verified-player-count="0"/);
});
test("safe apply is additive and refuses changes to pre-existing files", () => {
  const code = read("../../apply_additive_local.py");
  assert.match(code, /existing file differs/);
  assert.doesNotMatch(code, /v2-web\/src\/app\/characters\/\[slug\]\/page\.tsx',/);
});
