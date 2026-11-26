// 2026-11-19 Player図鑑・動画リストの統合データの検査。
// 追加データはすべて公開承認待ち(PENDING)で、既存の公開ゲートにより表示されないことを確認する。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const read = path => JSON.parse(readFileSync(new URL(`../src/data/player-research/${path}`, import.meta.url), 'utf8'));
const team = read('team-bindings.json');
const videos = read('videos.json');
const bindings = read('video-bindings.json');
const ENVS = new Set(['vvsknbmlfvvnrmgtyhbf', 'wnuxaxbrpudyypzdbdho']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function loadLib(file) {
  const m = { exports: {} };
  const code = ts.transpileModule(readFileSync(new URL(`../src/lib/${file}.ts`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function('module', 'exports', 'require', code)(m, m.exports, () => ({}));
  return m.exports;
}

test('Playerカード: 追加行はすべて PENDING、環境・ID・slugが正しい', () => {
  assert.ok(team.length > 48);
  const seen = new Set();
  for (const row of team) {
    assert.equal(row.publicationApproval, 'PENDING');
    assert.ok(ENVS.has(row.environment));
    assert.match(row.playerId, UUID);
    const key = `${row.environment}:${row.playerId}`;
    assert.ok(!seen.has(key), `同じ環境・同じIDの行が重複: ${key}`);
    seen.add(key);
    if (!row.identityVariants) assert.equal(row.display.slug, row.playerSlug);
  }
});

test('Playerカード: 大会使用キャラとメイン/サブを別ラベルで持つ', () => {
  const labels = new Set(team.flatMap(r => r.display.facts.map(f => f.label)));
  for (const label of labels) {
    assert.ok(['SFL2026での使用キャラクター', '主要大会での使用キャラクター', '使用キャラクター（ユーザー指定）', 'メインキャラクター', 'サブキャラクター'].includes(label)
      // 2026-11-26 V26: 現在の所属と大会登録時のチームを別ラベルで持つ(承認14名の行のみ)
      || label === '現在の所属' || /^大会登録チーム（.+）$/.test(label), label);
  }
  for (const row of team) {
    const ls = row.display.facts.map(f => f.label);
    assert.ok(!(ls.includes('サブキャラクター') && !ls.includes('メインキャラクター')), 'サブだけの行は作らない');
  }
});

test('Playerカード: 大会実績は出典URLつきだけ', () => {
  for (const row of team) for (const sec of row.display.sections) {
    if (sec.title !== 'その他の大会成績（2つの出典で確認）') continue;
    for (const item of sec.items) assert.match(item.sourceUrl, /^https:\/\//);
  }
});

test('Playerカード: PENDING行は既存ゲートで表示されない', () => {
  const { attachPlayerArchiveDisplay } = loadLib('player-archive-display');
  const row = team.find(r => r.environment === 'wnuxaxbrpudyypzdbdho');
  const player = { id: row.playerId, slug: row.playerSlug };
  assert.equal(attachPlayerArchiveDisplay(player, [row]), player);
  const approved = { ...row, publicationApproval: 'APPROVED' };
  assert.deepEqual(attachPlayerArchiveDisplay(player, [approved]).archiveDisplay, row.display); // 承認後は接続される
});

test('動画: キー・YouTube ID・公開承認・接続先が正しい', () => {
  const keys = new Set();
  for (const v of videos) {
    assert.ok(!keys.has(v.key), `動画キー重複: ${v.key}`);
    keys.add(v.key);
    assert.match(v.youtubeId, /^[A-Za-z0-9_-]{11}$/);
    assert.equal(v.publicationApproval, 'PENDING');
    // 2026-11-24: ranked/stream usage gets its own label instead of being shown as 本人解説.
    assert.ok(['本人解説', '大会対戦', '配信・ランクマ'].includes(v.kind));
    for (const c of v.characterLinks ?? []) assert.match(c.slug, /^[a-z][a-z0-9-]{0,30}$/);
  }
  const byKey = new Map(videos.map(v => [v.key, v]));
  const bset = new Set();
  for (const b of bindings) {
    assert.ok(ENVS.has(b.environment));
    assert.match(b.playerId, UUID);
    assert.ok(byKey.has(b.recommendationKey), `存在しない動画への接続: ${b.recommendationKey}`);
    assert.equal(byKey.get(b.recommendationKey).playerSlug, b.playerSlug);
    const k = `${b.environment}:${b.playerId}:${b.recommendationKey}`;
    assert.ok(!bset.has(k));
    bset.add(k);
  }
});

test('動画: 同じ選手・同じ環境で、選手IDが1つに決まる', () => {
  const ids = new Map();
  for (const b of bindings) {
    const k = `${b.environment}:${b.playerSlug}`;
    if (ids.has(k)) assert.equal(ids.get(k), b.playerId, `選手IDの食い違い: ${k}`);
    ids.set(k, b.playerId);
  }
});

test('ローカル確認スイッチ: next dev かつ明示の環境変数のときだけ有効', () => {
  const { playerLocalPreviewEnabled: on } = loadLib('player-local-preview');
  assert.equal(on({ NODE_ENV: 'development', SF6DNA_PLAYER_LOCAL_PREVIEW: '1' }, 'localhost:3000'), true);
  assert.equal(on({ NODE_ENV: 'development' }), false);                                       // 環境変数なし
  assert.equal(on({ NODE_ENV: 'production', SF6DNA_PLAYER_LOCAL_PREVIEW: '1' }), false);      // 本番ビルド
  assert.equal(on({ NODE_ENV: 'development', SF6DNA_PLAYER_LOCAL_PREVIEW: '1', VERCEL: '1' }, 'localhost'), false); // Vercel上
  assert.equal(on({ NODE_ENV: 'development', SF6DNA_PLAYER_LOCAL_PREVIEW: 'true' }), false);  // 値は "1" のみ
});

test('Player補足の既定値は公開承認を要求する', () => {
  const src = readFileSync(new URL('../src/components/player-detail-supplements.tsx', import.meta.url), 'utf8');
  assert.match(src, /preview = false/);
  assert.equal(loadLib('player-local-preview').playerLocalPreviewEnabled({ NODE_ENV: 'development', SF6DNA_PLAYER_LOCAL_PREVIEW: '1' }, 'example.com'), false);
  assert.match(src, /【ローカル確認用・未公開】/);
  assert.ok(!/searchParams|URLSearchParams/.test(src), 'URLパラメータから有効にしない');
  assert.ok([...team, ...videos].every(r => r.publicationApproval === 'PENDING'));
});

test('複数選手の動画は選手ごとに別キーで接続され、同じ動画が同じ選手に重複しない', () => {
  const pairs = new Set();
  for (const v of videos) {
    const k = `${v.playerSlug}:${v.youtubeId}`;
    assert.ok(!pairs.has(k), k);
    pairs.add(k);
    assert.equal(v.key, `${v.playerSlug}-${v.youtubeId}`.replace(/^(.+)-(.{11})$/, '$1-$2'));
  }
});

test('動画カード: ローカル確認(draftPreview)では承認待ちでも表示し、キャラ詳細へのリンクを出す。通常時は表示しない', async () => {
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const m = { exports: {} };
  const code = ts.transpileModule(readFileSync(new URL('../src/components/player-recommended-videos.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React },
  }).outputText;
  new Function('module', 'exports', 'require', 'React', code)(m, m.exports, n => (n === 'react' ? React : {}), React);
  const v = videos.find(x => x.characterLinks?.length);
  const el = props => React.createElement(m.exports.PlayerRecommendedVideos, props);
  assert.equal(renderToStaticMarkup(el({ playerSlug: v.playerSlug, items: [v] })), '');
  const html = renderToStaticMarkup(el({ playerSlug: v.playerSlug, items: [v], draftPreview: true }));
  assert.match(html, /掲載前の確認用です/);
  assert.ok(html.includes(`href="/characters/${v.characterLinks[0].slug}"`));
});

// ---- 実データでの表示確認(ローカル確認ON/OFF・公開環境) ----
function loadSupplements() {
  const src = readFileSync(new URL('../src/components/player-detail-supplements.tsx', import.meta.url), 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const esm = v => ({ __esModule: true, default: v });
  const deps = {
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    '../lib/player-archive-display': loadLib('player-archive-display'),
    '../lib/player-video-binding': loadLib('player-video-binding'),
    '../lib/player-local-preview': loadLib('player-local-preview'),
    './player-research-sections': { PlayerResearchSections: 'PlayerResearchSections' },
    './player-recommended-videos': { PlayerRecommendedVideos: 'PlayerRecommendedVideos' },
    '../data/player-research/team-bindings.json': esm(team),
    '../data/player-research/records.json': esm(read('records.json')),
    '../data/player-research/videos.json': esm(videos),
    '../data/player-research/video-bindings.json': esm(bindings),
    '../data/player-research/research-bindings.json': esm(read('research-bindings.json')),
    // 2026-11-25: profile supplements are covered by sfl48-profile-character-videos-20261125.test.mjs.
    '../data/player-research/profile-supplements.json': esm([]),
    './player-profile-supplement': { boundProfileSupplement: () => null, PlayerProfileSupplementSection: 'PlayerProfileSupplementSection' },
  };
  const m = { exports: {} };
  new Function('module', 'exports', 'require', js)(m, m.exports, n => { assert.ok(n in deps, n); return deps[n]; });
  return m.exports;
}
const PROD = 'wnuxaxbrpudyypzdbdho';

test('表示確認: ローカル確認ONならPlayer詳細にカードと動画が出て、OFF(公開環境)なら出ない', () => {
  const { attachPlayerTeamResults, playerDetailSupplements } = loadSupplements();
  const row = team.find(r => r.environment === PROD && r.display.facts.some(f => f.label === '使用キャラクター（ユーザー指定）'));
  const player = { id: row.playerId, slug: row.playerSlug };
  // 公開環境(プレビューOFF): PENDING は表示されない
  assert.equal(attachPlayerTeamResults(player, PROD, team, false).archiveDisplay, undefined);
  assert.equal(playerDetailSupplements(player, PROD, false).recommendedVideoSection, undefined);
  // ローカル確認ON: カードは「ローカル確認用」と明記して表示、元データは PENDING のまま
  const shown = attachPlayerTeamResults(player, PROD, team, true).archiveDisplay;
  assert.match(shown.intro, /^【ローカル確認用・未公開】/);
  assert.deepEqual(shown.facts, row.display.facts);
  assert.equal(row.publicationApproval, 'PENDING');
  const sup = playerDetailSupplements(player, PROD, true);
  if (bindings.some(b => b.environment === PROD && b.playerId === player.id)) {
    assert.equal(sup.recommendedVideoSection.props.draftPreview, true);
    assert.ok(sup.recommendedVideoSection.props.items.length > 0);
  }
  // 別環境・別IDでは、ローカル確認ONでも接続しない
  assert.equal(attachPlayerTeamResults({ ...player, id: '00000000-0000-4000-8000-000000000000' }, PROD, team, true).archiveDisplay, undefined);
});

test('表示確認: 本番ビルド相当の環境変数ではスイッチが入らず、全選手で PENDING が表示されない', () => {
  const { attachPlayerTeamResults } = loadSupplements();
  const { playerLocalPreviewEnabled } = loadLib('player-local-preview');
  const prodLike = playerLocalPreviewEnabled({ NODE_ENV: 'production', SF6DNA_PLAYER_LOCAL_PREVIEW: '1' });
  for (const r of team) {
    const env = r.environment;
    assert.equal(attachPlayerTeamResults({ id: r.playerId, slug: r.playerSlug }, env, team, prodLike).archiveDisplay, undefined, r.playerSlug);
  }
});
