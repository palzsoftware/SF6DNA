function requirePublicEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export function getPublicSupabaseEnv() {
  return {
    url: requirePublicEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: requirePublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getBackendUrl() {
  return process.env.SF6DNA_BACKEND_URL || "https://sf6dna-backend.onrender.com";
}
