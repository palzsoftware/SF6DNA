import candidates from "@/data/arjun-77-local-candidates.json";
import type { DevicePreviewBundle } from "@/lib/device-preview";
import type { ArjunIntake } from "@/lib/arjun-official-intake";
import { validateArjunIntake, arjunIntakeToDraftBundle } from "@/lib/arjun-official-intake";

type SourceRow = (typeof candidates.moves)[number];
// These source values are shown ONLY behind the local-only route. No official approval is implied.
export const ARJUN_SOURCE_FRAME_KEYS = ["startup", "active", "recovery", "onHit", "onBlock", "damage"] as const;
const JAPANESE_BUTTONS: Record<string,string> = { LP: "弱P", LK: "弱K", MP: "中P", MK: "中K", HP: "強P", HK: "強K", AUTO: "アシスト", SP: "必殺技", DI: "ドライブインパクト", DP: "ドライブパリィ" };
/** UI-only translation. Source raw command strings remain untouched in the JSON. */
export function arjunJapaneseInput(raw: string | null | undefined) {
  if (!raw?.trim()) return "原文に記載なし";
  return raw.replace(/LP|LK|MP|MK|HP|HK|AUTO|SP|DI|DP/g, token => JAPANESE_BUTTONS[token] ?? token)
    .replace(/([PK])(?=[弱中強][PK])/g,"$1＋")
    .replace(/\s*\|\s*/g, " または ")
    .replace(/\s*\+\s*/g, "＋")
    .replace(/\s*>\s*/g, " → ");
}
/** Keep OD as OD and localise any button abbreviations inside move titles. */
export function arjunJapaneseMoveName(name: string) { return arjunJapaneseInput(name); }

const sourceKindToIntake = (value: string): "normal" | "unique" | "special" | "throw" | "super" => {
  if (value === "NORMAL" || value === "AIR") return "normal";
  if (value === "SUPER") return "super";
  if (value === "SPECIAL") return "special";
  // Control/system actions are held under the intake's closest existing category,
  // with sourceType preserved and never treated as a verified game taxonomy.
  return "unique";
};
function pending(value: string | number | null) {
  return { value, status: "UNCONFIRMED" as const, evidence: [], reviewedBy: null, reviewedAt: null };
}
/** The existing intake contract is explicitly unreviewed: it cannot publish these rows. */
export function getArjun77UnverifiedIntake(): ArjunIntake {
  return {
    schema: "sf6dna/arjun-official-intake/1", characterSlug: "arjun",
    patch: { label: null, verified: false }, captures: [], coverage: [],
    moves: candidates.moves.map((row) => ({
      localKey: row.id, canonicalMoveId: null, canonicalIdentityVerified: false,
      category: sourceKindToIntake(row.sourceType), variantKey: row.sourceWebId,
      parentLocalKey: null,
      name: pending(row.name), classic: pending(row.classicRaw), modern: pending(row.modernRaw),
      classicCondition: pending(null), modernCondition: pending(null),
      startup: pending(row.sourceFrames.startup_frame), active: pending(row.sourceFrames.active_frame),
      recovery: pending(row.sourceFrames.recovery_frame), onHit: pending(row.sourceFrames.hit_frame),
      onBlock: pending(row.sourceFrames.block_frame), damage: pending(row.sourceFrames.damage), notes: pending(null),
    })),
  };
}

export function getArjun77LocalMoveCards(): DevicePreviewBundle["moves"] {
  const intake = getArjun77UnverifiedIntake();
  const validation = validateArjunIntake(intake);
  if (validation.errors.length) throw new Error(`Arjun intake invalid: ${validation.errors.join(",")}`);
  // The strict intake projection intentionally accepts zero unverified rows.
  // These 77 *separate* display-only references never become an approved bundle.
  if (arjunIntakeToDraftBundle(intake).moves.length !== 0) {
    throw new Error("Unverified source unexpectedly entered official draft projection");
  }
  if (candidates.count !== 77 || candidates.moves.length !== 77 ||
      candidates.officialCaptureVerified !== false || candidates.currentPatchVerified !== false ||
      candidates.canonicalIdentitiesVerified !== false) throw new Error("Arjun research guard failed");
  const ids = new Set<string>();
  return candidates.moves.map((row: SourceRow) => {
    if (ids.has(row.id) || row.canonicalMoveUuid !== null || row.media !== null || row.patchVerified !== false || row.publicationStatus !== "LOCAL_RESEARCH_ONLY") {
      throw new Error(`Unsafe Arjun row: ${row.sourceWebId}`);
    }
    ids.add(row.id);
    const commands = (["classic", "modern"] as const).flatMap((scheme, sortOrder) => {
      const raw = scheme === "classic" ? row.classicRaw : row.modernRaw;
      return raw && raw.trim() ? [{moveId: row.id, scheme, commandText: arjunJapaneseInput(raw),
        numericNotation: null, buttonNotation: null, sortOrder, conditionText: null}] : [];
    });
    return {
      id: row.id, slug: row.id, name: arjunJapaneseMoveName(row.name), moveType: row.category,
      usageSummary: null, status: "draft", commands, media: null,
      frame: {
        startup: row.sourceFrames.startup_frame?.trim() || null,
        active: row.sourceFrames.active_frame?.trim() || null,
        recovery: row.sourceFrames.recovery_frame?.trim() || null,
        onHit: row.sourceFrames.hit_frame?.trim() || null,
        onBlock: row.sourceFrames.block_frame?.trim() || null,
        damage: row.sourceFrames.damage?.trim() || null,
        verificationStatus: null,
      },
      // Deliberately NO CURRENT_OFFICIAL_SNAPSHOT_ACCEPTED marker: local reference, not verified.
      frameFieldStatus: {},
    };
  });
}

export function getArjun77SourceRows() { return candidates.moves; }
