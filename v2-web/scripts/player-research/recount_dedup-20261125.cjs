// Per-player related-video count after removing duplicates of the same match (B final check 2026-11-25, item 1):
// a full stream is not counted when the same player has a single-match clip that points to it (sameMatchFullStream).
// Mirrors src/lib/registered-youtube-videos.ts (onlyPlayerId, local preview) for each SFL48 player and environment.
// Usage: node scripts/player-research/recount_dedup-20261125.cjs [v2-webDir]
const fs = require("fs"), path = require("path");
const web = process.argv[2] || path.join(__dirname, "../..");
const rd = f => JSON.parse(fs.readFileSync(path.join(web, "src/data/player-research", f), "utf8"));
const videos = rd("videos.json"), bindings = rd("video-bindings.json"), sup = rd("profile-supplements.json");
const F7 = "BDKiKN1KD0s";
const report = { environments: {}, f7: [] };
for (const env of ["wnuxaxbrpudyypzdbdho", "vvsknbmlfvvnrmgtyhbf"]) {
  const bound = new Map(bindings.filter(b => b.environment === env).map(b => [b.recommendationKey, b]));
  const rows = {};
  for (const s of sup) {
    const pid = (s.identities || []).find(i => i.environment === env)?.playerId;
    const mine = videos.filter(r => r.relationConfirmed && /^[A-Za-z0-9_-]{11}$/.test(r.youtubeId) && bound.has(r.key) && bound.get(r.key).playerId === pid);
    const covered = new Set(mine.filter(r => r.sameMatchFullStream).map(r => r.sameMatchFullStream.youtubeId));
    const ids = new Set(mine.filter(r => r.sameMatchFullStream || !covered.has(r.youtubeId)).map(r => r.youtubeId));
    rows[s.playerSlug] = ids.size;
  }
  const counts = Object.values(rows);
  report.environments[env] = { players: counts.length, min: Math.min(...counts), under10: Object.entries(rows).filter(([, n]) => n < 10), perPlayer: rows };
}
for (const s of sup) {
  const mine = videos.filter(r => r.playerSlug === s.playerSlug);
  const full = mine.find(r => r.youtubeId === F7);
  if (!full) continue;
  const clip = mine.find(r => r.sameMatchFullStream?.youtubeId === F7);
  report.f7.push({ player: s.playerSlug, fullStreamRow: full.key, clip: clip ? clip.youtubeId : null });
}
console.log(JSON.stringify(report, null, 1));
