import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/combo-input-tokens.ts', import.meta.url), 'utf8');
const testModule = { exports: {} };
new Function('module', 'exports', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText)(testModule, testModule.exports);
const { tokenizeComboRecipe: parse, isComboIconPilot, comboIconPilotIds } = testModule.exports;
const typed = raw => parse(raw).filter(t => !['TEXT', 'AMBIGUOUS'].includes(t.type));
const fixture = JSON.parse(readFileSync(new URL('./fixtures/combo-icon-pilot.json', import.meta.url), 'utf8'));

test('all 15 existing pilot recipes are lossless; gameplay status is not upgraded', () => {
  assert.equal(fixture.cases.length, 15);
  for (const character of ['luke', 'jp', 'ken']) assert.equal(fixture.cases.filter(c => c.character === character).length, 5);
  for (const c of fixture.cases) {
    assert.equal(parse(c.recipe).map(t => t.raw).join(''), c.recipe);
    assert.equal(isComboIconPilot(c.id), true);
  }
  assert.equal(isComboIconPilot('unrelated-card'), false);
  assert.equal(Object.values(comboIconPilotIds).flat().length, 15);
});

test('compact classic direction, button, and motion commands are distinct', () => {
  assert.deepEqual(typed('5LP > 2MK > 236HP').map(t => [t.type, t.value]), [['DIRECTION','5'], ['BUTTON','LP'], ['DIRECTION','2'], ['BUTTON','MK'], ['SPECIAL_COMMAND','236'], ['BUTTON','HP']]);
  assert.equal(typed('236LP')[0].display, '↓↘→');
  assert.deepEqual(typed('22HP > 236236LP').map(t => t.value), ['22', 'HP', '236236', 'LP']);
});

test('explicit drive and DI states never merge', () => {
  const values = ['DR', 'CDR', 'DI_HIT', 'DI_GUARD', 'DI_WALL_SPLAT', 'DI_STUN', 'DRIVE_REVERSAL', 'THROW'];
  assert.deepEqual(typed(values.join(' > ')).map(t => t.value), values);
  assert.deepEqual(typed('DI clean hit > DI wall splat > DI stun > DI guard').map(t => t.value), ['DI_HIT', 'DI_WALL_SPLAT', 'DI_STUN', 'DI_GUARD']);
});

test('DI with uncertain state and generic P/K retain ambiguous original', () => {
  for (const raw of ['DI', 'DI(PC)', 'DI(clean)', 'DI(wall)', 'DI(壁)', 'P', 'K', 'PP', 'KK', '123', 'or']) {
    assert.equal(typed(raw).length, 0, raw);
    assert.equal(parse(raw)[0].type, 'AMBIGUOUS', raw);
    assert.equal(parse(raw).map(t => t.raw).join(''), raw);
  }
});

test('Modern tokens are recognized only when explicit; classic recipes are not converted', () => {
  assert.deepEqual(typed('L M H SP Assist').map(t => t.value), ['L', 'M', 'H', 'SP', 'ASSIST']);
  assert.deepEqual(typed('LP MP HP LK MK HK').map(t => t.value), ['LP', 'MP', 'HP', 'LK', 'MK', 'HK']);
  assert.deepEqual(typed('SA1 SA2 SA3 CA OD').map(t => t.value), ['SA1','SA2','SA3','CA','OD']);
});

test('all declared command and direction symbols are supported (synthetic, not gameplay verified)', () => {
  const commands = ['236','214','623','421','22','41236','63214','632146','236236','214214','HALF_CIRCLE','FULL_CIRCLE','DOUBLE_CIRCLE','CHARGE_BACK','CHARGE_DOWN','HIGH_JUMP','COMMAND_THROW'];
  assert.deepEqual(typed(commands.join(' > ')).map(t => t.value), commands);
  assert.equal(typed('↑ ↗ → ↘ ↓ ↙ ← ↖ N').length, 9);
});

test('unknown prose, timing, alternatives and unlisted symbols stay lossless', () => {
  for (const raw of ['', 'Luke Spin HIGH_JUMPER', '2LP(PC) > 微歩き5HP > ODトルバラン > SA3', '214LP(Perfect or max charge) > 236K > P', '[4]6HP', '360P > 720P', '2L x2 > one-button/manual SA3', '<script>alert(1)</script>']) {
    assert.equal(parse(raw).map(t => t.raw).join(''), raw);
  }
  assert.equal(typed('Luke Spin HIGH_JUMPER').length, 0);
  assert.equal(parse('(Perfect or max charge)')[0].type, 'TEXT');
  assert.equal(parse('(PC)')[0].type, 'CONDITION');
  assert.equal(parse('(CH)')[0].label, 'カウンターヒット');
});

