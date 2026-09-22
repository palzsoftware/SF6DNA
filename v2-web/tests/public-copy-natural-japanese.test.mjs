import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = [
  "src/app/page.tsx", "src/app/auth/page.tsx", "src/app/search/page.tsx", "src/app/players/page.tsx",
  "src/app/videos/page.tsx", "src/app/faq/page.tsx", "src/app/feedback/page.tsx", "src/app/contact/page.tsx",
  "src/app/about/page.tsx", "src/app/sources/page.tsx", "src/app/privacy/page.tsx", "src/app/terms/page.tsx",
  "src/app/disclaimer/page.tsx", "src/app/favorites/page.tsx", "src/app/diagnosis/page.tsx",
  "src/app/matchup-card/page.tsx", "src/app/characters/[slug]/page.tsx", "src/components/logout-button.tsx",
  "src/components/contact-form.tsx",
  "src/components/video-library.tsx", "src/components/diagnosis-runner.tsx",
];
const sources = await Promise.all(files.map((file) => readFile(new URL(`../${file}`, import.meta.url), "utf8")));
const publicCopy = sources.join("\n");

test("reviewed public copy does not contain known stale or internal phrases", () => {
  for (const phrase of [
    "ブラウザー", "公開metadata", "relationの公開", "metadata待ち", "用Evidence", "Traitデータ",
    "公開情報を検索", "プレイアブル31キャラクターを収録", "診断・図鑑・練習メニューがひとつになった",
    "アカウントID", "不具合についてご連絡いただく場合", "アカウントを切り替える場合",
    "サイト内で送信", "よく確認するキャラクター", ">開く →</span>",
  ]) assert.doesNotMatch(publicCopy, new RegExp(phrase));
});

test("reviewed routes use concrete destination labels", () => {
  assert.match(publicCopy, /SF6の情報を探す/);
  assert.match(publicCopy, /問い合わせフォームへ/);
  assert.match(publicCopy, /攻略・対戦・大会などの動画を探せます/);
  assert.match(publicCopy, /問い合わせを送信/);
  assert.match(publicCopy, /問い合わせフォームへ/);
  assert.match(publicCopy, /詳しく見る →/);
});

test("Login and Contact helpers use natural copy without weakening retention disclosure", () => {
  assert.match(publicCopy, /診断結果をアカウントに保存できます/);
  assert.match(publicCopy, /別のアカウントを使う場合は、いったんログアウトしてください/);
  assert.match(publicCopy, /お問い合わせへの返信に必要なメールアドレスと内容を保存します/);
  assert.match(publicCopy, /迷惑行為対策用の情報を含め、保存したデータは180日以内に削除します/);
  assert.match(publicCopy, /利用中のアカウントを識別する情報を関連付けます/);
});
