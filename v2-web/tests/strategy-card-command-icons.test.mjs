import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
function realModule(file) {
  const result = { exports: {} };
  const script = ts.transpileModule(readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, resolveJsonModule: true, esModuleInterop: true } }).outputText;
  const dir = file.slice(0, file.lastIndexOf("/") + 1);
  new Function("module", "exports", "require", script)(result, result.exports, name => {
    if (name.endsWith(".css")) return { default: {} };
    if (name.endsWith(".json")) {
      const path = name.startsWith("@/") ? `../src/${name.slice(2)}` : new URL(name, new URL(`../src/${dir}`, import.meta.url)).href;
      return { __esModule: true, default: JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8")) };
    }
    const local = name.startsWith("@/") ? name.slice(2) : name.startsWith(".") ? new URL(name, `file:///${dir}`).pathname.slice(1) : null;
    if (local) return realModule(local + (existsSync(new URL(`../src/${local}.tsx`, import.meta.url)) ? ".tsx" : ".ts"));
    return require(name);
  });
  return result.exports;
}

const icons = read("../src/data/strategy-card-command-icons-20261120.json").cards;
const master = read("../src/data/SF6DNA_WS5_OFFICIAL_TXT_CANONICAL_20261026.json");
const displayed = read("../src/lib/strategy-research-cards-20261118.json");
const local = read("../src/data/ws5-local-reviewed-strategy-cards.json");
const cardIds = new Set([...displayed, ...local].map(card => card.id));

test("generated command icons use the official classic command of the matched move, for existing cards only", () => {
  for (const [id, steps] of Object.entries(icons)) {
    assert.ok(cardIds.has(id), `unknown card ${id}`);
    assert.ok(steps.length > 0, id);
    assert.ok(steps.some(step => step.command), `${id}: at least one own input`);
    for (const step of steps) {
      assert.equal(Object.keys(step).filter(k => ["command", "text", "opponent"].includes(k)).length, 1, `${id}: one kind per step`);
      if (step.text !== undefined || step.opponent !== undefined) { assert.ok((step.text ?? step.opponent).trim(), id); continue; }
      if (step.moveKey) assert.equal(step.command, master[step.moveKey].raw.command.trim(), `${id} ${step.moveKey}`);
      else assert.match(step.command, /^(DR|CDR|66)$/, `${id}: only fixed system inputs are allowed without a move`);
    }
  }
});

const { CharacterStrategyResearchGrid } = realModule("components/character-strategy-research-grid.tsx");
const html = renderToStaticMarkup(require("react").createElement(CharacterStrategyResearchGrid, { characterSlug: "yasmine", kind: "sequence" }));
const commandBlockOf = (card) => card.split("<h4>連携コマンド</h4>")[1]?.split("<h4>連携解説</h4>")[0] ?? "";
const cardHtml = (id) => html.split(`data-reference-card-id="${id}"`)[1]?.split("data-reference-card-id=")[0] ?? "";

