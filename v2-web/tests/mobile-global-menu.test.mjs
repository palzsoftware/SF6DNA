import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../src/components/mobile-global-menu.tsx", import.meta.url), "utf8");

function setup() {
  const details = { open: true, contains: target => target === link };
  const link = {};
  let effect;
  let dependencies;
  const testModule = { exports: {} };
  const output = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  new Function("module", "exports", "require", output)(testModule, testModule.exports, name => {
    if (name === "react") return {
      useRef: () => ({ current: details }),
      useEffect: (callback, deps) => { effect = callback; dependencies = deps; },
    };
    if (name === "next/navigation") return { usePathname: () => "/diagnosis" };
    return require(name);
  });
  const tree = testModule.exports.MobileGlobalMenu({ children: "existing navigation" });
  class Target {
    constructor(anchor) { this.anchor = anchor; }
    closest() { return this.anchor; }
  }
  return { details, link, tree, effect, dependencies, Target };
}

test("selecting a menu link closes it, including a link to the current page", () => {
  const original = globalThis.Element;
  try {
    const s = setup();
    globalThis.Element = s.Target;
    s.tree.props.onClickCapture({ button: 0, target: new s.Target(s.link), currentTarget: s.details });
    assert.equal(s.details.open, false);
  } finally { globalThis.Element = original; }
});

test("pathname navigation closes an open menu, including browser history navigation", () => {
  const s = setup();
  assert.deepEqual(s.dependencies, ["/diagnosis"]);
  s.effect();
  assert.equal(s.details.open, false);
});

test("summary clicks retain native toggle behavior and modified links stay open", () => {
  const original = globalThis.Element;
  try {
    for (const overrides of [{ target: null }, { ctrlKey: true }, { metaKey: true },
      { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }]) {
      const s = setup();
      globalThis.Element = s.Target;
      s.tree.props.onClickCapture({ button: 0, target: new s.Target(s.link), currentTarget: s.details, ...overrides });
      assert.equal(s.details.open, true, JSON.stringify(overrides));
    }
  } finally { globalThis.Element = original; }
});

test("the native details group and supplied navigation are preserved", () => {
  const s = setup();
  assert.equal(s.tree.type, "details");
  assert.equal(s.tree.props.className, "mobile-global-menu");
  assert.equal(s.tree.props.name, "site-header-panels");
  assert.equal(s.tree.props.children[0].type, "summary");
  assert.equal(s.tree.props.children[0].props.children, "メニュー");
  assert.equal(s.tree.props.children[1], "existing navigation");
});
