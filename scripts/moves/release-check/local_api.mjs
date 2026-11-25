// ISOLATED VERIFICATION ONLY. Serves http://127.0.0.1:54321/rest/v1/* -> local PostgREST and prints a local anon key.
// Usage: node local_api.mjs <postgrest-port> <jwt-secret-file> <anon-key-out-file>   (local-only secret; never a Supabase secret)
import http from "node:http"; import crypto from "node:crypto"; import fs from "node:fs";
const [port, secretFile, keyOut] = process.argv.slice(2);
const secret = fs.readFileSync(secretFile, "utf8").trim();
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const body = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ role: "anon", iss: "local-release-check" })}`;
const anon = `${body}.${crypto.createHmac("sha256", secret).update(body).digest("base64url")}`;
fs.writeFileSync(keyOut, anon, { mode: 0o600 });
http.createServer((req, res) => {
  if (!req.url.startsWith("/rest/v1/")) { res.writeHead(404); return res.end(); }
  const up = http.request({ host: "127.0.0.1", port, method: req.method, path: req.url.slice("/rest/v1".length), headers: { ...req.headers, host: `127.0.0.1:${port}` } },
    (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
  up.on("error", () => { res.writeHead(502); res.end(); }); req.pipe(up);
}).listen(54321, "127.0.0.1", () => console.error("local API on http://127.0.0.1:54321 (anon key written to the given file)"));
