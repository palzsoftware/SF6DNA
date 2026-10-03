import snapshot from "@/data/YASMINE_OFFICIAL_CAPTURE_PREVIEW_20261003.json";
import type { DevicePreviewBundle } from "@/lib/device-preview";

/** User-supplied official capture, reviewed only. No current-patch or publication grant. */
export function getYasmineMoveMediaPilot(): DevicePreviewBundle | null {
  if (process.env.VERCEL_ENV !== "preview" || snapshot.characterSlug !== "yasmine") return null;
  return {
    guideSections: [], combos: [], setups: [], sequences: [], matchups: [], training: [],
    moves: snapshot.moves.filter((move) => move.slug.startsWith("yasmine-")).map((move) => {
      const frame = move.frame;
      const frameReady = snapshot.publication === "PREVIEW_ONLY"
        && move.identityStatus === "READABLE_OFFICIAL_CAPTURE"
        && frame?.verificationStatus === "reviewed"
        && frame.sourceFile === move.sourceFile
        && frame.patchStatus === snapshot.patchStatus;
      return {
        id: move.id, slug: move.slug, name: move.name, moveType: move.moveType,
        usageSummary: null, status: "draft",
        frame: frameReady && frame ? {
          startup: frame.startup, active: frame.active, recovery: frame.recovery,
          onHit: frame.onHit, onBlock: frame.onBlock, damage: frame.damage,
          verificationStatus: "reviewed",
        } : null,
        commands: move.commands.map(({ moveId, scheme, commandText, numericNotation, buttonNotation, conditionText, sortOrder }) => ({
          moveId, scheme, commandText, numericNotation, buttonNotation, conditionText, sortOrder,
        })),
      };
    }),
  };
}
