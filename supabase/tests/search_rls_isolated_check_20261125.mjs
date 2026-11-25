// Isolated check (PGlite, in-memory): anonymous/authenticated search under restricted source-table grants.
// Usage: node search_rls_check.mjs <repoRoot>
import { PGlite } from "@electric-sql/pglite";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.argv[2];
const mig = f => readFileSync(path.join(root, "supabase/migrations", f), "utf8");

// search_sf6dna exactly as live in Development/Production (pg_get_functiondef, 2026-11-25, read-only).
const SEARCH_FN = readFileSync(new URL("./search_sf6dna_live_20261125.sql", import.meta.url), "utf8");

const SCHEMA = `
create extension if not exists pg_trgm;
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
create schema private; create schema extensions;
grant usage on schema public, private to anon, authenticated, service_role;
create table public.characters (id uuid primary key, slug text, name_ja text, name_en text, summary text, status text, is_playable boolean default true);
create table public.character_aliases (character_id uuid, alias text, normalized_alias text);
create table public.moves (id uuid primary key, slug text, name_ja text, name_en text, character_id uuid, status text);
create table public.move_aliases (move_id uuid, alias text, normalized_alias text);
create table public.combos (id uuid primary key, slug text, name text, purpose text, notation text, character_id uuid, status text, verification_status text);
create table public.setups (id uuid primary key, slug text, name text, description text, sequence_text text, character_id uuid, status text, verification_status text);
create table public.sequences (id uuid primary key, slug text, name text, sequence_text text, notes text, character_id uuid, status text, verification_status text);
create table public.counters (id uuid primary key, slug text, title text, summary text, situation text, status text, verification_status text);
create table public.trainings (id uuid primary key, slug text, name text, purpose text, method text, status text, verification_status text);
create table public.players (id uuid primary key, slug text, display_name text, team_name text, player_type text, status text);
create table public.player_aliases (player_id uuid, alias text, normalized_alias text);
create table public.tournaments (id uuid primary key, slug text, name text, series_name text, status text);
create table public.videos (id uuid primary key, slug text, title text, video_type text, description text, status text);
create table public.glossary (id uuid primary key, slug text, term text, short_definition text, definition text, status text);
create table public.glossary_aliases (glossary_id uuid, alias text, normalized_alias text);
create table public.move_commands (id uuid primary key, move_id uuid, command text);
create table public.sources (id uuid primary key, reliability_level text, url text, title text);
create table public.entity_sources (id uuid primary key default gen_random_uuid(), entity_type text, entity_id uuid, source_id uuid);
-- Public read policies as live in Development (pg_policies, 2026-11-25).
do $$ declare t text; begin
  foreach t in array array['characters','moves','players','tournaments','videos','glossary'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "public read %s" on public.%I for select to public using (status = ''published'')', t, t);
  end loop;
  foreach t in array array['combos','setups','sequences','counters','trainings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format($p$create policy "public read published %s" on public.%I for select to public using (status = 'published' and verification_status = 'verified' and exists (select 1 from entity_sources es where es.entity_type = %L and es.entity_id = %I.id))$p$,
      t, t, case t when 'combos' then 'combo' when 'setups' then 'setup' when 'sequences' then 'sequence' when 'counters' then 'counter' else 'training' end, t);
  end loop;
end $$;
-- move_commands as after 20261120115000 (applied before 117000/120000 in the Production plan).
alter table public.move_commands enable row level security;
create function private.move_command_has_official_source(target_move_command_id uuid) returns boolean language sql stable security definer set search_path to ''
  as $f$ select exists (select 1 from public.entity_sources es join public.sources s on s.id = es.source_id where es.entity_type = 'move_command' and es.entity_id = target_move_command_id and s.reliability_level = 'official') $f$;
create policy "public read move commands" on public.move_commands for select to public
  using (exists (select 1 from public.moves m where m.id = move_commands.move_id and m.status = 'published') and private.move_command_has_official_source(move_commands.id));
alter table public.sources enable row level security; alter table public.entity_sources enable row level security;
create policy "public read sources" on public.sources for select to public using (true);
create policy "public read entity_sources" on public.entity_sources for select to public using (true);
-- Supabase defaults: anon/authenticated hold table grants; aliases tables have no RLS.
grant select on all tables in schema public to anon, authenticated, service_role;
grant insert, update, delete on public.sources, public.entity_sources to anon, authenticated;
`;
const id = n => `00000000-0000-0000-0000-${String(n).padStart(12, "0")}`;
const SEED = `
insert into public.characters values ('${id(1)}','ryu','リュウ','Ryu','公開キャラ','published',true), ('${id(2)}','ryu-draft','リュウ（下書き）','RyuDraft','非公開キャラ','draft',true);
insert into public.combos values
 ('${id(11)}','ryu-public-combo','リュウ 公開コンボ','p','n','${id(1)}','published','verified'),
 ('${id(12)}','ryu-no-source','リュウ 出典なしコンボ','p','n','${id(1)}','published','verified'),
 ('${id(13)}','ryu-draft-combo','リュウ 下書きコンボ','p','n','${id(1)}','draft','verified'),
 ('${id(14)}','ryu-unverified','リュウ 未検証コンボ','p','n','${id(1)}','published','unverified');
insert into public.setups values ('${id(21)}','ryu-setup','リュウ 公開セットプレイ','d','s','${id(1)}','published','verified');
insert into public.sequences values ('${id(31)}','ryu-seq-hidden','リュウ 出典なし連携','s','n','${id(1)}','published','verified');
insert into public.counters values ('${id(41)}','vs-ryu','リュウ 対策','要約','状況','published','verified');
insert into public.trainings values ('${id(51)}','ryu-training','リュウ トレーニング','目的','方法','published','verified');
insert into public.players values ('${id(61)}','ryu-fan','リュウ使い','team','pro','published'), ('${id(62)}','ryu-hidden','リュウ非公開選手','team','pro','draft');
insert into public.videos values ('${id(71)}','ryu-video','リュウ 解説','guide','d','published'), ('${id(72)}','ryu-video-draft','リュウ 下書き動画','guide','d','draft');
insert into public.sources values ('${id(81)}','official','https://example.com/1','s1');
insert into public.entity_sources (entity_type, entity_id, source_id) values
 ('combo','${id(11)}','${id(81)}'), ('combo','${id(13)}','${id(81)}'), ('combo','${id(14)}','${id(81)}'),
 ('setup','${id(21)}','${id(81)}'), ('counter','${id(41)}','${id(81)}'), ('training','${id(51)}','${id(81)}');
`;
// Production plan step: 20261120120000's policy precondition + REVOKE (the function-MD5 preflight/postcondition
// only apply to the real Production functions and are not part of this isolated schema).
const m120 = mig("20261120120000_align_source_boundary_with_production.sql");
const PRECONDITION = m120.slice(m120.indexOf("DO $policy_precondition$"), m120.indexOf("$policy_precondition$;") + "$policy_precondition$;".length)
  // preview RPCs do not exist in this isolated schema
  .replace(/pg_catalog\.to_regprocedure\('public\.get_phase\d+_[a-z_]+\([a-z,]*\)'\)/g, "NULL");
