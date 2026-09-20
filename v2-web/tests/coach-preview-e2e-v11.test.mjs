import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const activationSource = readFileSync(new URL("../src/lib/coach-preview-activation.ts", import.meta.url), "utf8");
const activationJs = ts.transpileModule(activationSource, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const activation = await import(`data:text/javascript;base64,${Buffer.from(activationJs).toString("base64")}`);

test("AI Coach is enabled only on the exact V1.1 Preview branch", () => {
  assert.equal(activation.isV11CoachPreviewEnabled({ VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "sf6dna-v1-1-ai-coach-20260918" }), true);
  assert.equal(activation.isV11CoachPreviewEnabled({ VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "sf6dna-v1-1-ai-coach-20260918" }), false);
  assert.equal(activation.isV11CoachPreviewEnabled({ VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "main" }), false);
  assert.equal(activation.isV11CoachPreviewEnabled({}), false);
});

test("default feature boundary remains a literal false", () => {
  const source = readFileSync(new URL("../src/lib/release-features.ts", import.meta.url), "utf8");
  for (const flag of ["aiCoach", "training", "publicStrategyContent"]) assert.match(source, new RegExp(`${flag}: false`));
});

test("route and page share the server-only Preview activation boundary", () => {
  const route = readFileSync(new URL("../src/app/api/coach/retrieve/route.ts", import.meta.url), "utf8");
  const page = readFileSync(new URL("../src/app/coach/page.tsx", import.meta.url), "utf8");
  assert.match(route, /isCoachSurfaceEnabled\(releaseFeatures\.aiCoach\)/);
  assert.match(page, /isCoachSurfaceEnabled\(releaseFeatures\.aiCoach\)/);
  assert.doesNotMatch(activationSource, /NEXT_PUBLIC_/);
});

test("Preview E2E connects prompt, deterministic provider and composer", () => {
  const source = readFileSync(new URL("../src/lib/coach-preview-e2e.ts", import.meta.url), "utf8");
  assert.match(source, /buildCoachPromptInput/);
  assert.match(source, /DeterministicCoachProvider/);
  assert.match(source, /runCoachProvider/);
  assert.match(source, /composeCoachAnswer/);
});

test("API exposes deterministic output but keeps external generation disabled", () => {
  const source = readFileSync(new URL("../src/app/api/coach/retrieve/route.ts", import.meta.url), "utf8");
  assert.match(source, /generationEnabled: false/);
  assert.match(source, /deterministicPreviewEnabled: true/);
  assert.match(source, /providerDraft/);
});
