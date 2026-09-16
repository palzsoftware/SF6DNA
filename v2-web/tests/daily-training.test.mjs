import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
function loadCommonJs(source, requireStub = () => { throw new Error("Unexpected module"); }) {
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  new Function("module", "exports", "require", output)(loadedModule, loadedModule.exports, requireStub);
  return loadedModule.exports;
}
const detailApi = loadCommonJs(read("src/lib/daily-training-details.ts"));
const api = loadCommonJs(read("src/lib/daily-training.ts"), (name) => {
  if (name === "@/lib/daily-training-details") return detailApi;
  throw new Error(`Unexpected import: ${name}`);
});
const {
  IMPROVEMENT_FOCUS_KEYS, pickDiagnosisFocus, buildDailyTrainingHref,
  parseDailyTrainingRequest, getLatestLocalDiagnosisFocus, normalizePrimaryIssue,
  resolveDailyTrainingSelection, getJstDateKey, buildDailyTrainingPlan,
} = api;
const now = new Date("2026-09-07T05:00:00Z");
const record = (overrides = {}) => ({
  id: "fixture-only", diagnosisSlug: "improvement-check", diagnosisType: "improvement",
  completedAt: "2026-09-07T04:00:00Z", topResults: [{ key: "anti_air", label: "対空", score: 3 }],
  ...overrides,
});
const plan = (source = "default", focus = null, dateKey = "2026-09-07") =>
  buildDailyTrainingPlan({ dateKey, selection: { source, focus } });

for (const focus of IMPROVEMENT_FOCUS_KEYS) {
  test(`diagnosis focus ${focus} stays in the first five minutes`, () => {
    const result = plan("diagnosis_link", focus);
    assert.equal(result.source, "diagnosis_link");
    assert.equal(result.items[0].id, `2026-09-07:${focus}`);
    assert.equal(result.items.length, 3);
    assert.equal(new Set(result.items.map((item) => item.id)).size, 3);
    assert.equal(result.items.reduce((sum, item) => sum + item.minutes, 0), 15);
    assert.equal(result.totalMinutes, 15);
    assert.ok(result.items.every((item) => item.minutes === 5 && item.title && item.goal && item.detail));
  });
}

