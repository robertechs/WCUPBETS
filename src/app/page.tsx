"use client";

import Card from "@/components/card";
import CardFullWidth from "@/components/card-fullwidth";
import Hero from "@/components/hero";
import { RefreshTicker } from "@/components/refresh-ticker";
import Image from "next/image";
import time from "@/../public/time.svg";
import cup from "@/../public/cup.svg";
import { useAnimationSequence } from "@/hooks/useAnimationSequence";
import { useLanguage } from "@/contexts/LanguageContext";
import { mostPopularCards, latestCards } from "@/data/betCards";

export default function Home() {
  const {
    mostPopularHeader,
    mostPopularCards: mostPopularCardsAnimated,
    latestHeader,
    cards,
  } = useAnimationSequence();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col max-w-[1120px] mx-auto px-4">
      <Hero />
      <div className="flex flex-col mt-[84px] gap-9">
        <div
          className={`flex items-center justify-between gap-4 transition-all duration-1000 ease-out ${
            mostPopularHeader
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="wc-section-title flex gap-3 items-center">
            <Image src={cup} alt="" className="w-9 h-9 shrink-0" style={{ filter: "brightness(0) invert(1)", opacity: 0.9 }} />
            {t("home.mostPopular")}
          </div>
          <RefreshTicker />
        </div>
        <div
          className={`flex flex-col gap-[14px] transition-all duration-1000 ease-out ${
            mostPopularCardsAnimated
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {mostPopularCards.map((card) => (
            <CardFullWidth
              key={card.id}
              marketId={card.id}
              marketType={card.marketType}
              tokens={card.tokens}
              title={card.title}
              topic={card.topic}
              roundId={card.roundId}
              targetMcUsd={card.targetMcUsd}
              percentage={card.percentage}
              startingDate={card.startingDate}
              timeRemaining={card.timeRemaining}
              yesButtonText={card.yesButtonText}
              noButtonText={card.noButtonText}
              yesBetAmount={card.yesBetAmount}
              noBetAmount={card.noBetAmount}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col mt-[84px] gap-9">
        <div
          className={`wc-section-title flex gap-3 items-center transition-all duration-1000 ease-out ${
            latestHeader ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Image src={time} alt="" className="w-9 h-9 invert opacity-90 shrink-0" />
          {t("home.latest")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
          {latestCards.map((card, index) => (
            <div
              key={card.id}
              className={`min-w-0 flex flex-col [&>.wc-card]:flex-1 transition-all duration-1000 ease-out ${
                cards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: cards ? `${index * 200}ms` : "0ms",
              }}
            >
              <Card
                marketId={card.id}
                marketType={card.marketType}
                tokens={card.tokens}
                title={card.title}
                topic={card.topic}
                roundId={card.roundId}
                targetMcUsd={card.targetMcUsd}
                percentage={card.percentage}
                startingDate={card.startingDate}
                timeRemaining={card.timeRemaining}
                yesButtonText={card.yesButtonText}
                noButtonText={card.noButtonText}
                yesBetAmount={card.yesBetAmount}
                noBetAmount={card.noBetAmount}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
