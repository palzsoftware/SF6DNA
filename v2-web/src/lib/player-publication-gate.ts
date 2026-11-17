import type { PlayerSummary } from "@/types/player";

export type PlayerPublicationBasis = "LEGACY_PRODUCTION_PUBLIC" | "INDIVIDUAL_APPROVAL";
export type PlayerPublicationRow = {
  environment: "production" | "development";
  playerId: string;
  playerSlug: string;
  basis: PlayerPublicationBasis;
  evidence: string;
};

const DEVELOPMENT_MIRROR_EVIDENCE = "SFL2026_48_PLAYER_AUDIT_20261115: Development UUID+slug equals the Production legacy row";
const LEGACY_EVIDENCE = "docs/release-20260930-publication/PLAYER_PUBLICATION_AUDIT.json (2026-09-30 published, sha256 73d8c321)";

/**
 * Plan A: players already public in Production stay public. The list is an
 * exact UUID+slug snapshot; it never grants visibility by slug or name alone.
 */
export const LEGACY_PRODUCTION_PUBLIC_PLAYERS: readonly PlayerPublicationRow[] = [
  { environment: "production", playerId: "830621f4-38aa-49e3-a320-31621e983fb5", playerSlug: "blaz", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "caeb6733-08e8-43e1-85dd-b275a2f38571", playerSlug: "caba", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "15778fa3-31cb-4567-851f-5d443cd2e0ac", playerSlug: "chris-wong", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "e3cb3bf2-9ec9-4b40-a89a-e33361211cf4", playerSlug: "craime", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "e5afe19f-e311-4e6f-ab33-781e0263efdf", playerSlug: "crossoverrd", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "0a8aacc8-3feb-42c4-88e5-3dd5d3a9efe6", playerSlug: "dogura", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "d3277581-4bd8-41a2-8f95-9eac22b10c53", playerSlug: "endingwalker", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "df248618-ed06-4979-ba86-be2a0b1b3bc6", playerSlug: "enzo-yasmine", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "210a2651-87f7-436f-ae88-fdee5df4868a", playerSlug: "go1", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "d2159f7c-5076-46b8-9b6d-b4bef558f91a", playerSlug: "grustle-grindset", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "670431a1-addb-4c8e-9828-a45652ff976b", playerSlug: "higuchi", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "84c0c16a-4ccc-4928-b284-2e6e22143adc", playerSlug: "hinao", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "766d1c0b-e823-4d1b-8c18-7f34368e34b8", playerSlug: "inaba", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "524ee9aa-4ca0-4b7b-aecb-6aad8d8d4bfe", playerSlug: "jaeger", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "4a081ccd-1f5a-4293-aead-31deb9fadd22", playerSlug: "john-takeuchi", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "626062e4-4300-43ee-a20d-10d4c7672364", playerSlug: "kilzyou", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "2c6c27df-f35f-4b40-b32a-47ff0e36842f", playerSlug: "lexx", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "7d9f9d3d-2206-4ef9-9347-c4bcfcc04a9f", playerSlug: "linknova", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "ce9b7b2f-4b01-406f-be32-e940e59abf5e", playerSlug: "lsecto", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "72f18e74-1239-4d81-9603-3a5e7470a5d8", playerSlug: "lugabo", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "99addbae-9429-4128-9242-b8f2b89365c2", playerSlug: "micky", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "ea83d7db-da1a-4fee-b564-140f607d4950", playerSlug: "mister-crimson", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "e4424bda-9897-4d10-a316-a91a76333e00", playerSlug: "mysticsmash", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "8ac01b6d-0a18-4da4-a154-4d8274957a6c", playerSlug: "naruo", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "f219456a-9a27-4fae-a874-f52b12c9160d", playerSlug: "nemo", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "dca72b60-2ab0-4685-a87e-1b68bbdd17ba", playerSlug: "noahtheprodigy", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "86378b1d-e655-4c6f-808e-0cd8099a5403", playerSlug: "nychrisg", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "7c8377fa-29eb-4015-bf1d-f76a03569725", playerSlug: "psycho", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "97789718-3277-40a1-b3a9-d7955f35f198", playerSlug: "raihan-yasmine", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "66f1e8db-358c-4cd6-9e00-005162fec7eb", playerSlug: "ryusei", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "082e5e11-4622-4df7-9123-969e2812584a", playerSlug: "sako", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "c3690c71-080e-4f90-a9de-0f1b35dc2b21", playerSlug: "shadyimpostor", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "b6c02dab-cd27-4dbd-b184-fda9e79d7d7c", playerSlug: "shine", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "264c841d-6962-449c-9c50-cacf88f91cc0", playerSlug: "shuto", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "2e98c322-7880-4aec-be51-d2bffc7d3836", playerSlug: "tachikawa", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "e6d36527-9b82-4b4d-b4c3-9b3a1a602c4d", playerSlug: "takepi", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "952f2765-bafc-47d0-8be6-af76179a8bfa", playerSlug: "tantanmen", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "24f7c815-946f-49f0-aede-7b8f42fdfebb", playerSlug: "tokido", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "3232647e-9641-41aa-b869-34e25e247d0f", playerSlug: "watyawacha", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "889c6628-2d4e-4379-87bc-c5545cbc6f49", playerSlug: "wawa", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
  { environment: "production", playerId: "f7a3ae8e-8692-467b-9ca3-8d31597774d3", playerSlug: "yamaguchi", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: LEGACY_EVIDENCE },
];

/**
 * Development mirrors of legacy rows, only where the Development UUID+slug was
 * verified to equal Production. Other legacy players stay hidden in Development.
 */
export const LEGACY_DEVELOPMENT_MIRROR_PLAYERS: readonly PlayerPublicationRow[] = [
  { environment: "development", playerId: "0a8aacc8-3feb-42c4-88e5-3dd5d3a9efe6", playerSlug: "dogura", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: DEVELOPMENT_MIRROR_EVIDENCE },
  { environment: "development", playerId: "670431a1-addb-4c8e-9828-a45652ff976b", playerSlug: "higuchi", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: DEVELOPMENT_MIRROR_EVIDENCE },
  { environment: "development", playerId: "84c0c16a-4ccc-4928-b284-2e6e22143adc", playerSlug: "hinao", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: DEVELOPMENT_MIRROR_EVIDENCE },
  { environment: "development", playerId: "4a081ccd-1f5a-4293-aead-31deb9fadd22", playerSlug: "john-takeuchi", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: DEVELOPMENT_MIRROR_EVIDENCE },
  { environment: "development", playerId: "082e5e11-4622-4df7-9123-969e2812584a", playerSlug: "sako", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: DEVELOPMENT_MIRROR_EVIDENCE },
  { environment: "development", playerId: "264c841d-6962-449c-9c50-cacf88f91cc0", playerSlug: "shuto", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: DEVELOPMENT_MIRROR_EVIDENCE },
  { environment: "development", playerId: "e6d36527-9b82-4b4d-b4c3-9b3a1a602c4d", playerSlug: "takepi", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: DEVELOPMENT_MIRROR_EVIDENCE },
  { environment: "development", playerId: "24f7c815-946f-49f0-aede-7b8f42fdfebb", playerSlug: "tokido", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: DEVELOPMENT_MIRROR_EVIDENCE },
  { environment: "development", playerId: "f7a3ae8e-8692-467b-9ca3-8d31597774d3", playerSlug: "yamaguchi", basis: "LEGACY_PRODUCTION_PUBLIC", evidence: DEVELOPMENT_MIRROR_EVIDENCE },
];

/**
 * New SFL2026 / major-tournament Top8 players. Add one row per environment only
 * after an individual publication approval with its reference in `evidence`.
 */
export const INDIVIDUALLY_APPROVED_PLAYERS: readonly PlayerPublicationRow[] = [];

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PROJECT_ENVIRONMENTS: Readonly<Record<string, PlayerPublicationRow["environment"]>> = {
  wnuxaxbrpudyypzdbdho: "production",
  vvsknbmlfvvnrmgtyhbf: "development",
};

/** Exact https://<known-ref>.supabase.co only; anything else is unknown and shows no player. */
export function playerPublicationEnvironment(supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL): PlayerPublicationRow["environment"] | null {
  if (!supabaseUrl) return null;
  try {
    const url = new URL(supabaseUrl);
    if (url.protocol !== "https:" || url.port || url.username || url.password || url.search || url.hash || url.pathname !== "/") return null;
    const match = /^([a-z0-9]{20})\.supabase\.co$/.exec(url.hostname);
    return match ? PROJECT_ENVIRONMENTS[match[1]] ?? null : null;
  } catch { return null; }
}

const ALL_ROWS: readonly PlayerPublicationRow[] = [
  ...LEGACY_PRODUCTION_PUBLIC_PLAYERS, ...LEGACY_DEVELOPMENT_MIRROR_PLAYERS, ...INDIVIDUALLY_APPROVED_PLAYERS,
];

/** Rows of one environment only; approvals never cross environments. */
export function publicPlayerIdentityKeys(
  environment: PlayerPublicationRow["environment"] | null = playerPublicationEnvironment(),
  rows: readonly PlayerPublicationRow[] = ALL_ROWS,
): ReadonlySet<string> {
  if (!environment) return new Set();
  return new Set(rows.filter(row => row.environment === environment && uuid.test(row.playerId) && row.playerSlug.trim() && row.evidence.trim())
    .map(row => `${row.playerId}:${row.playerSlug}`));
}

/** Exact UUID+slug match only. DB status=published is still required by the caller's query. */
export function isPublicPlayerIdentity(id: unknown, slug: unknown, keys: ReadonlySet<string> = publicPlayerIdentityKeys()): boolean {
  return typeof id === "string" && typeof slug === "string" && keys.has(`${id}:${slug}`);
}

/** Input must already be limited to status=published rows. */
export function gatePublicPlayers<T extends Pick<PlayerSummary, "id" | "slug">>(publishedItems: readonly T[], keys: ReadonlySet<string> = publicPlayerIdentityKeys()): T[] {
  return publishedItems.filter(item => item != null && isPublicPlayerIdentity(item.id, item.slug, keys));
}

export function gatePublicPlayer<T extends Pick<PlayerSummary, "id" | "slug">>(publishedPlayer: T | null, keys: ReadonlySet<string> = publicPlayerIdentityKeys()): T | null {
  return publishedPlayer && isPublicPlayerIdentity(publishedPlayer.id, publishedPlayer.slug, keys) ? publishedPlayer : null;
}