test("reads highest existing improvement score, preserving first row on ties", () => {
  assert.equal(pickDiagnosisFocus("improvement", [["anti_air", 1], ["punish", 3], ["execution", 3]]), "punish");
});
test("comprehensive preference scores are not interpreted as weaknesses", () => {
  assert.equal(pickDiagnosisFocus("comprehensive", [["aggression", 99], ["simplicity", 30], ["anti_air", 1]]), "anti_air");
});
test("playstyle and character-fit do not yield a weakness even with an overlapping key", () => {
  for (const type of ["playstyle", "character_fit", "invalid", null]) {
    assert.equal(pickDiagnosisFocus(type, [["execution", 99]]), null);
    assert.equal(buildDailyTrainingHref(type, [["execution", 99]]), "/me/training");
  }
});
test("zero, negative, nonnumeric, infinite, unknown, and malformed scores are ignored", () => {
  const rows = [["anti_air", 0], ["punish", -1], ["defense", "3"], ["meter", Infinity], ["decision", NaN], ["__proto__", 999], null, {}];
  assert.equal(pickDiagnosisFocus("improvement", rows), null);
  assert.equal(pickDiagnosisFocus("improvement", {}), null);
});
test("CTA transfers only diagnosis kind and a whitelisted focus, never scores or identity", () => {
  const href = buildDailyTrainingHref("comprehensive", [["aggression", 99], ["execution", 2]]);
  assert.equal(href, "/me/training?diagnosis=comprehensive&focus=execution");
  assert.doesNotMatch(href, /99|user|request|score|answer/);
});
test("zero-score diagnosis still carries a context marker to avoid resurrecting older local issues", () => {
  assert.equal(buildDailyTrainingHref("improvement", [["anti_air", 0]]), "/me/training?diagnosis=improvement");
});
test("request normalization rejects unsupported kinds and array parameters", () => {
  for (const params of [{}, { diagnosis: "playstyle", focus: "anti_air" }, { diagnosis: ["improvement"] }]) {
    assert.equal(parseDailyTrainingRequest(params), null);
  }
  assert.deepEqual(parseDailyTrainingRequest({ diagnosis: "improvement", focus: ["anti_air"] }), { diagnosisType: "improvement", focus: null });
});
test("request normalization ignores invalid focus, raw labels, and additional user identifiers", () => {
  assert.deepEqual(parseDailyTrainingRequest({ diagnosis: "improvement", focus: "<script>", user_id: "other-user" }), { diagnosisType: "improvement", focus: null });
  assert.deepEqual(parseDailyTrainingRequest({ diagnosis: "comprehensive", focus: "punish" }), { diagnosisType: "comprehensive", focus: "punish" });
});
test("history selects newest applicable diagnosis independently of input order", () => {
  const older = record({ completedAt: "2026-09-06T04:00:00Z" });
  const newer = record({ topResults: [{ key: "execution", score: 3 }] });
  assert.equal(getLatestLocalDiagnosisFocus([older, newer], now), "execution");
  assert.equal(getLatestLocalDiagnosisFocus([newer, older], now), "execution");
});
test("preference-only history never becomes a weakness", () => {
  assert.equal(getLatestLocalDiagnosisFocus([record({ diagnosisType: "playstyle" })], now), null);
  assert.equal(getLatestLocalDiagnosisFocus([record({ diagnosisType: "character_fit" })], now), null);
});
test("malformed histories do not throw", () => {
  for (const history of [null, {}, "bad", 42, [null, {}, { completedAt: 1 }]]) {
    assert.equal(getLatestLocalDiagnosisFocus(history, now), null);
  }
});
test("invalid and future timestamps are not accepted as the latest diagnosis", () => {
  const broken = record({ completedAt: "invalid" });
  const future = record({ completedAt: "2030-01-01T00:00:00Z" });
  assert.equal(getLatestLocalDiagnosisFocus([broken, future], now), null);
  assert.equal(getLatestLocalDiagnosisFocus([record()], new Date("bad")), null);
});
test("latest zero or incomplete result does not revive an older weakness", () => {
  const older = record({ completedAt: "2026-09-06T04:00:00Z" });
  assert.equal(getLatestLocalDiagnosisFocus([older, record({ topResults: [] })], now), null);
  assert.equal(getLatestLocalDiagnosisFocus([older, record({ topResults: [{ key: "aggression", score: 3 }] })], now), null);
  assert.equal(getLatestLocalDiagnosisFocus([older, record({ topResults: null })], now), null);
});
test("history uses whitelisted keys and ignores stored display labels", () => {
  assert.equal(getLatestLocalDiagnosisFocus([record({ topResults: [{ key: "punish", label: "<script>", score: 2 }] })], now), "punish");
});
test("priority is current diagnosis link, then browser diagnosis, then own match, then default", () => {
  assert.deepEqual(resolveDailyTrainingSelection({ request: { diagnosisType: "improvement", focus: "anti_air" }, localFocus: "punish", primaryIssue: "habit" }), { source: "diagnosis_link", focus: "anti_air" });
  assert.deepEqual(resolveDailyTrainingSelection({ request: null, localFocus: "punish", primaryIssue: "habit" }), { source: "local_diagnosis", focus: "punish" });
  assert.deepEqual(resolveDailyTrainingSelection({ request: null, localFocus: null, primaryIssue: "habit" }), { source: "match_issue", focus: "habit" });
  assert.deepEqual(resolveDailyTrainingSelection({ request: null, localFocus: null, primaryIssue: "unknown" }), { source: "default", focus: null });
});
test("current diagnosis without positive scores supersedes older browser history", () => {
  assert.deepEqual(resolveDailyTrainingSelection({ request: { diagnosisType: "improvement", focus: null }, localFocus: "anti_air", primaryIssue: "execution" }), { source: "match_issue", focus: "execution" });
});
for (const issue of ["knowledge", "execution", "decision", "habit", "matchup"]) {
  test(`match issue ${issue} creates a stable three-item plan`, () => {
    const result = plan("match_issue", issue);
    assert.equal(normalizePrimaryIssue(issue), issue);
    assert.equal(result.source, "match_issue");
    assert.equal(result.items[0].id, `2026-09-07:${issue}`);
    assert.equal(result.items.length, 3);
  });
}
test("unknown or invalid match issue falls back instead of claiming personalization", () => {
  for (const issue of ["unknown", "judgment", "anti_air", "__proto__", null, []]) {
    assert.equal(normalizePrimaryIssue(issue), null);
    assert.equal(plan("match_issue", issue).source, "default");
  }
});
test("all default plans have three distinct five-minute items", () => {
  for (let day = 1; day <= 30; day += 1) {
    const result = plan("default", null, `2026-09-${String(day).padStart(2, "0")}`);
    assert.equal(result.items.length, 3);
    assert.equal(new Set(result.items.map((item) => item.id)).size, 3);
    assert.equal(result.items.reduce((sum, item) => sum + item.minutes, 0), result.totalMinutes);
  }
});
test("same date and input return identical plans; following day rotates support but retains focus", () => {
  assert.deepEqual(plan("diagnosis_link", "anti_air"), plan("diagnosis_link", "anti_air"));
  const next = plan("diagnosis_link", "anti_air", "2026-09-08");
  assert.equal(next.items[0].title, plan("diagnosis_link", "anti_air").items[0].title);
  assert.notEqual(next.items[1].title, plan("diagnosis_link", "anti_air").items[1].title);
});
test("JST day boundary is 15:00 UTC", () => {
  assert.equal(getJstDateKey(new Date("2026-09-07T14:59:59Z")), "2026-09-07");
  assert.equal(getJstDateKey(new Date("2026-09-07T15:00:00Z")), "2026-09-08");
});
test("invalid and impossible dates are rejected explicitly", () => {
  for (const date of ["bad", "2026-02-29", "2026-13-01", "2026-04-31"]) {
    assert.throws(() => plan("default", null, date), RangeError);
  }
  assert.throws(() => getJstDateKey(new Date("bad")), RangeError);
  assert.equal(plan("default", null, "2028-02-29").items.length, 3);
});
test("browser history and account history are described separately", () => {
  assert.match(plan("local_diagnosis", "anti_air").reason, /このブラウザ/);
  assert.match(plan("local_diagnosis", "anti_air").reason, /アカウントに保存された診断履歴とは別/);
  assert.match(plan("match_issue", "habit").reason, /ログイン中のアカウント/);
});
test("invalid source-focus combinations fall back safely", () => {
  assert.equal(plan("diagnosis_link", "knowledge").source, "default");
  assert.equal(plan("default", "anti_air").source, "default");
});

