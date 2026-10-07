import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { audit, routePattern } from '../scripts/audit-technical-static.mjs';

test('route matching distinguishes exact pages, dynamic segments, query and trailing slash', () => {
  assert.ok(routePattern('/characters/[slug]').test('/characters/ryu/'));
  assert.ok(!routePattern('/characters/[slug]').test('/characters/ryu/missing'));
  assert.ok(!routePattern('/players').test('/players-extra'));
});
test('literal broken href fails the gate without treating computed links or comments as evidence', () => {
  const root = mkdtempSync(join(tmpdir(), 'sf6dna-technical-'));
  try {
    mkdirSync(join(root, 'src/app/characters/[slug]'), { recursive: true });
    writeFileSync(join(root, 'src/app/characters/[slug]/page.tsx'), 'export default function Page() { return <h1>test</h1>; }');
    writeFileSync(join(root, 'src/app/page.tsx'), `// href="/comment-only"
      export default function Page() { return <><a href="/characters/ryu?x=1#moves">valid</a><a href="/missing">broken</a><a href={computed}>dynamic</a><img alt="" src="/x.png" /></>; }`);
    const result = audit(root);
    assert.equal(result.links.length, 2);
    assert.deepEqual(result.findings.map(f => f.href), ['/missing']);
    assert.equal(result.gates.NO_BROKEN_INTERNAL_LINK, 'FAIL');
    assert.equal(result.gates.ROUTES_PASS, 'NOT_RUN_RUNTIME');
  } finally { rmSync(root, { recursive: true, force: true }); }
});
