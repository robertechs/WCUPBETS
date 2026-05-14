import { getRoundDeadlineMs } from "@/lib/tournament";
import { WCUP_MARKETS } from "@/lib/markets";

export type MarketSeedRow = {
  id: string;
  market_type: string;
  title: string;
  deadline_ms: number;
  target_mc_usd: number | null;
  resolution_rule: string;
  token_a_symbol: string;
  token_b_symbol: string | null;
};

export function buildMarketSeedRows(): MarketSeedRow[] {
  return WCUP_MARKETS.map((m) => {
    const deadline_ms = getRoundDeadlineMs(m.roundId);
    const token_a_symbol = m.tokens[0]!.symbol;
    const token_b_symbol =
      m.marketType === "h2h" ? m.tokens[1]!.symbol : null;
    return {
      id: m.id,
      market_type: m.marketType,
      title: m.title,
      deadline_ms,
      target_mc_usd: m.targetMcUsd ?? null,
      resolution_rule: m.resolutionRule,
      token_a_symbol,
      token_b_symbol,
    };
  });
}
