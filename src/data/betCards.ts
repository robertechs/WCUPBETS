import type { TournamentRoundId } from "@/lib/tournament";
import { WCUP_MARKETS } from "@/lib/markets";
import type { WcupMarketType } from "@/lib/markets";

export interface BetCardData {
  id: string;
  marketType: WcupMarketType;
  tokens: { symbol: string; flag: string; countryCode?: string }[];
  title: string;
  topic: string;
  roundId: TournamentRoundId;
  targetMcUsd?: number;
  percentage?: string;
  startingDate?: string;
  timeRemaining?: string;
  yesButtonText?: string;
  noButtonText?: string;
  yesBetAmount?: string;
  noBetAmount?: string;
  category: "most-popular" | "latest";
}

function toCard(
  def: (typeof WCUP_MARKETS)[number],
  category: BetCardData["category"]
): BetCardData {
  return {
    id: def.id,
    marketType: def.marketType,
    tokens: [...def.tokens],
    title: def.title,
    topic: def.topic,
    roundId: def.roundId,
    targetMcUsd: def.targetMcUsd,
    percentage: "50%",
    category,
  };
}

export const mostPopularCards: BetCardData[] = [
  toCard(WCUP_MARKETS[0], "most-popular"),
];

export const latestCards: BetCardData[] = WCUP_MARKETS.slice(1).map((d) =>
  toCard(d, "latest")
);

export const getUniqueCards = (cards: BetCardData[]): BetCardData[] => {
  const uniqueMap = new Map<string, BetCardData>();
  cards.forEach((card) => {
    if (!uniqueMap.has(card.id)) {
      uniqueMap.set(card.id, card);
    }
  });
  return Array.from(uniqueMap.values());
};

export const getCardsByCategory = (
  category: "most-popular" | "latest"
): BetCardData[] => {
  if (category === "most-popular") return mostPopularCards;
  return latestCards;
};

export const getAllCards = (): BetCardData[] => [
  ...mostPopularCards,
  ...latestCards,
];

export const getCardById = (id: string): BetCardData | undefined =>
  getAllCards().find((c) => c.id === id);
