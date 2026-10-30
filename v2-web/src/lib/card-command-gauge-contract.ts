/** WS12 reference candidate. No DB/API/render-route writes or publication grant. */
import { tokenizeSf6Command } from "./sf6-command-tokens";
import { commandIconPresentation, commandIconAccessibleName } from "./sf6-command-icon-contract";

export type CardKind = "move" | "combo" | "setplay" | "sequence";
export type Control = "classic" | "modern" | "unknown";
export type InputPath = "normal" | "manual" | "quick_sp" | "assist" | "shared" | "followup" | "unknown";
export type CommandIdentity = {
  character_id: string; move_id: string | null; control: Control;
  input_path: InputPath; condition: string[] | null; patch: string | null;
};
export type RecipeStep = {
  step_id: string; move_name: string; identity: CommandIdentity;
  raw_command: string; boundary_reviewed: boolean;
  command_evidence: string | null;
  relation_to_next: "cancel" | "hit_link" | "delay" | "sequence" | "unknown" | "end";
};
export type CardRecipe = {
  schema_version: "ws12-card-recipe/1"; card_kind: CardKind; control: Control;
  recipe_id: string; raw_recipe: string; steps: RecipeStep[];
  game_verification: "NOT_VERIFIED" | "VERIFIED";
};
export type MetricKind = "cost" | "remaining" | "recovery" | "required";
export type DriveMetric = {
  kind: MetricKind; units: number | null;
  gauge_state: "active" | "burnout" | "unknown";
  evidence_id: string | null;
};
export type SaMetric = {
  kind: MetricKind; units: number | null; evidence_id: string | null;
  arts: { step_id: string; art_kind: "SA1" | "SA2" | "SA3" | "CA" | "unknown"; move_name: string }[];
};
const controlName: Record<Control, string> = {classic:"クラシック",modern:"モダン",unknown:"操作方式未確認"};
const pathName: Record<InputPath, string> = {normal:"通常入力",manual:"手動入力",quick_sp:"SP入力",assist:"Assist入力",shared:"共通入力",followup:"派生入力",unknown:"入力経路未確認"};
const metricName: Record<MetricKind, string> = {cost:"消費",remaining:"残量",recovery:"回復",required:"必要量"};
const relationName: Record<RecipeStep["relation_to_next"], string> = {cancel:"キャンセル",hit_link:"ヒット後につなぐ",delay:"遅らせる",sequence:"連携の次の行動",unknown:"接続条件未確認",end:"終了"};
const isText = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;
const isId = (s: unknown): s is string => typeof s === "string" && /^[\x21-\x7E]+$/.test(s);
const member = (v: unknown, map: object) => typeof v === "string" && Object.hasOwn(map,v);

function fallbackCommandLabel(step: Pick<RecipeStep, "identity" | "move_name" | "raw_command">) {
  const i = step.identity;
  const conditions = Array.isArray(i.condition) ? (i.condition.length ? i.condition.join("、") : "通常時") : "条件未確認";
  return `${controlName[i.control] ?? controlName.unknown}、${pathName[i.input_path] ?? pathName.unknown}、${conditions}、${step.move_name || "技名未確認"}、${step.raw_command || "入力未確認"}、コマンド表示確認中`;
}

export function presentCommand(step: RecipeStep, cardControl: Control) {
  const i = step.identity;
  const reasons: string[] = [];
  if (!member(i.control,controlName) || !member(cardControl,controlName) || i.control === "unknown" || cardControl !== i.control) reasons.push("CONTROL_UNVERIFIED");
  if (!member(i.input_path,pathName) || i.input_path === "unknown") reasons.push("INPUT_PATH_UNVERIFIED");
  if (i.control === "classic" && ["quick_sp","assist"].includes(i.input_path)) reasons.push("CONTROL_PATH_MISMATCH");
  if (i.control === "modern" && i.input_path === "normal") reasons.push("MODERN_PATH_UNRESOLVED");
  if (!isId(i.character_id) || !isId(i.move_id)) reasons.push("RELATION_UNRESOLVED");
  if (!Array.isArray(i.condition) || i.condition.some(v=>!isText(v))) reasons.push("CONDITION_UNVERIFIED");
  if (!isText(i.patch)) reasons.push("PATCH_UNVERIFIED");
  if (!step.boundary_reviewed || !isText(step.command_evidence)) reasons.push("COMMAND_BOUNDARY_UNREVIEWED");
  if (!isText(step.move_name) || !isText(step.raw_command)) reasons.push("COMMAND_MISSING");
  const tokens = tokenizeSf6Command(typeof step.raw_command === "string" ? step.raw_command : "");
  const presentations = tokens.filter(t=>!/^\s+$/.test(t.raw)).map(t=>commandIconPresentation(t,i.control));
  if (tokens.some(t=>t.kind === "pending")) reasons.push("UNSUPPORTED_TOKEN");
  if (presentations.some(p=>p.schemeMismatch)) reasons.push("TOKEN_SCHEME_MISMATCH");
  const conditions = Array.isArray(i.condition) ? (i.condition.length ? i.condition.join("、") : "通常時") : "条件未確認";
  const context = `${controlName[i.control] ?? controlName.unknown}、${pathName[i.input_path] ?? pathName.unknown}、${conditions}`;
  const fallback = `${step.move_name || "技名未確認"}：${step.raw_command || "入力未確認"}`;
  return {
    mode: reasons.length ? "TEXT_FALLBACK" as const : "EXISTING_COMMAND_ICONS" as const,
    identity: i, raw_command: step.raw_command, move_name: step.move_name,
    presentations: reasons.length ? [] : presentations,
    visible_text: fallback,
    aria_label: reasons.length ? fallbackCommandLabel(step) : `${context}、${step.move_name || "技名未確認"}、${commandIconAccessibleName(tokens)}`,
    reasons, publicationGrant: false as const,
  };
}

