import type { DevicePreviewBundle } from "@/lib/device-preview";
import type { CharacterDetailV21Profile } from "@/lib/character-detail-v21";
import type { CharacterDetail, SourceReference } from "@/types/character";
import type { Ws5LocalAdmission } from "@/lib/official-txt-character-page-connection.mjs";
import type { MediaKeyReference } from "@/lib/media-key-registry.mjs";

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
  ["神気の巨巌", "special"],
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
  tagline: "10月13日に配信が開始されたアルジュン。インド出身の元警官です。",
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

const arjunReleaseSource: SourceReference = { id: "arjun-official-update-20261013-index", title: "CAPCOM: 2026年10月13日更新告知（配信開始の検索掲載）",
  url: "https://www.streetfighter.com/6/buckler/ja-jp/information/detail/update20261013", publisher: "CAPCOM", sourceType: "official", relationship: "reference" };
const arjunCurrentNameSource: SourceReference = { id: "arjun-command-name-20261014-index", title: "CAPCOM: アルジュン コマンドリスト（技名の検索掲載）",
  url: "https://www.streetfighter.com/6/ja-jp/character/arjun/movelist", publisher: "CAPCOM", sourceType: "official", relationship: "reference" };

/** Presentation adapter only. Placeholder identities never become DB/public IDs. */
export function preReleaseUnifiedProps(record: typeof arjun & { localCardDraft?: true }) {
  const source: SourceReference = { id: "arjun-announcement-20260908", title: record.source.title,
    url: record.source.url, publisher: "株式会社カプコン", sourceType: record.source.type,
    relationship: "announcement" };
  const character: CharacterDetail = { id: "local-pre-release-arjun", slug: record.slug,
    name: record.name, nameEn: record.nameEn, shortDescription: record.summary, imageUrl: null,
    difficulty: null, rangeLabel: null, archetypeLabel: null, releaseDate: record.releaseDate,
    updatedAt: null, strengthsSummary: null, weaknessesSummary: null, guideSections: [], sources: [source, arjunReleaseSource] };
  return { character, bundle: record.bundle, players: [], videos: [], showPreferences: false,
    moveEvidence: Object.fromEntries(record.bundle.moves.map(move => [move.id, record.localCardDraft ? {
      patch: null, verification: "公式TXT候補（2026-10-23取得）。Patch・Source・表示照合・公開承認待ち", sources: [],
    } : {
      patch: null, verification: move.id === "arjun-official-4"
        ? "公式検索掲載の技名。入力・数値・Patchは確認中" : "公式発表の技名候補。現行コマンド・数値は確認中",
      sources: move.id === "arjun-official-4" ? [arjunCurrentNameSource] : [source],
    }])) };
}

/**
 * Local-development-only Arjun move cards (72 = 62 registration candidates + 10 common system rows),
 * prepared from the official TXT (scripts/build-arjun-intake-candidate.mjs --card-data).
 * They REPLACE the 9 Preview name placeholders (each family is covered), so no duplicate cards appear.
 * Admission is the existing WS5 localhost gate; Vercel Preview/Production keep the 9-move record above.
 * Values stay candidate_only and grant no publication.
 */
export async function getPreReleaseLocalCardCharacter(slug: string, admission: Ws5LocalAdmission) {
  if (slug !== "arjun") return null;
  // Runtime modules load lazily so the Preview/Production code path stays dependency-free.
  const { isWs5LocalCardRequest } = await import("@/lib/official-txt-character-page-connection.mjs");
  if (!isWs5LocalCardRequest(admission)) return null;
  const [{ attachMoveMediaKeys }, { default: draft }, { default: registry }] = await Promise.all([
    import("@/lib/media-key-registry.mjs"),
    import("@/data/SF6DNA_ARJUN_CARD_DRAFT_20261117.json"),
    import("@/data/SF6DNA_WS5_MEDIA_KEY_REGISTRY_20261026.json"),
  ]);
  const { bundle } = attachMoveMediaKeys(draft as unknown as DevicePreviewBundle,
    registry as unknown as MediaKeyReference[], "arjun");
  return { ...arjun, bundle: bundle ?? arjunBundle, localCardDraft: true as const };
}
