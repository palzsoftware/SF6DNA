// 2026-11-26 Security P0 candidate: public read of entity_videos must require BOTH a published video and a published target (character/player).
// Static contract only. Behaviour was verified in an isolated PostgreSQL 16 (leak 2 rows -> 0, published links kept, rollback restores).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const dir = new URL('../../supabase/migrations/', import.meta.url);
const name = readdirSync(dir).filter(n => n.endsWith('_entity_videos_public_target_boundary.sql'));
const sql = readFileSync(new URL(name[0], dir), 'utf8');
test('one candidate migration, later than every applied version', () => { assert.equal(name.length, 1); assert.ok(name[0] > '20261120120000'); });
test('policy keeps the published-video condition and adds the published-target condition', () => {
  assert.match(sql, /DROP POLICY "public read published entity videos" ON public\.entity_videos;/);
  assert.match(sql, /FOR SELECT TO public[\s\S]*v\.status = 'published'[\s\S]*AND private\.entity_video_target_is_public\(entity_videos\.entity_type, entity_videos\.entity_id\)/);
});
test('target check is SECURITY DEFINER with a fixed search_path, fail-closed for unknown types, not executable by PUBLIC', () => {
  assert.match(sql, /SECURITY DEFINER SET search_path TO ''/);
  assert.match(sql, /when 'character' then exists[\s\S]*c\.status = 'published'/);
  assert.match(sql, /when 'player'\s+then exists[\s\S]*p\.status = 'published'/);
  assert.match(sql, /else false end/);
  assert.match(sql, /REVOKE ALL ON FUNCTION private\.entity_video_target_is_public\(text, uuid\) FROM PUBLIC;/);
});
test('no table grant, no admin policy change, precondition and rollback are present', () => {
  assert.ok(!/GRANT\s+(SELECT|ALL|INSERT|UPDATE|DELETE)[^;]*ON\s+(TABLE\s+)?public\./i.test(sql));
  assert.ok(!sql.includes('admin manage entity videos'));
  assert.match(sql, /expected policy missing: abort/);
  assert.match(sql, /-- ROLLBACK \(manual\)/);
});
