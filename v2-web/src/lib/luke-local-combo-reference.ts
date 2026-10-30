import type { Relation } from './character-consultation';
import type { ConsultationCardPayload } from './consultation-card-payload';
import { lukeCanonicalCombo as combo } from './luke-canonical-combo';

// Explicit admission of one observed local sample; never a published relation.
export const lukeLocalComboRelation: Relation = {
  id: combo.combo_id, revision: 'ws5-luke-observed-combo-20261012', kind: 'Combo', character: 'luke',
  control: 'CLASSIC', inputPath: 'manual', patch: '', issue: 'combo', detail: 'drive_rush',
  condition: combo.condition, verification: 'GAME_OBSERVED',
  sourceRefs: combo.source.map(s => s.artifact + ':' + s.sha256),
  publicationAllowed: false, routeConfirmed: false, fieldEvidenceComplete: false, href: combo.safe_href,
};
export const lukeLocalComboPayload: ConsultationCardPayload = {
  cardType: 'Combo', characterId: 'luke', cardId: combo.combo_id, comboId: combo.combo_id,
  revision: lukeLocalComboRelation.revision, title: combo.formal_card_name, reason: combo.purpose,
  verification: 'GAME_OBSERVED', control: 'CLASSIC', inputPath: 'manual', condition: combo.condition,
  patch: null, mediaState: 'hold',
  recipe: { schema_version: 'ws12-card-recipe/1', card_kind: 'combo', control: 'classic',
    recipe_id: combo.combo_id, raw_recipe: combo.raw_recipe, steps: [], game_verification: 'NOT_VERIFIED' },
  localComboReference: { scope: 'RC_PREVIEW_LOCAL_CANDIDATE_ONLY', acceptance: 'ACCEPTED_LOCAL_CANDIDATE',
    combo_id: combo.combo_id, combo_slug: combo.combo_slug, safe_href: combo.safe_href,
    patch_state: 'HOLD_OBSERVED_BUILD_UNKNOWN', verification: 'GAME_OBSERVED',
    damage: 2210, drive_cost: 3, sa_cost: 0, end_frame: 56,
    modern_state: 'LOCAL_HOLD', objective_just: 'HOLD', media_state: 'LOCAL_HOLD',
    anchor_state: 'MOUNTED_LOCAL_CANDIDATE_BROWSER_NOT_RUN' },
};
// Reject altered recipes, values, identities, sources, scope or publication flags.
export function isLocalObservedComboReference(r: Relation, p: ConsultationCardPayload): boolean {
  try { return p?.cardType === 'Combo' &&
    JSON.stringify(r) === JSON.stringify(lukeLocalComboRelation) &&
    JSON.stringify(p) === JSON.stringify(lukeLocalComboPayload); } catch { return false; }
}