const REVOKE = `REVOKE ALL ON TABLE public.sources, public.entity_sources FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON TABLE public.sources, public.entity_sources FROM authenticated;`;
const FIX = mig("20261120117000_public_content_policies_definer_source_check.sql");

const EXPECT_PUBLIC = ["character:ryu", "combo:ryu-public-combo", "setup:ryu-setup", "counter:vs-ryu", "training:ryu-training", "player:ryu-fan", "video:ryu-video"].sort();
const HIDDEN = ["ryu-draft", "ryu-no-source", "ryu-draft-combo", "ryu-unverified", "ryu-seq-hidden", "ryu-hidden", "ryu-video-draft"];

async function fresh() { const db = await PGlite.create({ extensions: { pg_trgm } }); await db.exec(SCHEMA); await db.exec(SEED); await db.exec(SEARCH_FN); return db; }
async function searchAs(db, role, q = "リュウ") {
  try {
    await db.exec(`set role ${role}`);
    const r = await db.query("select entity_type, slug from public.search_sf6dna($1, 50)", [q]);
    await db.exec("reset role");
    return { ok: true, rows: r.rows.map(x => `${x.entity_type}:${x.slug}`).sort() };
  } catch (e) { await db.exec("reset role"); return { ok: false, error: `${e.code ?? ""} ${e.message}` }; }
}
async function directSourcesAs(db, role) {
  try { await db.exec(`set role ${role}`); await db.query("select 1 from public.entity_sources limit 1"); await db.exec("reset role"); return "readable"; }
  catch (e) { await db.exec("reset role"); return `denied (${e.code})`; }
}
const report = [];
const check = (name, cond, detail) => { report.push({ name, pass: !!cond, detail }); };

