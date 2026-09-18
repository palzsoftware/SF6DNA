import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const slugs = [
  "ryu", "jp", "zangief", "chun-li", "dhalsim", "kimberly", "luke",
  "jamie", "guile", "juri", "ken", "blanka", "e-honda", "dee-jay",
  "manon", "marisa", "lily", "cammy", "rashid", "aki", "ed", "akuma",
  "m-bison", "terry", "mai", "elena", "sagat", "c-viper", "alex",
  "ingrid", "yasmine",
];

test("all 31 preview routes share the audited copy and layout component", () => {
  const route = read("src/lib/character-detail-route.ts");
  const page = read("src/app/characters/[slug]/page.tsx");
  assert.equal(slugs.length, 31);
  assert.equal(new Set(slugs).size, 31);
  for (const slug of slugs) assert.match(route, new RegExp(`"${slug}"`));
  assert.match(page, /<CharacterDetailPilot/);
  assert.match(route, /process\.env\.VERCEL_ENV === "preview"/);
});

test("public terminology normalization covers the approved Japanese terms", () => {
  const normalization = read("src/lib/public-copy.ts");
  const required = [
    "ドライブラッシュ", "ドライブインパクト", "ドライブゲージ",
    "ジャストパリィ", "パニッシュカウンター", "カウンターヒット",
    "バーンアウト", "スーパーアーツ", "ドライブリバーサル", "OD",
  ];
  for (const term of required) assert.match(normalization, new RegExp(term));
  assert.match(normalization, /publication gated/);
  assert.match(normalization, /secondary-current/);
});

test("shared public component removes internal prose and English-only UI labels", () => {
  const component = read("src/components/character-detail-pilot.tsx");
  const combo = read("src/components/pilot-combo-card.tsx");
  assert.match(component, /isInternalMoveNote/);
  assert.match(component, /normalizePublicCopy/);
  assert.doesNotMatch(component, />HOW TO PLAY<|>PROFILE<|>STRENGTH<|>CAUTION<|>MOVE DATA<|>PLAYERS<|>VIDEOS</);
  assert.doesNotMatch(combo, />MOTION MEDIA<|"Drive Gauge使用量"|"Patch"|"Source"/);
  assert.match(combo, /ドライブゲージ使用量/);
  assert.match(combo, /対応バージョン/);
});

test("responsive contract covers desktop, tablet, mobile and narrow mobile without page masking", () => {
  const css = read("src/components/character-detail-pilot.module.css");
  assert.match(css, /grid-template-columns:\s*minmax\(0,1\.25fr\)\s+minmax\(380px,\.75fr\)/);
  assert.match(css, /@media \(max-width:\s*1080px\)/);
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /@media \(max-width:\s*420px\)/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(css, /\.pilot\s*\{[^}]*overflow-x:\s*hidden/s);
});
