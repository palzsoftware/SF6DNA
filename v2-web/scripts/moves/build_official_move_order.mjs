// Builds src/data/official-move-order.json from the saved official frame tables (ALL32, 2026-11-24 check).
// Only the row order is kept: [official row key, display name] per character, in the order the official
// command list / frame table shows them (弱→中→強→OD, follow-ups in listed order, SA1→SA2→SA3→CA).
// Usage (from v2-web): node scripts/moves/build_official_move_order.mjs
import { readFileSync, writeFileSync } from "node:fs";

const source = new URL("../../src/data/SF6DNA_ALL32_OFFICIAL_MOVE_FILL_20261125.json", import.meta.url);
const target = new URL("../../src/data/official-move-order.json", import.meta.url);
const data = JSON.parse(readFileSync(source, "utf8"));
const byCharacter = Object.fromEntries(Object.entries(data.byCharacter).map(([slug, rows]) =>
  [slug, rows.map(row => [row.k ?? null, row.n])]));
writeFileSync(target, JSON.stringify({ source: "SF6DNA_ALL32_OFFICIAL_MOVE_FILL_20261125.json (official frame tables, checked 2026-11-24)", byCharacter }) + "\n");
console.log("characters", Object.keys(byCharacter).length, "rows", Object.values(byCharacter).reduce((n, rows) => n + rows.length, 0));
