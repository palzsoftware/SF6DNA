// WS13 local candidate. No route, database, storage or existing-diagnosis imports.
export type Control = 'CLASSIC' | 'MODERN';
export type InputPath = 'manual' | 'SP' | 'Assist';
export type Verification = 'VERIFIED' | 'GAME_OBSERVED' | 'SOURCE_SUPPORTED' | 'USER_ATTESTED' | 'RESEARCH_ONLY' | 'HOLD';
export type CardType = 'Move' | 'Combo' | 'Player' | 'Video';
export type Focus = 'execution' | 'anti_air' | 'drive_rush_defense' | 'offense' | 'meter' | 'defense' | 'corner_defense' | 'neutral' | 'decision';
export type Option = { id: string; label: string };
export type Question = { id: string; prompt: string; options: Option[] };
export type Context = { character: string; control: Control; inputPath: InputPath; patch: string; roster: readonly string[] };
// Internal normalized port, not an assertion about current DB columns.
export type Relation = {
  id: string; revision: string; kind: CardType; character: string;
  control: Control; inputPath: InputPath; patch: string; issue: string;
  detail: string | null; condition: string; verification: Verification;
  sourceRefs: readonly string[]; fieldEvidenceComplete: boolean;
  publicationAllowed: boolean; routeConfirmed: boolean; href: string;
};

