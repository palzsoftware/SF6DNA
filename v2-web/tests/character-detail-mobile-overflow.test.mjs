import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const globalCss = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const pageCss = readFileSync(new URL("../src/app/character-overview-refresh.css", import.meta.url), "utf8");
const pilotCss = readFileSync(new URL("../src/components/character-detail-pilot.module.css", import.meta.url), "utf8");

test("JP page and detail grids can shrink inside a 375px viewport", () => {
  assert.match(pageCss, /\.character-overview-page\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(pageCss, /\.character-overview-page\s*>\s*\*\s*\{[^}]*min-width:\s*0/);
  assert.match(pilotCss, /\.pilot\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(pilotCss, /@media \(max-width: 760px\)[\s\S]*?\.moveRow\s*\{\s*grid-template-columns:\s*minmax\(0,1fr\)/);
  assert.match(pilotCss, /\.moveMediaAsset\s*\{[^}]*width:\s*100%/);
  assert.match(pilotCss, /\.moveCommands code\s*\{[^}]*overflow-wrap:\s*anywhere/);
});

test("horizontal rails remain scrollable within the page", () => {
  assert.match(globalCss, /\.character-tabs\s*\{[^}]*overflow-x:\s*auto/);
  for (const name of ["inlineSources", "comboList", "playerGrid", "videoList"]) {
    assert.match(pilotCss, new RegExp(`\\.${name}\\s*\\{[^}]*overflow-x:\\s*auto`));
  }
  assert.doesNotMatch(globalCss + pageCss + pilotCss, /(?:html\s*,\s*body|body\s*,\s*html)\s*\{[^}]*overflow-x:\s*(?:hidden|clip)/);
});
