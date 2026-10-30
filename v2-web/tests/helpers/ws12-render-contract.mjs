import assert from 'node:assert/strict';
import {readFileSync, existsSync, statSync} from 'node:fs';
import {posix} from 'node:path';
import {createRequire} from 'node:module';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const sourceRoot = new URL('../../src/', import.meta.url);
export function makeSourceLoader(overrides = {}) {
  const cache = new Map();
  function resolveSource(path) {
    const normal = posix.normalize(path);
    if (posix.isAbsolute(normal) || normal === '..' || normal.startsWith('../')) throw Error('Outside source root: ' + path);
    const found = [normal, normal+'.ts', normal+'.tsx', normal+'/index.ts', normal+'/index.tsx'].find(file => {
      const url = new URL(file, sourceRoot); return existsSync(url) && statSync(url).isFile();
    });
    if (!found) throw Error('Missing source module: ' + path);
    return found;
  }
  function load(path) {
    path = resolveSource(path);
    if (cache.has(path)) return cache.get(path).exports;
    const loadedModule = {exports:{}};
    cache.set(path, loadedModule);
    const compiled = ts.transpileModule(readFileSync(new URL(path, sourceRoot),'utf8'), {
      compilerOptions: {module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022, jsx:ts.JsxEmit.ReactJSX},
      reportDiagnostics:true,
    });
    assert.equal((compiled.diagnostics ?? []).filter(d=>d.category===ts.DiagnosticCategory.Error).length,0,path+': syntax/transpile diagnostics');
    new Function('module','exports','require',compiled.outputText)(loadedModule,loadedModule.exports,name=>{
      if (Object.hasOwn(overrides,name)) return overrides[name];
      if (name==='react' || name==='react/jsx-runtime' || name==='next/link') return require(name);
      if (name.endsWith('.module.css')) return {default:new Proxy({},{get:(_,key)=>String(key)}),__esModule:true};
      if (name.startsWith('@/')) return load(name.slice(2));
      if (name.startsWith('.')) return load(posix.join(posix.dirname(path),name));
      throw Error('Unexpected external import: '+name);
    });
    return loadedModule.exports;
  }
  return load;
}
export const loadSource = makeSourceLoader();

function visit(element, assets, decorations) {
  if (!element || typeof element !== 'object') return;
  if (Array.isArray(element)) {element.forEach(item=>visit(item,assets,decorations));return;}
  if (typeof element.type === 'function') {
    if (element.type.name === 'Sf6CommandIcon') assets.push(element.props.asset);
    visit(element.type(element.props),assets,decorations); return;
  }
  if (element.type === 'svg') decorations.push({hidden:element.props['aria-hidden'],focusable:element.props.focusable});
  visit(element.props?.children,assets,decorations);
}
export function commandRenderSnapshot(value, options = {}) {
  const {Sf6CommandInput}=loadSource('components/sf6-command-input.tsx');
  const root=Sf6CommandInput({value,...options});
  const assets=[], decorations=[];
  visit(root,assets,decorations);
  return {role:root.props.role, label:root.props['aria-label'], assets, decorations,
    html:renderToStaticMarkup(React.createElement(Sf6CommandInput,{value,...options}))};
}
export function assertRenderedCommand(snapshot, expectedAssets, expectedLabel, rawNumber) {
  assert.equal(snapshot.role,'img');
  assert.deepEqual(snapshot.assets,expectedAssets);
  assert.equal(snapshot.label,expectedLabel);
  assert.ok(snapshot.decorations.every(svg=>svg.hidden===true && svg.focusable==='false'));
  assert.doesNotMatch(snapshot.html, /data-raw|data-source|title="[^"]*[0-9]{3}/);
  if (rawNumber) assert.ok(!snapshot.html.includes(rawNumber));
}
