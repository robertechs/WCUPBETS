import { NextResponse } from "next/server";
import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { assertCronSecret } from "@/lib/cron-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getServerConnection } from "@/lib/server-solana";
import { getVaultKeypair } from "@/lib/solana-vault";

const FEE_NUM = 98n;
const FEE_DEN = 100n;
const TX_FEE_BUFFER = 5000n;

function mulDiv(a: bigint, b: bigint, c: bigint): bigint {
  if (c === 0n) return 0n;
  return (a * b) / c;
}

export async function POST(request: Request) {
  try {
    assertCronSecret(request);
    const supabase = getSupabaseAdmin();
    const connection = getServerConnection();
    const vault = getVaultKeypair();

    const { data: markets, error: mErr } = await supabase
      .from("markets")
      .select("id, outcome")
      .not("outcome", "is", null);

    if (mErr) throw mErr;

    let paid = 0;
    for (const market of markets ?? []) {
      const outcome = market.outcome as "YES" | "NO";

      const { data: bets, error: bErr } = await supabase
        .from("bets")
        .select("id, user_pubkey, side, amount_lamports, payout_sig")
        .eq("market_id", market.id)
        .eq("status", "confirmed");
      if (bErr) throw bErr;

      let yesTotal = 0n;
      let noTotal = 0n;
      for (const b of bets ?? []) {
        const a = BigInt(String(b.amount_lamports));
        if (b.side === "YES") yesTotal += a;
        else noTotal += a;
      }
      const totalPool = yesTotal + noTotal;
      const winTotal = outcome === "YES" ? yesTotal : noTotal;
      if (winTotal === 0n || totalPool === 0n) continue;

      for (const b of bets ?? []) {
        if (b.side !== outcome) continue;
        if (b.payout_sig) continue;

        const betAmt = BigInt(String(b.amount_lamports));
        const gross = mulDiv(betAmt, totalPool, winTotal);
        let net = mulDiv(gross, FEE_NUM, FEE_DEN);
        if (net > TX_FEE_BUFFER) net -= TX_FEE_BUFFER;
        if (net <= 0n) continue;

        const toPub = new PublicKey(b.user_pubkey as string);
        const tx = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: vault.publicKey,
            toPubkey: toPub,
            lamports: Number(net),
          }),
        );
        tx.feePayer = vault.publicKey;
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash("confirmed");
        tx.recentBlockhash = blockhash;
        tx.sign(vault);

        const sig = await connection.sendRawTransaction(tx.serialize(), {
          skipPreflight: false,
          maxRetries: 3,
        });
        await connection.confirmTransaction(
          { signature: sig, blockhash, lastValidBlockHeight },
          "confirmed",
        );

        const { error: uErr } = await supabase
          .from("bets")
          .update({
            payout_sig: sig,
            payout_lamports: net.toString(),
            status: "paid",
          })
          .eq("id", b.id);
        if (uErr) throw uErr;
        paid += 1;
      }
    }

    return NextResponse.json({ ok: true, paid });
  } catch (e) {
    const status = (e as Error & { status?: number }).status ?? 500;
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status });
  }
}
