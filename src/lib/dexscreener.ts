export type DexTokenSnapshot = {
  mint: string;
  fdvUsd: number;
  priceUsd: number;
  volume24hUsd: number;
  pairUrl: string;
  symbol: string;
};

type DexPair = {
  chainId?: string;
  url?: string;
  liquidity?: { usd?: number };
  fdv?: number;
  priceUsd?: string;
  volume?: { h24?: number };
  baseToken?: { address?: string; symbol?: string };
};

type SearchResponse = { pairs?: DexPair[] };
type TokenResponse = { pairs?: DexPair[] };

/** Canonical mints sourced from worldcupcoins.org/app-config.js — covers both short (3-letter)
 *  and full-name variants so any symbol used in markets.ts resolves to the right token. */
const KNOWN_MINT_BY_SYMBOL: Record<string, string> = {
  // Hub token
  WORLDCUP:    "33eum82LaAhtv5YkUq1BdwEviSErH5CnFxqVNLT5pump",

  // CONCACAF
  MEX:         "4DbaSWS3jYHEmQQP2jGHLz2PMHrmzbWNZynM32YFpump",
  MEXICO:      "4DbaSWS3jYHEmQQP2jGHLz2PMHrmzbWNZynM32YFpump",
  CAN:         "Gr6dUXQKQwsfqtedc26GK4qLawCoxT7bk2cyFuwGpump",
  CANADA:      "Gr6dUXQKQwsfqtedc26GK4qLawCoxT7bk2cyFuwGpump",
  USA:         "3hqrigP7PiomQQ5RtdYE9kagmo2q4r3euae2fEJWpump",

  // AFC
  AUS:         "5bp1N2FctJ2MQqGMxP9QrWTh7PgX1mg9y3Pm8tZgpump",
  AUSTRALIA:   "5bp1N2FctJ2MQqGMxP9QrWTh7PgX1mg9y3Pm8tZgpump",
  IRQ:         "CV6oyXbcTLPqnqKv9BgvhJU5xXEhqiAkSR6V9PeMpump",
  IRAQ:        "CV6oyXbcTLPqnqKv9BgvhJU5xXEhqiAkSR6V9PeMpump",
  IRN:         "6gU6PMzreEuZjVnjVhWT1V6XHLaQWDi3NyXFedUXpump",
  IRAN:        "6gU6PMzreEuZjVnjVhWT1V6XHLaQWDi3NyXFedUXpump",
  JPN:         "3myG7jK9ejeofY67E6sK3U4T1RVYuW875nmb1MKZpump",
  JAPAN:       "3myG7jK9ejeofY67E6sK3U4T1RVYuW875nmb1MKZpump",
  JOR:         "7oBA7LMBEcNiG1ygvGmyMMcwcyGJKfjkj6EVkbptpump",
  JORDAN:      "7oBA7LMBEcNiG1ygvGmyMMcwcyGJKfjkj6EVkbptpump",
  KOR:         "DJfxEAEc8JU1Jf4yajYwi4Qma5Jb2qgYmxkoUctEpump",
  KOREA:       "DJfxEAEc8JU1Jf4yajYwi4Qma5Jb2qgYmxkoUctEpump",
  QAT:         "841uQfUMKTQmcQDPDrusRcHcH5SYr8qVJoPnhezHpump",
  QATAR:       "841uQfUMKTQmcQDPDrusRcHcH5SYr8qVJoPnhezHpump",
  KSA:         "Bdjfur6JPfj8s89rqnk7zj9MmtYFMYKCDM1PLg2wpump",
  SAUDI:       "Bdjfur6JPfj8s89rqnk7zj9MmtYFMYKCDM1PLg2wpump",
  UZB:         "CNgYGabJrqPGmKgaGymNPBRLKe1KDTHZBUj8owN8pump",
  UZBEKISTAN:  "CNgYGabJrqPGmKgaGymNPBRLKe1KDTHZBUj8owN8pump",

  // CAF
  ALG:         "SJpCpLd5K1RZMNAmum6tqqcvBndMoM9p4cfBAk6pump",
  ALGERIA:     "SJpCpLd5K1RZMNAmum6tqqcvBndMoM9p4cfBAk6pump",
  CPV:         "7uej4Cu1BW2rhjUbyRBJxSr1fBVztW9Aefum7rqYpump",
  CIV:         "9k7s6G7mwmpFRRE5Yb3hE9PYtrvJkaFp676gXigGpump",
  EGY:         "8B5STCstZ4hGTv54VBTvscPgWZbR9PwY2oZKWYGypump",
  EGYPT:       "8B5STCstZ4hGTv54VBTvscPgWZbR9PwY2oZKWYGypump",
  GHA:         "3s63jkytjPVMk1P6Xq5CfdnKwCD6f8HuV2oMPoy9pump",
  GHANA:       "3s63jkytjPVMk1P6Xq5CfdnKwCD6f8HuV2oMPoy9pump",
  MAR:         "twuH9xFoyWfpJUwuGdKfzaVok9sVo87VTXev7pVpump",
  MOROCCO:     "twuH9xFoyWfpJUwuGdKfzaVok9sVo87VTXev7pVpump",
  SEN:         "J5EppEJ24KBJCgUFiev8h4tgqLNRGUiykzfL4abgpump",
  SENEGAL:     "J5EppEJ24KBJCgUFiev8h4tgqLNRGUiykzfL4abgpump",
  RSA:         "G6jshPGug6B4X9EskPZSoQzMMcPP7sZJKvsq26rwpump",
  TUN:         "F9cvyLcGwvs42ZyHmMvq5qtj1vJFdjvNJgwDdBs7pump",
  TUNISIA:     "F9cvyLcGwvs42ZyHmMvq5qtj1vJFdjvNJgwDdBs7pump",
  CUW:         "2i5MxfUtB4CfXzczty8HxWojVSjDxGfJc5tHge5Gpump",
  COD:         "E4gCAyCBorg8K4x6MU7SbXsKqTJKdGVYSy6QcVNxpump",

  // CONCACAF Caribbean
  HAI:         "9EfHVmbAUGCiBvB8XGqAoGszj9Dxu456xPXsB8mCpump",
  HAITI:       "9EfHVmbAUGCiBvB8XGqAoGszj9Dxu456xPXsB8mCpump",
  PAN:         "9bZNHosiUnv3dQMKqXdcjj1ynSFtwY5FLySWMjmqpump",
  PANAMA:      "9bZNHosiUnv3dQMKqXdcjj1ynSFtwY5FLySWMjmqpump",

  // CONMEBOL
  ARG:         "8vR5VdBAGAWVjvycijB4yLTRmJ3N8RaUS6m3jgAnpump",
  ARGENTINA:   "8vR5VdBAGAWVjvycijB4yLTRmJ3N8RaUS6m3jgAnpump",
  BRA:         "88gKZC3rmTH9CuMVmUXyxAg3ijY7wD8n2AK9WGPBpump",
  BRAZIL:      "88gKZC3rmTH9CuMVmUXyxAg3ijY7wD8n2AK9WGPBpump",
  COL:         "FXbMB3vqfwp4UFHGodm7zAggzqMZ88XRhd3kd1u3pump",
  COLOMBIA:    "FXbMB3vqfwp4UFHGodm7zAggzqMZ88XRhd3kd1u3pump",
  ECU:         "Ehfbc4bJUBUox7iFEAyqwwqseEp9xwQXdD24jWggpump",
  ECUADOR:     "Ehfbc4bJUBUox7iFEAyqwwqseEp9xwQXdD24jWggpump",
  PAR:         "22TBuCLZLNzWmko5af4mc1AwT39zyh9riWL5x26apump",
  PARAGUAY:    "22TBuCLZLNzWmko5af4mc1AwT39zyh9riWL5x26apump",
  URU:         "E3KxuGBsGQ7n4v4M29thLnwuZRdnPHEQXTGLL31zpump",
  URUGUAY:     "E3KxuGBsGQ7n4v4M29thLnwuZRdnPHEQXTGLL31zpump",

  // OFC
  NZL:         "GDEp82Xj5y3CVo9Wc7DgX37iTbUTqXhAASVfAcYEpump",
  NEWZEALAND:  "GDEp82Xj5y3CVo9Wc7DgX37iTbUTqXhAASVfAcYEpump",

  // UEFA
  AUT:         "9QriWeK9xyb6mdPhnHUYgLdcHK4K1Nx2sofpMiipump",
  AUSTRIA:     "9QriWeK9xyb6mdPhnHUYgLdcHK4K1Nx2sofpMiipump",
  BEL:         "Ed7QEvbkumr5CPkSegQUy6SfXbvC32Vut5PSSab3pump",
  BELGIUM:     "Ed7QEvbkumr5CPkSegQUy6SfXbvC32Vut5PSSab3pump",
  BIH:         "5K1J5pMBaS5LRddJLQ4bFCAcJUQGV1sMqoxWKjZjpump",
  CRO:         "9FKNTn3671wHRK8URYPEYVphJt48ia6GzLNTSarbpump",
  CROATIA:     "9FKNTn3671wHRK8URYPEYVphJt48ia6GzLNTSarbpump",
  CZE:         "6DEPJP4gWLpXTQjEWnXZUc57HY7svWaAN63hTosApump",
  CZECHIA:     "6DEPJP4gWLpXTQjEWnXZUc57HY7svWaAN63hTosApump",
  ENG:         "DTuthGCM1nMgv1wr6fsHQFoHwzBBCcdpq63gnMFmpump",
  ENGLAND:     "DTuthGCM1nMgv1wr6fsHQFoHwzBBCcdpq63gnMFmpump",
  FRA:         "2gXeM4einZoLMSQ5K7s6rHzCAeksU2hRFouBpqSopump",
  FRANCE:      "2gXeM4einZoLMSQ5K7s6rHzCAeksU2hRFouBpqSopump",
  GER:         "Bv3qk2ViNmXvXs8T3VESqJsypkm9NGi3YAisFRmTpump",
  GERMANY:     "Bv3qk2ViNmXvXs8T3VESqJsypkm9NGi3YAisFRmTpump",
  NED:         "iabWvp2SGYhvmfd9huN3smdWGwSq1xafc2fQF1Ypump",
  NETHERLANDS: "iabWvp2SGYhvmfd9huN3smdWGwSq1xafc2fQF1Ypump",
  NOR:         "ACGL2YHwKVbeNX1uXweHe6eYyjRiRpvaThWxFgmepump",
  NORWAY:      "ACGL2YHwKVbeNX1uXweHe6eYyjRiRpvaThWxFgmepump",
  POR:         "Se2HT3A2WTqdpAeBy6wwuYMtoqmodGC7eLxrBFUpump",
  PORTUGAL:    "Se2HT3A2WTqdpAeBy6wwuYMtoqmodGC7eLxrBFUpump",
  SCO:         "2rezQLfcLDXimtLXPDFnCKxW3QCKHRDkm6JSySVcpump",
  SCOTLAND:    "2rezQLfcLDXimtLXPDFnCKxW3QCKHRDkm6JSySVcpump",
  ESP:         "D2bSDzYKpFCePrp98dfN4uuKH1SBnYiiWjwmpYBspump",
  SPAIN:       "D2bSDzYKpFCePrp98dfN4uuKH1SBnYiiWjwmpYBspump",
  SWE:         "9su6LMTBCJa3Fcwhnq4NrRupZnrtwUGpng1Dnt3Jpump",
  SWEDEN:      "9su6LMTBCJa3Fcwhnq4NrRupZnrtwUGpng1Dnt3Jpump",
  SUI:         "2Ra6W2qhsCKTb83JDZ6y5NMuQf23CGJhvLicmQi6pump",
  SWITZERLAND: "2Ra6W2qhsCKTb83JDZ6y5NMuQf23CGJhvLicmQi6pump",
  TUR:         "AJCAd7ixokqPegWtEa133BUyJydERvEWs8bDJFPWpump",
  TURKEY:      "AJCAd7ixokqPegWtEa133BUyJydERvEWs8bDJFPWpump",
};

