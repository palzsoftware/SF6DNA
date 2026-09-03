import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const improvement = fs.readFileSync(new URL('../src/lib/improvement-tools.ts', import.meta.url), 'utf8');
const component = fs.readFileSync(new URL('../src/components/improvement-loop-tool.tsx', import.meta.url), 'utf8');
const diagnosis = fs.readFileSync(new URL('../src/components/diagnosis-runner.tsx', import.meta.url), 'utf8');
const matchup = fs.readFileSync(new URL('../src/lib/matchup-card.ts', import.meta.url), 'utf8');
const matchupPage = fs.readFileSync(new URL('../src/app/matchup-card/page.tsx', import.meta.url), 'utf8');

test('battle log analysis is local and covers Phase22 weakness axes', () => {
  assert.match(improvement, /antiAir/);
  assert.match(improvement, /driveImpact/);
  assert.match(improvement, /punish/);
  assert.match(improvement, /cornerEscape/);
  assert.match(improvement, /driveManagement/);
  assert.match(component, /localStorage/);
  assert.match(component, /直近10戦レビュー/);
  assert.match(component, /Replay復習ワークフロー/);
});

test('diagnosis resume reuses only explicit stored answers', () => {
  assert.match(diagnosis, /sf6dna_v2_diagnosis_answers/);
  assert.match(diagnosis, /以前あなたが選んだ回答だけ/);
  assert.match(diagnosis, /推測入力は行いません/);
});

test('matchup card preserves publication, verification and source gates', () => {
  assert.match(matchup, /\.eq\("status", "published"\)/);
  assert.match(matchup, /\.eq\("verification_status", "verified"\)/);
  assert.match(matchup, /getPublicEntitySources/);
  assert.match(matchupPage, /公開条件を満たした技情報/);
  assert.match(matchupPage, /未確認の情報を推測で補うことはしません/);
});
