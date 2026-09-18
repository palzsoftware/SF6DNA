import type { CoachEvidenceItem } from "@/lib/coach-foundation";
import type { CoachInputContext } from "@/lib/coach-shared-analysis";
import type { SearchEntityType } from "@/types/search";

export const RETRIEVAL_PATCH_STATUSES = [
  "PATCH_MATCH",
  "PATCH_COMPATIBLE",
  "PATCH_UNKNOWN",
  "PATCH_STALE",
  "PATCH_NOT_APPLICABLE",
] as const;
export type RetrievalPatchStatus = (typeof RETRIEVAL_PATCH_STATUSES)[number];

export type TrustedRetrievalVerificationStatus = "verified" | "reviewed" | "unknown" | "draft";
export type TrustedRetrievalPublicationStatus = "published" | "draft" | "unknown";
export type TrustedRetrievalAvailabilityStatus = "public" | "unknown" | "inaccessible" | "restricted" | "private" | "internal";
export type TrustedRetrievalFactDomain = "game" | "profile" | "content";

export type CurrentPatchContext = {
  versionLabel: string;
  name: string | null;
  releasedAt: string | null;
  officialUrl: string | null;
};

export type TrustedRetrievalItem = {
  id: string;
  entityType: string;
  entityId: string;
  slug: string | null;
  characterSlug: string | null;
  playerId: string | null;
  title: string;
  statement: string;
  sourceId: string | null;
  sourceUrl: string | null;
  sourceType: string | null;
  reliabilityLevel: string | null;
  patch: string | null;
  verificationStatus: TrustedRetrievalVerificationStatus;
  publicationStatus: TrustedRetrievalPublicationStatus;
  reviewedAt: string | null;
  verifiedAt: string | null;
  publishedAt: string | null;
  sourceAccessedAt: string | null;
  relevanceScore: number | null;
  availabilityStatus: TrustedRetrievalAvailabilityStatus;
  patchSensitive: boolean;
  factDomain: TrustedRetrievalFactDomain;
  conflictKey: string | null;
  patchCompatible: boolean;
};

export type RetrievalSearchSource = {
  sourceId?: string | null;
  title: string;
  url: string;
  sourceType: string;
  publisher: string | null;
  reliabilityLevel: string | null;
  publishedAt?: string | null;
  accessedAt?: string | null;
};

export type RetrievalSearchItem = {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle?: string | null;
  href: string;
  matchedBy: "name" | "alias" | "content";
  relevanceScore?: number | null;
  sources: RetrievalSearchSource[];
};

export type RetrievalFilterOptions = {
  publicStrategyContent: boolean;
  training: boolean;
  exactCharacterId?: string | null;
  exactPlayerId?: string | null;
};

export type RetrievalEvidenceBundle = {
  evidence: CoachEvidenceItem[];
  uncertainty: string[];
  excludedIds: string[];
};

export type RetrievalQueryPlan = {
  query: string;
  exactCharacterId: string | null;
  exactPlayerId: string | null;
  omittedSensitiveInput: boolean;
  uncertainty: string[];
};

const STRATEGY_ENTITY_TYPES = new Set(["move", "combo", "setup", "sequence", "counter"]);
const PATCH_SENSITIVE_ENTITY_TYPES = new Set(["move", "frame", "move_frame_data", "combo", "setup", "sequence", "counter", "training"]);
const GAME_ENTITY_TYPES = new Set(["move", "frame", "move_frame_data", "combo", "setup", "sequence", "counter", "training"]);
const INTERNAL_SOURCE_TYPES = new Set(["internal_audit", "internal_candidate", "internal", "qa", "private"]);
const INTERNAL_RELIABILITY = new Set(["internal_candidate", "internal"]);

