import { NextResponse } from "next/server";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { createMemoInstruction } from "@solana/spl-memo";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getVaultPubkey } from "@/lib/solana-vault";
import { getServerConnection } from "@/lib/server-solana";
import { buildBetMemo } from "@/lib/memo-bet";

const MIN_LAMPORTS = BigInt(Math.floor(0.01 * Number(LAMPORTS_PER_SOL)));

type Body = {
  marketId: string;
  side: "YES" | "NO";
  amountLamports: string | number;
  userPubkey: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const { marketId, side, userPubkey } = body;
    const amountLamports = BigInt(String(body.amountLamports));

    if (!marketId || !side || !userPubkey) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    if (side !== "YES" && side !== "NO") {
      return NextResponse.json({ error: "Invalid side" }, { status: 400 });
    }
    if (amountLamports < MIN_LAMPORTS) {
      return NextResponse.json({ error: "Below minimum bet" }, { status: 400 });
    }

    const userPk = new PublicKey(userPubkey);
    const supabase = getSupabaseAdmin();

    const { data: market, error: mErr } = await supabase
      .from("markets")
      .select("id, deadline_ms, outcome")
      .eq("id", marketId)
      .maybeSingle();

    if (mErr) throw mErr;
    if (!market) {
      return NextResponse.json({ error: "Unknown market" }, { status: 404 });
    }
    if (market.outcome != null) {
      return NextResponse.json({ error: "Market already resolved" }, { status: 400 });
    }
    if (Date.now() > Number(market.deadline_ms)) {
      return NextResponse.json({ error: "Market closed" }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { data: quote, error: qErr } = await supabase
      .from("bet_quotes")
      .insert({
        market_id: marketId,
        user_pubkey: userPubkey,
        side,
        amount_lamports: amountLamports.toString(),
        status: "pending",
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (qErr) throw qErr;
    const quoteId = quote.id as string;

    const memo = buildBetMemo(marketId, side, quoteId);
    const vault = getVaultPubkey();
    const connection = getServerConnection();
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: userPk,
        toPubkey: vault,
        lamports: Number(amountLamports),
      }),
      createMemoInstruction(memo, [userPk]),
    );
    tx.feePayer = userPk;
    tx.recentBlockhash = blockhash;

    const serialized = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
    const txBase64 = Buffer.from(serialized).toString("base64");

    return NextResponse.json({
      txBase64,
      quoteId,
      blockhash,
      lastValidBlockHeight,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
