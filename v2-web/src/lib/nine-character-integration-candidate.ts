import checkpoint from "@/data/NINE_CHARACTER_PAGE_CANDIDATE_20261006.json";
import snapshot from "@/data/ALL_CHARACTER_RELEASE_FIXTURE_20261004.json";
import type { DevicePreviewBundle } from "@/lib/device-preview";
import { getAlexFullDataWithReviewedMedia } from "@/lib/alex-approved-data-overlay";

export function hasNineCharacterIntegrationCandidate(slug: string) {
  return Object.hasOwn(checkpoint.candidate.characters, slug);
}

function snapshotNotation(value: unknown): string {
  if (value === null) return "—";
  if (Array.isArray(value)) return value.map(snapshotNotation).join(" / ");
  if (typeof value === "object" && value !== null) return Object.entries(value)
    .map(([condition, amount]) => `${condition}: ${snapshotNotation(amount)}`).join(" / ");
  return String(value);
}

function acceptedFrame(state: unknown, field: string, value: unknown) {
  if (!state || typeof state !== "object") return false;
  const fact = state as { status: string; adopted: boolean; value: unknown; evidence_value: unknown;
    evidence_status: string; source_available: string; source_sha256: string; source_field_guard_sha256: string;
    evidence_source: string; capture_date: string; snapshot_source: string; battle_version_label_verified: boolean };
  if (fact.status !== "CURRENT_OFFICIAL_SNAPSHOT_ACCEPTED") {
    return ["OFFICIAL_NA", "DETAIL_PENDING", "SOURCE_REVIEW", "SAFE_OMIT"].includes(fact.status) && value === null && fact.value === null;
  }
  const expected = field === "damage" && typeof fact.evidence_value === "number"
    ? fact.evidence_value : snapshotNotation(fact.evidence_value);
  return fact.adopted === true && fact.evidence_value !== null && fact.value === expected && value === expected &&
    ["CONFIRMED", "CONDITIONAL"].includes(fact.evidence_status) && fact.source_available === "YES" &&
    /^[a-f0-9]{64}$/.test(fact.source_sha256) && /^[a-f0-9]{64}$/.test(fact.source_field_guard_sha256) &&
    Boolean(fact.evidence_source) && fact.capture_date === "2026-10-06" &&
    fact.snapshot_source === "CAPCOM_OFFICIAL_FRAME_DATA" && fact.battle_version_label_verified === false;
}

/** Preview candidate data; selection never grants Production publication. */
export function getNineCharacterIntegrationCandidate(characterId: string, slug: string) {
  if (process.env.VERCEL_ENV !== "preview") return null;
  if (checkpoint.snapshot_policy.source !== "CAPCOM_OFFICIAL_FRAME_DATA" ||
    checkpoint.snapshot_policy.capture_date !== "2026-10-06" ||
    checkpoint.snapshot_policy.production_approved !== false ||
    checkpoint.snapshot_policy.battle_version_label_verified !== false) return null;
  const candidates = checkpoint.candidate.characters[slug as keyof typeof checkpoint.candidate.characters];
  const base = snapshot.characters[slug as keyof typeof snapshot.characters];
  if (!candidates || !base || base.characterId !== characterId) return null;
  const ids = candidates.map(row => row.id);
  if (new Set(ids).size !== ids.length || candidates.length !== base.moves.length) return null;
  const evidence = checkpoint.evidence as Record<string, (typeof checkpoint.evidence)[keyof typeof checkpoint.evidence]>;
  const alex = slug === "alex" ? getAlexFullDataWithReviewedMedia(characterId) : null;
  const source = alex?.moves ?? base.moves;
  const preservedBase = structuredClone(source);
  const moves: DevicePreviewBundle["moves"] = [];
  const heldMoves: { move: DevicePreviewBundle["moves"][number]; reviewStatus: "IDENTITY_REVIEW_REQUIRED" }[] = [];
  for (const original of source) {
    const rows = candidates.filter(row => row.id === original.id && row.slug === original.slug);
    const state = evidence[original.id];
    if (rows.length !== 1 || !state || state.character !== slug || state.production_approved !== false || state.release_registry_write_allowed !== false) return null;
    const row = rows[0];
    // Jump is a source subgroup; the existing UI contract groups it under normal.
    if ((row.category === "jump" ? "normal" : row.category) !== original.moveType) return null;
    if (state.move_display === "SUPPRESS_PENDING_OFFICIAL_IDENTITY") {
      heldMoves.push({ move: structuredClone(original), reviewStatus: "IDENTITY_REVIEW_REQUIRED" });
      continue;
    }
    if (state.move_display !== "INCLUDE_SAVED_IDENTITY") return null;
    if (row.commands.some(command => command.moveId !== original.id)) return null;
    if (Object.entries(row.frame).some(([field, value]) => !acceptedFrame(
      state.frame_classifications[field as keyof typeof state.frame_classifications], field, value))) return null;
    const media = slug === "alex" ? alex?.moves.find(move => move.id === original.id)?.media ?? null : null;
    moves.push({ ...structuredClone(original), name: row.name, commands: structuredClone(row.commands),
      frame: { ...structuredClone(row.frame), verificationStatus: original.frame?.verificationStatus ?? "unverified" },
      frameFieldStatus: Object.fromEntries(Object.entries(state.frame_classifications).map(([field, fact]) => [field, fact.status])),
      usageSummary: null, usageSummaryJa: null, descriptionJa: null, media, releaseFixture: true });
  }
  const bundle: DevicePreviewBundle = { guideSections: [], moves, combos: [], setups: [], sequences: [], matchups: [], training: [] };
  return { bundle, preservedBase, heldMoves, frameStatus: "CURRENT_OFFICIAL_SNAPSHOT_ACCEPTED_WITH_PENDING" as const,
    counts: { dataBase: preservedBase.length, publicCandidate: moves.length, held: heldMoves.length },
    evidence: structuredClone(evidence), productionApproved: false as const };
}