const common: Option[] = [
  { id: 'combo', label: 'コンボ' }, { id: 'projectile', label: '弾' },
  { id: 'drive_rush', label: '相手のドライブラッシュへの対応' }, { id: 'anti_air', label: '対空' },
  { id: 'okizeme', label: '起き攻め' }, { id: 'defense', label: '守り' },
  { id: 'corner', label: '画面端' }, { id: 'close_range', label: '近距離' },
  { id: 'other', label: 'その他・まだ分からない' },
];
const specific: Record<string, Option[]> = {
  jp: [{ id: 'setup', label: '設置' }, { id: 'sa2', label: 'SA2' }, { id: 'amnesia', label: 'アムネジア' }],
  luke: [{ id: 'flash_knuckle', label: 'フラッシュナックル' }, { id: 'sa', label: 'SAの使いどころ' }],
};
const combo: Option[] = [
  { id: 'light', label: '小技始動' }, { id: 'medium', label: '中技始動' },
  { id: 'drive_rush', label: 'ドライブラッシュ' }, { id: 'di', label: 'ドライブインパクト' },
  { id: 'punish_counter', label: 'パニッシュカウンター' }, { id: 'corner', label: '画面端' },
  { id: 'sa1', label: 'SA1' }, { id: 'sa2', label: 'SA2' },
  { id: 'sa3_ca', label: 'SA3・CA' }, { id: 'unknown', label: 'まだ分からない' },
];
const obstacles: Option[] = [
  { id: 'knowledge', label: 'やり方・使う場面が分からない' },
  { id: 'execution', label: '練習では分かるが、操作で失敗する' },
  { id: 'decision', label: '実戦で使うかどうか迷う' },
  { id: 'unknown', label: '失敗の原因がまだ分からない' },
];
const focus: Record<string, Focus> = {
  combo: 'execution', projectile: 'neutral', drive_rush: 'drive_rush_defense',
  anti_air: 'anti_air', okizeme: 'offense', defense: 'defense', corner: 'corner_defense',
  close_range: 'neutral', other: 'decision', setup: 'offense', sa2: 'meter',
  amnesia: 'defense', flash_knuckle: 'execution', sa: 'meter',
};
function validateContext(c: Context) {
  if (!c || !Array.isArray(c.roster) || !c.roster.includes(c.character)
    || !/^[a-z0-9-]+$/.test(c.character) || !['CLASSIC', 'MODERN'].includes(c.control)
    || !['manual', 'SP', 'Assist'].includes(c.inputPath)
    || (c.control === 'CLASSIC' && c.inputPath !== 'manual')) throw new TypeError('Invalid consultation context');
  // Unknown patch permits questions/common practice but no card admission.
  if (typeof c.patch !== 'string') throw new TypeError('Invalid patch');
}
function validateAnswers(a: Record<string, string>, issues: Option[]) {
  if (!a || typeof a !== 'object' || Array.isArray(a)) throw new TypeError('Invalid answers');
  const allowed = new Set(['issue', 'combo_route', 'obstacle']);
  if (Object.keys(a).some(k => !allowed.has(k))) throw new TypeError('Unknown answer key');
  for (const [key, value] of Object.entries(a)) {
    const options = key === 'issue' ? issues : key === 'combo_route' ? combo : obstacles;
    if (!options.some(o => o.id === value)) throw new TypeError('Invalid answer');
  }
  if (a.combo_route && a.issue !== 'combo') throw new TypeError('Stale combo answer');
  if ((a.combo_route || a.obstacle) && !a.issue) throw new TypeError('Missing parent answer');
  if (a.obstacle && a.issue === 'combo' && !a.combo_route) throw new TypeError('Missing combo answer');
}
export function nextQuestion(c: Context, a: Record<string, string>): Question | null {
  validateContext(c);
  const options = [...common, ...(specific[c.character] ?? [])];
  validateAnswers(a, options);
  if (!a.issue) return { id: 'issue', prompt: '今いちばん困っているのは？', options: options.map(o => ({ ...o })) };
  if (a.issue === 'combo' && !a.combo_route) return { id: 'combo_route', prompt: 'どのコンボで困っていますか？', options: combo.map(o => ({ ...o })) };
  if (!a.obstacle) return { id: 'obstacle', prompt: 'どこで困ることが多いですか？', options: obstacles.map(o => ({ ...o })) };
  return null;
}
export function changeAnswer(a: Record<string, string>, key: string, value: string): Record<string, string> {
  if (key === 'issue') return { issue: value };
  if (key === 'combo_route') return { issue: a.issue, combo_route: value };
  if (key === 'obstacle') return { ...a, obstacle: value };
  throw new TypeError('Unknown answer key');
}
export function eligible(r: Relation, c: Context, a: Record<string, string>): boolean {
  return !!r && ['Move', 'Combo', 'Player', 'Video'].includes(r.kind)
    && typeof r.id === 'string' && r.id.trim().length > 0
    && typeof r.revision === 'string' && r.revision.trim().length > 0
    && r.character === c.character && r.control === c.control && r.inputPath === c.inputPath
    && c.patch.trim().length > 0 && r.patch === c.patch && r.issue === a.issue
    && (r.detail === null || r.detail === a.combo_route || r.detail === a.obstacle)
    && typeof r.condition === 'string' && r.condition.trim().length > 0
    && ['VERIFIED', 'GAME_OBSERVED', 'SOURCE_SUPPORTED'].includes(r.verification)
    && Array.isArray(r.sourceRefs) && r.sourceRefs.length > 0 && r.sourceRefs.every(s => typeof s === 'string' && s.trim().length > 0)
    && r.fieldEvidenceComplete === true && r.publicationAllowed === true && r.routeConfirmed === true
    && typeof r.href === 'string' && /^\/[a-zA-Z0-9/_?=&.#%-]+$/.test(r.href)
    && !r.href.startsWith('//') && !r.href.includes('\\') && !/\s/.test(r.href);
}
export function buildResult(c: Context, a: Record<string, string>, relations: readonly Relation[] = []) {
  if (nextQuestion(c, a)) throw new TypeError('Incomplete consultation');
  const issue = [...common, ...(specific[c.character] ?? [])].find(o => o.id === a.issue)!;
  const admitted = (Array.isArray(relations) ? relations : []).filter(r => eligible(r, c, a));
  // Duplicate identities/versions are omitted, rather than selecting a conflicting revision.
  const ids = admitted.map(r => `${r.kind}:${r.id}`);
  const cards = admitted.filter((r, i) => ids.indexOf(ids[i]) === ids.lastIndexOf(ids[i])).map(r => ({ ...r, sourceRefs: [...r.sourceRefs] }));
  const known = a.obstacle !== 'unknown' && (a.issue !== 'combo' || a.combo_route !== 'unknown');
  const practiceFocus: Focus = known ? focus[a.issue] : 'decision';
  const route = combo.find(o => o.id === a.combo_route)?.label;
  return {
    diagnosisKey: 'character-consultation-candidate-v1', character: c.character,
    provenance: 'SELF_REPORTED_CONCERN',
    currentIssue: `${issue.label}${route ? `・${route}` : ''}を今回の確認課題に選びました。`,
    firstLearning: known ? '困った場面を1つ選び、やり方・操作・判断のどこで止まったかを確認しましょう。' : 'リプレイから困った場面を1つ選び、まず状況を整理しましょう。',
    orderedSections: ['current_issue', 'first_learning', 'moves', 'combos', 'practice', 'players', 'videos'],
    moves: cards.filter(r => r.kind === 'Move'), combos: cards.filter(r => r.kind === 'Combo'),
    players: cards.filter(r => r.kind === 'Player'), videos: cards.filter(r => r.kind === 'Video'),
    relationState: cards.length ? 'CONFIRMED_RELATIONS' : 'COMMON_FALLBACK',
    relationNotice: cards.length ? null : '確認済みの参考カードは準備中です。共通の練習候補から始められます。',
    practiceProposal: {
      status: 'CANDIDATE_NOT_CONNECTED', focus: practiceFocus, totalMinutes: 15,
      items: [
        { templateKey: practiceFocus, minutes: 5, goal: '選んだ課題を1つ確認する' },
        { templateKey: practiceFocus === 'decision' ? 'execution' : 'decision', minutes: 5, goal: '操作と判断を分けて確認する' },
        { templateKey: 'review', minutes: 5, goal: '次の対戦で試すことを1つ決める' },
      ],
      href: null, adapterRequired: true,
    },
    releaseReady: false,
  };
}
