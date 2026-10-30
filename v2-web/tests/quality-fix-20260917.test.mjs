import { assertVideoPreferenceCard } from './helpers/video-preference-card-contract.mjs';
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {makeSourceLoader} from './helpers/ws12-render-contract.mjs';

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("character source actions use metadata-grounded presentation and retain a generic fallback", () => {
  const page = read("src/app/characters/[slug]/page.tsx");
  const presentation = read("src/lib/source-presentation.ts");
  const unified=read('src/components/character-unified-page.tsx');
  assert.match(page, /<CharacterUnifiedPage/);
  assert.doesNotMatch(page, /出典を開く/);
  assert.match(presentation, /関連動画を見る/);
  assert.match(presentation, /公式情報を見る/);
  assert.match(presentation, /フレームデータを見る/);
  assert.match(presentation, /プロフィールを見る/);
  assert.match(presentation, /記事を読む/);
  assert.match(presentation, /参照先のサイトを見る/);
  const empty=()=>null;
  const load=makeSourceLoader({
    'next/image':{default:empty,__esModule:true},
    'next/link':{default:({children,...props})=>React.createElement('a',props,children),__esModule:true},
    './character-move-explorer':{CharacterMoveExplorer:empty},
    './move-motion-media':{MoveMotionMedia:empty},
    './character-player-card':{CharacterPlayerCard:empty},
    './video-card':{VideoCard:empty},
    './character-strategy-slot':{CharacterStrategySlot:empty},
    './character-preference-actions':{CharacterPreferenceActions:empty},
    '@/lib/public-copy':{isInternalMoveNote:()=>false,normalizePublicCopy:x=>x},
    '@/lib/event-media':{formatVideoPublishedDate:x=>x},
  });
  const {CharacterUnifiedPage}=load('components/character-unified-page.tsx');
  const base={sourceType:'unknown',publisher:null,relationship:'reference'};
  const cases=[
    ['https://www.streetfighter.com/6/ja-jp/character/ryu/frame','frame','公式フレームデータを見る'],
    ['https://www.streetfighter.com/6/ja-jp/character/ryu/movelist','command','公式技表を見る'],
    ['https://www.youtube.com/watch?v=example','video','関連動画を見る'],
    ['https://example.com/frame','frame','フレームデータを見る'],
    ['https://example.com/profile','profile','プロフィールを見る'],
    ['https://example.com/guide','article','記事を読む'],
    ['https://example.com/other','unknown','参照先のサイトを見る'],
  ];
  const sources=cases.map(([url,sourceType],index)=>({...base,id:'source-'+index,title:'資料'+index,url,sourceType}));
  sources.push({...sources[0]}, {...base,id:'unsafe',title:'不正URL',url:'javascript:alert(1)'},
    {...base,id:'credential',title:'認証情報入りURL',url:'https://user:secret@example.com'},
    {...base,id:'candidate',title:'候補資料',url:'https://example.com/candidate',relationship:'candidate'});
  const character={id:'test',slug:'ryu',name:'リュウ',difficulty:null,sources};
  const before=structuredClone(character);
  const html=renderToStaticMarkup(React.createElement(CharacterUnifiedPage,{character,bundle:null,players:[],videos:[]}));
  for(const [index,[url,,cta]] of cases.entries()) {
    assert.ok(html.includes(url));
    assert.ok(html.includes('aria-label="資料'+index+'：'+cta+'"'));
    assert.ok(html.includes('資料'+index+' · '+cta+' ↗'));
  }
  assert.equal((html.match(/target="_blank" rel="noopener noreferrer"/g)||[]).length,cases.length);
  assert.doesNotMatch(html,/不正URL|認証情報入りURL|候補資料|javascript:|user:secret/);
  assert.deepEqual(character,before);
  assert.match(unified, /presentSource\(source\.sourceType, source\.publisher, source\.url\)/);
  const fallback=renderToStaticMarkup(React.createElement(CharacterUnifiedPage,{character:{...character,sources:[]},bundle:null,players:[],videos:[]}));
  assert.ok(fallback.includes('情報源を確認中です。'));
});

test("player detail avoids developer-style empty copy and large no-image cards", () => {
  const page = read("src/app/players/[slug]/page.tsx");
  const identity = read("src/components/player-identity.tsx");
  const css = read("src/components/player-identity.module.css");
  assert.doesNotMatch(page, /公開できるプロフィール情報を準備中/);
  assert.match(identity, /選手ビジュアルは今後のアップデートで追加予定です/);
  assert.match(identity, /styles\.withoutPhoto/);
  assert.match(css, /\.withoutPhoto \{ min-height: 0/);
});

test("FAQ and Auth copy match currently released behavior", () => {
  const faq = read("src/app/faq/page.tsx");
  const auth = read("src/app/auth/page.tsx");
  assert.match(faq, /AIコーチは現在公開していません/);
  assert.match(auth, /診断結果をアカウントに保存できます/);
  assert.match(auth, /この端末のブラウザに保存されるため、別の端末には自動で引き継がれません/);
});

test("video cards expose YouTube, share and reversible local watched state", () => {
  const card = read("src/components/video-card.tsx");
  const preferences = read("src/lib/video-preferences.ts");
  const loader = read("src/lib/event-media.ts");
  const page = read("src/app/videos/page.tsx");
  assert.match(card, /navigator\.share/);
  assert.match(card, /navigator\.clipboard\.writeText/);
  assert.match(preferences, /sf6dna:watched-videos:v1/);
  assertVideoPreferenceCard('watched');
  assert.match(loader, /youtubeThumbnail/);
  assert.match(loader, /entity_videos/);
  assert.match(page, /<VideoLibrary/);
});
