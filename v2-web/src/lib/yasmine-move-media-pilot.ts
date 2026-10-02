import manifest from "@/data/SF6DNA_VER1_YASMINE_MEDIA_MANIFEST_20261003.json";
import type { DevicePreviewBundle } from "@/lib/device-preview";

/** Reviewed capture identities only. This is not a public Move grant or frame verification. */
export function getYasmineMoveMediaPilot(): DevicePreviewBundle | null {
  if (process.env.VERCEL_ENV !== "preview" || manifest.character_slug !== "yasmine") return null;
  return {
    guideSections: [], combos: [], setups: [], sequences: [], matchups: [], training: [],
    moves: manifest.clips.filter((clip) => clip.verification_status === "approved_for_preview" && clip.move_slug.startsWith("yasmine-")).map((clip) => ({
      id: clip.move_id, slug: clip.move_slug, name: clip.move_name,
      moveType: clip.db_move_type, usageSummary: null, status: "draft", frame: null,
      commands: clip.command_snapshot ? [{
        moveId: clip.move_id, scheme: "classic", commandText: clip.command_snapshot,
        numericNotation: null, buttonNotation: null, conditionText: null, sortOrder: 0,
      }] : [],
    })),
  };
}
