// For the SFL2026 48 players only: rows bound to the development ID but not the production ID get the production
// binding too (production IDs matched against the production DB on 2026-11-25). Local candidate data only.
// Usage: node align_prod_bindings.js <v2-webDir>
const fs = require("fs"), path = require("path");
const web = process.argv[2];
const f = n => path.join(web, "src/data/player-research", n);
const bindings = JSON.parse(fs.readFileSync(f("video-bindings.json"), "utf8"));
const videos = JSON.parse(fs.readFileSync(f("videos.json"), "utf8"));
const sup = JSON.parse(fs.readFileSync(f("profile-supplements.json"), "utf8"));
const PROD = "wnuxaxbrpudyypzdbdho", DEV = "vvsknbmlfvvnrmgtyhbf";
const keys = new Set(videos.filter(v => v.relationConfirmed).map(v => v.key));
let added = 0; const per = {};
for (const s of sup) {
  const prodId = s.identities.find(i => i.environment === PROD)?.playerId;
  if (!prodId) continue;
  const devKeys = bindings.filter(b => b.environment === DEV && b.playerSlug === s.playerSlug).map(b => b.recommendationKey);
  for (const key of devKeys) {
    if (!keys.has(key) || bindings.some(b => b.environment === PROD && b.recommendationKey === key)) continue;
    bindings.push({ environment: PROD, playerId: prodId, playerSlug: s.playerSlug, recommendationKey: key });
    added++; per[s.playerSlug] = (per[s.playerSlug] || 0) + 1;
  }
}
fs.writeFileSync(f("video-bindings.json"), JSON.stringify(bindings, null, 2) + "\n");
console.log(JSON.stringify({ added, players: Object.keys(per).length, per }));
