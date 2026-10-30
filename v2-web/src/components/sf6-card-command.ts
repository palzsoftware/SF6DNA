import { createElement } from 'react';
import { Sf6CommandIcon, hasCommandIcon } from './sf6-command-icon';
import { moveCommandPlan, comboRecipePlan, pendingCdr, type MoveCommandInput } from '../lib/card-command-integration';
import type { CardRecipe } from '../lib/card-command-gauge-contract';
import { isVerifiedCdrGate, type CdrRendererGate } from '../lib/cdr-renderer-admission-contract';
import type { CommandIconPresentation } from '../lib/sf6-command-icon-contract';

function visual(parts: CommandIconPresentation[], gate: CdrRendererGate) {
  return parts.flatMap(p => p.parts).map((part, key) => {
    // CDR extension is independently admitted; frozen 28 assets remain intact.
    if (part.asset === 'control-cdr' && part.type === 'icon' && isVerifiedCdrGate(gate)) {
      return createElement('svg', { key, viewBox: '0 0 24 24', width: 24, height: 24, 'aria-hidden': true, focusable: 'false' },
        createElement('path', { d: 'M2 2H15.5L22 12L15.5 22H2Z', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' }),
        createElement('path', { d: 'M10 7.2A5 5 0 1 0 10 16.8', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' }),
        createElement('path', { d: 'M12.2 8.1L17.7 12L12.2 15.9M17.7 12H8.5', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }));
    }
    return part.type === 'icon' && part.asset && hasCommandIcon(part.asset)
      ? createElement(Sf6CommandIcon, { key, asset: part.asset, size: 24 })
      : createElement('span', { key }, part.value);
  });
}
const wrap = { display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, maxWidth: '100%' } as const;
const rawStyle = { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', minWidth: 0 } as const;

/** Display only. Relation/publication admission belongs to the owner before this port. */
export function Sf6CardCommand({ input, cdrGate = pendingCdr }: { input: MoveCommandInput; cdrGate?: CdrRendererGate }) {
  const plan = moveCommandPlan(input, cdrGate);
  return createElement('span', { role: 'img', 'aria-label': plan.accessibleName, 'data-render-mode': plan.mode,
    'data-move-id': input.context.moveId, 'data-control': input.context.control, 'data-input-path': input.context.inputPath },
    plan.mode === 'ICONS' ? createElement('span', { 'aria-hidden': true, style: wrap }, ...visual(plan.presentations, cdrGate)) : null,
    createElement('span', { 'aria-hidden': true, style: rawStyle }, plan.visible));
}

export function Sf6CardRecipe({ recipe, cdrGate = pendingCdr }: { recipe: CardRecipe; cdrGate?: CdrRendererGate }) {
  const plan = comboRecipePlan(recipe, cdrGate);
  return createElement('div', { role: 'img', 'aria-label': plan.accessibleName, 'data-render-mode': plan.mode },
    plan.mode === 'ICONS' ? createElement('span', { 'aria-hidden': true, style: wrap }, ...plan.steps.flatMap((step, index) => [
      createElement('span', { key: step.step_id, 'data-move-id': step.identity.move_id, 'data-control': step.identity.control,
        'data-input-path': step.identity.input_path, style: wrap },
        createElement('span', null, step.move_name), ...visual(step.presentations, cdrGate)),
      index < plan.steps.length - 1 ? createElement('span', { key: `separator-${index}` }, ' → ') : null,
    ])) : null,
    // Original recipe is always visible and never reconstructed from parsed tokens.
    createElement('span', { 'aria-hidden': true, style: rawStyle, 'data-original-recipe': true }, plan.rawRecipe));
}