test("all twelve improvement axes have complete accordion details", () => {
  for (const focus of IMPROVEMENT_FOCUS_KEYS) {
    const item = plan("diagnosis_link", focus).items[0];
    for (const key of ["setup", "minute01", "minute13", "minute35", "successCondition", "commonFailure", "adjustment", "matchFocus"]) {
      assert.ok(Array.isArray(item.detail[key]) && item.detail[key].length > 0, `${focus}.${key} is required`);
    }
  }
});

test("impact training uses natural player-facing terminology", () => {
  const detail = plan("diagnosis_link", "impact_response").items[0].detail;
  assert.equal(detail.title, "ドライブインパクトを意識する");
  assert.match(JSON.stringify(detail), /インパクト返し/);
  assert.doesNotMatch(JSON.stringify(detail), /音や色を確認|正解を先読み/);
});

test("combo practice uses safe generic content and five consecutive successes per side", () => {
  const detail = plan("diagnosis_link", "execution").items[0].detail;
  const text = JSON.stringify(detail);
  assert.match(text, /実戦で使っている基本コンボ/);
  assert.match(text, /1P側と2P側で、それぞれ5回連続成功/);
  assert.match(text, /左右合計10回のうち8回成功/);
  assert.doesNotMatch(text, /リュウ|JPなら|ルーク|キャミィ|屈大P/);
});
