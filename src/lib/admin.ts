import { redirect } from "next/navigation";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export async function requireAdmin() {
  const supabase = await getSupabaseAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth?next=/admin");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error || profile?.role !== "admin") redirect("/admin");

  return { supabase, user, profile };
}
