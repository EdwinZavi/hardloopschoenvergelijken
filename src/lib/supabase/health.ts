import { getSupabaseConfigStatus } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function getSupabaseHealth() {
  const config = getSupabaseConfigStatus();

  if (!config.isConfigured) {
    return {
      configured: false,
      reachable: false,
      missing: config.missing
    };
  }

  try {
    const supabase = await createClient();
    const [brandsResult, shoesResult, offersResult] = await Promise.all([
      supabase.from("brands").select("id", { count: "exact", head: true }),
      supabase.from("shoes").select("id", { count: "exact", head: true }),
      supabase.from("offers").select("id", { count: "exact", head: true })
    ]);
    const error = brandsResult.error ?? shoesResult.error ?? offersResult.error;

    return {
      configured: true,
      reachable: !error,
      tables: {
        brands: brandsResult.count ?? 0,
        shoes: shoesResult.count ?? 0,
        offers: offersResult.count ?? 0
      },
      error: error?.message ?? null
    };
  } catch (error) {
    return {
      configured: true,
      reachable: false,
      tables: null,
      error: error instanceof Error ? error.message : "Onbekende Supabase-fout"
    };
  }
}
