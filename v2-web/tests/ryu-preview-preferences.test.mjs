import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const root = new URL("../src/", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
test("Ryu preview uses independent storage, does not invoke Supabase auth, and keeps production behavior", () => {
 const owner = read("lib/use-personalization-owner.ts");
 const hook = read("lib/use-owned-video-preferences.ts");
 const storage = read("lib/preview-video-preferences.ts");
 assert.match(owner, /if \(skipAuthForPreview\) return;/);
 assert.match(hook, /usePersonalizationOwner\(previewLocalOnly\)/);
 assert.match(hook, /previewLocalOnly \? readPreviewVideoPreferences\(\) : readOwnedVideoPreferences\(scope\)/);
 assert.match(hook, /previewLocalOnly \? togglePreviewVideoPreference\(kind, videoId\) : toggleOwnedVideoPreference\(scope, kind, videoId\)/);
 assert.match(storage, /sf6dna_ryu_preview_/);
 assert.doesNotMatch(storage, /sf6dna_v3_guest_/);
 assert.match(storage, /INVALID_DATA/);
 assert.match(storage, /WRITE_FAILED/);
});
test("Ryu candidate cards use preview-only preferences and contain no internal acceptance labels", () => {
 const library = read("components/video-library.tsx");
 const card = read("components/video-card.tsx");
 assert.match(library, /useOwnedVideoPreferences\(previewCandidates\)/);
 assert.match(library, /previewLocalOnly=\{previewCandidates\}/);
 assert.match(card, /useOwnedVideoPreferences\(previewLocalOnly\)/);
 assert.doesNotMatch(card, /確認用候補・公開未承認/);
 assert.match(card, /preferences\.toggle\("favorite", video\.id\)/);
 assert.match(card, /preferences\.toggle\("watched", video\.id\)/);
});
