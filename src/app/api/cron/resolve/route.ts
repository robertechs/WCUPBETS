import { NextResponse } from "next/server";
import { assertCronSecret } from "@/lib/cron-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { fetchFdvForSymbol, computeOutcome } from "@/lib/market-resolution";

export async function POST(request: Request) {
  try {
    assertCronSecret(request);
    const supabase = getSupabaseAdmin();
    const now = Date.now();

    const { data: markets, error } = await supabase
      .from("markets")
      .select("*")
      .is("outcome", null)
      .lt("deadline_ms", now);

    if (error) throw error;

    let resolved = 0;
    for (const m of markets ?? []) {
      const fdvA = await fetchFdvForSymbol(m.token_a_symbol as string);
      let fdvB: number | null = null;
      if (m.token_b_symbol) {
        fdvB = await fetchFdvForSymbol(m.token_b_symbol as string);
      }
      const target = m.target_mc_usd != null ? Number(m.target_mc_usd) : null;
      const outcome = computeOutcome(
        m.resolution_rule as string,
        target,
        fdvA,
        fdvB,
      );

      const { error: uErr } = await supabase
        .from("markets")
        .update({
          outcome,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", m.id);
      if (uErr) throw uErr;
      resolved += 1;
    }

    return NextResponse.json({ ok: true, resolved });
  } catch (e) {
    const status = (e as Error & { status?: number }).status ?? 500;
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status });
  }
}
