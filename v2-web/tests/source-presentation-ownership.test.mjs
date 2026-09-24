import assert from "node:assert/strict";
import test from "node:test";
import { presentSource } from "../src/lib/source-presentation.ts";

test("official source labels require an actual CAPCOM domain", () => {
  const official = presentSource("official_frame", "CAPCOM", "https://www.streetfighter.com/6/ja-jp/character/jp/frame");
  assert.deepEqual(official, { badge: "CAPCOM公式", cta: "公式フレームデータを見る" });

  const mirror = presentSource("official_frame", "CAPCOM", "https://example.com/character/jp/frame");
  assert.deepEqual(mirror, { badge: "フレームデータ", cta: "フレームデータを見る" });

  const deceptiveHost = presentSource("official", "CAPCOM", "https://capcom.com.example.org/guide");
  assert.deepEqual(deceptiveHost, { badge: "情報源", cta: "情報源を見る" });

  const video = presentSource("official", "CAPCOM", "https://www.youtube.com/watch?v=example");
  assert.deepEqual(video, { badge: "YouTube", cta: "関連動画を見る" });
});
