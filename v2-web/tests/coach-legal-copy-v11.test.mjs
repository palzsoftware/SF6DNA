import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../src/app/${path}/page.tsx`, import.meta.url), "utf8");
test("FAQ preserves the public-off boundary and explains AI uncertainty", () => {
  const text = read("faq");
  assert.match(text, /AIコーチは現在公開していません/);
  assert.match(text, /誤りが含まれる可能性/);
  assert.match(text, /本人の発言や確認済み事実/);
});
test("Privacy avoids unsupported provider-specific promises", () => {
  const text = read("privacy");
  assert.match(text, /利用事業者、保持期間、学習利用、保存場所/);
  assert.match(text, /確認の完了後に案内/);
  assert.doesNotMatch(text, /OpenAI|Anthropic|Google Gemini/);
});
test("Terms and disclaimer identify AI output as fallible assistance", () => {
  assert.match(read("terms"), /誤り、不完全な情報、古い情報/);
  assert.match(read("disclaimer"), /AIによる推論は本人の発言ではなく/);
});
test("correction and contact route remains available", () => assert.match(read("faq"), /フィードバックまたはお問い合わせページ/));
