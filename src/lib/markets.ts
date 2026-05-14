import type { TournamentRoundId } from "./tournament";

export type WcupMarketType = "mc-target" | "h2h";

/** How YES resolves from DexScreener FDV at deadline. */
export type WcupResolutionRule = "mc_gte" | "mc_lt" | "h2h";

export type WcupTokenRef = {
  symbol: string;
  /** Unicode regional indicator flag pair */
  flag: string;
  /** ISO 3166-1 alpha-2 country code for flagcdn.com (e.g. "fr", "gb-eng") */
  countryCode?: string;
};

export type WcupMarketDef = {
  id: string;
  marketType: WcupMarketType;
  tokens: [WcupTokenRef] | [WcupTokenRef, WcupTokenRef];
  /** Headline shown on card (plain English) */
  title: string;
  /** Subline / resolution detail */
  description: string;
  /** Category pill e.g. MC Target, Head-to-Head */
  topic: string;
  roundId: TournamentRoundId;
  /** For mc-target: FDV / "market cap" target in USD */
  targetMcUsd?: number;
  /** Rule used by backend cron to auto-resolve from DexScreener */
  resolutionRule: WcupResolutionRule;
};

export const WCUP_MARKETS: WcupMarketDef[] = [
  {
    id: "mc-worldcup-r32",
    marketType: "mc-target",
    tokens: [{ symbol: "WORLDCUP", flag: "🌍", countryCode: undefined }],
    title: "Will $WORLDCUP hit $10M market cap by end of May 18?",
    description: "Resolves YES if FDV ≥ $10M on DexScreener by May 18 at 11:59 PM UTC.",
    topic: "MC Target",
    roundId: "sf",
    targetMcUsd: 10_000_000,
    resolutionRule: "mc_gte",
  },
  {
    id: "mc-argentina-qf",
    marketType: "mc-target",
    tokens: [{ symbol: "ARGENTINA", flag: "🇦🇷", countryCode: "ar" }],
    title: "Will $ARGENTINA hit $200K market cap by end of May 17?",
    description: "Resolves YES if FDV ≥ $200K on DexScreener by May 17 at 11:59 PM UTC.",
    topic: "MC Target",
    roundId: "qf",
    targetMcUsd: 200_000,
    resolutionRule: "mc_gte",
  },
  {
    id: "mc-brazil-r16",
    marketType: "mc-target",
    tokens: [{ symbol: "BRAZIL", flag: "🇧🇷", countryCode: "br" }],
    title: "Will $BRAZIL hit $150K market cap by end of May 16?",
    description: "Resolves YES if FDV ≥ $150K on DexScreener by May 16 at 11:59 PM UTC.",
    topic: "MC Target",
    roundId: "r16",
    targetMcUsd: 150_000,
    resolutionRule: "mc_gte",
  },
  {
    id: "mc-england-r32",
    marketType: "mc-target",
    tokens: [{ symbol: "ENGLAND", flag: "🇬🇧", countryCode: "gb-eng" }],
    title: "Will $ENGLAND be below $100K market cap by end of May 16?",
    description: "Resolves YES if FDV < $100K on DexScreener by May 16 at 11:59 PM UTC.",
    topic: "MC Target",
    roundId: "r16",
    targetMcUsd: 100_000,
    resolutionRule: "mc_lt",
  },
  {
    id: "h2h-france-spain-r16",
    marketType: "h2h",
    tokens: [
      { symbol: "FRANCE", flag: "🇫🇷", countryCode: "fr" },
      { symbol: "SPAIN", flag: "🇪🇸", countryCode: "es" },
    ],
    title: "Will $FRANCE have a higher market cap than $SPAIN by end of May 16?",
    description: "Resolves YES if $FRANCE FDV > $SPAIN FDV on DexScreener by May 16 at 11:59 PM UTC.",
    topic: "Head-to-Head",
    roundId: "r16",
    resolutionRule: "h2h",
  },
  {
    id: "mc-portugal-qf",
    marketType: "mc-target",
    tokens: [{ symbol: "PORTUGAL", flag: "🇵🇹", countryCode: "pt" }],
    title: "Will $PORTUGAL be below $80K market cap by end of May 17?",
    description: "Resolves YES if FDV < $80K on DexScreener by May 17 at 11:59 PM UTC.",
    topic: "MC Target",
    roundId: "qf",
    targetMcUsd: 80_000,
    resolutionRule: "mc_lt",
  },
  {
    id: "h2h-spain-england-final",
    marketType: "h2h",
    tokens: [
      { symbol: "SPAIN", flag: "🇪🇸", countryCode: "es" },
      { symbol: "ENGLAND", flag: "🇬🇧", countryCode: "gb-eng" },
    ],
    title: "Will $SPAIN have a higher market cap than $ENGLAND by end of May 19?",
    description: "Resolves YES if $SPAIN FDV > $ENGLAND FDV on DexScreener by May 19 at 11:59 PM UTC.",
    topic: "Head-to-Head",
    roundId: "final",
    resolutionRule: "h2h",
  },
];
