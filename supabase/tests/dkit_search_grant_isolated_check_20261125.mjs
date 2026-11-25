// Isolated DB (PGlite, in memory) in D's kit state: Production schema chain (20260922) + 115000 + base.sql + candidate.sql (V6),
// then 117000, then the planned source-grant restriction (116000 + 120000). Checks anon API counts and anonymous search.
// Usage: node dkit_isolated.mjs <repoRoot> <kitOutDir>
import { PGlite } from "@electric-sql/pglite";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { readFileSync } from "node:fs";
import path from "node:path";

const [root, out] = process.argv.slice(2);
const rd = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const mig = f => rd(path.join(root, "supabase/migrations", f));
const kit = f => rd(path.join(root, "scripts/moves/release-check", f));
const db = await PGlite.create({ extensions: { pg_trgm, pgcrypto, uuid_ossp } });
const step = async (name, sql) => { const t = Date.now(); try { await db.exec(sql); console.log(`ok   ${name} (${Date.now() - t}ms)`); return true; } catch (e) { console.log(`FAIL ${name}: ${e.message}`); await db.exec("rollback").catch(() => {}); return false; } };

// Kit's setup_isolated_db.sh roles + database settings.
await step("roles", `do $r$ begin
  if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role nologin bypassrls; end if;
end $r$; set search_path to "$user", public, extensions;`);
// pg_dump's psql-only \restrict / \unrestrict guard lines are not SQL; the schema itself is unchanged.
await step("schema_prod_chain_20260922", kit("schema_prod_chain_20260922.sql").split("\n").filter(l => !l.startsWith("\\")).join("\n"));
// The dump sets session-level search_path='' and row_security=off; psql runs each file in a fresh session, PGlite does not.
await step("reset session (as psql would)", `reset all; set search_path to "$user", public, extensions;`);
await step("20261120115000", mig("20261120115000_move_commands_policy_definer_source_check.sql"));
await step("base.sql", rd(path.join(out, "base.sql")));
await step("candidate.sql (V6)", rd(path.join(out, "candidate.sql")));

const asAnon = async (sql, params) => {
  try { await db.exec("set role anon"); const r = await db.query(sql, params); await db.exec("reset role"); return { ok: true, rows: r.rows }; }
  catch (e) { await db.exec("reset role"); return { ok: false, error: `${e.code ?? ""} ${e.message}` }; }
};
const counts = async label => {
  const q = `select (select count(*) from public.characters where status='published') characters,
    (select count(*) from public.moves) moves, (select count(*) from public.move_commands) move_commands,
    (select count(*) from public.move_frame_data) frames`;
  const r = await asAnon(q);
  const s = await asAnon("select $1::text q, entity_type, count(*) n from public.search_sf6dna($1, 100) group by 1, 2 union all select $2::text, entity_type, count(*) from public.search_sf6dna($2, 100) group by 1, 2 order by 1, 2", ["リュウ", "波動拳"]);
  const direct = await asAnon("select count(*) n from public.entity_sources");
  console.log(`\n[${label}]`);
  console.log("  anon API counts:", r.ok ? JSON.stringify(r.rows[0]) : r.error);
  console.log("  anon search リュウ:", s.ok ? JSON.stringify(s.rows) : s.error);
  console.log("  anon direct read of entity_sources:", direct.ok ? `readable (${direct.rows[0].n})` : `denied (${direct.error.split(" ")[0]})`);
  return { counts: r, search: s, direct };
};
const a = await counts("V6 + 115000（Dキットの状態）");
await step("20261120117000", mig("20261120117000_public_content_policies_definer_source_check.sql"));
const b = await counts("+ 117000");
await step("20261120116000", mig("20261120116000_preview_rpcs_public_source_boundary.sql"));
const ok120 = await step("20261120120000 (planned source-grant restriction)", mig("20261120120000_align_source_boundary_with_production.sql"));
const c = await counts("+ 116000 + 120000（出典テーブル権限制限後）");
// Hidden data never in the anonymous search response: every returned move/character must be published.
const leak = await asAnon(`select count(*) n from public.search_sf6dna('リュウ', 100) s
  left join public.moves m on s.entity_type='move' and m.id=s.entity_id left join public.characters ch on s.entity_type='character' and ch.id=s.entity_id
  where (s.entity_type='move' and coalesce(m.status,'')<>'published') or (s.entity_type='character' and coalesce(ch.status,'')<>'published')`);
console.log("\nunpublished rows in anon search response:", leak.ok ? leak.rows[0].n : leak.error, "| 120000 applied:", ok120);
