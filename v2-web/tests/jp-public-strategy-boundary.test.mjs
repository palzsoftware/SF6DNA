import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../src/app/characters/[slug]/page.tsx", import.meta.url), "utf8");
const fixture = readFileSync(new URL("../src/lib/character-detail-v21-fixture.ts", import.meta.url), "utf8");

test("ordinary JP detail never passes draft strategy cards to its public renderer", () => {
  assert.match(fixture, /jp: \{[\s\S]*?combos: \[[\s\S]*?status: "draft"/);
  assert.match(page, /const publicJpBundle = previewActive \? pilotBundle : \{/);
  for (const kind of ["combos", "setups", "sequences"]) {
    assert.match(page, new RegExp(`${kind}: releaseFeatures\\.publicStrategyContent[\\s\\S]*?pilotBundle\\.${kind}\\.filter\\(\\(item\\) => item\\.status === "published" && item\\.verificationStatus === "verified"\\) : \\[\\]`));
  }
  assert.match(page, /<JpCharacterDetail[\s\S]*?bundle=\{publicJpBundle\}/);
});
