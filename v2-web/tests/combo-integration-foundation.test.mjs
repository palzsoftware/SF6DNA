import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Combo list keeps publication filtering before mapping expanded data", () => {
  const loader = read("src/lib/character-sections.ts");
  const comboBlock = loader.split('if (section === "combos") {').at(-1).split('if (section === "setups") {')[0];
  assert.match(comboBlock, /\.eq\("status", "published"\)/);
  assert.match(comboBlock, /\.eq\("verification_status", "verified"\)/);
  assert.match(comboBlock, /getPublicEntitySources\(\["combo"\], combos\.map/);
  assert.match(comboBlock, /source\?\.title/);
  assert.doesNotMatch(comboBlock, /entity_sources.*note|sources.*notes/);
});

test("Expanded Combo path preserves the unknown numeric state and source safety", () => {
  const loader = read("src/lib/character-sections.ts");
  const explorer = read("src/components/combo-explorer.tsx");
  const card = read("src/components/pilot-combo-card.tsx");
  assert.match(loader, /command: row\.notation \?\? null/);
  assert.match(loader, /patch: row\.valid_to_patch_id === null && patch\?\.version_label/);
  assert.match(explorer, /\.\.\.item\.combo/);
  assert.match(card, /value === null \|\| value === undefined/);
  assert.match(card, /url\.protocol === "https:" \|\| url\.protocol === "http:"/);
  assert.match(card, /rel="noopener noreferrer"/);
  assert.match(card, /<details/);
  assert.match(card, /preload="none"/);
});
