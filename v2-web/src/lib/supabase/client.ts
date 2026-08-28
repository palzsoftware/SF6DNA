"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseEnv } from "@/lib/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const { url, anonKey } = getPublicSupabaseEnv();
  browserClient = createBrowserClient(url, anonKey);

  return browserClient;
}
