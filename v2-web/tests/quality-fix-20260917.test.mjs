import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("character source actions use metadata-grounded presentation and retain a generic fallback", () => {
  const page = read("src/app/characters/[slug]/page.tsx");
  const presentation = read("src/lib/source-presentation.ts");
  assert.match(page, /presentSource\(source\.sourceType, source\.publisher, source\.url\)/);
  assert.doesNotMatch(page, /出典を開く/);
  assert.match(presentation, /関連動画を見る/);
  assert.match(presentation, /公式情報を見る/);
  assert.match(presentation, /フレームデータを見る/);
  assert.match(presentation, /プロフィールを見る/);
  assert.match(presentation, /記事を読む/);
  assert.match(presentation, /情報源を見る/);
});

test("player detail avoids developer-style empty copy and large no-image cards", () => {
  const page = read("src/app/players/[slug]/page.tsx");
  const identity = read("src/components/player-identity.tsx");
  const css = read("src/components/player-identity.module.css");
  assert.doesNotMatch(page, /公開できるプロフィール情報を準備中/);
  assert.match(identity, /選手ビジュアルは今後のアップデートで追加予定です/);
  assert.match(identity, /styles\.withoutPhoto/);
  assert.match(css, /\.withoutPhoto \{ min-height: 0/);
});

test("FAQ and Auth copy match currently released behavior", () => {
  const faq = read("src/app/faq/page.tsx");
  const auth = read("src/app/auth/page.tsx");
  assert.match(faq, /AIコーチは現在公開していません/);
  assert.match(auth, /完了した診断結果をアカウントに保存できます/);
  assert.match(auth, /この端末のブラウザに保存され、別の端末には自動で引き継がれません/);
});

test("video cards expose YouTube, share and reversible local watched state", () => {
  const card = read("src/components/video-card.tsx");
  const preferences = read("src/lib/video-preferences.ts");
  const loader = read("src/lib/event-media.ts");
  const page = read("src/app/videos/page.tsx");
  assert.match(card, /navigator\.share/);
  assert.match(card, /navigator\.clipboard\.writeText/);
  assert.match(preferences, /sf6dna:watched-videos:v1/);
  assert.match(card, /aria-pressed=\{watched\}/);
  assert.match(loader, /youtubeThumbnail/);
  assert.match(loader, /entity_videos/);
  assert.match(page, /<VideoLibrary/);
});
