// 2026-11-26 V26: ユーザー承認14名のPlayerカード候補。開発draftがある行だけを接続し、全行PENDING(非表示)であることを確認する。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = p => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const team = read('../src/data/player-research/team-bindings.json');
const pending = read('../docs/v26/player14-pending-registration.json');
const DEV = 'vvsknbmlfvvnrmgtyhbf', PROD = 'wnuxaxbrpudyypzdbdho';
const APPROVED14 = ['xiaohai', 'problem-x', 'vxbao', 'kakeru', 'haitani', 'angrybird', 'nl', 'nuckledu', 'oil-king', 'kusanagi', 'broski', 'juicyjoe', 'xian', 'luffy'];
const v26 = team.filter(r => String(r.note ?? '').startsWith('V26承認14名'));

test('V26: 7 new Development rows + existing kakeru + 6 pending = the approved 14, nothing else', () => {
  assert.equal(v26.length, 7);
  const kakeru = team.filter(r => r.playerSlug === 'kakeru');
  assert.equal(kakeru.length, 1);
  assert.deepEqual([...v26.map(r => r.playerSlug), 'kakeru', ...pending.map(r => r.targetSlug)].sort(), [...APPROVED14].sort());
  assert.ok(!v26.some(r => r.playerSlug === 'uma'), 'UMA is not in the approved 14');
});
test('V26: rows are Development-only, PENDING, unique identity, never a Production row', () => {
  for (const r of v26) {
    assert.equal(r.environment, DEV); assert.equal(r.publicationApproval, 'PENDING');
    assert.match(r.playerId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    assert.equal(r.display.slug, r.playerSlug);
    assert.equal(team.filter(x => x.playerId === r.playerId || x.playerSlug === r.playerSlug).length, 1);
  }
  assert.ok(!team.some(r => r.environment === PROD && APPROVED14.includes(r.playerSlug) ));
});
test('V26: main only from an official profile (2) or dated basis (1 new); no sub, no SNS, no unverified results', () => {
  const labels = v26.flatMap(r => r.display.facts.map(f => [r.playerSlug, f.label]));
  assert.deepEqual(labels.filter(([, l]) => l === 'メインキャラクター').map(([s]) => s).sort(), ['nl', 'nuckledu', 'xiaohai']);
  assert.match(v26.find(r => r.playerSlug === 'nuckledu').display.facts[0].value, /公式プロフィールの記載・2026-11-26確認/);
  assert.ok(!labels.some(([, l]) => /サブ/.test(l)));
  assert.ok(labels.every(([, l]) => ['メインキャラクター', '主要大会での使用キャラクター', '現在の所属'].includes(l) || /^大会登録チーム（.+）$/.test(l)));
  assert.ok(v26.every(r => r.display.sections.length === 0 && r.display.intro === null));
  assert.ok(!JSON.stringify(v26.map(r => r.display)).match(/twitter\.com|x\.com|twitch\.tv|youtube\.com/));
  // 現在所属と大会登録チームは別ラベル
  assert.ok(v26.every(r => r.display.facts.filter(f => f.label === '現在の所属').length <= 1));
});
test('V26: pending six have no ID and stay out of runtime data', () => {
  assert.equal(pending.length, 6);
  assert.ok(pending.every(r => r.state === 'HOLD_NO_DEV_ROW' && r.publicationApproval === 'PENDING' && !('playerId' in r)));
  assert.equal(pending.find(r => r.targetSlug === 'kusanagi').countryCodeCandidate, 'FR');
});
