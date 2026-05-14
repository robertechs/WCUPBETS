import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ pubkey: string }> },
) {
  try {
    const { pubkey } = await ctx.params;
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(pubkey)) {
      return NextResponse.json({ error: "Invalid pubkey" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: bets, error } = await supabase
      .from("bets")
      .select(
        "id, market_id, side, amount_lamports, deposit_sig, status, payout_sig, payout_lamports, created_at",
      )
      .eq("user_pubkey", pubkey)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const ids = [...new Set((bets ?? []).map((b) => b.market_id as string))];
    let marketMap: Record<string, { title: string; outcome: string | null }> = {};
    if (ids.length > 0) {
      const { data: mkts, error: mErr } = await supabase
        .from("markets")
        .select("id, title, outcome")
        .in("id", ids);
      if (mErr) throw mErr;
      marketMap = Object.fromEntries(
        (mkts ?? []).map((m) => [
          m.id as string,
          { title: m.title as string, outcome: (m.outcome as string | null) ?? null },
        ]),
      );
    }

    const LAMPORTS_PER_SOL = 1_000_000_000;
    const rows = (bets ?? []).map((b) => {
      const lam = BigInt(String(b.amount_lamports));
      const m = marketMap[b.market_id as string];
      return {
        id: b.id,
        marketId: b.market_id,
        title: m?.title ?? (b.market_id as string),
        side: b.side,
        amountSol: Number(lam) / LAMPORTS_PER_SOL,
        depositSig: b.deposit_sig,
        status: b.status,
        payoutSig: b.payout_sig,
        payoutLamports: b.payout_lamports,
        marketOutcome: m?.outcome ?? null,
        ts: new Date(b.created_at as string).getTime(),
      };
    });

    return NextResponse.json({ bets: rows });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
