import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { normalizePrimaryIssue, type PrimaryIssue } from "@/lib/daily-training";
import { accountScope } from "@/lib/diagnosis-storage-scope";
import type { PersonalOwner } from "@/lib/personalization-storage";

export type DailyTrainingContext = {
  primaryIssue: PrimaryIssue | null;
  state: "guest" | "match" | "empty" | "unavailable";
  // Legacy or explicit-link contexts may lack ownership. The client must not
  // consume their primaryIssue without a verified current-owner match.
  owner?: PersonalOwner | null;
};

export async function loadDailyTrainingContext(): Promise<DailyTrainingContext> {
  let owner: PersonalOwner | null = null;
  try {
    const supabase = await getSupabaseAuthServerClient();
    const { data, error: authError } = await supabase.auth.getUser();
    if (authError) {
      const guest = authError.name === "AuthSessionMissingError";
      return { primaryIssue: null, state: guest ? "guest" : "unavailable", owner: guest ? "guest" : null };
    }
    if (!data.user) return { primaryIssue: null, state: "guest", owner: "guest" };
    owner = accountScope(data.user.id);
    if (!owner) return { primaryIssue: null, state: "unavailable", owner: null };

    const { data: row, error } = await supabase
      .from("user_match_logs")
      .select("primary_issue, played_at")
      .eq("user_id", data.user.id)
      .order("played_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return { primaryIssue: null, state: "unavailable", owner };
    const primaryIssue = normalizePrimaryIssue(row?.primary_issue);
    return { primaryIssue, state: primaryIssue ? "match" : "empty", owner };
  } catch {
    // An already verified owner can use the existing unavailable fallback.
    // Unknown authentication never masquerades as a Guest context.
    return { primaryIssue: null, state: "unavailable", owner };
  }
}
