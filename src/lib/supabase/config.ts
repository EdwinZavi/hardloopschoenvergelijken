export type SupabaseConfigStatus = {
  isConfigured: boolean;
  missing: string[];
};

const REQUIRED_PUBLIC_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
] as const;

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const missing = REQUIRED_PUBLIC_ENV.filter((key) => !process.env[key]);

  return {
    isConfigured: missing.length === 0,
    missing
  };
}

export function getSupabaseEnv() {
  const status = getSupabaseConfigStatus();

  if (!status.isConfigured) {
    throw new Error(`Supabase is niet geconfigureerd. Ontbrekend: ${status.missing.join(", ")}`);
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  };
}

export function getSupabaseServiceRoleEnv() {
  const { url } = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY ontbreekt. Admin staging gebruikt JSON fallback.");
  }

  return {
    url,
    serviceRoleKey
  };
}
