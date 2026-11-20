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
  const effects = [];
  const testModule = { exports: {} };
  const output = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  new Function("module", "exports", "require", output)(testModule, testModule.exports, name => {
    if (name === "react") return {
      useRef: () => ({ current: details }),
      useEffect: (callback, deps) => {
        effects.push({ callback, deps });
        if (!effect) { effect = callback; dependencies = deps; }
      },
    };
    if (name === "next/navigation") return { usePathname: () => "/diagnosis" };
    return require(name);
  });
  const tree = testModule.exports.MobileGlobalMenu({ children: "existing navigation" });
  class Target {
    constructor(anchor) { this.anchor = anchor; }
    closest() { return this.anchor; }
  }
  return { details, link, tree, effect, dependencies, effects, Target };
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

test("Escape closes the menu and returns focus to its trigger", () => {
  const { details, tree } = setup();
  let focused = false;
  let prevented = false;
  details.querySelector = selector => selector === "summary" ? { focus: () => { focused = true; } } : null;
  tree.props.onKeyDown({ currentTarget: details, key: "Escape", preventDefault: () => { prevented = true; } });
  assert.equal(details.open, false);
  assert.equal(focused, true);
  assert.equal(prevented, true);
});

test("tapping outside the open menu closes it; taps inside keep it open", () => {
  const originalDocument = globalThis.document;
  const originalNode = globalThis.Node;
  const listeners = new Map();
  try {
    class FakeNode {}
    globalThis.Node = FakeNode;
    globalThis.document = {
      addEventListener: (type, fn) => listeners.set(type, fn),
      removeEventListener: (type, fn) => { if (listeners.get(type) === fn) listeners.delete(type); },
    };
    const s = setup();
    const inside = new FakeNode();
    const outside = new FakeNode();
    s.details.contains = target => target === inside;
    const outsideEffect = s.effects.find(e => Array.isArray(e.deps) && e.deps.length === 0);
    assert.ok(outsideEffect, "outside-pointer effect registered once on mount");
    const cleanup = outsideEffect.callback();
    const handler = listeners.get("pointerdown");
    assert.equal(typeof handler, "function");

    handler({ target: inside });
    assert.equal(s.details.open, true);
    handler({ target: null });
    assert.equal(s.details.open, true);
    handler({ target: outside });
    assert.equal(s.details.open, false);

    s.details.open = false;
    handler({ target: outside });
    assert.equal(s.details.open, false);

    cleanup();
    assert.equal(listeners.has("pointerdown"), false);
  } finally {
    globalThis.document = originalDocument;
    globalThis.Node = originalNode;
  }
});
