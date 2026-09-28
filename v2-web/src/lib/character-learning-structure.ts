import type { DevicePreviewBundle } from "@/lib/device-preview";
import type { VideoSummary } from "@/lib/event-media";

export const COMBO_FACET_LABELS = {
  light_start: "弱攻撃始動",
  no_drive: "ノーゲージ",
  drive_spend: "Dゲージ消費",
  cancel_drive_rush: "キャンセルドライブラッシュ",
  center: "画面中央",
  corner: "画面端",
  counter_hit: "カウンターヒット限定",
  punish_counter: "パニッシュカウンター限定",
  di_hit: "DIヒット時",
  di_wall_splat: "DI壁貼り付け時",
  di_stun: "DIスタン時",
  sa1_finish: "SA1締め",
  sa2_finish: "SA2締め",
  sa3_ca_finish: "SA3 / CA締め",
  character_limited: "キャラ限定",
  large_body_limited: "デカキャラ限定",
  hurtbox_limited: "身長・当たり判定限定",
} as const;

export type ComboFacet = keyof typeof COMBO_FACET_LABELS;

// Only structured, explicit fields can add facets. Names, recipes, and prose
// are not evidence of starter, DI, SA finish, or character restrictions.
export function classifyComboFacets(
  combo: Pick<DevicePreviewBundle["combos"][number], "position" | "driveCost" | "verificationStatus">,
): ComboFacet[] {
  if (combo.verificationStatus !== "verified") return [];
  const facets: ComboFacet[] = [];
  if (combo.driveCost === 0) facets.push("no_drive");
  else if (typeof combo.driveCost === "number" && combo.driveCost > 0) facets.push("drive_spend");

  for (const position of (combo.position ?? "").split(/\s*[/／、]\s*/)) {
    if (position === "中央" || position === "画面中央") facets.push("center");
    if (position === "画面端") facets.push("corner");
  }
  return [...new Set(facets)];
}

export type CharacterVideoGroup = "guide" | "beginner" | "counter" | "match" | "unclassified";

export const CHARACTER_VIDEO_GROUP_LABELS: Record<CharacterVideoGroup, string> = {
  guide: "キャラ解説",
  beginner: "初心者向け",
  counter: "キャラ対策",
  match: "対戦動画",
  unclassified: "その他の関連動画",
};

export const CHARACTER_VIDEO_GROUP_ORDER: CharacterVideoGroup[] = [
  "guide", "beginner", "counter", "match", "unclassified",
];

// A title or description never upgrades an unknown video to a category.
export function classifyCharacterVideo(
  video: Pick<VideoSummary, "videoType" | "level">,
): CharacterVideoGroup {
  const type = video.videoType?.toLowerCase();
  if (type === "counter") return "counter";
  if (type === "match" || type === "tournament") return "match";
  if (video.level === "beginner") return "beginner";
  if (type === "guide" || type === "official_guide") return "guide";
  return "unclassified";
}
