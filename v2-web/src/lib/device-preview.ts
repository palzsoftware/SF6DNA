import { getSupabaseServerClient } from "@/lib/supabase/server";

export type DevicePreviewBundle = {
  guideSections: Array<{
    id: string;
    sectionType: string;
    title: string;
    body: string;
    summary: string | null;
    displayOrder: number | null;
    status: string;
    verificationStatus: string | null;
  }>;
  moves: Array<{
    id: string;
    slug: string;
    name: string;
    moveType: string | null;
    usageSummary: string | null;
    status: string;
    frame: {
      startup: string | null;
      onBlock: string | null;
      damage: number | null;
      verificationStatus: string | null;
    } | null;
  }>;
  combos: Array<{
    id: string;
    slug: string;
    name: string;
    purpose: string | null;
    damage: number | null;
    driveCost: number | null;
    saCost: number | null;
    difficulty: string | null;
    status: string;
    verificationStatus: string | null;
  }>;
  setups: Array<{
    id: string;
    slug: string;
    name: string;
    setupType: string | null;
    description: string | null;
    frameAdvantage: string | null;
    position: string | null;
    status: string;
    verificationStatus: string | null;
  }>;
  sequences: Array<{
    id: string;
    slug: string;
    name: string;
    sequenceType: string | null;
    sequenceText: string | null;
    notes: string | null;
    status: string;
    verificationStatus: string | null;
  }>;
  matchups: Array<{
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    counterType: string | null;
    difficulty: string | null;
    defenderCharacterId: string | null;
    opponentCharacterId: string | null;
    status: string;
    verificationStatus: string | null;
  }>;
  training: Array<{
    id: string;
    slug: string;
    name: string;
    purpose: string | null;
    trainingType: string | null;
    level: string | null;
    durationMinutes: number | null;
    playerCharacterId: string | null;
    dummyCharacterId: string | null;
    status: string;
    verificationStatus: string | null;
  }>;
};

export type DevicePreviewMoveCommand = {
  moveId: string;
  scheme: string;
  commandText: string | null;
  numericNotation: string | null;
  buttonNotation: string | null;
  conditionText: string | null;
  sortOrder: number | null;
};

export type DevicePreviewMoveMotionMedia = {
  id: string;
  moveId: string;
  mediaType: "gif" | "video";
  mediaUrl: string;
  posterUrl: string | null;
  sourceUrl: string | null;
  sourceLabel: string | null;
  status: string;
  displayOrder: number | null;
};

export type DevicePreviewContentType = "combo" | "setup" | "sequence" | "counter" | "training";

export type DevicePreviewContentDetail = {
  entityType: DevicePreviewContentType;
  record: Record<string, unknown>;
  characterName: string | null;
  opponentCharacterName?: string | null;
  dummyCharacterName?: string | null;
  patchLabel: string | null;
  moveGlossary?: Array<{
    english: string;
    japanese: string;
  }>;
  sources: Array<{
    id: string;
    title: string;
    url: string;
    publisher: string | null;
    sourceType: string;
    relationship: string;
  }>;
};

export type DevicePreviewMoveGlossaryEntry = {
  english: string;
  japanese: string;
};

export function normalizeDevicePreviewToken(value: string | string[] | undefined): string | null {
  const token = Array.isArray(value) ? value[0] : value;
  if (!token || token.length < 20 || token.length > 200) return null;
  return token;
}

export function isDevicePreviewRequest(previewToken: string | null | undefined): previewToken is string {
  return process.env.VERCEL_ENV === "preview" && Boolean(previewToken);
}

export async function getDevicePreviewBundle(
  characterId: string,
  previewToken: string | null | undefined
): Promise<DevicePreviewBundle | null> {
  if (!isDevicePreviewRequest(previewToken)) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_phase23_character_preview", {
    target_character_id: characterId,
    preview_token: previewToken,
  });

  if (error) {
    console.error("[device-preview] character preview failed", error.message);
    return null;
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  return data as unknown as DevicePreviewBundle;
}