export function presentRecipe(recipe: CardRecipe) {
  const reasons: string[] = [];
  if (recipe.schema_version !== "ws12-card-recipe/1") reasons.push("SCHEMA_UNSUPPORTED");
  if (!["move","combo","setplay","sequence"].includes(recipe.card_kind)) reasons.push("CARD_KIND_INVALID");
  if (!isId(recipe.recipe_id) || !isText(recipe.raw_recipe) || !recipe.steps.length) reasons.push("RECIPE_MISSING");
  const ids = new Set<string>();
  const first = recipe.steps[0]?.identity;
  const steps = recipe.steps.map((step,index)=>{
    if (!isId(step.step_id) || ids.has(step.step_id)) reasons.push("STEP_ID_INVALID_OR_DUPLICATE");
    ids.add(step.step_id);
    if (step.identity.character_id !== first?.character_id || step.identity.patch !== first?.patch) reasons.push("RECIPE_IDENTITY_MISMATCH");
    if (!member(step.relation_to_next,relationName) || ((index === recipe.steps.length - 1) !== (step.relation_to_next === "end"))) reasons.push("STEP_RELATION_INVALID");
    return {...presentCommand(step,recipe.control),step_id:step.step_id,relation_to_next:step.relation_to_next,relation_text:relationName[step.relation_to_next] ?? relationName.unknown};
  });
  const allReasons = [...new Set([...reasons,...steps.flatMap(s=>s.reasons)])];
  // A whole-recipe fallback applies to every step. Consumers must not bypass
  // identity/boundary holds by rendering an individually eligible step.
  const mode = allReasons.length ? "TEXT_FALLBACK" as const : "EXISTING_COMMAND_ICONS" as const;
  const displaySteps = mode === "TEXT_FALLBACK" ? steps.map(step=>({
    ...step, mode: "TEXT_FALLBACK" as const, presentations: [],
    reasons: [...new Set([...step.reasons, ...allReasons])],
    aria_label: fallbackCommandLabel(step),
  })) : steps;
  return {
    ...recipe, steps: displaySteps, mode,
    reasons:allReasons, raw_recipe:recipe.raw_recipe,
    aria_label: mode === "TEXT_FALLBACK" ? `${controlName[recipe.control] ?? controlName.unknown}、${recipe.raw_recipe || "Recipe未確認"}、コマンド表示確認中` : `${controlName[recipe.control] ?? controlName.unknown}、${displaySteps.map(s=>`${s.aria_label}、${s.relation_text}`).join("。")}`,
    // Command icon eligibility is independent from game validity or publication.
    publicationGrant:false as const,
  };
}

export function presentDrive(metric: DriveMetric) {
  const label = metricName[metric.kind] ?? "種別未確認";
  const validKind = member(metric.kind,metricName);
  const validUnits = typeof metric.units === "number" && Number.isFinite(metric.units) && metric.units >= 0 && Number.isSafeInteger(metric.units * 2) && (metric.kind !== "remaining" || metric.units <= 6);
  const validState = ["active","burnout","unknown"].includes(metric.gauge_state);
  // Burnout is an observed state, never inferred from a zero cost or zero remaining value.
  const conflict = metric.kind === "remaining" && metric.gauge_state === "burnout" && validUnits && metric.units !== 0;
  const known = validKind && validUnits && validState && !conflict && isText(metric.evidence_id);
  const state = metric.gauge_state === "burnout" ? "、Burnout" : metric.gauge_state === "unknown" ? "、状態未確認" : "";
  const text = known ? `Drive ${label} ${metric.units}本${state}` : `Drive ${label}確認中${state}`;
  const units = known ? metric.units as number : null;
  return {
    metric, units, mode:known ? "VALUE_CANDIDATE" as const : "UNKNOWN" as const,
    // Twelve halves make six independent units; total cost >6 retains numeric text.
    halves: units !== null && units <= 6 ? Array.from({length:12},(_,n)=>n < units * 2) : null,
    visible_text:text, aria_label:text, state_conflict:conflict,
    publicationGrant:false as const,
  };
}

export function presentSa(metric: SaMetric) {
  const label = metricName[metric.kind] ?? "種別未確認";
  const valid = member(metric.kind,metricName) && typeof metric.units === "number" && Number.isSafeInteger(metric.units) && metric.units >= 0 && (metric.kind !== "remaining" || metric.units <= 3) && isText(metric.evidence_id);
  const units = valid ? metric.units as number : null;
  const arts = metric.arts.map(a=>({...a,visible_text:`${a.move_name}（${a.art_kind}）`}));
  const text = valid ? `SAゲージ ${label} ${units}本` : `SAゲージ ${label}確認中`;
  return {metric, units, arts,visible_text:text,aria_label:text,
    // No art_kind → cost rule; route totals and resource gains are supplied evidence.
    inferred_from_art:false as const, publicationGrant:false as const};
}
