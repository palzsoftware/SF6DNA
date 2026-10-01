import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
function load(file, overrides = {}) {
  const testModule = { exports: {} };
  const js = ts.transpileModule(readFileSync(new URL(`../src/components/${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  new Function('module', 'exports', 'require', js)(testModule, testModule.exports, name => name in overrides ? overrides[name] : require(name));
  return testModule.exports;
}
function mountMotion(initial) {
  const state = []; let cursor = 0;
  const effects = [];
  const react = { ...React, useRef: () => ({ current: null }), useEffect: (callback, deps) => effects.push({ callback, deps }),
    useState: initial => {
      const slot = cursor++;
      if (!(slot in state)) state[slot] = initial;
      return [state[slot], next => { state[slot] = next; }];
    },
  };
  const { MoveMotionMedia } = load('move-motion-media.tsx', { react, 'next/image': { __esModule: true, default: 'img' } });
  let props = initial;
  return { effects, render(next = props) { props = next; cursor = 0; return MoveMotionMedia(props); } };
}
const record = { mediaType: 'video', mediaUrl: '/one.mp4', posterUrl: '/one.webp', sourceUrl: 'https://example.com/source', sourceLabel: '録画元' };

test('failed video preserves the media frame and source link, and a new URL can render again', () => {
  const mounted = mountMotion({ media: record, title: '技', className: 'motion', showSource: true });
  const initial = mounted.render();
  const video = initial.props.children[0];
  assert.equal(video.type, 'video');
  assert.equal(video.props.preload, 'none');
  video.props.onError();
  const fallback = mounted.render();
  const html = renderToStaticMarkup(fallback);
  assert.match(html, /動作映像を読み込めませんでした/);
  assert.match(html, /aspect-ratio:16 \/ 9/);
  assert.match(html, /href="https:\/\/example.com\/source"/);
  assert.doesNotMatch(html, /<video|<img/);
  const updated = mounted.render({ media: { ...record, mediaUrl: '/two.mp4' }, title: '別の技' });
  assert.equal(updated.props.children[0].type, 'video');
  assert.equal(updated.props.children[0].key, '/two.mp4');
});

test('failed image produces readable fallback without exposing an unrequested source link', () => {
  const mounted = mountMotion({ media: { ...record, mediaType: 'gif', mediaUrl: '/animation.gif' }, title: '技' });
  mounted.render().props.children[0].props.onError();
  const html = renderToStaticMarkup(mounted.render());
  assert.match(html, /動作映像を読み込めませんでした/);
  assert.doesNotMatch(html, /<img|href=/);
});

test('character grid emits lazy images and a mobile half-width size hint for every card', () => {
  const { CharacterCard } = load('character-card.tsx');
  const cards = Array.from({ length: 31 }, (_, i) => React.createElement(CharacterCard, {
    key: i, character: { id: String(i), slug: `character-${i}`, name: `キャラ${i}`, imageUrl: '/portrait.jpg' },
  }));
  const html = renderToStaticMarkup(React.createElement(React.Fragment, null, cards));
  assert.equal((html.match(/loading="lazy"/g) ?? []).length, 31);
  assert.equal((html.match(/sizes="\(max-width: 820px\) 50vw, \(max-width: 1080px\) 33vw, 310px"/g) ?? []).length, 31);
  assert.doesNotMatch(html, /fetchPriority="high"|rel="preload"/);
});
