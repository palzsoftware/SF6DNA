import { lukeMoveSample, lukeComboSample } from './luke-sample-cards';
import type { MoveCommandInput } from './card-command-integration';
import type { CardRecipe } from './card-command-gauge-contract';

// QA-only sample. No guessed steps, conditions, patch, metric or publication approval.
export function lukeReferenceCommand(): MoveCommandInput {
  return { context: {
    characterId: 'luke', moveId: lukeMoveSample.id, formalMoveName: lukeMoveSample.name,
    control: 'classic', inputPath: 'unknown', condition: { state: 'UNKNOWN' },
    rawCommand: lukeMoveSample.classic, spokenCommand: null,
    evidenceState: 'NOT_VERIFIED', tokenizationState: 'NOT_TOKENIZED',
    officialSourceVerified: false, identityMatch: false,
  }, patch: null, commandEvidence: null };
}
export function lukeReferenceRecipe(): CardRecipe {
  return { schema_version: 'ws12-card-recipe/1', card_kind: 'combo', control: 'classic',
    recipe_id: lukeComboSample.id, raw_recipe: lukeComboSample.command,
    steps: [], game_verification: 'NOT_VERIFIED' };
}