// 1) Current code, restricted grants (Development today / Production after the planned REVOKE without the fix)
{ const db = await fresh(); await db.exec(REVOKE);
  const a = await searchAs(db, "anon");
  check("修正前＋権限制限: 未ログイン検索が失敗する（再現）", !a.ok && /42501|permission denied/.test(a.error), a.error ?? a.rows); }
// 2) The planned REVOKE is now refused while an inline policy remains (fix not applied)
{ const db = await fresh(); let err = null; try { await db.exec(PRECONDITION); } catch (e) { err = e.message; }
  check("修正前: 本番予定の権限変更は事前チェックで止まる", err && /public_policy_reads_source_tables_inline/.test(err), err); }
// 3) Fix + planned Production change (precondition passes, REVOKE applied)
{ const db = await fresh(); await db.exec(FIX); let err = null; try { await db.exec(PRECONDITION); await db.exec(REVOKE); } catch (e) { err = e.message; }
  check("修正後: 本番予定の権限変更（事前チェック＋REVOKE）が通る", !err, err);
  for (const role of ["anon", "authenticated"]) {
    const r = await searchAs(db, role);
    check(`修正後＋権限制限: ${role} の検索が成功`, r.ok, r.error ?? r.rows.length);
    if (r.ok) {
      check(`修正後＋権限制限: ${role} は公開対象だけを返す`, JSON.stringify(r.rows) === JSON.stringify(EXPECT_PUBLIC), r.rows);
      check(`修正後＋権限制限: ${role} の応答に非公開データなし`, !r.rows.some(x => HIDDEN.includes(x.split(":")[1])), r.rows.filter(x => HIDDEN.includes(x.split(":")[1])));
    }
  }
  check("修正後: anon は出典テーブルを直接読めない（権限を広げていない）", (await directSourcesAs(db, "anon")).startsWith("denied"), await directSourcesAs(db, "anon"));
  const fnPriv = await db.query("select has_function_privilege('anon','private.content_has_source(text,uuid)','execute') a, (select prosecdef from pg_proc where proname='content_has_source') d");
  check("修正後: 判定関数はセキュリティ定義・anonは実行のみ", fnPriv.rows[0].a && fnPriv.rows[0].d, fnPriv.rows[0]);
}
// 4) Fix with grants as they are today on Production (anon still has SELECT): results identical
{ const db = await fresh(); await db.exec(FIX);
  const a = await searchAs(db, "anon"); const b = await searchAs(db, "authenticated");
  check("修正後＋現行の本番権限: anon・authenticated とも同じ公開結果", a.ok && b.ok && JSON.stringify(a.rows) === JSON.stringify(EXPECT_PUBLIC) && JSON.stringify(b.rows) === JSON.stringify(EXPECT_PUBLIC), { a: a.rows ?? a.error, b: b.rows ?? b.error }); }
// 5) Visibility rule unchanged: before vs after fix with full grants
{ const before = await fresh(); const after = await fresh(); await after.exec(FIX);
  const x = await searchAs(before, "anon"), y = await searchAs(after, "anon");
  check("公開範囲は修正前と同一（権限制限なしで比較）", x.ok && y.ok && JSON.stringify(x.rows) === JSON.stringify(y.rows), { before: x.rows, after: y.rows }); }

for (const r of report) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.pass ? "" : `  → ${JSON.stringify(r.detail)}`}`);
console.log(`${report.filter(r => r.pass).length}/${report.length} passed`);
process.exitCode = report.every(r => r.pass) ? 0 : 1;
