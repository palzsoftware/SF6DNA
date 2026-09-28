import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { videoPlayerFromQuery, videoPlayerHref } from "../src/lib/video-player-filter.ts";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("player video URL carries the exact player filter value", () => {
  for (const name of ["翔", "Player One", "ときど / Tokido"]) {
    const url = new URL(videoPlayerHref(name), "https://sf6dna.example");
    assert.equal(url.pathname, "/videos");
    assert.equal(videoPlayerFromQuery(url.searchParams.get("player") ?? undefined), name);
  }
  assert.equal(videoPlayerFromQuery(["  翔  ", "別の選手"]), "翔");
  assert.equal(videoPlayerFromQuery(" "), null);
  assert.equal(videoPlayerFromQuery("x".repeat(200))?.length, 100);
});

test("public navigation uses available routes and seeds the existing player facet", async () => {
  const [improve, matchup, playerPage, videosPage, library, videoFilters, flags] = await Promise.all([
    read("src/components/improvement-loop-tool.tsx"),
    read("src/app/matchup-card/page.tsx"),
    read("src/app/players/[slug]/page.tsx"),
    read("src/app/videos/page.tsx"),
    read("src/components/video-library.tsx"),
    read("src/lib/video-library.ts"),
    read("src/lib/release-features.ts"),
  ]);
  assert.match(flags, /training:\s*false/);
  assert.match(flags, /publicStrategyContent:\s*false/);
  assert.doesNotMatch(improve, /href=\{`\/characters\/\$\{[^}]+\}\/(training|matchups)`\}/);
  assert.match(improve, /href="\/me\/training"/);
  assert.doesNotMatch(matchup, /href=\{`\/characters\/\$\{[^}]+\}\/(training|moves)`\}/);
  assert.match(matchup, /releaseFeatures\.publicStrategyContent\s*\?\s*<Link/);
  assert.match(matchup, /<article className="search-result"/);
  assert.match(playerPage, /href=\{videoPlayerHref\(player\.displayName\)\}/);
  assert.match(videosPage, /videoPlayerFromQuery\(\(await searchParams\)\.player\)/);
  assert.match(videosPage, /initialPlayer=\{player\}/);
  assert.match(library, /players: initialPlayer \? new Set\(\[initialPlayer\]\) : new Set\(\)/);
  assert.match(videoFilters, /includesAny\(video\.players, filters\.players\)/);
});
