import type { DevicePreviewBundle } from "@/lib/device-preview";
import type { CharacterDetailV21Profile } from "@/lib/character-detail-v21";

// This content is deliberately separate from the published Character registry.
// It can only be loaded by the preview-only server route.
const arjunSource = {
  title: "CAPCOM: アルジュン ゲームプレイ映像公開",
  url: "https://prtimes.jp/main/html/rd/p/000006019.000013450.html",
  type: "official_press_release",
  retrievedAt: "2026-09-29",
};

const officialMoves = [
  ["大義の巨腕", "special"],
  ["厳酷な岩肩", "special"],
  ["息吹の円筒", "special"],
  ["神気の巨厳", "special"],
  ["鬼気迫る尋問", "special"],
  ["不撓の警衛", "special"],
  ["破壊の蛮声", "super"],
  ["忘却の一鎚", "super"],
  ["秩序の鬼神", "super"],
] as const;

const arjunBundle: DevicePreviewBundle = {
  guideSections: [],
  moves: officialMoves.map(([name, moveType], index) => ({
    id: `arjun-official-${index + 1}`,
    slug: `arjun-official-${index + 1}`,
    name,
    moveType,
    usageSummary: null,
    status: "draft",
    frame: null,
    commands: [],
  })),
  combos: [], setups: [], sequences: [], matchups: [], training: [],
};

const arjunProfile: CharacterDetailV21Profile = {
  tagline: "10月13日参戦予定のアルジュン。インド出身の元警官です。",
  winPath: "",
  firstLesson: "",
  strength: "",
  weakness: "",
  gameplan: [],
  ranges: [],
};

const arjun = {
  slug: "arjun",
  name: "アルジュン",
  nameEn: "Arjun",
  summary: "インド出身の元警官。ヨガの呼吸法を使うファイターです。",
  releaseDate: "2026-10-13",
  profile: arjunProfile,
  bundle: arjunBundle,
  source: arjunSource,
};

export function getPreReleaseCharacter(slug: string) {
  if (process.env.VERCEL_ENV !== "preview") return null;
  return slug === "arjun" ? arjun : null;
}