test('renderer preserves original, uses labels for icons and keeps uncertain text visible', () => {
  const component = readFileSync(new URL('../src/components/combo-input-recipe.tsx', import.meta.url), 'utf8');
  const card = readFileSync(new URL('../src/components/pilot-combo-card.tsx', import.meta.url), 'utf8');
  assert.match(component, /role="img" aria-label=\{token\.label\}/);
  assert.match(component, /type === "TEXT" \|\| token\.type === "AMBIGUOUS"/);
  assert.match(component, /原表記: /);
  assert.match(component, /\{recipe\}/);
  assert.doesNotMatch(card, /isComboIconPilot/);
  assert.match(card, /recipe=\{combo\.rawRecipe \?\? combo\.command \?\? ""\}/);
});

 test('prose digits and right-arrow recipe separators are not directional input', () => {
  assert.equal(typed('1').length, 0);
  assert.equal(typed('ゲージ 2 / ダメージ 623').length, 0);
  assert.equal(typed('5LP → 5MP').filter(t => t.value === '→').length, 0);
  assert.equal(typed('↓↘→').filter(t => t.type === 'DIRECTION').length, 3);
  assert.equal(typed('→')[0].type, 'DIRECTION');
});

test('actual React renderer escapes text and exposes separate DR/CDR/state labels', async () => {
  const React = await import('react');
  const jsx = await import('react/jsx-runtime');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const source = readFileSync(new URL('../src/components/combo-input-recipe.tsx', import.meta.url), 'utf8');
  const rendererModule = { exports: {} };
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  new Function('module', 'exports', 'require', js)(rendererModule, rendererModule.exports, name => {
    if (name === 'react/jsx-runtime') return jsx;
    if (name === '@/lib/combo-input-tokens') return testModule.exports;
    if (name.endsWith('.module.css')) return { default: new Proxy({}, { get: (_, key) => key }), __esModule: true };
    throw Error(name);
  });
  const raw = '5LP > DR > CDR > DI_GUARD > DI(PC) > <script>alert(1)</script>';
  const rendered = renderToStaticMarkup(React.createElement(rendererModule.exports.ComboInputRecipe, { recipe: raw }));
  assert.match(rendered, /aria-label="ドライブラッシュ"/);
  assert.match(rendered, /aria-label="キャンセルドライブラッシュ"/);
  assert.match(rendered, /aria-label="ドライブインパクト・ガード"/);
  assert.match(rendered, /data-token-type="AMBIGUOUS">DI\(PC\)/);
  assert.match(rendered, /原表記: /);
  assert.doesNotMatch(rendered, /<script>/);
  assert.match(rendered, /&lt;script&gt;/);
});

test('all explicit relative direction names render without silently mapping prose or partial words', () => {
  const names = ['N', 'UP', 'UP_FORWARD', 'FORWARD', 'DOWN_FORWARD', 'DOWN', 'DOWN_BACK', 'BACK', 'UP_BACK'];
  assert.deepEqual(typed(names.join(' > ')).map(t => t.value), names);
  assert.equal(typed('FORWARDNESS UPDATE BACKGROUND DOWNLOADED').length, 0);
});

test('a nonpilot card uses the shared renderer and byte-for-byte raw recipe instead of normalized copy', async () => {
  const React = await import('react');
  const jsx = await import('react/jsx-runtime');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const loadComponent = (file, imports) => {
    const componentModule = { exports: {} };
    const source = readFileSync(new URL(`../src/components/${file}`, import.meta.url), 'utf8');
    new Function('module', 'exports', 'require', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText)(componentModule, componentModule.exports, name => {
      if (name === 'react') return React;
      if (name === 'react/jsx-runtime') return jsx;
      if (name.endsWith('.module.css')) return { default: new Proxy({}, { get: (_, key) => key }), __esModule: true };
      assert.ok(imports[name], name); return imports[name];
    });
    return componentModule.exports;
  };
  const recipe = loadComponent('combo-input-recipe.tsx', { '@/lib/combo-input-tokens': testModule.exports });
  const { PilotComboCard } = loadComponent('pilot-combo-card.tsx', {
    './combo-input-recipe': recipe,
    'next/link': { default: props => React.createElement('a', props), __esModule: true },
    '@/lib/device-preview': { appendDevicePreviewToken: value => value },
    '@/lib/release-features': { releaseFeatures: { publicStrategyContent: false } },
    '@/lib/detail-localization': { localizeComboText: value => value, localizeSourceType: value => value },
  });
  const raw = '5LP > Drive Rush > DR > DI(PC)';
  const rendered = renderToStaticMarkup(React.createElement(PilotComboCard, { combo: { id: 'not-a-pilot-id', href:'/combos/example', name:'fixture', command:'正規化済み', rawRecipe:raw, damage:null, drive:null, sa:null, difficulty:null, verificationStatus:'unverified', preview:true } }));
  assert.match(rendered, /aria-label="ドライブラッシュ"/);
  assert.match(rendered, /5LP &gt; Drive Rush &gt; DR &gt; DI\(PC\)/);
  assert.doesNotMatch(rendered, /正規化済み/);
  assert.match(readFileSync(new URL('../src/components/jp-character-detail.tsx', import.meta.url), 'utf8'), /rawRecipe: combo\.command/);
});
