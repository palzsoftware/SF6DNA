import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

const require = createRequire(import.meta.url);
const { NextRequest } = require('next/server');
function load(path, overrides = {}) {
  const mod = { exports: {} };
  const js = ts.transpileModule(readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  new Function('module', 'exports', 'require', js)(mod, mod.exports, name => overrides[name] ?? (name.startsWith("@/lib/") ? load(name.slice(2) + ".ts", overrides) : require(name)));
  return mod.exports;
}

test('malformed paths fail before auth, while valid encoding preserves cookie refresh', async () => {
  const names = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const saved = names.map(name => process.env[name]);
  Object.assign(process.env, { NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'fixture' });
  let authCalls = 0;
  const { proxy } = load('proxy.ts', { '@supabase/ssr': { createServerClient(url, key, options) {
    assert.equal(url, 'https://test.supabase.co');
    return { auth: { async getUser() { authCalls++; options.cookies.setAll([{ name: 'fixture-session', value: 'refreshed', options: { httpOnly: true } }]); } } };
  } } });
  try {
    for (const path of ['/players/%ZZ', '/players/%', '/players/%E0%A4', '/characters/%C0%AF', '/videos/%ED%A0%80', '/players/%ZZ.webp', '/characters/%E0%A4.png', '/videos/%ZZ.svg']) {
      const response = await proxy(new NextRequest(`https://example.com${path}`));
      assert.equal(response.status, 400);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(response.headers.get('x-robots-tag'), 'noindex');
      const html = await response.text();
      assert.match(html, /<html lang="ja"/);
      assert.match(html, /<title>/);
      assert.match(html, /400 Bad Request/);
      assert.match(html, /href="\/"/);
      assert.ok(!html.includes(path), 'submitted URL must not be disclosed');
    }
    assert.equal(authCalls, 0);
    for (const path of ['/missing.png', '/characters/example.webp']) {
      assert.equal((await proxy(new NextRequest(`https://example.com${path}`))).status, 200);
    }
    assert.equal(authCalls, 0, 'valid image paths retain the previous auth bypass');
    for (const path of ['/auth', '/players/caba', '/players/%E6%97%A5%E6%9C%AC', '/videos?player=%ZZ', '/_next/data/build/auth.json']) {
      const response = await proxy(new NextRequest(`https://example.com${path}`));
      assert.equal(response.status, 200);
      assert.equal(response.cookies.get('fixture-session').value, 'refreshed');
    }
    assert.equal(authCalls, 5);
  } finally { names.forEach((name, i) => saved[i] === undefined ? delete process.env[name] : process.env[name] = saved[i]); }
});

test('known displayed command tokens have one spoken equivalent and visible text fallback', () => {
  const helper = load('lib/command-accessibility.ts');
  const { AccessibleCommand } = load('components/accessible-command.tsx', { '@/lib/command-accessibility': helper });
  assert.equal(helper.commandAccessibleName('↓↘→ + 弱P'), '下、右下、右、プラス、弱パンチ');
  for (const [token, name] of Object.entries({ LP:'弱パンチ', MP:'中パンチ', HP:'強パンチ', LK:'弱キック', MK:'中キック', HK:'強キック', DI:'ドライブインパクト', DR:'ドライブラッシュ', Assist:'アシスト', SP:'必殺技ボタン', SA:'スーパーアーツ', SA1:'スーパーアーツ1', SA2:'スーパーアーツ2', SA3:'スーパーアーツ3', CA:'クリティカルアーツ', OD:'オーバードライブ' })) {
    const html = renderToStaticMarkup(React.createElement(AccessibleCommand, { text: token }));
    assert.ok(html.includes(`aria-label="${name}"`));
    assert.ok(html.includes(`aria-hidden="true">${token}</span>`));
    assert.doesNotMatch(html, /tabindex|<img/);
  }
  assert.equal(helper.commandAccessibleName('236LP'), '236LP', 'unsupported recipe grammar stays unchanged');
});

test('canonical uses explicit production origin only, missing resources stay noindex', () => {
  const { publicPageMetadata } = load('lib/public-page-metadata.ts');
  const saved = [process.env.VERCEL_ENV, process.env.NEXT_PUBLIC_SITE_URL];
  try {
    Object.assign(process.env, { VERCEL_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://example.com/' });
    const metadata = publicPageMetadata('/players/caba', { title: 'Caba', description: '既存の説明' });
    assert.equal(metadata.alternates.canonical, 'https://example.com/players/caba');
    assert.equal(metadata.openGraph.title, 'Caba');
    assert.equal(metadata.twitter.description, '既存の説明');
    assert.equal(metadata.openGraph.images, undefined, 'no unapproved player imagery');
    for (const url of ['', 'not a url', 'https://example.com/preview', 'https://user:pass@example.com', 'http://example.com']) {
      process.env.NEXT_PUBLIC_SITE_URL = url;
      assert.equal(publicPageMetadata('/videos', {}).alternates, undefined);
    }
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    assert.equal(publicPageMetadata('/players/draft', {}, false).robots.index, false);
    assert.equal(publicPageMetadata('/players/draft', {}, false).alternates, undefined);
    process.env.VERCEL_ENV = 'preview';
    assert.equal(publicPageMetadata('/players/caba', {}).alternates, undefined);
  } finally {
    ['VERCEL_ENV', 'NEXT_PUBLIC_SITE_URL'].forEach((name, i) => saved[i] === undefined ? delete process.env[name] : process.env[name] = saved[i]);
  }
});

test('source transport failure preserves player identity and missing relations degrade to empty lists', async () => {
  const saved = [process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY];
  Object.assign(process.env, { NEXT_PUBLIC_SUPABASE_URL:'https://fixture.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY:'fixture' });
  const client = { rpc:async()=>{throw Error('PRIVATE_SOURCE_FAILURE')}, from(table) {
    const query = { select(){return this}, eq(){return this}, maybeSingle(){return Promise.resolve({data:{id:'fixture',slug:'fixture',display_name:'公開Player',team_name:null},error:null})},
      then(resolve,reject){return Promise.resolve({data: table==='player_characters' ? [{characters:null}] : [],error:null}).then(resolve,reject)} };
    return query;
  } };
  const original = console.error; const logs=[]; console.error=(...args)=>logs.push(args.join(' '));
  try {
    const sources = load('lib/public-source-links.ts', {'@/lib/supabase/server':{getSupabaseServerClient:()=>client}});
    const { getPlayerBySlug } = load('lib/players.ts', {'@/lib/supabase/server':{getSupabaseServerClient:()=>client}, '@/lib/public-source-links':sources, '@/lib/approved-player-images':{approvedPlayerImage:()=>null}});
    const player=await getPlayerBySlug('fixture');
    assert.equal(player.displayName,'公開Player'); assert.equal(player.teamName,null); assert.deepEqual(player.characters,[]); assert.deepEqual(player.sources,[]);
    assert.doesNotMatch(logs.join(' '),/PRIVATE_SOURCE_FAILURE/);
  } finally {console.error=original;['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY'].forEach((name,i)=>saved[i]===undefined?delete process.env[name]:process.env[name]=saved[i])}
});

test('optional video transport failure preserves player page and local empty state', async () => {
  const player = { id:'p',slug:'p',displayName:'公開Player',realName:null,bio:null,teamName:null,characters:[],tournamentResults:[],sources:[] };
  const original = console.error;const logs=[];console.error=(...args)=>logs.push(args.join(' '));
  try {
    const { default:Page } = load('app/players/[slug]/page.tsx', {
      '@/lib/public-page-metadata':load('lib/public-page-metadata.ts'),
      '@/lib/players':{getPlayerBySlug:async()=>player},
      '@/lib/event-media':{listVideos:async()=>{throw Error('PRIVATE_VIDEO_FAILURE')},formatVideoPublishedDate:()=>null},
      '@/components/player-evidence-sections':{PlayerEvidenceSections:()=>null},'@/components/player-identity':{PlayerIdentity:()=>null},'@/components/video-card':{VideoCard:()=>null},
      '@/lib/player-labels':{playerTypeLabel:()=>'',playerRoleLabel:()=>''},
      '@/lib/player-presentation':{playerRegionLabel:()=>'',playerSourceCta:()=>'',safePlayerBio:()=>null,playerBioSummary:()=>null},
      '@/lib/video-player-filter':{videoPlayerHref:()=>'/videos'},
      'next/navigation':{notFound:()=>{throw Error('NOT_FOUND')}},
      'next/link':{default:({children,...props})=>React.createElement('a',props,children),__esModule:true},
      '../players.module.css':{default:{},__esModule:true},
    });
    const html=renderToStaticMarkup(await Page({params:Promise.resolve({slug:'p'})}));
    assert.match(html,/<h1>公開Player<\/h1>/);
    assert.match(html,/このプレイヤーの関連動画はまだ掲載していません/);
    assert.doesNotMatch(logs.join(' '),/PRIVATE_VIDEO_FAILURE/);
  } finally {console.error=original;}
});