export async function getDevicePreviewCharacterMoveGlossary(
  characterId: string | null | undefined,
  previewToken: string | null | undefined
): Promise<DevicePreviewMoveGlossaryEntry[]> {
  if (!characterId || !isDevicePreviewRequest(previewToken)) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_phase43_character_move_glossary_preview", {
    target_character_id: characterId,
    preview_token: previewToken,
  });

  if (error) {
    console.error("[device-preview] character move glossary failed", error.message);
    return [];
  }

  if (!Array.isArray(data)) return [];
  return data as unknown as DevicePreviewMoveGlossaryEntry[];
}

export async function getDevicePreviewMoveCommands(
  characterId: string,
  previewToken: string | null | undefined
): Promise<DevicePreviewMoveCommand[]> {
  if (!isDevicePreviewRequest(previewToken)) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_phase23_move_commands_preview", {
    target_character_id: characterId,
    preview_token: previewToken,
  });

  if (error) {
    console.error("[device-preview] move command preview failed", error.message);
    return [];
  }

  if (!Array.isArray(data)) return [];
  return data as unknown as DevicePreviewMoveCommand[];
}

export async function getDevicePreviewMoveMotionMedia(
  characterId: string,
  previewToken: string | null | undefined
): Promise<DevicePreviewMoveMotionMedia[]> {
  if (!isDevicePreviewRequest(previewToken)) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_phase23_move_motion_media_preview", {
    target_character_id: characterId,
    preview_token: previewToken,
  });

  if (error) {
    console.error("[device-preview] move motion media preview failed", error.message);
    return [];
  }

  if (!Array.isArray(data)) return [];
  return data as unknown as DevicePreviewMoveMotionMedia[];
}

export async function getDevicePreviewContentDetail(
  entityType: DevicePreviewContentType,
  slug: string,
  previewToken: string | null | undefined
): Promise<DevicePreviewContentDetail | null> {
  if (!isDevicePreviewRequest(previewToken)) return null;

  const supabase = getSupabaseServerClient();
  if (entityType === "counter") {
    const { data, error } = await supabase.rpc("get_phase42_counter_detail_preview", {
      target_counter_slug: slug,
      preview_token: previewToken,
    });
    if (error) {
      console.error("[device-preview] counter detail preview failed", error.message);
      return null;
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    const detail = data as unknown as Partial<DevicePreviewContentDetail>;
    if (detail.entityType !== "counter" || !detail.record || Array.isArray(detail.record)) return null;
    return detail as DevicePreviewContentDetail;
  }

  const [detailResult, glossaryResult] = await Promise.all([
    supabase.rpc("get_phase39_content_detail_preview", {
      target_entity_type: entityType,
      target_entity_slug: slug,
      preview_token: previewToken,
    }),
    entityType === "combo" || entityType === "setup" || entityType === "sequence"
      ? supabase.rpc("get_phase41_strategy_move_glossary_preview", {
          target_entity_type: entityType,
          target_entity_slug: slug,
          preview_token: previewToken,
        })
      : Promise.resolve({ data: null, error: null }),
  ]);

  const { data, error } = detailResult;

  if (error) {
    console.error("[device-preview] content detail preview failed", error.message);
    return null;
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const detail = data as unknown as Partial<DevicePreviewContentDetail>;
  if (detail.entityType !== entityType || !detail.record || Array.isArray(detail.record)) return null;
  if (!glossaryResult.error && Array.isArray(glossaryResult.data)) {
    detail.moveGlossary = glossaryResult.data as unknown as DevicePreviewContentDetail["moveGlossary"];
  }
  return detail as DevicePreviewContentDetail;
}

export function appendDevicePreviewToken(href: string, previewToken: string | null | undefined) {
  if (!previewToken) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}preview=${encodeURIComponent(previewToken)}`;
}
