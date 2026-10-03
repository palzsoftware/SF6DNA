import snapshot from "@/data/YASMINE_PREVIEW_MOVE_SNAPSHOT_20261003.json";
import type { DevicePreviewBundle } from "@/lib/device-preview";

/** DB identity fallback, independent of media approval. Preview only; no publication grant. */
export function getYasmineMoveMediaPilot(): DevicePreviewBundle | null {
  if (process.env.VERCEL_ENV !== "preview" || snapshot.characterSlug !== "yasmine") return null;
  return {
    guideSections: [], combos: [], setups: [], sequences: [], matchups: [], training: [],
    moves: snapshot.moves.filter((move) => move.slug.startsWith("yasmine-")).map((move) => {
      const frame = move.frame;
      // Reuse stored verification only when all existing evidence requirements hold.
      // This does not assert a fresh official-table reconciliation on the snapshot date.
      const frameReady = frame?.verificationStatus === "verified"
        && frame.validFromPatchId === snapshot.currentPatchId && frame.validToPatchId === null
        && frame.evidence.length > 0 && move.moveEvidence.length > 0
        && move.commands.some((command) => command.evidence.length > 0);
      return {
        id: move.id, slug: move.slug, name: move.name, moveType: move.moveType,
        usageSummary: null, status: "draft",
        frame: frameReady && frame ? {
          startup: frame.startup, active: frame.active, recovery: frame.recovery,
          onHit: frame.onHit, onBlock: frame.onBlock, damage: frame.damage,
          verificationStatus: frame.verificationStatus,
        } : null,
        commands: move.commands.map(({ moveId, scheme, commandText, numericNotation, buttonNotation, conditionText, sortOrder }) => ({
          moveId, scheme, commandText, numericNotation, buttonNotation, conditionText, sortOrder,
        })),
      };
    }),
  };
}
