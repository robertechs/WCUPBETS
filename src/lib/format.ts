export function formatCompactUsd(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

/** Spot USD price for display (worldcupcoins.org-style small decimals). */
export function formatUsdPrice(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1)
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  if (n >= 0.000001) return `$${n.toFixed(6)}`;
  return `$${n.toPrecision(4)}`;
}
