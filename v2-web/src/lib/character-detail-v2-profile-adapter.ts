import type { CharacterDetail } from "@/types/character";
import type { CharacterDetailV21Profile } from "@/lib/character-detail-v21";

export type CharacterDetailV2Readiness =
  | "READY"
  | "PARTIAL"
  | "SOURCE_REQUIRED"
  | "GAME_VERIFICATION_REQUIRED"
  | "BLOCKED";

export type CharacterDetailV2ProfileShell = {
  slug: string;
  characterName: string;
  heroTitle: string | null;
  preferredRange: string | null;
  archetype: string | null;
  difficulty: number | null;
  strength: string | null;
  weakness: string | null;
  firstTraining: string | null;
};

export type CharacterDetailV2ProfileAdapterResult = {
  readiness: CharacterDetailV2Readiness;
  canRenderV2: boolean;
  shell: CharacterDetailV2ProfileShell;
  dedicatedProfile: CharacterDetailV21Profile | null;
  profile: CharacterDetailV21Profile | null;
  missingFields: string[];
  reason: string;
};

const requiredShellFields = [
  "heroTitle",
  "preferredRange",
  "archetype",
  "difficulty",
  "strength",
  "weakness",
] as const;

/**
 * Maps only existing, published Character fields into a V2 shell.
 * It deliberately does not invent first training, gameplan, range actions,
 * commands, frame data, combos, setups, or matchup claims.
 */
export function adaptCharacterDetailV2Profile({
  character,
  dedicatedProfile = null,
}: {
  character: CharacterDetail;
  dedicatedProfile?: CharacterDetailV21Profile | null;
}): CharacterDetailV2ProfileAdapterResult {
  const shell: CharacterDetailV2ProfileShell = {
    slug: character.slug,
    characterName: character.name,
    heroTitle: character.shortDescription,
    preferredRange: character.rangeLabel,
    archetype: character.archetypeLabel,
    difficulty: character.difficulty,
    strength: character.strengthsSummary,
    weakness: character.weaknessesSummary,
    firstTraining: dedicatedProfile?.firstLesson ?? null,
  };

  const missingFields = requiredShellFields.filter((field) => {
    const value = shell[field];
    return value === null || value === "";
  });

  if (dedicatedProfile) {
    return {
      readiness: "READY",
      canRenderV2: true,
      shell,
      dedicatedProfile,
      profile: dedicatedProfile,
      missingFields,
      reason: "Source-reviewed dedicated V2 profile is available.",
    };
  }

  if (!shell.heroTitle) {
    return {
      readiness: "BLOCKED",
      canRenderV2: false,
      shell,
      dedicatedProfile: null,
      profile: null,
      missingFields,
      reason: "Character overview copy is unavailable; do not expose an empty Hero.",
    };
  }

  if (missingFields.length) {
    return {
      readiness: "PARTIAL",
      canRenderV2: false,
      shell,
      dedicatedProfile: null,
      profile: null,
      missingFields,
      reason: "Existing public Character fields are incomplete.",
    };
  }

  return {
    readiness: "SOURCE_REQUIRED",
    canRenderV2: true,
    shell,
    dedicatedProfile: null,
    profile: {
      tagline: shell.heroTitle as string,
      winPath: "基本情報を確認できます。技・コンボ・セットプレイは、内容を確認できた項目だけ掲載します。",
      firstLesson: "最初の練習メニューは未掲載です。",
      strength: shell.strength as string,
      weakness: shell.weakness as string,
      gameplan: [],
      ranges: [],
    },
    missingFields: ["firstTraining", "gameplan", "rangeActions"],
    reason: "The safe overview shell can render; unreviewed gameplay guidance remains withheld.",
  };
}
