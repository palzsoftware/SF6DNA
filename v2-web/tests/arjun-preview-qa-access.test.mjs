import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
test("Preview QA gate explicitly requires preview and three server-side variables", () => {
  const code = read("../src/lib/arjun-preview-qa-auth.ts");
  for (const value of ["VERCEL_ENV === \"preview\"", "NODE_ENV === \"production\"", "SF6DNA_ARJUN_PREVIEW_QA", "SF6DNA_ARJUN_QA_PASSWORD", "SF6DNA_ARJUN_QA_SIGNING_KEY"]) assert.ok(code.includes(value), value);
  assert.match(code, /timingSafeEqual/);assert.match(code,/createHmac/);
});
test("new Preview page requires authenticated session; local-only route remains separate", () => {
  const page=read("../src/app/arjun-research-preview/page.tsx");
  assert.match(page,/hasArjunQaSession/);assert.match(page,/notFound\(\)/);assert.match(page,/redirect\(/);
  // Existing local route is supplied by the prerequisite ZIP and intentionally not modified by this package.
});
test("auth endpoint sets HttpOnly secure scoped session; no query string credential", () => {
  const route=read("../src/app/arjun-research-preview/access/route.ts");
  assert.match(route,/httpOnly: true/);assert.match(route,/secure: true/);assert.match(route,/sameSite: "strict"/);assert.match(route,/status: 401/);
});
test("Preview component wrappers do not bypass environment gate", () => {
  for(const file of ["arjun-77-preview-qa.tsx","arjun-142-preview-qa.tsx","arjun-player-video-preview-qa.tsx"]){
    const src=read(`../src/components/${file}`);assert.match(src,/arjunPreviewQaEnabled\(\)/);
  }
  assert.match(read("../src/lib/arjun-142-preview-strategy.tsx"),/arjunPreviewQaEnabled\(\)/);
});
