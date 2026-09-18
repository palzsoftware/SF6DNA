import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const batches = {
  A: ["jamie", "guile", "juri", "ken", "blanka", "e-honda", "dee-jay"],
  B: ["manon", "marisa", "lily", "cammy", "rashid", "aki", "ed", "akuma"],
  C: ["m-bison", "terry", "mai", "elena", "sagat", "c-viper", "alex", "ingrid", "yasmine"],
};

test("continuous rollout batches cover all remaining 24 characters", () => {
  const route = read("src/lib/character-detail-route.ts");
  const fixture = read("src/lib/character-detail-v21-fixture.ts");
  const rollout = Object.values(batches).flat();
  assert.equal(rollout.length, 24);
  assert.equal(new Set(rollout).size, 24);
  for (const slug of rollout) {
    assert.match(route, new RegExp(`"${slug}"`));
    assert.match(fixture, new RegExp(`"${slug}"`));
  }
});

test("overview-only rollout cannot expose Ryu or JP gameplay fixtures", () => {
  const fixture = read("src/lib/character-detail-v21-fixture.ts");
  assert.match(fixture, /if \(slug === "ryu" \|\| slug === "jp"\) return fixtures\[slug\]/);
  assert.match(fixture, /if \(overviewOnlySlugs\.has\(slug\)\)/);
  assert.match(fixture, /return \{ \.\.\.sharedEmpty, combos: \[\], setups: \[\], sequences: \[\] \}/);
});

test("rollout remains Preview-only with public strategy disabled", () => {
  const route = read("src/lib/character-detail-route.ts");
  const flags = read("src/lib/release-features.ts");
  assert.match(route, /process\.env\.VERCEL_ENV === "preview"/);
  assert.match(flags, /publicStrategyContent:\s*false/);
  assert.doesNotMatch(flags, /publicStrategyContent:\s*true/);
});
