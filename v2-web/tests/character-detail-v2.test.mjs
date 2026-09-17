import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const tabs = readFileSync(new URL("../src/components/character-tabs.tsx", import.meta.url), "utf8");
const sectionPage = readFileSync(new URL("../src/app/characters/[slug]/[section]/page.tsx", import.meta.url), "utf8");
const motion = readFileSync(new URL("../src/components/move-motion-media.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../src/app/characters/[slug]/page.tsx", import.meta.url), "utf8");
const fixture = readFileSync(new URL("../src/lib/character-detail-v21-fixture.ts", import.meta.url), "utf8");
const pilot = readFileSync(new URL("../src/components/character-detail-pilot.tsx", import.meta.url), "utf8");

test("public character navigation keeps strategy sections behind the existing boundary", () => {
  const publicBlock = tabs.match(/const publicTabs:[\s\S]*?\n\];/)?.[0] ?? "";
  assert.match(publicBlock, /overview/);
  assert.match(publicBlock, /players/);
  assert.match(publicBlock, /videos/);
  assert.doesNotMatch(publicBlock, /moves|combos|setups|sequences|matchups|training/);
});

test("device preview navigation exposes the shared character-detail information architecture", () => {
  const pilotBlock = tabs.match(/const pilotV21Tabs:[\s\S]*?\n\];/)?.[0] ?? "";
  for (const key of ["overview", "moves", "combos", "setups", "sequences", "videos"]) {
    assert.match(pilotBlock, new RegExp(`key: "${key}"`));
  }
  assert.doesNotMatch(pilotBlock, /players|training|情報源/);
  assert.match(tabs, /!pilotV21/);
  assert.match(tabs, /aria-current/);
});

test("disabled strategy routes remain unavailable publicly and open only in Vercel device preview", () => {
  assert.match(sectionPage, /!isReleaseSectionEnabled\(section\) && !previewActive/);
  assert.match(sectionPage, /publicStrategyContent/);
});

test("motion media renders only when a record exists and supports accessible GIF or video output", () => {
  assert.match(sectionPage, /move\.media \? \(/);
  assert.match(sectionPage, /<MoveMotionMedia/);
  assert.match(motion, /media\.mediaType === "gif"/);
  assert.match(motion, /<video/);
  assert.match(motion, /aria-label=\{`\$\{title\}のモーション`\}/);
  assert.match(motion, /showSource && media\.sourceUrl/);
  assert.doesNotMatch(motion, /GIF準備中/);
});

test("Ryu and JP use a protected Preview-only fixture when the legacy RPC gate is unavailable", () => {
  assert.match(page, /remotePilotBundle \?\? \(pilotRequested \? getCharacterDetailV21Fixture/);
  assert.match(fixture, /status: "draft"/);
  assert.match(fixture, /verificationStatus: "unverified"/);
  assert.doesNotMatch(fixture, /verificationStatus: "verified"/);
  assert.match(pilot, /未検証・確認用候補/);
});
