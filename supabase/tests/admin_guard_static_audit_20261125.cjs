// Static audit of /admin: every page and every exported server action must check admin before data access.
// Usage: node admin_audit.js <v2-webDir>
const fs = require("fs"), path = require("path");
const web = process.argv[2];
const adminDir = path.join(web, "src/app/admin");
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(adminDir).filter(f => /\.(tsx?|ts)$/.test(f));
const GUARD = /requireAdmin\(\)|profile\?\.role !== "admin"|profile\.role !== "admin"/;
const DATA = /\.from\(|\.rpc\(|\.storage\b/;
const out = { pages: [], actions: [], helpers: [] };
for (const f of files) {
  const rel = path.relative(web, f).replace(/\\/g, "/");
  const src = fs.readFileSync(f, "utf8");
  if (/[\\/]page\.tsx$/.test(f)) {
    const g = src.search(GUARD), dataIdx = src.search(DATA);
    // data access through imported helpers: find calls to functions imported from @/lib that hit the DB
    const usesHelperData = /await (list|get|fetch|load)[A-Z]\w*\(/.test(src);
    out.pages.push({ file: rel, guard: g >= 0, guardBeforeData: g >= 0 && (dataIdx < 0 || g < dataIdx), directData: dataIdx >= 0, usesHelperData });
  } else if (/"use server"/.test(src)) {
    const fns = [...src.matchAll(/export async function (\w+)\s*\(([^)]*)\)[^{]*\{([\s\S]*?)\n\}/g)];
    for (const [, name, , body] of fns) {
      const g = body.search(GUARD), dataIdx = body.search(DATA);
      out.actions.push({ file: rel, name, guard: g >= 0, guardFirst: g >= 0 && (dataIdx < 0 || g < dataIdx) });
    }
  } else out.helpers.push(rel);
}
const badPages = out.pages.filter(p => !p.guardBeforeData);
const badActions = out.actions.filter(a => !a.guardFirst);
console.log(JSON.stringify({ pages: out.pages.length, pagesWithoutGuardBeforeData: badPages, actions: out.actions.length, actionsWithoutGuardFirst: badActions, otherFiles: out.helpers }, null, 1));
