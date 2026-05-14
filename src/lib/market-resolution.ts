import { getKnownMintForSymbol, fetchTokenByMint } from "@/lib/dexscreener";

export async function fetchFdvForSymbol(symbol: string): Promise<number> {
  const mint = getKnownMintForSymbol(symbol);
  if (!mint) throw new Error(`Unknown symbol: ${symbol}`);
  const snap = await fetchTokenByMint(mint);
  return snap?.fdvUsd ?? 0;
}

export function computeOutcome(
  resolutionRule: string,
  targetMcUsd: number | null,
  fdvA: number,
  fdvB: number | null,
): "YES" | "NO" {
  if (resolutionRule === "mc_gte") {
    if (targetMcUsd == null) throw new Error("mc_gte requires target_mc_usd");
    return fdvA >= targetMcUsd ? "YES" : "NO";
  }
  if (resolutionRule === "mc_lt") {
    if (targetMcUsd == null) throw new Error("mc_lt requires target_mc_usd");
    return fdvA < targetMcUsd ? "YES" : "NO";
  }
  if (resolutionRule === "h2h") {
    if (fdvB == null) throw new Error("h2h requires two FDVs");
    return fdvA > fdvB ? "YES" : "NO";
  }
  throw new Error(`Unknown resolution_rule: ${resolutionRule}`);
}