test("a converted card shows icons above and Japanese move names below, not move names twice", () => {
  const card = cardHtml("guide-ref:SF6DNA-YASMINE-R5-078");
  assert.ok(card, "card rendered");
  const commandBlock = commandBlockOf(card);
  const iconRow = commandBlock.split('data-strategy-command-icons="true"')[1].split("<p")[0];
  assert.match(iconRow, /role="img"/, "the upper row is the SF6 command-icon renderer");
  assert.match(iconRow, /<svg/, "icons are drawn, not text");
  assert.ok(!/ナカタゴン/.test(iconRow.replace(/aria-label="[^"]*"/g, "")), "no move name inside the icon row");
  assert.match(commandBlock, /<p[^>]*>SA2 ナカタゴン・ラカス<\/p>/, "the lower row keeps the Japanese route");
  assert.match(card, /原表記/, "the original notation stays available in the details");
});

test("a card whose steps are not all identified stays on HOLD instead of guessing", () => {
  const holdId = displayed.find(c => c.characterSlug === "yasmine" && c.category === "pressure" && !icons[c.id] && cardHtml(c.id))?.id;
  assert.ok(holdId, "a HOLD card is rendered");
  const commandBlock = commandBlockOf(cardHtml(holdId));
  assert.match(commandBlock, /コマンド確認中/);
  assert.doesNotMatch(commandBlock, /data-strategy-command-icons/);
});

test("source-held cards are still withheld", () => {
  const held = new Set(read("../src/lib/strategy-reference-source-hold-20261120.json").holdCardIds);
  for (const id of held) assert.ok(!html.includes(`data-reference-card-id="${id}"`), id);
});

test("existing curated Luke display inputs are used only when the generated data has no entry", () => {
  const luke = read("../src/lib/luke-strategy-display-20261118.json");
  const { strategyCommandIconSteps } = realModule("lib/strategy-research-display.ts");
  const curatedOnly = displayed.find(c => c.characterSlug === "luke" && !icons[c.id] && luke[c.id]?.iconInput);
  assert.ok(curatedOnly, "a Luke card relies on the curated input");
  assert.deepEqual(strategyCommandIconSteps(curatedOnly), luke[curatedOnly.id].iconInput.split(">").map(s => s.trim()).filter(Boolean).map(value => ({ kind: "command", value })));
  const other = displayed.find(c => c.characterSlug !== "luke" && !icons[c.id]);
  assert.equal(strategyCommandIconSteps(other), null, "no curated fallback outside Luke");
});

test("abbreviations are applied only from the verified unique-prefix candidate list", () => {
  const rows = readFileSync(new URL("../../scripts/strategy-bulk/STRATEGY_ABBREVIATION_CANDIDATES_CC2_20261120.csv", import.meta.url), "utf8").replace(/^\uFEFF/, "").trim().split("\n").slice(1).map(l => l.split(","));
  for (const [slug, abbr, key, name, , status] of rows) {
    if (status !== "CC1_ADOPTED_ROUND16") { assert.equal(key, "", `${abbr}: HOLD rows carry no move`); continue; }
    assert.equal(master[key].characterSlug, slug);
    assert.equal(master[key].raw.skill, name);
    const norm = (v) => v.normalize("NFKC").replace(/[\s・\-ー]/g, "");
    const prefixed = Object.values(master).filter(m => m.characterSlug === slug && norm(m.raw.skill ?? "").startsWith(norm(abbr)));
    assert.equal(prefixed.length, 1, `${abbr} must match exactly one official name`);
  }
});

test("counter cards keep the opponent's move apart from the player's input", () => {
  const { StrategyCommandIcons } = realModule("components/strategy-command-icons.tsx");
  const steps = [{ kind: "opponent", value: "立ち強K" }, { kind: "text", value: "ガード" }, { kind: "command", value: "2 + MK" }];
  const markup = renderToStaticMarkup(require("react").createElement(StrategyCommandIcons, { steps }));
  const part = (kind) => markup.split(`data-step-kind="${kind}"`)[1].split("data-step-kind=")[0];
  assert.match(part("opponent"), /相手[^]*立ち強K/);
  assert.doesNotMatch(part("opponent"), /<svg/, "the opponent's move is not drawn as the player's input");
  assert.doesNotMatch(part("text"), /<svg/, "supporting text is not converted into a command");
  assert.match(part("command"), /<svg/);
  // Opponent-only counter cards have no own input and therefore stay on HOLD.
  for (const steps of Object.values(icons)) assert.ok(steps.some(step => step.command));
});

test("shared StrategyCard order: title, command icons, Japanese route, facts, explanation, details", () => {
  const { StrategyCard } = realModule("components/strategy-card.tsx");
  const React = require("react");
  const markup = renderToStaticMarkup(React.createElement(StrategyCard, {
    kind: "combo", title: "T_TITLE", category: "C_CAT", facts: [["F_FACT", "1"]],
    commandIcons: React.createElement("span", null, "I_ICONS"), commandJa: "J_ROUTE", body: "B_BODY", details: [["D_DETAIL", "x"]],
  }));
  const order = ["T_TITLE", "I_ICONS", "J_ROUTE", "F_FACT", "B_BODY", "D_DETAIL"].map(marker => markup.indexOf(marker));
  assert.ok(order.every(index => index >= 0), String(order));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
});
