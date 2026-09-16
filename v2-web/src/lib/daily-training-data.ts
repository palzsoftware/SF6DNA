import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { normalizePrimaryIssue, type PrimaryIssue } from "@/lib/daily-training";

export type DailyTrainingContext = {
  primaryIssue: PrimaryIssue | null;
  state: "guest" | "match" | "empty" | "unavailable";
};

export async function loadDailyTrainingContext(): Promise<DailyTrainingContext> {
  try {
    const supabase = await getSupabaseAuthServerClient();
    const { data, error: authError } = await supabase.auth.getUser();
    if (authError) {
      return { primaryIssue: null, state: authError.name === "AuthSessionMissingError" ? "guest" : "unavailable" };
    }
    if (!data.user) return { primaryIssue: null, state: "guest" };

    const { data: row, error } = await supabase
      .from("user_match_logs")
      .select("primary_issue, played_at")
      .eq("user_id", data.user.id)
      .order("played_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return { primaryIssue: null, state: "unavailable" };
    const primaryIssue = normalizePrimaryIssue(row?.primary_issue);
    return { primaryIssue, state: primaryIssue ? "match" : "empty" };
  } catch {
    // Environment, auth and query failures must not prevent the basic 15-minute plan.
    return { primaryIssue: null, state: "unavailable" };
  }
}
