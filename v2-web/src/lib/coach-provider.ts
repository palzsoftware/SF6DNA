import { validateProviderDraft, type CoachPromptInput, type CoachProviderDraft } from "@/lib/coach-prompt-contract";
import type { CoachEvidenceItem } from "@/lib/coach-foundation";

export type CoachProviderUsage = { inputUnits: number; outputUnits: number };
export type CoachProviderResult = { draft: CoachProviderDraft; providerId: string; model: string | null; latencyMs: number; usage: CoachProviderUsage | null; finishReason: "completed" | "fallback"; fallbackReason: CoachProviderErrorCategory | null };
export type CoachProviderErrorCategory = "timeout" | "provider_error" | "invalid_schema" | "post_validation" | "rate_limit" | "cost_guard";
export interface CoachProvider { readonly id: string; generate(input: CoachPromptInput, signal?: AbortSignal): Promise<CoachProviderDraft>; }

export const DEFAULT_PROVIDER_POLICY = { timeoutMs: 4_000, maxRetries: 0, requestsPerMinute: 6, requestsPerDay: 60, maxEstimatedUnitsPerRequest: 8_000 } as const;
export type ProviderBudgetState = { requestsLastMinute: number; requestsToday: number; estimatedUnits: number };

export function evaluateProviderBudget(state: ProviderBudgetState): { allowed: boolean; reason: "rate_limit" | "cost_guard" | null } {
  if (state.requestsLastMinute >= DEFAULT_PROVIDER_POLICY.requestsPerMinute || state.requestsToday >= DEFAULT_PROVIDER_POLICY.requestsPerDay) return { allowed: false, reason: "rate_limit" };
  if (state.estimatedUnits > DEFAULT_PROVIDER_POLICY.maxEstimatedUnitsPerRequest) return { allowed: false, reason: "cost_guard" };
  return { allowed: true, reason: null };
}

function deterministicDraft(input: CoachPromptInput): CoachProviderDraft {
  const all = [...input.allowedFacts, ...input.userStatements, ...input.aiInferences];
  return { headline: all.length ? "確認できる根拠をもとに整理しました。" : "回答に使える根拠がまだありません。", sections: all.map((item) => ({ title: "確認内容", body: item.statement, referencedEvidenceIds: [item.evidenceId] })), referencedEvidenceIds: all.map((item) => item.evidenceId) };
}

export class DeterministicCoachProvider implements CoachProvider {
  readonly id = "deterministic";
  async generate(input: CoachPromptInput): Promise<CoachProviderDraft> { return deterministicDraft(input); }
}

export type ExternalProviderTransport = (request: { input: CoachPromptInput; signal: AbortSignal }) => Promise<unknown>;
export class ExternalCoachProviderAdapter implements CoachProvider {
  constructor(readonly id: string, private readonly transport: ExternalProviderTransport) {}
  async generate(input: CoachPromptInput, signal?: AbortSignal): Promise<CoachProviderDraft> {
    const value = await this.transport({ input, signal: signal ?? new AbortController().signal });
    if (!isCoachProviderDraft(value)) throw new Error("invalid provider response");
    return value;
  }
}

export function isCoachProviderDraft(value: unknown): value is CoachProviderDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<CoachProviderDraft>;
  return typeof draft.headline === "string" && Array.isArray(draft.referencedEvidenceIds) && draft.referencedEvidenceIds.every((id) => typeof id === "string") && Array.isArray(draft.sections) && draft.sections.every((section) => section && typeof section.title === "string" && typeof section.body === "string" && Array.isArray(section.referencedEvidenceIds) && section.referencedEvidenceIds.every((id) => typeof id === "string"));
}

export function repairProviderDraft(draft: CoachProviderDraft, evidence: CoachEvidenceItem[]): CoachProviderDraft {
  const known = new Set(evidence.map((item) => item.id));
  const clean = (ids: string[]) => [...new Set(ids.filter((id) => known.has(id)))];
  return { headline: draft.headline.trim(), sections: draft.sections.map((section) => ({ title: section.title.trim(), body: section.body.trim(), referencedEvidenceIds: clean(section.referencedEvidenceIds) })), referencedEvidenceIds: clean(draft.referencedEvidenceIds) };
}

function timeout<T>(promise: Promise<T>, timeoutMs: number, onTimeout: () => void): Promise<T> {
  return new Promise((resolve, reject) => { const timer = setTimeout(() => { onTimeout(); reject(new Error("provider timeout")); }, timeoutMs); promise.then((value) => { clearTimeout(timer); resolve(value); }, (error) => { clearTimeout(timer); reject(error); }); });
}

export async function runCoachProvider({ provider, input, evidence, timeoutMs = DEFAULT_PROVIDER_POLICY.timeoutMs, budgetState = { requestsLastMinute: 0, requestsToday: 0, estimatedUnits: 0 } }: { provider: CoachProvider; input: CoachPromptInput; evidence: CoachEvidenceItem[]; timeoutMs?: number; budgetState?: ProviderBudgetState }): Promise<CoachProviderResult> {
  const started = Date.now();
  const budget = evaluateProviderBudget(budgetState);
  let fallbackReason: CoachProviderErrorCategory | null = budget.reason;
  let draft: CoachProviderDraft | null = null;
  if (budget.allowed) {
    try {
      const controller = new AbortController();
      const generated = await timeout(provider.generate(input, controller.signal), timeoutMs, () => controller.abort());
      if (!isCoachProviderDraft(generated)) fallbackReason = "invalid_schema";
      else {
        if (validateProviderDraft(generated, evidence, input.uncertainties).length) fallbackReason = "post_validation";
        else draft = repairProviderDraft(generated, evidence);
      }
    } catch (error) { fallbackReason = error instanceof Error && error.message === "provider timeout" ? "timeout" : "provider_error"; }
  }
  if (!draft) draft = deterministicDraft(input);
  return { draft, providerId: draft && !fallbackReason ? provider.id : "deterministic", model: null, latencyMs: Math.max(0, Date.now() - started), usage: null, finishReason: fallbackReason ? "fallback" : "completed", fallbackReason };
}

export function providerAuditEvent(result: CoachProviderResult, input: CoachPromptInput) {
  return { providerId: result.providerId, model: result.model, latencyMs: result.latencyMs, success: result.finishReason === "completed", fallback: result.finishReason === "fallback", errorCategory: result.fallbackReason, evidenceCount: input.allowedFacts.length + input.userStatements.length + input.aiInferences.length, persona: input.personaPolicy.personaId };
}
