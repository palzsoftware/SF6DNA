import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const doc = read('../src/data/ws5-local-strategy-variant-links-20261120.json');
const local = read('../src/data/ws5-local-reviewed-strategy-cards.json');
const displayed = read('../src/lib/strategy-research-cards-20261118.json');
const byId = new Map([...displayed, ...local].map((c) => [c.id, c]));

test('派生関連付けは候補のままで、画面のコードから参照されていない', () => {
  assert.equal(doc.status, 'CANDIDATE_NOT_CONNECTED');
  for (const file of ['../src/lib/ws5-character-review.ts', '../src/components/character-strategy-research-grid.tsx']) {
    assert.doesNotMatch(readFileSync(new URL(file, import.meta.url), 'utf8'), /variant-links/);
  }
});

test('親子はすべて既存カードを指し、自己参照・循環がない', () => {
  const parentOf = new Map(doc.links.map((l) => [l.childId, l.parentId]));
  assert.equal(parentOf.size, doc.links.length, '子カードは1件につき1つの親');
  for (const link of doc.links) {
    assert.ok(byId.has(link.childId), link.childId);
    assert.ok(byId.has(link.parentId), link.parentId);
    assert.notEqual(link.childId, link.parentId);
    assert.equal(byId.get(link.childId).characterSlug, byId.get(link.parentId).characterSlug);
    assert.equal(byId.get(link.childId).characterSlug, link.characterSlug);
    const seen = new Set([link.childId]);
    for (let id = link.parentId; parentOf.has(id); id = parentOf.get(id)) {
      assert.ok(!seen.has(id), `循環: ${link.childId}`);
      seen.add(id);
    }
  }
});

test('統合推奨と別ルート保持の分類は監査結果どおり', () => {
  assert.deepEqual(doc.counts, { MERGE_INTO_PARENT: 159, KEEP_LINKED_ALTERNATIVE: 232 });
  assert.equal(doc.links.length, doc.counts.MERGE_INTO_PARENT + doc.counts.KEEP_LINKED_ALTERNATIVE);
  for (const link of doc.links) {
    const keep = link.differs.positionDiffers || link.differs.counterStartDiffers || link.differs.gaugeDiffers;
    assert.equal(link.recommendation, keep ? 'KEEP_LINKED_ALTERNATIVE' : 'MERGE_INTO_PARENT', link.childId);
  }
});
