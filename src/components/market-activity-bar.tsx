import {
  formatMarketVolume,
  formatPooledSol,
  getMarketCardStats,
} from "@/lib/market-card-stats";

export function MarketActivityBar({ marketId }: { marketId: string }) {
  const { marketVolumeUsd, pooledSol } = getMarketCardStats(marketId);

  return (
    <div className="flex justify-between items-center mt-2.5 gap-3 text-[11px] font-medium text-[rgba(51,65,85,0.88)]">
      <span className="truncate">
        <span className="text-[#064e3b] font-semibold">
          {formatMarketVolume(marketVolumeUsd)}
        </span>{" "}
        volume on market
      </span>
      <span className="shrink-0 tabular-nums">
        <span className="text-[#064e3b] font-semibold">{formatPooledSol(pooledSol)}</span>{" "}
        SOL pooled
      </span>
    </div>
  );
}
