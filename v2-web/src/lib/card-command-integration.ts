import { buildCardCommandEnvelope, type CardCommandContext } from './card-command-accessible-envelope-contract';
import { presentRecipe, type CardRecipe } from './card-command-gauge-contract';
import { tokenizeSf6Command } from './sf6-command-tokens';
import { commandIconPresentationWithCdrAdmission, type CdrRendererGate } from './cdr-renderer-admission-contract';
import type { ControlScheme, CommandIconPresentation } from './sf6-command-icon-contract';

export const pendingCdr: CdrRendererGate = { adoptionState: 'HANDOFF_PENDING', assetState: 'NOT_CHECKED', observedSha256: null };
const hasText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** Explicit enum adapter only. Never normalizes a Move ID, recipe or source text. */
export function consultationCommandRoute(control: 'CLASSIC' | 'MODERN', inputPath: 'manual' | 'SP' | 'Assist') {
  if (control === 'CLASSIC' && inputPath !== 'manual') throw new TypeError('Classic route mismatch');
  if (!['CLASSIC', 'MODERN'].includes(control) || !['manual', 'SP', 'Assist'].includes(inputPath)) throw new TypeError('Unknown route');
  return { control: control === 'CLASSIC' ? 'classic' as const : 'modern' as const,
    inputPath: inputPath === 'SP' ? 'special' as const : inputPath === 'Assist' ? 'assist' as const : 'manual' as const };
}

function parse(raw: string, control: ControlScheme, gate: CdrRendererGate, inputPath?: string) {
  const tokens = tokenizeSf6Command(raw);
  const reasons: string[] = [];
  // No partial conversion of prose, unsupported input, or dropped characters.
  if (!tokens.length || tokens.map(t => t.raw).join('') !== raw) reasons.push('TOKEN_COVERAGE_UNVERIFIED');
  if (tokens.some(t => t.kind === 'pending' || (t.kind === 'text' && hasText(t.raw)))) reasons.push('TOKEN_UNSUPPORTED');
  const presentations = tokens.filter(t => hasText(t.raw)).map(t => commandIconPresentationWithCdrAdmission(t, control, gate));
  if (presentations.some(p => p.schemeMismatch)) reasons.push('TOKEN_SCHEME_MISMATCH');
  const assets = presentations.flatMap(p => p.parts.map(part => part.asset));
  if (control === 'modern' && inputPath === 'manual' && assets.some(a => a === 'control-sp' || a === 'control-assist')) reasons.push('TOKEN_PATH_MISMATCH');
  if (control === 'modern' && ['special', 'quick_sp'].includes(inputPath ?? '') && assets.includes('control-assist')) reasons.push('TOKEN_PATH_MISMATCH');
  return { presentations, reasons };
}

export type MoveCommandInput = { context: CardCommandContext; patch: string | null; commandEvidence: string | null };
export type CommandPlan = {
  mode: string; raw: string; accessibleName: string; visible: string;
  presentations: CommandIconPresentation[]; reasons: string[]; publicationGrant: false;
};

/** Same port for a Move Card reached through Consultation or Character Detail. */
export function moveCommandPlan(input: MoveCommandInput, gate: CdrRendererGate = pendingCdr): CommandPlan {
  const envelope = buildCardCommandEnvelope(input.context);
  const parsed = parse(envelope.visible, envelope.control, gate, envelope.inputPath);
  const reasons = [...envelope.reasons];
  if (!hasText(input.patch)) reasons.push('PATCH_UNVERIFIED');
  if (!hasText(input.commandEvidence)) reasons.push('COMMAND_BOUNDARY_UNREVIEWED');
  reasons.push(...parsed.reasons);
  const allowed = envelope.renderMode === 'ICON_SEQUENCE_CANDIDATE' && reasons.length === 0;
  const fallbackEnvelope = buildCardCommandEnvelope({ ...input.context, spokenCommand: null });
  return { mode: allowed ? 'ICONS' : envelope.renderMode === 'ICON_SEQUENCE_CANDIDATE' ? 'WHOLE_RAW_FALLBACK' : envelope.renderMode,
    raw: input.context.rawCommand ?? '', visible: envelope.visible, accessibleName: allowed ? envelope.accessibleName : fallbackEnvelope.accessibleName,
    presentations: allowed ? parsed.presentations : [], reasons: [...new Set(reasons)], publicationGrant: false };
}

export function comboRecipePlan(recipe: CardRecipe, gate: CdrRendererGate = pendingCdr) {
  const base = presentRecipe(recipe);
  const parsed = base.steps.map(step => parse(step.raw_command, step.identity.control, gate, step.identity.input_path));
  const reasons = [...new Set([...base.reasons, ...parsed.flatMap(p => p.reasons),
    ...base.steps.flatMap(s => s.relation_to_next === 'unknown' ? ['STEP_RELATION_UNVERIFIED'] : [])])];
  const allowed = base.mode === 'EXISTING_COMMAND_ICONS' && reasons.length === 0;
  const paths: Record<string, string> = { normal: '通常入力', manual: '手動入力', quick_sp: 'SP入力', assist: 'Assist入力', shared: '共通入力', followup: '派生入力', unknown: '入力経路未確認' };
  // Whole fallback must keep both source recipe and each supplied identity trace.
  // Do not reconstruct the original recipe from these reviewed step fields.
  const stepTrace = base.steps.map(step => {
    const i = step.identity;
    const conditions = Array.isArray(i.condition) ? (i.condition.length ? i.condition.join('、') : '通常時') : '条件未確認';
    return `${i.control === 'classic' ? 'クラシック' : i.control === 'modern' ? 'モダン' : '操作方式未確認'}、${paths[i.input_path] ?? paths.unknown}、${conditions}、${step.move_name || '技名未確認'}、${step.raw_command || '入力未確認'}、${step.relation_text}`;
  }).join('。');
  return { mode: allowed ? 'ICONS' as const : 'WHOLE_RAW_FALLBACK' as const, rawRecipe: recipe.raw_recipe,
    accessibleName: allowed ? base.aria_label : `${recipe.control === 'modern' ? 'モダン' : recipe.control === 'classic' ? 'クラシック' : '操作方式未確認'}、${recipe.raw_recipe || 'Recipe未確認'}、コマンド表示確認中${stepTrace ? '。' + stepTrace : ''}`,
    steps: base.steps.map((step, i) => ({ ...step, presentations: allowed ? parsed[i].presentations : [] })),
    reasons, publicationGrant: false as const };
}
