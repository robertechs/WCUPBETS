/** Card UI: betting-market volume & pool (separate from DexScreener 24h coin stats). */
export type MarketCardStats = {
  yesPercent: number;
  marketVolumeUsd: number;
  pooledSol: number;
};

const FALLBACK: MarketCardStats = {
  yesPercent: 58,
  marketVolumeUsd: 8_000,
  pooledSol: 6,
};

export const MARKET_CARD_STATS: Record<string, MarketCardStats> = {
  "mc-worldcup-r32": { yesPercent: 62, marketVolumeUsd: 16_000, pooledSol: 12 },
  "mc-argentina-qf": { yesPercent: 58, marketVolumeUsd: 11_200, pooledSol: 8.4 },
  "mc-brazil-r16": { yesPercent: 61, marketVolumeUsd: 9_800, pooledSol: 7.2 },
  "mc-england-r32": { yesPercent: 54, marketVolumeUsd: 8_400, pooledSol: 6.5 },
  "h2h-france-spain-r16": { yesPercent: 57, marketVolumeUsd: 14_500, pooledSol: 10.5 },
  "mc-portugal-qf": { yesPercent: 53, marketVolumeUsd: 7_600, pooledSol: 5.8 },
  "h2h-spain-england-final": { yesPercent: 59, marketVolumeUsd: 12_300, pooledSol: 9.1 },
};

export function getMarketCardStats(marketId: string): MarketCardStats {
  return MARKET_CARD_STATS[marketId] ?? FALLBACK;
}

export function formatMarketVolume(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) {
    const k = usd / 1_000;
    return Number.isInteger(k) ? `$${k}K` : `$${k.toFixed(1)}K`;
  }
  return `$${usd}`;
}

export function formatPooledSol(sol: number): string {
  return Number.isInteger(sol) ? `${sol}` : sol.toFixed(1);
}
