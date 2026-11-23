import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("every selected-filter chip announces what it clears to screen readers", () => {
  const source = read("src/components/player-directory.tsx");
  assert.match(source, /aria-label=\{`\$\{team\}の絞り込みを解除`\}/);
  assert.match(source, /aria-label=\{`\$\{playerTypeLabel\(category\)\}の絞り込みを解除`\}/);
  assert.match(source, /aria-label=\{`\$\{name\}の絞り込みを解除`\}/);
  const chipBlock = source.slice(source.indexOf("選択中のフィルター"), source.indexOf("filterNote"));
  const buttons = chipBlock.match(/<button type="button"[^>]*>/g) ?? [];
  assert.equal(buttons.length, 3);
  for (const button of buttons) assert.match(button, /aria-label=/);
});
