#!/usr/bin/env node
// 132本のGIF実体が正しく復元されているかを検証する(読み取りのみ)。
// 使い方: node scripts/gif-intake/verify-restore-132.mjs   (リポジトリのルートから)
// 期待: RESTORE_TABLE_132_20261117.json の各行について、v2-web/<localFile> が存在し SHA-256 と bytes が一致する。
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const table = JSON.parse(readFileSync(path.join(ROOT, "scripts/gif-intake/RESTORE_TABLE_132_20261117.json"), "utf8"));
let ok = 0;
const problems = [];
for (const r of table.rows) {
  const file = path.join(ROOT, "v2-web", r.localFile);
  if (!existsSync(file)) { problems.push(`MISSING ${r.localFile} (Drive ${r.driveFileId})`); continue; }
  const bytes = readFileSync(file);
  const sha = createHash("sha256").update(bytes).digest("hex");
  if (sha !== r.sha256 || bytes.length !== r.bytes) problems.push(`MISMATCH ${r.localFile}`);
  else ok++;
}
console.log(`復元確認: ${ok}/${table.rows.length} 一致`);
for (const p of problems) console.log(p);
process.exit(problems.length ? 1 : 0);
