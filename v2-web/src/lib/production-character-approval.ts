import { createHash } from "node:crypto";
import registry from "@/data/CHARACTER_PRODUCTION_RELEASE_APPROVAL.json";
import type { DevicePreviewBundle } from "@/lib/device-preview";
import type { PublicEntitySourceRow } from "@/lib/public-source-links";

export type MoveApproval = { id: string; slug: string; factDigest: string; identityConfirmed: true;
  commandEvidence: "APPROVED_CURRENT"; frameEvidence: "APPROVED_CURRENT"; sourceStatus: "APPROVED_CURRENT" };
export type CharacterApproval = { characterId: string; slug: string; approved: true; revoked: false;
  patchId: string; approvalRef: string; approvedBy: string; approvedAt: string;
  checkpointId: string; checkpointHash: string; candidateHash: string; expectedCount: number; moves: MoveApproval[] };
export type ApprovalRegistry = { schemaVersion: 1; releaseId: "SF6DNA_VER1_0"; baseRcSha: string; characters: CharacterApproval[] };
const BASE = "d929501ee45b86e2f2b18d7efc09381e7b4d8cb6";
const digestPattern = /^[a-f0-9]{64}$/;
const text = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

/** Trusted code-owned input only. Malformed registry invalidates all grants. */
export function validateApprovalRegistry(value: unknown): value is ApprovalRegistry {
  if (!value || typeof value !== "object") return false;
  const r = value as ApprovalRegistry;
  if (r.schemaVersion !== 1 || r.releaseId !== "SF6DNA_VER1_0" || r.baseRcSha !== BASE || !Array.isArray(r.characters)) return false;
  const ids = new Set<string>(), slugs = new Set<string>();
  return r.characters.every(c => {
    if (!c || !text(c.characterId) || !text(c.slug) || ids.has(c.characterId) || slugs.has(c.slug)
      || c.approved !== true || c.revoked !== false || !text(c.patchId) || !text(c.approvalRef)
      || !text(c.approvedBy) || !text(c.approvedAt) || !Number.isFinite(Date.parse(c.approvedAt))
      || !text(c.checkpointId) || !digestPattern.test(c.checkpointHash ?? "") || !digestPattern.test(c.candidateHash ?? "")
      || !Array.isArray(c.moves) || c.moves.length === 0 || c.expectedCount !== c.moves.length) return false;
    ids.add(c.characterId); slugs.add(c.slug);
    const moveIds = new Set<string>(), moveSlugs = new Set<string>();
    return c.moves.every(m => {
      if (!m || !text(m.id) || !text(m.slug) || moveIds.has(m.id) || moveSlugs.has(m.slug)
        || !digestPattern.test(m.factDigest ?? "") || m.identityConfirmed !== true
        || m.commandEvidence !== "APPROVED_CURRENT" || m.frameEvidence !== "APPROVED_CURRENT" || m.sourceStatus !== "APPROVED_CURRENT") return false;
      moveIds.add(m.id); moveSlugs.add(m.slug); return true;
    });
  });
}
export function getCharacterProductionApproval(characterId: string, slug: string): CharacterApproval | null {
  const value: unknown = registry;
  if (process.env.VERCEL_ENV !== "production" || !validateApprovalRegistry(value)) return null;
  return value.characters.find(c => c.characterId === characterId && c.slug === slug) ?? null;
}
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k,v]) => [k, canonical(v)]));
  return value;
}
/** Exact raw values, selected row IDs and entity relations are bound into the grant. */
export function productionFactDigest(proof: unknown): string {
  return createHash("sha256").update(JSON.stringify(canonical(proof))).digest("hex");
}
export type ProductionMoveProof = { move: DevicePreviewBundle["moves"][number]; characterId: string;
  patchId: string; rawMove: unknown; commands: unknown[]; frames: unknown[]; sources: PublicEntitySourceRow[] };
export function isProductionMoveApproved(grant: CharacterApproval, proof: ProductionMoveProof): boolean {
  if (!validateApprovalRegistry({ schemaVersion: 1, releaseId: "SF6DNA_VER1_0", baseRcSha: BASE, characters: [grant] })) return false;
  const move = proof.move;
  if (grant.characterId !== proof.characterId || grant.patchId !== proof.patchId || move.status !== "published"
    || move.frame?.verificationStatus !== "verified" || proof.frames.length !== 1 || !proof.commands.length) return false;
  const raw = proof.rawMove as { id?: string; character_id?: string; status?: string };
  const frame = proof.frames[0] as { move_id?: string; valid_from_patch_id?: string; valid_to_patch_id?: string | null; verification_status?: string };
  if (raw?.id !== move.id || raw.character_id !== proof.characterId || raw.status !== "published"
    || frame?.move_id !== move.id || frame.valid_from_patch_id !== proof.patchId || frame.valid_to_patch_id !== null
    || frame.verification_status !== "verified") return false;
  const commandIds = new Set<string>();
  for (const row of proof.commands) {
    const command = row as { id?: string; move_id?: string; control_scheme?: string };
    if (!text(command?.id) || commandIds.has(command.id) || command.move_id !== move.id || command.control_scheme !== "classic") return false;
    commandIds.add(command.id);
  }
  const approval = grant.moves.find(m => m.id === move.id && m.slug === move.slug);
  if (!approval) return false;
  const sourceFor = (type: string[], id: string) => proof.sources.some(s => type.includes(s.entityType)
    && s.entityId === id && s.reliabilityLevel === "official" && text(s.sourceId) && text(s.url));
  if (!sourceFor(["move"], move.id)) return false;
  for (const command of proof.commands) {
    if (!command || typeof command !== "object" || !sourceFor(["move_command"], String((command as {id?: unknown}).id ?? ""))) return false;
  }
  const frameId = String((proof.frames[0] as {id?: unknown})?.id ?? "");
  if (!sourceFor(["frame", "move_frame_data"], frameId)) return false;
  return productionFactDigest(proof) === approval.factDigest;
}
