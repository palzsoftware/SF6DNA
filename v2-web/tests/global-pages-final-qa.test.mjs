import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("FAQ provides searchable categories and accessible disclosures", async () => {
  const [page, browser] = await Promise.all([
    read("src/app/faq/page.tsx"),
    read("src/components/faq-browser.tsx"),
  ]);
  assert.match(page, /情報と出典/);
  assert.match(page, /AIコーチは現在公開していません/);
  assert.match(browser, /type="search"/);
  assert.match(browser, /<details/);
  assert.match(browser, /aria-live="polite"/);
});

test("footer groups global links and includes feedback", async () => {
  const layout = await read("src/app/layout.tsx");
  for (const label of ["ガイド", "コンテンツ", "情報と方針", "その他"]) assert.match(layout, new RegExp(label));
  for (const href of ["/about", "/faq", "/feedback", "/sources", "/privacy", "/terms", "/disclaimer", "/contact"]) {
    assert.match(layout, new RegExp(`href="${href}"`));
  }
});

test("feedback V1 is guidance-only and does not collect submissions", async () => {
  const page = await read("src/app/feedback/page.tsx");
  assert.match(page, /このページから送信・公開されるフォームや掲示板はありません/);
  assert.doesNotMatch(page, /<form/);
  assert.match(page, /href="\/contact"/);
});

test("sources page explains publication states", async () => {
  const page = await read("src/app/sources/page.tsx");
  for (const label of ["公式情報・一次情報", "ゲーム内確認待ち", "更新確認中", "外部リンク"]) assert.match(page, new RegExp(label));
});
