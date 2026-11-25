const fs = require("fs");
module.exports = function parse(p) {
  const t = fs.readFileSync(p, "utf8").replace(/^﻿/, "");
  const rows = []; let r = [], f = "", q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { r.push(f); f = ""; }
    else if (c === "\n") { r.push(f.replace(/\r$/, "")); rows.push(r); r = []; f = ""; }
    else f += c;
  }
  if (f || r.length) { r.push(f); rows.push(r); }
  const h = rows.shift().map(s => s.trim());
  return rows.filter(x => x.length > 1).map(x => Object.fromEntries(h.map((k, i) => [k, (x[i] ?? "").trim()])));
};
