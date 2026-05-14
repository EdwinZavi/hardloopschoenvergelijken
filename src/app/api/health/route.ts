import { NextResponse } from "next/server";
import { getCatalogCounts } from "@/lib/catalog/repository";
import { getSupabaseHealth } from "@/lib/supabase/health";

export async function GET() {
  const [supabase, catalogCounts] = await Promise.all([getSupabaseHealth(), getCatalogCounts()]);

  return NextResponse.json({
    ok: true,
    service: "loopwijzer",
    supabase,
    catalogSource: catalogCounts.source,
    fallbackReason: catalogCounts.fallbackReason ?? null,
    counts: catalogCounts.data,
    generatedAt: new Date().toISOString()
  });
}
