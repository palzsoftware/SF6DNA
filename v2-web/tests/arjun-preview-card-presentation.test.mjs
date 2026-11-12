import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
test("Arjun Preview cards retain 142 unpublished records and use a presentation-only formatter", () => {
  const src = read("../src/lib/arjun-142-preview-strategy.tsx");
  assert.match(src,/research\.count !== 142/);
  assert.match(src,/publication_status !== "not_imported"/);
  assert.match(src,/formatArjunPreviewCard/);
  assert.match(src,/情報源を確認/);
  assert.match(src,/ダメージ（資料記載の目安・未検証）/);
  assert.match(src,/対策する技/);
});
test("combo damage is only extracted from an explicitly numeric lead and kept unverified", () => {
  const src = read("../src/lib/arjun-preview-card-format.ts");
  assert.match(src,/isCombo \? row\.details\.match/);
  assert.match(src,/掲載目安/);
  assert.match(src,/カウンター/);
  assert.match(src,/実機未検証/);
});
test("Preview video search is interactive without public video registry writes", () => {
  const src = read("../src/components/arjun-video-preview-search.tsx");
  assert.match(src,/"use client"/);
  assert.match(src,/useMemo/);
  assert.match(src,/検索結果/);
  assert.match(src,/previewCandidate previewLocalOnly/);
  assert.doesNotMatch(src,/\.from\(|createClient|fetch\(/);
});
test("player candidates remain explicitly unverified and display video evidence without main promotion", () => {
  const src = read("../src/components/arjun-player-video-preview-qa.tsx");
  assert.match(src,/arjunPreviewQaEnabled/);
  assert.match(src,/メイン使用未確認/);
  assert.match(src,/関連動画の候補を見る/);
  assert.match(src,/ArjunVideoPreviewSearch/);
});

test("Preview favorites and unwatched filters reuse the video-card preference store", () => {
  const src = read("../src/components/arjun-video-preview-search.tsx");
  assert.match(src, /useOwnedVideoPreferences\(true\)/);
  assert.match(src, /preferences\.favorites\.has\(video\.id\)/);
  assert.match(src, /!preferences\.watched\.has\(video\.id\)/);
  assert.match(src, /onPreferenceChange=\{preferences\.refresh\}/);
  assert.match(src, /お気に入りのみ/);
  assert.match(src, /未視聴のみ/);
  assert.match(src, /disabled=\{preferences\.status !== "ready"\}/);
  assert.doesNotMatch(src, /createClient\(|localStorage\.|\.from\(/);
});
