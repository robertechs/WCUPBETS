const PREFIX = "wcup|v1|";

export function buildBetMemo(marketId: string, side: "YES" | "NO", quoteId: string): string {
  return `${PREFIX}${marketId}|${side}|${quoteId}`;
}

export function parseBetMemo(data: string): {
  marketId: string;
  side: "YES" | "NO";
  quoteId: string;
} | null {
  const s = data.trim();
  if (!s.startsWith(PREFIX)) return null;
  const rest = s.slice(PREFIX.length);
  const parts = rest.split("|");
  if (parts.length < 3) return null;
  const quoteId = parts[parts.length - 1]!;
  const side = parts[parts.length - 2] as "YES" | "NO";
  if (side !== "YES" && side !== "NO") return null;
  const marketId = parts.slice(0, -2).join("|");
  if (!marketId || !quoteId) return null;
  return { marketId, side, quoteId };
}