export function getKnownMintForSymbol(symbol: string): string | undefined {
  const k = symbol.replace(/^\$/, "").trim().toUpperCase();
  return KNOWN_MINT_BY_SYMBOL[k];
}

function pickBestPair(pairs: DexPair[] | undefined): DexPair | null {
  if (!pairs?.length) return null;
  const sol = pairs.filter((p) => p.chainId === "solana");
  const list = sol.length ? sol : pairs;
  return [...list].sort((a, b) => {
    const la = a.liquidity?.usd ?? 0;
    const lb = b.liquidity?.usd ?? 0;
    return lb - la;
  })[0];
}

function pairToSnapshot(pair: DexPair, fallbackMint: string): DexTokenSnapshot {
  const mint = pair.baseToken?.address ?? fallbackMint;
  const fdv = typeof pair.fdv === "number" ? pair.fdv : 0;
  const price = parseFloat(pair.priceUsd ?? "0") || 0;
  const vol = pair.volume?.h24 ?? 0;
  return {
    mint,
    fdvUsd: fdv,
    priceUsd: price,
    volume24hUsd: vol,
    pairUrl: pair.url ?? `https://dexscreener.com/solana/${mint}`,
    symbol: pair.baseToken?.symbol ?? "",
  };
}

/** Resolve best Solana mint for a ticker symbol (runtime; replace with hardcoded mints later). */
export async function searchTokenBySymbol(
  symbol: string
): Promise<string | null> {
  const q = symbol.replace(/^\$/, "").trim();
  const known = getKnownMintForSymbol(q);
  if (known) return known;
  const res = await fetch(
    `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`
  );
  if (!res.ok) return null;
  const data = (await res.json()) as SearchResponse;
  const pair = pickBestPair(data.pairs);
  if (!pair?.baseToken?.address) return null;
  if (pair.chainId && pair.chainId !== "solana") return null;
  return pair.baseToken.address;
}

export async function fetchTokenByMint(
  mintAddress: string
): Promise<DexTokenSnapshot | null> {
  const res = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(mintAddress)}`
  );
  if (!res.ok) return null;
  const data = (await res.json()) as TokenResponse;
  const pair = pickBestPair(data.pairs);
  if (!pair) return null;
  const snapshot = pairToSnapshot(pair, mintAddress);
  // Sum volume across all Solana pairs so we show the token's total 24h volume
  const solPairs = (data.pairs ?? []).filter((p) => p.chainId === "solana");
  const totalVol = solPairs.reduce((acc, p) => acc + (p.volume?.h24 ?? 0), 0);
  return { ...snapshot, volume24hUsd: totalVol || snapshot.volume24hUsd };
}
