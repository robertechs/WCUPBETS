"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import time from "@/../public/time.svg";
import { useWallet } from "@/contexts/WalletContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useResolveMintBySymbol } from "@/hooks/useResolveMintBySymbol";
import { useDexScreenerMc } from "@/hooks/useDexScreenerMc";
import { getRoundDeadlineMs, type TournamentRoundId } from "@/lib/tournament";
import { formatCompactUsd, formatUsdPrice } from "@/lib/format";
import type { WcupMarketType } from "@/lib/markets";
import { getMarketCardStats } from "@/lib/market-card-stats";
import { MarketActivityBar } from "./market-activity-bar";
import BettingModal from "./betting-modal";

const GREEN = "#22c55e";

function CopyableMint({ mint, symbol }: { mint: string | undefined; symbol?: string }) {
  const [copied, setCopied] = useState(false);
  if (!mint) return null;
  const short = mint.length >= 12 ? `${mint.slice(0, 6)}…${mint.slice(-4)}` : mint;
  const handleCopy = () => {
    navigator.clipboard.writeText(mint).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied!" : mint}
      className="wc-mint-line flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity bg-transparent border-0 p-0 text-left"
    >
      {symbol && <span className="font-semibold">${symbol}:</span>}
      <span>{copied ? "Copied!" : short}</span>
      {!copied && (
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 shrink-0">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      )}
    </button>
  );
}

function TokenIcon({ symbol, countryCode, flag, size }: { symbol: string; countryCode?: string; flag: string; size: number }) {
  if (symbol === "WORLDCUP") {
    return (
      <Image
        src="/worldcup-trophy.png"
        alt="World Cup Trophy"
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  if (countryCode) {
    return (
      <Image
        src={`https://flagcdn.com/w80/${countryCode}.png`}
        alt={symbol}
        width={size * 1.5}
        height={size}
        className="object-cover rounded-[3px]"
        style={{ width: "auto", height: size }}
        unoptimized
      />
    );
  }
  return <span style={{ fontSize: size, lineHeight: 1 }}>{flag}</span>;
}

interface CardProps {
  marketId: string;
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
  onYesClick?: () => void;
  onNoClick?: () => void;
}

export default function Card({
  marketId,
  marketType,
  tokens,
  title,
  topic,
  roundId,
  percentage: initialPercentage = "50%",
  onYesClick,
  onNoClick,
}: CardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [betType, setBetType] = useState<"yes" | "no">("yes");
  const [modalKey, setModalKey] = useState(0);
  const [tick, setTick] = useState(Date.now());
  const { isConnected, openConnectModal } = useWallet();
  const { t } = useLanguage();

  const symA = tokens[0]?.symbol;
  const symB = tokens[1]?.symbol;
  const mintAQuery = useResolveMintBySymbol(symA);
  const mintBQuery = useResolveMintBySymbol(
    marketType === "h2h" ? symB : undefined,
  );

  const dexA = useDexScreenerMc(mintAQuery.data);
  const dexB = useDexScreenerMc(
    marketType === "h2h" ? mintBQuery.data : undefined,
  );

  const cardStats = getMarketCardStats(marketId);
  const percentage = `${cardStats.yesPercent}%`;

  const deadlineMs = getRoundDeadlineMs(roundId);

  const calculateTimeRemaining = (): string => {
    const diff = deadlineMs - tick;
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const tmr = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(tmr);
  }, []);

  const displayTimeRemaining = calculateTimeRemaining();

  const handleYesClick = () => {
    setBetType("yes");
    if (isConnected) {
      setModalKey((p) => p + 1);
      setModalOpen(true);
    } else {
      openConnectModal();
    }
    onYesClick?.();
  };

  const handleNoClick = () => {
    setBetType("no");
    if (isConnected) {
      setModalKey((p) => p + 1);
      setModalOpen(true);
    } else {
      openConnectModal();
    }
    onNoClick?.();
  };

  const percentValue = parseFloat(percentage.replace("%", ""));
  const redPercentage = 100 - percentValue;

  const mcLineA =
    dexA.isLoading || mintAQuery.isPending
      ? "…"
      : formatCompactUsd(dexA.data?.fdvUsd ?? 0);
  const mcLineB =
    marketType === "h2h"
      ? dexB.isLoading || mintBQuery.isPending
        ? "…"
        : formatCompactUsd(dexB.data?.fdvUsd ?? 0)
      : null;

  const volA = dexA.data?.volume24hUsd
    ? formatCompactUsd(dexA.data.volume24hUsd)
    : "—";

  const priceA = formatUsdPrice(dexA.data?.priceUsd ?? 0);
  const priceB =
    marketType === "h2h"
      ? formatUsdPrice(dexB.data?.priceUsd ?? 0)
      : null;

  const tradeLinks: { label: string; href: string }[] = [];
  if (dexA.data?.pairUrl)
    tradeLinks.push({ label: `$${symA}`, href: dexA.data.pairUrl });
  if (marketType === "h2h" && dexB.data?.pairUrl && symB)
    tradeLinks.push({ label: `$${symB}`, href: dexB.data.pairUrl });

  const headerFlags =
    marketType === "h2h" ? (
      <span className="flex gap-0.5 h-full items-center">
        <TokenIcon symbol={tokens[0]?.symbol ?? ""} countryCode={tokens[0]?.countryCode} flag={tokens[0]?.flag ?? ""} size={20} />
        <TokenIcon symbol={tokens[1]?.symbol ?? ""} countryCode={tokens[1]?.countryCode} flag={tokens[1]?.flag ?? ""} size={20} />
      </span>
    ) : (
      <TokenIcon symbol={tokens[0]?.symbol ?? ""} countryCode={tokens[0]?.countryCode} flag={tokens[0]?.flag ?? ""} size={24} />
    );

  return (
    <>
      <div className="wc-card h-full flex flex-col">
        <div className="wc-card-glow" aria-hidden />
        <div className="flex items-start gap-2">
          <div className="wc-flag">
            {marketType === "h2h" ? (
              <span className="flex gap-0.5">
                <TokenIcon symbol={tokens[0]?.symbol ?? ""} countryCode={tokens[0]?.countryCode} flag={tokens[0]?.flag ?? ""} size={14} />
                <TokenIcon symbol={tokens[1]?.symbol ?? ""} countryCode={tokens[1]?.countryCode} flag={tokens[1]?.flag ?? ""} size={14} />
              </span>
            ) : (
              <TokenIcon symbol={tokens[0]?.symbol ?? ""} countryCode={tokens[0]?.countryCode} flag={tokens[0]?.flag ?? ""} size={20} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="wc-card-title min-w-0 flex-1">{title}</h2>
            </div>
            <p className="text-xs text-[#334155] mt-0.5 leading-snug">{topic}</p>
          </div>
        </div>

        <div className="wc-stats-grid">
          <div className="wc-stat">
            <p className="wc-stat-label">Market cap</p>
            <p className="wc-stat-big">{marketType === "h2h" && mcLineB ? `${mcLineA} / ${mcLineB}` : mcLineA}</p>
          </div>
          <div className="wc-stat wc-stat-vol">
            <p className="wc-stat-label">24h volume</p>
            <p className="wc-stat-big wc-stat-big-vol">{volA}</p>
          </div>
          <div className="wc-stat wc-stat-gold">
            <p className="wc-stat-label">Price</p>
            <span className="wc-stat-mono">
              {marketType === "h2h" && priceB
                ? `${priceA} / ${priceB}`
                : priceA}
            </span>
          </div>
        </div>

        <CopyableMint mint={dexA.data?.mint} symbol={marketType === "h2h" ? symA : undefined} />
        {marketType === "h2h" && <CopyableMint mint={dexB.data?.mint} symbol={symB} />}

        <div className="flex-1" />
        <div className="flex flex-col w-full text-[#0f172a] font-semibold mt-2">
          <div className="flex justify-between">
            <div
              className="h-[34px] flex items-center gap-1 px-3 rounded-lg"
              style={{
                background: "linear-gradient(to right, rgba(34,197,94,0.12), transparent)",
              }}
            >
              <span className="text-[13px]" style={{ color: GREEN }}>
                {percentage}
              </span>
              <span className="text-[13px]">{t("home.chance")}</span>
            </div>
            <div
              className="h-[34px] flex items-center gap-1 px-3 rounded-lg"
              style={{
                background: "linear-gradient(to right, transparent, rgba(181,46,41,0.08))",
              }}
            >
              <span className="text-[#B52E29] text-[13px]">{redPercentage}% </span>
              <span className="text-[13px]">{t("home.chance")}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleYesClick}
              className="flex-1 cursor-pointer hover:opacity-90 transition-opacity rounded-lg h-[44px] px-3 flex items-center justify-center"
              style={{ backgroundColor: "#4ade80" }}
            >
              <span className="text-[#0f172a] font-semibold text-[18px]">
                {t("home.yes")}
              </span>
            </button>
            <button
              type="button"
              onClick={handleNoClick}
              className="flex-1 bg-[#A94137]/10 cursor-pointer hover:bg-[#A94137]/20 transition-colors rounded-lg h-[44px] px-3 flex items-center justify-center"
            >
              <span className="text-[#B52E29] font-semibold text-[18px]">
                {t("home.no")}
              </span>
            </button>
          </div>
          <MarketActivityBar marketId={marketId} />
        </div>

        <div className="flex justify-between mt-3 gap-2 text-[12px] text-[rgba(51,65,85,0.85)]">
          <div className="flex gap-2 items-center min-w-0">
            <Image src={time} alt="" className="w-4 h-4 shrink-0 opacity-70" />
            <span className="truncate">
              <span className="font-semibold text-[#0f172a]">Ends</span>{" "}
              {displayTimeRemaining}
            </span>
          </div>
        </div>

      </div>

      <BettingModal
        key={`modal-${modalKey}`}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        marketId={marketId}
        title={title}
        betType={betType}
        headerFlags={headerFlags}
      />
    </>
  );
}
