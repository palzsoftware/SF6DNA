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

export function appendDevicePreviewToken(href: string, previewToken: string | null | undefined) {
  if (!previewToken) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}preview=${encodeURIComponent(previewToken)}`;
}
