import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/daily-training-sound.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const loaded = { exports: {} };
new Function("module", "exports", compiled)(loaded, loaded.exports);
const { createTrainingSound } = loaded.exports;

function fixture(overrides = {}) {
  const events = [];
  const audio = {
    state: "suspended", currentTime: 10, destination: {},
    resume: async () => { events.push(["resume"]); audio.state = "running"; },
    close: async () => { events.push(["close"]); audio.state = "closed"; },
    createOscillator: () => {
      const node = { type: "", frequency: { value: 0 }, connect: () => {}, disconnect: () => events.push(["disconnect"]),
        start: at => events.push(["start", at, node.frequency.value]), stop: at => events.push(["stop", at]), onended: null };
      return node;
    },
    createGain: () => ({ gain: { setValueAtTime: (...x) => events.push(["gain", ...x]), linearRampToValueAtTime: (...x) => events.push(["ramp", ...x]) }, connect: () => {}, disconnect: () => {} }),
    ...overrides,
  };
  let creates = 0;
  const sound = createTrainingSound(() => { creates++; return audio; });
  return { sound, audio, events, creates: () => creates };
}

test("user preparation unlocks one reusable audio context without playing a tone", async () => {
  const f = fixture();
  assert.equal(await f.sound.prepare(), true);
  assert.equal(await f.sound.prepare(), true);
  assert.equal(f.creates(), 1);
  assert.deepEqual(f.events, [["resume"]]);
});
test("the alert schedules two short quiet tones and finite stop times", async () => {
  const f = fixture();
  assert.equal(await f.sound.play(), true);
  assert.deepEqual(f.events.filter(x => x[0] === "start"), [["start", 10, 880], ["start", 10.25, 1046.5]]);
  assert.deepEqual(f.events.filter(x => x[0] === "stop"), [["stop", 10.19], ["stop", 10.44]]);
  assert.ok(f.events.filter(x => x[0] === "ramp").every(x => x[1] <= 0.12));
});
test("unsupported audio leaves the timer free to continue", async () => {
  const s = createTrainingSound(() => null);
  assert.equal(await s.prepare(), false);
  assert.equal(await s.play(), false);
  s.dispose();
});
test("constructor failures are contained", async () => {
  const s = createTrainingSound(() => { throw Error("unsupported"); });
  assert.equal(await s.prepare(), false);
  assert.equal(await s.play(), false);
});
test("autoplay rejection reports failure without scheduling a tone", async () => {
  const f = fixture({ resume: async () => { throw Error("NotAllowedError"); } });
  assert.equal(await f.sound.play(), false);
  assert.equal(f.events.some(x => x[0] === "start"), false);
});
test("a context that stays suspended is not reported as playing", async () => {
  const f = fixture({ resume: async () => {} });
  assert.equal(await f.sound.play(), false);
  assert.equal(f.events.some(x => x[0] === "start"), false);
});
test("turning off or resetting during delayed unlock cancels a pending alert", async () => {
  let release;
  const f = fixture({ resume: () => new Promise(resolve => { release = () => { f.audio.state = "running"; resolve(); }; }) });
  const playing = f.sound.play();
  f.sound.cancel();
  release();
  assert.equal(await playing, false);
  assert.equal(f.events.some(x => x[0] === "start"), false);
});
test("unmounting during unlock prevents later playback and closes the context", async () => {
  let release;
  const f = fixture({ resume: () => new Promise(resolve => { release = resolve; }) });
  const playing = f.sound.play();
  f.sound.dispose();
  release();
  assert.equal(await playing, false);
  assert.equal(await f.sound.prepare(), false);
  assert.equal(await f.sound.play(), false);
  assert.equal(f.events.filter(x => x[0] === "close").length, 1);
});
test("reset or completion stops already scheduled tones", async () => {
  const f = fixture();
  await f.sound.play();
  f.sound.cancel();
  assert.equal(f.events.filter(x => x[0] === "stop" && x[1] === undefined).length, 2);
});
test("a later preview supersedes an older pending preview", async () => {
  let release;
  const f = fixture({ resume: () => new Promise(resolve => { release = () => { f.audio.state = "running"; resolve(); }; }) });
  const first = f.sound.play();
  f.audio.state = "running";
  const second = f.sound.play();
  release();
  assert.equal(await first, false);
  assert.equal(await second, true);
  assert.equal(f.events.filter(x => x[0] === "start").length, 2);
});
test("audio resource failures are contained and do not throw through the UI", async () => {
  const f = fixture({ createGain: () => { throw Error("audio resource limit"); } });
  assert.equal(await f.sound.play(), false);
});
