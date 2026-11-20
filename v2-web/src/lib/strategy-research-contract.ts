import rawCards from "./strategy-research-cards-20261118.json";
import sourceHold from "./strategy-reference-source-hold-20261120.json";

export type StrategySlotKind = "combo" | "setplay" | "sequence" | "counter";
export type ResearchCardCategory = "combo" | "setplay" | "pressure" | "counter";
type ReferenceStats = { damage: number | null; drive: number | null; sa: number | null; knockdownAdvantage: number | null };
export type StrategyResearchCard = {
  id: string; characterSlug: string; characterName: string;
  category: ResearchCardCategory; categoryLabel: string; title: string;
  controlLabel: string; commandRaw: string; commandJapanese: string; description: string;
  condition: string; position: string; reportedStats: ReferenceStats; verifiedStats: ReferenceStats;
  referenceVersion: string; sourceUrl: string | null; sourceUrls: string[]; media: null;
  referenceNotice: string; commandNotice: string; caution: string | null;
};
const cards = rawCards as readonly StrategyResearchCard[];
const categoryBySlot: Record<StrategySlotKind, ResearchCardCategory> = {
  combo: "combo", setplay: "setplay", sequence: "pressure", counter: "counter",
};
const anchorByCategory: Record<ResearchCardCategory, string> = {
  combo: "pilot-combos", setplay: "pilot-setplay", pressure: "pilot-sequences", counter: "pilot-counters",
};

// Only a server-side deployment environment may enable this review path.
// In particular, a production deployment cannot be opened by a query string.
export function isStrategyResearchPreviewAllowed(env: { VERCEL_ENV?: string; NODE_ENV?: string }): boolean {
  if (env.VERCEL_ENV === "production") return false;
  if (env.VERCEL_ENV === "preview") return true;
  return (!env.VERCEL_ENV || env.VERCEL_ENV === "development") && env.NODE_ENV === "development";
}

/**
 * Dedicated switch for the 384 reference cards only (independent of releaseFeatures.publicStrategyContent,
 * which keeps the internal strategy DB closed). Production default is closed: it opens only when the
 * server-side env SF6DNA_PUBLIC_STRATEGY_REFERENCE is "all" (all 32 characters) or a comma list of slugs.
 */
const SLUG = /^[a-z0-9-]{2,40}$/;
export function strategyReferencePublication(env: { SF6DNA_PUBLIC_STRATEGY_REFERENCE?: string }): "ALL" | ReadonlySet<string> | null {
  const raw = env.SF6DNA_PUBLIC_STRATEGY_REFERENCE?.trim().toLowerCase();
  if (!raw) return null;
  if (raw === "all") return "ALL";
  const slugs = raw.split(",").map(value => value.trim()).filter(value => SLUG.test(value));
  return slugs.length ? new Set(slugs) : null;
}
export function isStrategyReferencePublic(env: { SF6DNA_PUBLIC_STRATEGY_REFERENCE?: string }, slug: string): boolean {
  const scope = strategyReferencePublication(env);
  return scope === "ALL" || (scope !== null && scope.has(slug));
}
/** Visible when previewing (Dev/Preview) or when explicitly published for this character. */
export function isStrategyReferenceVisible(env: { VERCEL_ENV?: string; NODE_ENV?: string; SF6DNA_PUBLIC_STRATEGY_REFERENCE?: string }, slug: string): boolean {
  return isStrategyResearchPreviewAllowed(env) || isStrategyReferencePublic(env, slug);
}

// Cards whose source terms are not cleared/reviewed or that have no source are withheld in every
// environment (Preview included). This does not change any release flag; removing an ID requires
// source clearance recorded by the strategy owner.
const SOURCE_HOLD_IDS: ReadonlySet<string> = new Set(sourceHold.holdCardIds);
export function isStrategyResearchCardHeld(id: string): boolean {
  return SOURCE_HOLD_IDS.has(id);
}

export function listStrategyResearchCards(slug: string, kind: StrategySlotKind): readonly StrategyResearchCard[] {
  const category = categoryBySlot[kind];
  return cards.filter(card => card.characterSlug === slug && card.category === category && !SOURCE_HOLD_IDS.has(card.id));
}

// Reference-page links must never use the internal research archive, credentials or executable URLs.
export function safeStrategyResearchSource(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    if (['localhost','127.0.0.1','drive.google.com','docs.google.com','github.com','api.github.com'].includes(url.hostname) || url.hostname.endsWith('.local')) return null;
    return url.href;
  } catch { return null; }
}

// Compatible with the real PilotComboCardData interface at 014aa4b. The new shared
// StrategyCard (currently uncommitted in the other workspace) should consume this
// same projection, without copying/editing the original research records.
export function toStrategyResearchPreviewData(card: StrategyResearchCard) {
  const sourceUrl = safeStrategyResearchSource(card.sourceUrl);
  return {
    id: card.id, href: `#${anchorByCategory[card.category]}`, name: card.title,
    // Keep an explicit per-card qualification; do not label source-reported numbers as verified.
    purpose: `${card.referenceNotice}。${card.description}`,
    damage: card.reportedStats.damage, drive: card.reportedStats.drive, sa: card.reportedStats.sa,
    difficulty: null, verificationStatus: "reference_unverified", preview: true,
    category: card.categoryLabel, starter: null, command: card.commandRaw, rawRecipe: card.commandRaw,
    startCondition: card.condition, endCondition: null, position: card.position,
    patch: `参考資料: ${card.referenceVersion}`, sourceLabel: sourceUrl ? "参考資料（本文未照合の場合あり）" : null,
    sourceType: null, sourceUrl, media: null,
  };
}
