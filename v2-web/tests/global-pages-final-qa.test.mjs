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

test("feedback routes users to the Contact form", async () => {
  const page = await read("src/app/feedback/page.tsx");
  assert.match(page, /お問い合わせページの案内に沿って/);
  assert.match(page, /href="\/contact"/);
});

test("public contact is centralized and used consistently across contact and legal pages", async () => {
  const [contact, feedback, privacy, terms, disclaimer, faq, shared, flags] = await Promise.all([
    read("src/app/contact/page.tsx"),
    read("src/app/feedback/page.tsx"),
    read("src/app/privacy/page.tsx"),
    read("src/app/terms/page.tsx"),
    read("src/app/disclaimer/page.tsx"),
    read("src/app/faq/page.tsx"),
    read("src/lib/contact.ts"),
    read("src/lib/release-features.ts"),
  ]);
  assert.match(shared, /pal2software\.support@gmail\.com/);
  assert.match(shared, /mailto:\$\{PUBLIC_CONTACT_EMAIL\}/);
  for (const page of [contact, feedback, privacy, terms, disclaimer]) {
    assert.match(page, /PUBLIC_CONTACT_MAILTO/);
    assert.match(page, /PUBLIC_CONTACT_EMAIL/);
  }
  assert.match(contact, /<ContactForm/);
  assert.match(contact, /180日以内に削除/);
  assert.match(faq, /PUBLIC_CONTACT_EMAIL/);
  for (const source of [contact, feedback, faq]) {
    assert.doesNotMatch(source, /受付先は、公開準備が整い次第|お問い合わせ窓口を準備|連絡先の準備状況/);
  }
  assert.match(flags, /aiCoach:\s*false/);
  assert.match(flags, /training:\s*false/);
  assert.match(flags, /publicStrategyContent:\s*false/);
});

test("sources page explains publication states", async () => {
  const page = await read("src/app/sources/page.tsx");
  for (const label of ["公式情報・一次情報", "ゲーム内での確認", "アップデート後の確認", "外部リンク"]) assert.match(page, new RegExp(label));
});
