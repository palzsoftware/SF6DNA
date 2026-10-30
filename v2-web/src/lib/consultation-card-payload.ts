import { isLocalJpSafeMoveReference, type JpLocalMoveReference } from './jp-safe-move-reference';
import { isLocalObservedComboReference } from './luke-local-combo-reference';
import { buildResult, type Context, type Relation, type Control, type InputPath, type Verification } from './character-consultation';
import type { MoveCommandInput } from './card-command-integration';
import type { CardRecipe } from './card-command-gauge-contract';

type PayloadBase = {
  // Consultation slug identity; never an inferred DB UUID.
  characterId: string; cardId: string; revision: string; title: string; reason: string;
  verification: Verification; control: Control; inputPath: InputPath;
  condition: string | null; patch: string | null;
  mediaState: 'verified' | 'unknown' | 'hold' | 'none' | 'PENDING';
  localComboReference?: {
    scope: 'RC_PREVIEW_LOCAL_CANDIDATE_ONLY'; acceptance: 'ACCEPTED_LOCAL_CANDIDATE';
    combo_id: 'qa-sample:luke-crmk-rush-20261011'; combo_slug: 'luke-crmk-rush-20261011'; safe_href: string;
    patch_state: 'HOLD_OBSERVED_BUILD_UNKNOWN'; verification: 'GAME_OBSERVED';
    damage: 2210; drive_cost: 3; sa_cost: 0; end_frame: 56;
    modern_state: 'LOCAL_HOLD'; objective_just: 'HOLD'; media_state: 'LOCAL_HOLD';
    anchor_state: 'MOUNTED_LOCAL_CANDIDATE_BROWSER_NOT_RUN';
  };
  localJpReference?: JpLocalMoveReference;
  localReference?: {
    scope: 'RC_PREVIEW_LOCAL_CANDIDATE_ONLY'; character_slug: 'luke'; character_id: string;
    move_id: string; move_slug: 'luke-crouching-lp'; safe_href: string;
    control: 'CLASSIC'; input_path: 'manual'; verification: 'SOURCE_SUPPORTED';
    patch_state: 'CURRENT_DB_ONLY'; media_state: 'PENDING'; modern_state: 'LOCAL_HOLD_NOT_ADMITTED';
    anchor_state: 'IMPLEMENTED_LOCAL_CANDIDATE';
  };
};
export type ConsultationCardPayload = PayloadBase & (
  | { cardType: 'Move'; moveId: string; input: MoveCommandInput }
  | { cardType: 'Combo'; comboId: string; recipe: CardRecipe }
);
export type ConsultationCardCatalog = {
  patch: string | null; relations: readonly Relation[]; payloads: readonly ConsultationCardPayload[];
  localRelations?: readonly Relation[];
};
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** Agreement never grants verification, publication or route availability. */
export function payloadMatches(r: Relation, p: ConsultationCardPayload): boolean {
  try {
    if (p?.localComboReference) return isLocalObservedComboReference(r, p);
    const local = isLocalMoveReference(r, p);
    if ((p?.localReference || p?.localJpReference) && !local) return false;
    if (!r || !['VERIFIED', 'GAME_OBSERVED', 'SOURCE_SUPPORTED'].includes(r.verification) ||
      (!local && (r.publicationAllowed !== true || r.routeConfirmed !== true || r.fieldEvidenceComplete !== true)) ||
      !Array.isArray(r.sourceRefs) || !r.sourceRefs.length || !r.sourceRefs.every(text) ||
      !text(r.href) || !/^\/[a-zA-Z0-9/_?=&.#%-]+$/.test(r.href) || r.href.startsWith('//') ||
      !p || p.cardType !== r.kind || p.cardId !== r.id || p.revision !== r.revision ||
      p.characterId !== r.character || p.control !== r.control || p.inputPath !== r.inputPath ||
      p.patch !== r.patch || p.condition !== r.condition || p.verification !== r.verification ||
      !text(p.title) || !text(p.reason) || !text(p.patch) || !text(p.condition) ||
      !['verified', 'unknown', 'hold', 'none', 'PENDING'].includes(p.mediaState)) return false;
    const control = r.control === 'CLASSIC' ? 'classic' : 'modern';
    if (p.cardType === 'Move') {
      const c = p.input.context;
      return p.moveId === r.id && c.moveId === r.id && c.characterId === r.character &&
        c.formalMoveName === p.title && c.control === control &&
        c.inputPath === (r.inputPath === 'SP' ? 'special' : r.inputPath === 'Assist' ? 'assist' : 'manual') &&
        c.condition.state === 'EXACT' && c.condition.text === r.condition &&
        c.identityMatch === true && c.evidenceState === 'VERIFIED' &&
        text(c.rawCommand) && text(p.input.commandEvidence) && p.input.patch === r.patch &&
        ['VERIFIED', 'UNSUPPORTED', 'NOT_TOKENIZED'].includes(c.tokenizationState);
    }
    const recipe = p.recipe;
    return p.comboId === r.id && recipe.recipe_id === r.id && recipe.card_kind === 'combo' &&
      recipe.schema_version === 'ws12-card-recipe/1' && recipe.control === control &&
      recipe.game_verification === 'VERIFIED' && text(recipe.raw_recipe) && Array.isArray(recipe.steps) &&
      recipe.steps.every(s => text(s.step_id) && text(s.move_name) && text(s.raw_command) &&
        typeof s.boundary_reviewed === 'boolean' &&
        (s.command_evidence === null || text(s.command_evidence)) &&
        ['cancel', 'hit_link', 'delay', 'sequence', 'unknown', 'end'].includes(s.relation_to_next) &&
        (s.identity.move_id === null || text(s.identity.move_id)) &&
        s.identity.character_id === r.character && s.identity.control === control &&
        s.identity.patch === r.patch &&
        s.identity.input_path === (r.inputPath === 'SP' ? 'quick_sp' : r.inputPath === 'Assist' ? 'assist' : 'manual') &&
        s.identity.condition?.join('、') === r.condition);
    // Empty typed steps keep a verified source recipe in whole-text fallback.
  } catch { return false; }
}

/** Explicit acceptance of this single WS3 local reference; no public gate override. */
export function isLocalSafeMoveReference(r: Relation, p: ConsultationCardPayload): boolean {
  const ref = p?.localReference;
  return !!r && !!ref && p.cardType === 'Move' && r.kind === 'Move' &&
    ref.scope === 'RC_PREVIEW_LOCAL_CANDIDATE_ONLY' && ref.anchor_state === 'IMPLEMENTED_LOCAL_CANDIDATE' &&
    ref.character_slug === 'luke' && ref.character_id === '1e4e3f57-7ba0-454c-86d7-72b1deeb3713' &&
    ref.move_id === '40d7e3a8-5e6c-49b1-9e88-3cdb830f8ce0' && r.id === ref.move_id && p.moveId === ref.move_id &&
    ref.move_slug === 'luke-crouching-lp' && ref.safe_href === '/characters/luke#move-luke-crouching-lp' &&
    r.href === ref.safe_href && r.character === ref.character_slug &&
    r.revision === 'ws3-luke-crouching-lp-classic-source-20261012' && r.issue === 'combo' && r.detail === 'light' &&
    r.condition === 'Classic・しゃがみ弱P・公式Frame表の通常行' &&
    p.input?.context?.rawCommand === '↓ + 弱P' &&
    p.input?.commandEvidence === 'CAPCOM:LUK-FRAME-CLASSIC:20261006:normal-row-7:sha256:d71d25fd77a38376953ea7691905074d9dd29cbdde10305833f48fed106e5537' &&
    r.sourceRefs?.length === 1 && r.sourceRefs[0] === p.input.commandEvidence &&
    ref.control === 'CLASSIC' && ref.input_path === 'manual' && r.control === ref.control && r.inputPath === ref.input_path &&
    ref.verification === 'SOURCE_SUPPORTED' && r.verification === ref.verification &&
    ref.patch_state === 'CURRENT_DB_ONLY' && r.patch === '2026.08.03' &&
    ref.media_state === 'PENDING' && p.mediaState === 'PENDING' && ref.modern_state === 'LOCAL_HOLD_NOT_ADMITTED' &&
    r.publicationAllowed === false && r.routeConfirmed === false && r.fieldEvidenceComplete === false;
}
function isLocalMoveReference(r: Relation, p: ConsultationCardPayload): boolean {
  if (p?.localReference && p?.localJpReference) return false;
  return isLocalSafeMoveReference(r, p) || isLocalJpSafeMoveReference(r, p);
}
export function matchCardPayloads(relations: readonly Relation[], payloads: readonly ConsultationCardPayload[]) {
  const relationRows = Array.isArray(relations) ? relations : [];
  const payloadRows = Array.isArray(payloads) ? payloads : [];
  return relationRows.flatMap(relation => {
    if (!relation || typeof relation !== 'object' || Array.isArray(relation)) return [];
    if (relationRows.filter(r => r && r.id === relation.id && r.kind === relation.kind).length !== 1) return [];
    const matches = payloadRows.filter(p => p && p.cardId === relation.id && p.cardType === relation.kind);
    if (matches.length !== 1 || !payloadMatches(relation, matches[0])) return [];
    return [{ relation, payload: matches[0] }];
  });
}
/** Result and Daily15 share admission including exact payload agreement. */
export function buildConsultationCards(c: Context, a: Record<string, string>, catalog: ConsultationCardCatalog) {
  const payloads = Array.isArray(catalog.payloads) ? catalog.payloads : [];
  const preliminary = buildResult(c, a, catalog.patch !== null && catalog.patch === c.patch ? catalog.relations : []);
  const local = (Array.isArray(catalog.localRelations) ? catalog.localRelations : []).filter(r => {
    if (!r || typeof r !== 'object' || Array.isArray(r)) return false;
    if (r.character !== c.character || r.control !== c.control || r.inputPath !== c.inputPath ||
        r.issue !== a.issue || (r.detail !== null && r.detail !== a.combo_route && r.detail !== a.obstacle)) return false;
    return payloads.some(p => isLocalObservedComboReference(r, p) ||
      (catalog.patch === c.patch && r.patch === c.patch && isLocalMoveReference(r, p)));
  });
  const cards = matchCardPayloads([...preliminary.moves, ...preliminary.combos, ...local], payloads);
  const publicResult = buildResult(c, a, cards.filter(card => !(isLocalMoveReference(card.relation, card.payload) || isLocalObservedComboReference(card.relation, card.payload))).map(card => card.relation).concat(preliminary.players, preliminary.videos));
  const result = { ...publicResult,
    moves: cards.filter(card => card.relation.kind === 'Move').map(card => card.relation),
    combos: cards.filter(card => card.relation.kind === 'Combo').map(card => card.relation),
    relationState: cards.some(card => isLocalMoveReference(card.relation, card.payload) || isLocalObservedComboReference(card.relation, card.payload)) ? 'LOCAL_REFERENCE_CANDIDATE' : publicResult.relationState,
    relationNotice: cards.some(card => isLocalMoveReference(card.relation, card.payload) || isLocalObservedComboReference(card.relation, card.payload)) ? 'RC・ローカル確認用の参考カードです。対応バージョンと未確認項目は各カードをご確認ください。' : publicResult.relationNotice,
  };
  return { result, cards, payloads: cards.map(card => card.payload) };
}

