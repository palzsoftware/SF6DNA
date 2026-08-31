import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getOfficialMovelistUrl(characterName: string): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("sources")
    .select("url")
    .eq("source_type", "official_movelist")
    .eq("reliability_level", "official")
    .eq("title", `${characterName} 公式ムーブリスト`)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[official-links] movelist lookup failed", error.message);
    return null;
  }

  return typeof data?.url === "string" && data.url.trim() ? data.url : null;
}
