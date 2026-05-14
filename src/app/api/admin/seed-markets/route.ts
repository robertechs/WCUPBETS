import { NextResponse } from "next/server";
import { assertAdminToken } from "@/lib/cron-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { buildMarketSeedRows } from "@/lib/markets-seed";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertAdminToken(request);
    const supabase = getSupabaseAdmin();
    const rows = buildMarketSeedRows();

    const { error } = await supabase.from("markets").upsert(rows, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true, count: rows.length });
  } catch (e) {
    const status = (e as Error & { status?: number }).status ?? 500;
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status });
  }
}
