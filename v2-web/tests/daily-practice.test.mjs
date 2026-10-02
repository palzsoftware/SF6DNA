import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
function load(name) {
  const js = ts.transpileModule(readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const m = { exports: {} }; new Function('module', 'exports', 'require', js)(m, m.exports, path => load(path.slice(6))); return m.exports;
}
const p = load('daily-practice'); const training = load('daily-training');
const plan = () => training.buildDailyTrainingPlan({ dateKey: '2026-10-02', selection: { source: 'default', focus: null } });
const id = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const session = (n = 1) => p.createPractice(plan(), id(n), '2026-10-02T14:55:00.000Z', 'jp');
function storage(raw = null) { return { raw, getItem() { return this.raw; }, setItem(key, value) { assert.equal(key, p.DAILY_PRACTICE_KEY); this.raw = value; } }; }
test('absent, invalid JSON, wrong shape and unsupported schema fail safely', () => {
  assert.deepEqual(p.readPractice(storage()), { sessions: [], unavailable: false, invalid: false });
  for (const raw of ['{', 'null', '{}', JSON.stringify({ version: 2, sessions: [] }), JSON.stringify({ version: 1, sessions: {} })]) {
    const read = p.readPractice(storage(raw)); assert.equal(read.invalid, true); assert.deepEqual(read.sessions, []);
  }
});
test('storage denial and quota failure return explicit failure without throwing', () => {
  assert.equal(p.readPractice({ getItem() { throw Error('denied'); } }).unavailable, true);
  assert.equal(p.savePractice(session(), { getItem: () => null, setItem() { throw Error('quota'); } }), false);
});
test('a future schema is never overwritten', () => {
  const port = storage(JSON.stringify({ version: 2, sessions: [] })); const before = port.raw;
  assert.equal(p.savePractice(session(), port), false); assert.equal(port.raw, before);
});
test('reload restores the same plan snapshot, metadata and one-of-three progress', () => {
  const port = storage(); const s = session(); const before = structuredClone(s);
  const next = p.togglePracticeItem(s, s.plan.items[0].id, '2026-10-02T15:05:00.000Z');
  assert.deepEqual(s, before); assert.ok(p.savePractice(next, port));
  const read = p.readPractice(port); assert.deepEqual(read.sessions, [next]); assert.equal(read.sessions[0].plan.dateKey, '2026-10-02');
  assert.equal(read.sessions[0].characterSlug, 'jp'); assert.equal(read.sessions[0].completedIds.length, 1);
});
test('completion upserts one history entry; undo preserves the session', () => {
  const port = storage(); let s = session();
  for (const i of s.plan.items) { s = p.togglePracticeItem(s, i.id, '2026-10-02T15:10:00.000Z'); assert.ok(p.savePractice(s, port)); }
  assert.ok(s.completedAt); for (let n = 0; n < 5; n++) assert.ok(p.savePractice(s, port));
  assert.equal(p.readPractice(port).sessions.length, 1); assert.equal(p.latestUnfinished(p.readPractice(port).sessions), null);
  s = p.togglePracticeItem(s, s.plan.items[1].id, '2026-10-02T15:11:00.000Z'); assert.equal(s.completedAt, null); p.savePractice(s, port);
  assert.equal(p.readPractice(port).sessions.length, 1); assert.equal(p.latestUnfinished(p.readPractice(port).sessions).id, s.id);
});
test('multiple sessions on one day are allowed and latest unfinished wins', () => {
  const port = storage(); const first = session(1); const second = session(2); second.updatedAt = '2026-10-02T15:20:00.000Z';
  p.savePractice(first, port); p.savePractice(second, port); assert.equal(p.readPractice(port).sessions.length, 2);
  assert.equal(p.latestUnfinished(p.readPractice(port).sessions).id, second.id);
});
test('history retains the 50 latest sessions and caps rendering separately', () => {
  const port = storage(); for (let n = 1; n <= 55; n++) { const s = session(n); s.updatedAt = new Date(Date.parse(s.startedAt) + n * 1000).toISOString(); p.savePractice(s, port); }
  const read = p.readPractice(port); assert.equal(read.sessions.length, 50); assert.equal(read.sessions[0].id, id(55)); assert.equal(read.sessions.at(-1).id, id(6));
});
test('malformed items, duplicated IDs and inconsistent completion are rejected', () => {
  const corruptions = [s => s.completedIds.push('unknown'), s => s.plan.items[0].detail.setup = {}, s => s.completedAt = s.startedAt, s => s.planId = 'wrong', s => s.id = '../../internal', s => s.plan.items[1].id = s.plan.items[0].id, s => s.completedIds = [s.plan.items[0].id, s.plan.items[0].id], s => s.updatedAt = 'invalid', s => s.plan.dateKey = '2026-02-30'];
  for (const corrupt of corruptions) { const s = session(); corrupt(s); assert.equal(p.validSession(s), false); assert.equal(p.readPractice(storage(JSON.stringify({ version: 1, sessions: [s] }))).sessions.length, 0); }
});
test('invalid neighbors are ignored and duplicate stored IDs do not multiply history', () => {
  const s = session(); const read = p.readPractice(storage(JSON.stringify({ version: 1, sessions: [s, null, s] })));
  assert.equal(read.invalid, true); assert.deepEqual(read.sessions, [s]);
});
test('new practice recovers invalid JSON only after an explicit save', () => {
  const port = storage('{'); assert.equal(p.readPractice(port).invalid, true); assert.equal(port.raw, '{');
  assert.ok(p.savePractice(session(), port)); assert.equal(p.readPractice(port).invalid, false);
});
test('history snapshot survives future changes to the generated plan', () => {
  const original = plan(); const s = p.createPractice(original, id(1), '2026-10-02T14:55:00.000Z'); const before = s.plan.items[0].title;
  original.items[0].title = 'future copy'; assert.equal(s.plan.items[0].title, before);
});
test('overnight completion keeps original date and timestamps monotonic', () => {
  let s = session(); for (const i of s.plan.items) s = p.togglePracticeItem(s, i.id, '2026-10-02T15:05:00.000Z');
  assert.equal(s.plan.dateKey, '2026-10-02'); assert.equal(s.completedAt, '2026-10-02T15:05:00.000Z'); assert.ok(p.validSession(s));
  const changed = p.togglePracticeItem(s, s.plan.items[0].id, '2026-10-02T14:00:00.000Z'); assert.equal(changed.updatedAt, s.updatedAt); assert.ok(p.validSession(changed));
});
test('unknown item cannot change progress and generated resume URL stays local', () => {
  const s = session(); assert.equal(p.togglePracticeItem(s, 'unknown', s.updatedAt), s);
  assert.equal(p.practiceHref(s.id), `/me/training?session=${s.id}`); assert.equal(p.isSessionId('https://example.com'), false);
});
