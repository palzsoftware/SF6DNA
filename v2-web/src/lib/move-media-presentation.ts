export type MediaPresentationState = "MEDIA_READY" | "MEDIA_LOW_INFORMATION" | "MEDIA_PENDING_UPGRADE" | "MEDIA_MISSING";
export type MotionOutcome = "HIT" | "WHIFF" | "BLOCK" | "COUNTER" | "PUNISH" | "UNKNOWN";
export type MotionMediaCandidate<T> = {
  media: T; moveId: string; variantKey: string; outcome: MotionOutcome;
  confidence: "HIGH" | "REVIEW" | "HOLD";
  identity: "CONFIRMED" | "REVIEW"; quality: "PASS" | "HOLD";
  decode: "PASS" | "HOLD"; animation: "PASS" | "HOLD";
  loop: "PASS" | "HOLD"; hash: "PASS" | "HOLD";
};
export type MotionMediaPresentation<T> = {
  variantKey?: string;
  existingOutcome?: MotionOutcome;
  existingValidation?: "PASS" | "HOLD";
  upgradePending?: boolean;
  candidates?: readonly MotionMediaCandidate<T>[];
};
// Explicit schema categories only; never infer a category or outcome from a name/file.
const upgradeCategories = new Set(["normal", "normal_attack", "unique", "unique_attack", "unique_move", "special", "special_move"]);
export function selectMoveMotionMedia<T>(move: {
  id: string; moveType?: string | null; media?: T | null;
  motionMediaPresentation?: MotionMediaPresentation<T>;
}): { media: T | null; state: MediaPresentationState; outcome: MotionOutcome; upgradePriority: boolean } {
  const p = move.motionMediaPresentation;
  const upgradePriority = upgradeCategories.has((move.moveType ?? "").toLowerCase());
  const candidates = (p?.candidates ?? []).filter(c => c.moveId === move.id &&
    c.variantKey === (p?.variantKey ?? "") && c.media != null &&
    c.confidence === "HIGH" && c.identity === "CONFIRMED" && c.quality === "PASS" &&
    c.decode === "PASS" && c.animation === "PASS" && c.loop === "PASS" && c.hash === "PASS");
  const hit = candidates.find(c => c.outcome === "HIT");
  const existing = p?.existingValidation === "HOLD" ? null : move.media ?? null;
  const chosen = hit ?? (existing == null ? candidates[0] : undefined);
  const media = chosen?.media ?? existing;
  const outcome = chosen?.outcome ?? (media == null ? "UNKNOWN" : p?.existingOutcome ?? "UNKNOWN");
  const state: MediaPresentationState = media == null ? "MEDIA_MISSING"
    : upgradePriority && outcome === "WHIFF" ? p?.upgradePending ? "MEDIA_PENDING_UPGRADE" : "MEDIA_LOW_INFORMATION"
    : "MEDIA_READY";
  return { media, state, outcome, upgradePriority };
}