function cleanText(value: unknown, maxLength = 2000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function isHttpUrl(value: string | null): boolean {
  return Boolean(value && /^https?:\/\//i.test(value));
}

function slugFromHref(href: string): string | null {
  const parts = href.split("?")[0].split("/").filter(Boolean);
  return parts.length ? parts.at(-1) ?? null : null;
}

function factDomainFor(entityType: string): TrustedRetrievalFactDomain {
  if (GAME_ENTITY_TYPES.has(entityType)) return "game";
  if (entityType === "character" || entityType === "player") return "profile";
  return "content";
}

function normalizedSourceQuality(level: string | null): number {
  if (level === "official") return 0;
  if (level === "primary") return 1;
  if (level === "secondary") return 2;
  if (level === "community") return 3;
  return 4;
}

export function normalizeTrustedRetrievalItems(items: RetrievalSearchItem[]): TrustedRetrievalItem[] {
  const output: TrustedRetrievalItem[] = [];
  for (const item of items) {
    const slug = slugFromHref(item.href);
    for (const source of item.sources) {
      const sourceId = cleanText(source.sourceId, 200);
      const sourceUrl = cleanText(source.url, 2000);
      output.push({
        id: `${item.type}:${item.id}:${sourceId ?? sourceUrl ?? output.length}`,
        entityType: item.type,
        entityId: item.id,
        slug,
        characterSlug: item.type === "character" ? slug : null,
        playerId: item.type === "player" ? item.id : null,
        title: item.title,
        statement: cleanText(item.subtitle, 2000) ? `${item.title}: ${cleanText(item.subtitle, 2000)}` : item.title,
        sourceId,
        sourceUrl,
        sourceType: cleanText(source.sourceType, 100),
        reliabilityLevel: cleanText(source.reliabilityLevel, 100),
        patch: null,
        verificationStatus: "unknown",
        publicationStatus: "published",
        reviewedAt: null,
        verifiedAt: null,
        publishedAt: cleanText(source.publishedAt, 100),
        sourceAccessedAt: cleanText(source.accessedAt, 100),
        relevanceScore: typeof item.relevanceScore === "number" && Number.isFinite(item.relevanceScore) ? item.relevanceScore : null,
        availabilityStatus: isHttpUrl(sourceUrl) ? "unknown" : "inaccessible",
        patchSensitive: PATCH_SENSITIVE_ENTITY_TYPES.has(item.type),
        factDomain: factDomainFor(item.type),
        conflictKey: `${item.type}:${item.id}`,
        patchCompatible: false,
      });
    }
  }
  return output;
}

export function retrievalPatchStatus(item: TrustedRetrievalItem, currentPatch: CurrentPatchContext | null): RetrievalPatchStatus {
  if (!item.patchSensitive) return "PATCH_NOT_APPLICABLE";
  if (!item.patch || !currentPatch?.versionLabel) return "PATCH_UNKNOWN";
  if (item.patch.trim() === currentPatch.versionLabel.trim()) return "PATCH_MATCH";
  if (item.patchCompatible) return "PATCH_COMPATIBLE";
  return "PATCH_STALE";
}

export function filterTrustedRetrievalItems(items: TrustedRetrievalItem[], options: RetrievalFilterOptions): { kept: TrustedRetrievalItem[]; excludedIds: string[] } {
  const kept: TrustedRetrievalItem[] = [];
  const excludedIds: string[] = [];
  for (const item of items) {
    const internalSource = INTERNAL_SOURCE_TYPES.has(item.sourceType ?? "") || INTERNAL_RELIABILITY.has(item.reliabilityLevel ?? "");
    const blockedAvailability = ["inaccessible", "restricted", "private", "internal"].includes(item.availabilityStatus);
    const featureBlocked = (STRATEGY_ENTITY_TYPES.has(item.entityType) && !options.publicStrategyContent) || (item.entityType === "training" && !options.training);
    const exactCharacterMismatch = item.entityType === "character" && options.exactCharacterId && item.entityId !== options.exactCharacterId;
    const exactPlayerMismatch = item.entityType === "player" && options.exactPlayerId && item.entityId !== options.exactPlayerId;
    const reject = item.publicationStatus === "draft" || item.verificationStatus === "draft" || internalSource || blockedAvailability || featureBlocked || !isHttpUrl(item.sourceUrl) || exactCharacterMismatch || exactPlayerMismatch;
    if (reject) excludedIds.push(item.id);
    else kept.push(item);
  }
  return { kept, excludedIds };
}

function evidenceKindFor(item: TrustedRetrievalItem, patchStatus: RetrievalPatchStatus): CoachEvidenceItem["kind"] {
  const sourceIsPubliclyConfirmed = item.availabilityStatus === "public";
  const patchIsUsable = patchStatus === "PATCH_MATCH" || patchStatus === "PATCH_COMPATIBLE" || patchStatus === "PATCH_NOT_APPLICABLE";
  if (item.verificationStatus === "verified" && item.factDomain === "game" && sourceIsPubliclyConfirmed && patchIsUsable) return "VERIFIED_GAME_FACT";
  if (item.verificationStatus === "reviewed" && patchStatus !== "PATCH_STALE") return "SOURCE_BACKED_FACT";
  if (item.verificationStatus === "verified" && item.factDomain !== "game" && sourceIsPubliclyConfirmed) return "SOURCE_BACKED_FACT";
  return "UNVERIFIED_CANDIDATE";
}

function uncertaintyForItem(item: TrustedRetrievalItem, patchStatus: RetrievalPatchStatus, kind: CoachEvidenceItem["kind"]): string[] {
  const uncertainty: string[] = [];
  if (item.availabilityStatus === "unknown") uncertainty.push(`「${item.title}」のSource到達性は未確認です。`);
  if (patchStatus === "PATCH_UNKNOWN") uncertainty.push(`「${item.title}」は対応Patchを確認できていません。`);
  if (patchStatus === "PATCH_STALE") uncertainty.push(`「${item.title}」はCurrent Patchと一致しないため、現在のゲーム事実として断定しません。`);
  if (kind === "UNVERIFIED_CANDIDATE") uncertainty.push(`「${item.title}」は検証状態が十分でないため追加確認が必要です。`);
  return uncertainty;
}

export function buildRetrievalEvidence(item: TrustedRetrievalItem, currentPatch: CurrentPatchContext | null): { evidence: CoachEvidenceItem; uncertainty: string[] } {
  const patchStatus = retrievalPatchStatus(item, currentPatch);
  const kind = evidenceKindFor(item, patchStatus);
  return {
    evidence: {
      id: `retrieval:${item.id}`,
      kind,
      statement: item.statement,
      sourceId: item.sourceId,
      sourceUrl: item.sourceUrl,
      patch: item.patch,
      confidence: null,
      verificationStatus: kind === "VERIFIED_GAME_FACT" ? "verified" : item.verificationStatus === "reviewed" ? "reviewed" : "unverified",
      characterSlug: item.characterSlug,
      playerId: item.playerId,
      createdAt: item.verifiedAt ?? item.reviewedAt ?? item.publishedAt,
      sourceType: item.sourceType,
      sourceReliability: item.reliabilityLevel,
      patchStatus,
      availabilityStatus: item.availabilityStatus,
      sourcePublishedAt: item.publishedAt,
      sourceAccessedAt: item.sourceAccessedAt,
      relevanceScore: item.relevanceScore,
    },
    uncertainty: uncertaintyForItem(item, patchStatus, kind),
  };
}

function conflictUncertainty(items: TrustedRetrievalItem[]): string[] {
  const grouped = new Map<string, TrustedRetrievalItem[]>();
  for (const item of items) {
    if (!item.conflictKey) continue;
    const group = grouped.get(item.conflictKey) ?? [];
    group.push(item);
    grouped.set(item.conflictKey, group);
  }
  const output: string[] = [];
  for (const group of grouped.values()) {
    const statements = new Set(group.map((item) => item.statement.trim()).filter(Boolean));
    if (statements.size > 1) {
      const title = group[0]?.title ?? "Retrieval結果";
      output.push(`「${title}」について複数Sourceの内容が一致していません。Source・Patch・日付を比較して追加確認してください。`);
    }
  }
  return output;
}

function evidenceRank(item: TrustedRetrievalItem, currentPatch: CurrentPatchContext | null): number {
  const patch = retrievalPatchStatus(item, currentPatch);
  if (item.verificationStatus === "verified" && patch === "PATCH_MATCH") return 0;
  if (item.verificationStatus === "verified" && (patch === "PATCH_COMPATIBLE" || patch === "PATCH_NOT_APPLICABLE")) return 1;
  if (item.verificationStatus === "reviewed" && patch === "PATCH_MATCH") return 2;
  if (item.verificationStatus === "reviewed" && (patch === "PATCH_UNKNOWN" || patch === "PATCH_NOT_APPLICABLE")) return 3;
  return 4;
}

export function buildRetrievalEvidenceList(items: TrustedRetrievalItem[], currentPatch: CurrentPatchContext | null, options: RetrievalFilterOptions): RetrievalEvidenceBundle {
  const filtered = filterTrustedRetrievalItems(items, options);
  const sorted = [...filtered.kept].sort((a, b) => {
    const rankDiff = evidenceRank(a, currentPatch) - evidenceRank(b, currentPatch);
    if (rankDiff) return rankDiff;
    const relevanceDiff = (b.relevanceScore ?? -1) - (a.relevanceScore ?? -1);
    if (relevanceDiff) return relevanceDiff;
    return normalizedSourceQuality(a.reliabilityLevel) - normalizedSourceQuality(b.reliabilityLevel);
  });
  const uncertainty = conflictUncertainty(sorted);
  const evidence: CoachEvidenceItem[] = [];
  for (const item of sorted) {
    const adapted = buildRetrievalEvidence(item, currentPatch);
    evidence.push(adapted.evidence);
    uncertainty.push(...adapted.uncertainty);
  }
  return { evidence, uncertainty: [...new Set(uncertainty)], excludedIds: filtered.excludedIds };
}

const SENSITIVE_PATTERNS = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi,
  /\b\d{8,}\b/g,
  /\b(?:eyJ|sk-|sb_secret_)[A-Za-z0-9._-]{12,}\b/g,
  /\b(?:request[_-]?id|user[_-]?id|auth[_-]?token)\s*[:=]\s*\S+/gi,
];

export function sanitizeRetrievalText(value: string): { text: string; omittedSensitiveInput: boolean } {
  let text = value.normalize("NFKC");
  let omittedSensitiveInput = false;
  for (const pattern of SENSITIVE_PATTERNS) {
    const next = text.replace(pattern, " ");
    if (next !== text) omittedSensitiveInput = true;
    text = next;
  }
  return { text: text.replace(/\s+/g, " ").trim().slice(0, 500), omittedSensitiveInput };
}

export function buildRetrievalQuery(context: CoachInputContext): RetrievalQueryPlan {
  const parts: string[] = [];
  let omittedSensitiveInput = false;
  if (context.characterContext) parts.push(context.characterContext.name, context.characterContext.slug);
  if (context.playerContext) parts.push(context.playerContext.displayName);
  for (const issue of context.diagnosisResult?.primaryIssues ?? []) parts.push(issue.label, issue.key);
  for (const item of (context.dailyTraining?.items ?? []).slice(0, 2)) parts.push(item.issue, item.objective);
  if (context.userMessage?.rawText) {
    const sanitized = sanitizeRetrievalText(context.userMessage.rawText);
    omittedSensitiveInput ||= sanitized.omittedSensitiveInput;
    if (sanitized.text) parts.push(sanitized.text);
  }
  const deduped = [...new Set(parts.map((part) => cleanText(part, 200)).filter((part): part is string => Boolean(part)))];
  const query = deduped.join(" ").replace(/\s+/g, " ").trim().slice(0, 500);
  const uncertainty = omittedSensitiveInput ? ["検索語に含めるべきでない識別子・秘密値候補をRetrieval queryから除外しました。"] : [];
  return {
    query,
    exactCharacterId: context.characterContext?.id ?? null,
    exactPlayerId: context.playerContext?.id ?? null,
    omittedSensitiveInput,
    uncertainty,
  };
}

export function retrievalPatchStatusLabel(status: unknown): string | null {
  if (status === "PATCH_MATCH") return "現行Patch一致";
  if (status === "PATCH_COMPATIBLE") return "互換Patch";
  if (status === "PATCH_UNKNOWN") return "対応Patch未確認";
  if (status === "PATCH_STALE") return "旧Patchの可能性";
  if (status === "PATCH_NOT_APPLICABLE") return "Patch非依存";
  return null;
}

export function retrievalEvidenceStatusLabel(item: CoachEvidenceItem): string {
  if (item.kind === "VERIFIED_GAME_FACT" && item.verificationStatus === "verified") return "ゲーム内確認済み";
  if (item.kind === "SOURCE_BACKED_FACT") return "出典あり・検証状態は別管理";
  return "追加確認が必要";
}
