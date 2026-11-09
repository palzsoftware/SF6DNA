import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../src/" + path, import.meta.url), "utf8");

test("Preview registry is character-scoped and stays separate from publication", () => {
  const registry = read("lib/character-video-preview.ts");
  const list = read("app/videos/page.tsx");
  const detail = read("app/characters/[slug]/page.tsx");
  assert.match(registry, /ryu: RYU_VIDEO_PREVIEW/);
  assert.match(registry, /previewVideosByCharacter\[characterSlug\] \?\? \[\]/);
  assert.match(list, /process\.env\.VERCEL_ENV === "preview" \? getAllPreviewVideoCandidates\(\) : \[\]/);
  assert.match(detail, /process\.env\.VERCEL_ENV === "preview" \? getCharacterPreviewVideos\(character\.slug\) : \[\]/);
  assert.match(list, /!publishedIds\.has\(youtubeId\)/);
  assert.match(detail, /!publishedYoutubeIds\.has\(youtubeId\)/);
});
test("Video listing uses 24 item increments and has one search form", () => {
  const library = read("components/video-library.tsx");
  const page = read("app/videos/page.tsx");
  assert.match(library, /useState\(24\)/);
  assert.match(library, /count \+ 24/);
  assert.match(library, /さらに24件表示/);
  assert.match(page, /hideSearchInput listingOnly/);
  assert.equal((page.match(/<VideoSearchForm /g) ?? []).length, 1);
});
