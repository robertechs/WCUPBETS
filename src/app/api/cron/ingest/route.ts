import { NextResponse } from "next/server";
import { assertCronSecret } from "@/lib/cron-auth";
import { getServerConnection } from "@/lib/server-solana";
import { getVaultPubkey } from "@/lib/solana-vault";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { parseBetMemo } from "@/lib/memo-bet";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function extractMemoFromLogs(logs: string[] | null | undefined): string | null {
  if (!logs) return null;
  for (const line of logs) {
    const marker = "wcup|v1|";
    const i = line.indexOf(marker);
    if (i >= 0) {
      let s = line.slice(i).trim();
      if (s.endsWith('"')) s = s.slice(0, -1);
      if (s.endsWith("'")) s = s.slice(0, -1);
      return s;
    }
  }
  return null;
}

function transferFromIx(
  ix: unknown,
  vault: string,
  user: string,
): bigint | null {
  if (
    ix &&
    typeof ix === "object" &&
    "program" in ix &&
    (ix as { program: string }).program === "system" &&
    "parsed" in ix
  ) {
    const p = (ix as { parsed: { type?: string; info?: { source: string; destination: string; lamports: number } } })
      .parsed;
    if (p?.type === "transfer" && p.info) {
      const { source, destination, lamports } = p.info;
      if (destination === vault && source === user) return BigInt(lamports);
    }
  }
  return null;
}

function findTransferLamports(
  parsed: NonNullable<Awaited<ReturnType<import("@solana/web3.js").Connection["getParsedTransaction"]>>>,
  vault: string,
  user: string,
): bigint | null {
  for (const ix of parsed.transaction.message.instructions) {
    const t = transferFromIx(ix, vault, user);
    if (t != null) return t;
  }
  for (const group of parsed.meta?.innerInstructions ?? []) {
    for (const ix of group.instructions) {
      const t = transferFromIx(ix, vault, user);
      if (t != null) return t;
    }
  }
  return null;
}

function inferLamportsFromBalanceDelta(
  meta: NonNullable<
    Awaited<ReturnType<import("@solana/web3.js").Connection["getParsedTransaction"]>>
  >["meta"],
  accountKeys: string[],
  vault: string,
  user: string,
): bigint | null {
  if (!meta?.preBalances || !meta.postBalances) return null;
  const vi = accountKeys.indexOf(vault);
  const ui = accountKeys.indexOf(user);
  if (vi < 0 || ui < 0) return null;
  const userDelta = BigInt(meta.preBalances[ui]!) - BigInt(meta.postBalances[ui]!);
  const vaultDelta = BigInt(meta.postBalances[vi]!) - BigInt(meta.preBalances[vi]!);
  if (userDelta <= 0n || vaultDelta <= 0n) return null;
  if (userDelta !== vaultDelta) return null;
  return vaultDelta;
}

export async function POST(request: Request) {
  try {
    assertCronSecret(request);
    const connection = getServerConnection();
    const vault = getVaultPubkey();
    const vaultStr = vault.toBase58();
    const supabase = getSupabaseAdmin();

    const sigs = await connection.getSignaturesForAddress(vault, {
      limit: 100,
    });

    let processed = 0;
    for (const { signature } of [...sigs].reverse()) {
      const { data: existing } = await supabase
        .from("bets")
        .select("id")
        .eq("deposit_sig", signature)
        .maybeSingle();
      if (existing) continue;

      const parsed = await connection.getParsedTransaction(signature, {
        maxSupportedTransactionVersion: 0,
        commitment: "confirmed",
      });
      if (!parsed || parsed.meta?.err) continue;

      const memoText = extractMemoFromLogs(parsed.meta?.logMessages);
      if (!memoText) continue;

      const parsedMemo = parseBetMemo(memoText);
      if (!parsedMemo) continue;

      const { data: quote } = await supabase
        .from("bet_quotes")
        .select("*")
        .eq("id", parsedMemo.quoteId)
        .maybeSingle();

      if (!quote || quote.status !== "pending") continue;
      if (quote.market_id !== parsedMemo.marketId || quote.side !== parsedMemo.side) continue;

      const userPub = quote.user_pubkey as string;
      const keys = parsed.transaction.message.accountKeys.map((k) =>
        typeof k === "string" ? k : k.pubkey.toBase58(),
      );

      let lamports = findTransferLamports(parsed, vaultStr, userPub);
      if (lamports == null) {
        lamports = inferLamportsFromBalanceDelta(parsed.meta, keys, vaultStr, userPub);
      }
      if (lamports == null) continue;

      if (lamports !== BigInt(String(quote.amount_lamports))) continue;

      if (Date.now() > new Date(quote.expires_at as string).getTime()) {
        await supabase.from("bet_quotes").update({ status: "expired" }).eq("id", quote.id);
        continue;
      }

      const blockTime = parsed.blockTime ?? Math.floor(Date.now() / 1000);

      const { error: betErr } = await supabase.from("bets").insert({
        quote_id: quote.id,
        market_id: quote.market_id,
        user_pubkey: quote.user_pubkey,
        side: quote.side,
        amount_lamports: quote.amount_lamports,
        deposit_sig: signature,
        block_time: blockTime,
        status: "confirmed",
      });
      if (betErr) {
        if (betErr.code === "23505") continue;
        throw betErr;
      }

      await supabase
        .from("bet_quotes")
        .update({ status: "confirmed" })
        .eq("id", quote.id);

      processed += 1;
    }

    return NextResponse.json({ ok: true, scanned: sigs.length, processed });
  } catch (e) {
    const status = (e as Error & { status?: number }).status ?? 500;
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status });
  }
}
