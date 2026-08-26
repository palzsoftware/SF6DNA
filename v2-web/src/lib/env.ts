function requireValue(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export function getPublicSupabaseEnv() {
  return {
    url: requireValue(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: requireValue(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ),
  };
}

export function getBackendUrl() {
  return process.env.SF6DNA_BACKEND_URL || "https://sf6dna-backend.onrender.com";
}
