import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {makeSourceLoader} from './helpers/ws12-render-contract.mjs';

// Actual unified page and strategy slots; unrelated personal/video components are isolated.
function renderUnified(slug, props) {
  const empty = () => null;
  const load = makeSourceLoader({
    'next/image': { default: empty, __esModule: true },
    'next/link': { default: 'a', __esModule: true },
    './video-card': { VideoCard: empty },
    './character-player-card': { CharacterPlayerCard: empty },
    './character-preference-actions': { CharacterPreferenceActions: empty },
    '@/lib/event-media': { formatVideoPublishedDate: value => value },
  });
  return renderToStaticMarkup(React.createElement(load('components/character-unified-page').CharacterUnifiedPage, {
    character: character(slug), players: [], videos: [], ...props,
  }));
}
import {character,bundle,assertUniqueAnchors} from './helpers/character-unified-ssr.mjs';
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../src/app/characters/[slug]/page.tsx", import.meta.url), "utf8");
const fixture = readFileSync(new URL("../src/lib/character-detail-v21-fixture.ts", import.meta.url), "utf8");
const jpDetail = readFileSync(new URL("../src/components/jp-character-detail.tsx", import.meta.url), "utf8");

test("ordinary JP detail never passes draft strategy cards to its public renderer", () => {
  assert.match(fixture,/jp: \{[\s\S]*?combos: \[[\s\S]*?status: "draft"/);
  const sentinel='DO_NOT_PUBLISH_DRAFT_STRATEGY';
  const input=bundle([], {combos:[{id:'draft',name:sentinel,command:sentinel,status:'draft',verificationStatus:'reviewed'}],setups:[{id:'setup',name:sentinel,status:'draft'}],sequences:[{id:'sequence',name:sentinel,status:'draft'}],training:[{id:'training',name:sentinel,status:'draft'}]});
  const before=JSON.stringify(input);
  for(const env of ['production','preview','development']){
    const previous=process.env.VERCEL_ENV;process.env.VERCEL_ENV=env;
    try{const html=renderUnified('jp',{bundle:input});assert.doesNotMatch(html,new RegExp(sentinel));assert.equal((html.match(/data-strategy-publication="CLOSED"/g)??[]).length,4);assert.doesNotMatch(html,/data-combo-id="draft"/);assertUniqueAnchors(assert,html);
      for (const id of ['pilot-combos', 'pilot-setplay', 'pilot-sequences', 'pilot-counters']) {
        assert.match(html, new RegExp('<section[^>]*id="'+id+'"[^>]*data-strategy-publication="CLOSED"'));
      }}
    finally{if(previous===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previous;}
  }
  assert.equal(JSON.stringify(input),before);
  assert.match(page,/localReferences=\{!production \?/);

});

test("JP move commands do not print internal verification notes", () => {
  assert.match(jpDetail, /command\.conditionText && !isInternalMoveNote\(command\.conditionText\) && !\/frame-table row; checked\/i\.test\(command\.conditionText\)/);
});
