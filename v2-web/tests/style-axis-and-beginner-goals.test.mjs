import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

// 表示専用モジュール（傾向12軸の説明・15分練習の初心者向け補足）の検査。
// 採点・推薦・保存の契約に触れていないことと、データの欠けや言い過ぎがないことを確かめる。
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
function load(path) {
  const output = ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = { exports: {} };
  new Function("module", "exports", "require", output)(mod, mod.exports, () => { throw new Error("unexpected import"); });
  return mod.exports;
}
const style = load("src/lib/style-axis-guide.ts");
const goals = load("src/lib/practice-beginner-goals.ts");

const STYLE_KEYS = ["aggression", "patience", "keepout", "rushdown", "grappling", "setup", "footsies", "mobility", "simplicity", "technicality", "defense_preference", "explosive"];

test("傾向12軸：軸キーは診断の軸ラベル表の傾向側12軸と一致し、各軸に3つの文がある", () => {
  const labels = read("src/lib/diagnosis-axis-labels.ts");
  for (const key of STYLE_KEYS) assert.match(labels, new RegExp(`\\b${key}: "`), `軸ラベルに ${key} がない`);
  assert.deepEqual(Object.keys(style.STYLE_AXIS_GUIDE).sort(), [...STYLE_KEYS].sort());
  for (const [key, g] of Object.entries(style.STYLE_AXIS_GUIDE)) {
    for (const field of ["meaning", "tryNext", "reviewQuestion"]) assert.ok(g[field] && g[field].length >= 10, `${key}.${field}`);
    assert.match(g.reviewQuestion, /？$/, `${key} の振り返りは問いの形`);
  }
});

test("傾向12軸：強さ・相性・性能を断定する言い方をしない", () => {
  const all = JSON.stringify(style.STYLE_AXIS_GUIDE) + style.STYLE_AXIS_DISCLAIMER;
  assert.doesNotMatch(JSON.stringify(style.STYLE_AXIS_GUIDE), /強い|弱い|上手|下手|向いています|相性が良い|最強|\d+F|フレーム/);
  assert.match(style.STYLE_AXIS_DISCLAIMER, /判定するものではありません/);
  assert.ok(all.length > 0);
});

test("傾向12軸：listStyleAxisGuides は並び順を保ち、未知キー・重複・改善軸を除く", () => {
  const out = style.listStyleAxisGuides(["rushdown", "anti_air", "rushdown", null, "patience", "unknown"]);
  assert.deepEqual(out.map((g) => g.key), ["rushdown", "patience"]);
  assert.equal(style.isStyleAxisKey("anti_air"), false);
});

test("15分練習：15種すべてに初心者向け補足があり、キーは既存の練習詳細と一致する", () => {
  const src = read("src/lib/daily-training-details.ts");
  const body = src.slice(src.indexOf("DAILY_TRAINING_DETAILS"), src.indexOf("} as const satisfies"));
  const detailKeys = [...body.matchAll(/\n  "?([a-z_]+)"?: \{/g)].map((m) => m[1]).sort();
  assert.equal(detailKeys.length, 15);
  assert.deepEqual(Object.keys(goals.PRACTICE_BEGINNER_GOALS).sort(), detailKeys);
  for (const [key, g] of Object.entries(goals.PRACTICE_BEGINNER_GOALS)) {
    assert.ok(["count", "explain"].includes(g.kind), key);
    for (const field of ["firstStep", "beginnerTarget", "firstCheck"]) assert.ok(g[field].length >= 10, `${key}.${field}`);
  }
});

test("15分練習：回数型10種・説明型5種の区分は既存の仮目標と食い違わない", () => {
  const src = read("src/lib/daily-training-details.ts");
  const countKeys = Object.entries(goals.PRACTICE_BEGINNER_GOALS).filter(([, g]) => g.kind === "count").map(([k]) => k).sort();
  assert.deepEqual(countKeys, ["anti_air", "corner_defense", "decision", "defense", "drive_rush_defense", "execution", "impact_response", "neutral", "offense", "punish"]);
  // 回数型は既存の仮目標が「10回中7〜8回」。初心者向けの目安（10回中5回）はそれより低い前段だけ。
  for (const key of countKeys) {
    const block = src.slice(src.indexOf(`\n  ${key}: {`) >= 0 ? src.indexOf(`\n  ${key}: {`) : src.indexOf(`\n  "${key}": {`));
    assert.match(block.slice(0, 4000), /10回中[78]回/, `${key} の既存仮目標`);
    assert.match(goals.PRACTICE_BEGINNER_GOALS[key].beginnerTarget, /10回中5回/);
  }
  assert.match(goals.BEGINNER_GOAL_NOTICE, /ゲーム公式の基準ではありません/);
});

test("15分練習：ダミー準備の言い方は公式マニュアルの名称だけを使い、機種別のボタン名を書かない", () => {
  for (const [key, g] of Object.entries(goals.PRACTICE_BEGINNER_GOALS)) {
    if (!g.dummyPlain) continue;
    assert.match(g.dummyPlain, /「レコード設定」/, key);
    assert.doesNotMatch(g.dummyPlain, /OPTIONS|Xbox|Steam|Switch|R3|L3|ボタンを押/, key);
    assert.doesNotMatch(g.dummyPlain, /録画/, key);
  }
  assert.equal(goals.getPracticeBeginnerGoal("unknown"), null);
});

test("新しい部品は表示だけ（状態・保存・通信・採点を持たない）で、既存の診断・練習コードの対象外の名前にしている", () => {
  for (const f of ["src/lib/style-axis-guide.ts", "src/lib/practice-beginner-goals.ts", "src/components/style-axis-guide-notes.tsx", "src/components/practice-beginner-goal-note.tsx"]) {
    assert.doesNotMatch(read(f), /useState|useEffect|localStorage|sessionStorage|fetch\(|supabase|scorePayload|score_payload|saveDiagnosis|rpc\(/, f);
    assert.doesNotMatch(f, /\/(diagnosis|daily-training)[^/]*$/, `${f} が承認対象パスの名前と重なる`);
  }
});
