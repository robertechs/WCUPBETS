import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch {
      return NextResponse.json({
        yesPool: 0,
        noPool: 0,
        isResolved: false,
        outcome: null,
      });
    }

    const { data: rows, error } = await supabase
      .from("bets")
      .select("side, amount_lamports")
      .eq("market_id", id)
      .in("status", ["confirmed", "paid"]);

    if (error) throw error;

    let yesLamports = BigInt(0);
    let noLamports = BigInt(0);
    for (const r of rows ?? []) {
      const amt = BigInt(r.amount_lamports as string | number);
      if (r.side === "YES") yesLamports += amt;
      else noLamports += amt;
    }

    const LAMPORTS_PER_SOL = BigInt(1_000_000_000);
    const yesPool = Number(yesLamports) / Number(LAMPORTS_PER_SOL);
    const noPool = Number(noLamports) / Number(LAMPORTS_PER_SOL);

    const { data: market } = await supabase
      .from("markets")
      .select("outcome, resolved_at")
      .eq("id", id)
      .maybeSingle();

    return NextResponse.json({
      yesPool,
      noPool,
      isResolved: market?.outcome != null,
      outcome: market?.outcome ?? null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
