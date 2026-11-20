import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

// Security P0: anon reads public move_commands while sources/entity_sources stay revoked from anon.
// The SECURITY DEFINER fix must sort BEFORE the REVOKE so the REVOKE can never land alone (42501).
const dir = new URL("../../supabase/migrations/", import.meta.url);
const files = readdirSync(dir).filter((name) => name.endsWith(".sql")).sort();
const read = (name) => readFileSync(new URL(name, dir), "utf8");
const revokeFile = files.find((name) => name.startsWith("20261120120000_"));
const fixFile = files.find((name) => name.startsWith("20261120115000_"));

test("definer fix sorts before the anon REVOKE and the REVOKE refuses to run without it", () => {
  assert.ok(fixFile && revokeFile && fixFile < revokeFile);
  const revoke = read(revokeFile);
  const guard = revoke.indexOf("move_commands_policy_reads_source_tables_inline");
  assert.ok(guard > 0 && guard < revoke.indexOf("REVOKE ALL ON TABLE public.sources, public.entity_sources FROM anon;"));
  assert.match(revoke, /source_tables_still_granted_to_anon/);
});

test("move_commands policy uses a narrow SECURITY DEFINER helper and no inline source tables", () => {
  const sql = read(fixFile);
  const fn = sql.slice(sql.indexOf("CREATE OR REPLACE FUNCTION private.move_command_has_official_source"), sql.indexOf("$function$;"));
  assert.match(fn, /SECURITY DEFINER SET search_path TO ''/);
  assert.match(fn, /es\.entity_type = 'move_command'/);
  assert.match(fn, /s\.reliability_level = 'official'/);
  assert.match(sql, /REVOKE ALL ON FUNCTION private\.move_command_has_official_source\(uuid\) FROM PUBLIC;/);
  const policy = sql.slice(sql.indexOf('CREATE POLICY "public read move commands"')).split(";")[0];
  assert.match(policy, /m\.status = 'published'/);
  assert.match(policy, /private\.move_command_has_official_source\(move_commands\.id\)/);
  assert.doesNotMatch(policy, /entity_sources|public\.sources/);
});

test("no later migration grants source tables back to anon", () => {
  for (const name of files.filter((n) => n >= "20261120115000")) {
    assert.doesNotMatch(read(name), /grant\s+(all|select)[^;]*on\s+(table\s+)?public\.(entity_)?sources[^;]*\bto\s+[^;]*\banon\b/i, name);
  }
});

test("preview RPCs read sources only via get_public_entity_sources and keep the token gate", () => {
  const file = files.find((name) => name.startsWith("20261120116000_"));
  assert.ok(file && file < revokeFile);
  const sql = read(file);
  assert.match(sql, /preview_rpc_definitions_differ_from_production_live/);
  const bodies = sql.split("CREATE OR REPLACE FUNCTION").slice(1);
  assert.equal(bodies.length, 3);
  for (const body of bodies) {
    assert.doesNotMatch(body, /public\.entity_sources|public\.sources\b/);
    assert.doesNotMatch(body, /SECURITY DEFINER/i);
    assert.match(body, /private\.is_phase23_device_preview\(\)/);
    assert.match(body, /public\.get_public_entity_sources\(array\[/);
  }
  assert.match(read(revokeFile), /preview_rpcs_read_source_tables_inline/);
});
