"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import time from "@/../public/time.svg";
import { useQuery } from "@tanstack/react-query";
import { useAnimationSequence } from "@/hooks/useAnimationSequence";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWallet } from "@/contexts/WalletContext";

export type UserBetRow = {
  id: string;
  marketId: string;
  title: string;
  side: string;
  amountSol: number;
  depositSig: string;
  status: string;
  payoutSig: string | null;
  payoutLamports: string | null;
  marketOutcome: string | null;
  ts: number;
};

async function fetchUserBets(pubkey: string): Promise<UserBetRow[]> {
  const res = await fetch(`/api/users/${encodeURIComponent(pubkey)}/bets`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(j.error ?? res.statusText);
  }
  const data = (await res.json()) as { bets: UserBetRow[] };
  return data.bets ?? [];
}

export default function MyBetsPage() {
  const { isConnected, address } = useWallet();
  const { myBetsHistoryHeader } = useAnimationSequence();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["userBets", address],
    queryFn: () => fetchUserBets(address!),
    enabled: Boolean(mounted && isConnected && address),
    staleTime: 20_000,
    refetchInterval: 30_000,
  });

  const totalSol = history.reduce((a, b) => a + b.amountSol, 0);

  return (
    <div className="flex flex-col max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`flex flex-col mt-8 sm:mt-16 lg:mt-[84px] gap-6 transition-all duration-1000 ease-out ${
          myBetsHistoryHeader
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="wc-page-title flex gap-3 items-center">
          <Image src={time} alt="" className="w-8 h-8 invert opacity-90 shrink-0" />
          {t("myBets.title")}
        </div>

        {!mounted || !isConnected ? (
          <div className="wc-card">
            <p className="p-8 text-center text-[rgba(71,85,105,0.92)] text-sm">
              {t("myBets.connectPrompt")}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
              <div className="wc-card flex flex-col items-center justify-center min-h-[120px] p-4">
                <span
                  className="text-4xl text-[#064e3b]"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  {isLoading ? "…" : history.length}
                </span>
                <span className="text-sm text-[rgba(51,65,85,0.85)] text-center mt-1">
                  {t("myBets.totalBets")}
                </span>
              </div>
              <div className="wc-card flex flex-col items-center justify-center min-h-[120px] p-4 sm:col-span-2">
                <span className="text-4xl text-[#0f172a] font-semibold">
                  {isLoading ? "…" : `${totalSol.toFixed(2)} SOL`}
                </span>
                <span className="text-sm text-[rgba(51,65,85,0.85)] text-center mt-1">
                  {t("myBets.totalWagered")}
                </span>
              </div>
            </div>

            <div>
              <div className="font-semibold text-[#0f172a] text-lg mb-3">
                {t("myBets.recentBets")}
              </div>
              {history.length === 0 && !isLoading ? (
                <div className="wc-card p-8 text-center text-[rgba(71,85,105,0.92)] text-sm">
                  {t("myBets.noRecent")}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
                  {history.map((row) => (
                    <div key={row.id} className="wc-card flex flex-col">
                      <div className="wc-card-glow" aria-hidden />
                      <h2 className="wc-card-title mb-3">{row.title}</h2>

                      <div className="wc-stats-grid mb-2">
                        <div className="wc-stat">
                          <p className="wc-stat-label">Wagered</p>
                          <p className="wc-stat-big">{row.amountSol.toFixed(2)} SOL</p>
                        </div>
                        <div className="wc-stat wc-stat-vol">
                          <p className="wc-stat-label">Status</p>
                          <p className="wc-stat-big" style={{ fontSize: "0.8rem" }}>
                            {row.status === "paid" ? "Paid out" : row.marketOutcome ? `Outcome ${row.marketOutcome}` : "Open"}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1" />

                      <div
                        className="mt-3 rounded-lg h-[44px] flex items-center justify-center font-semibold text-[18px]"
                        style={{
                          backgroundColor: row.side === "YES" ? "#4ade80" : "rgba(169,65,55,0.1)",
                          color: row.side === "YES" ? "#0f172a" : "#B52E29",
                        }}
                      >
                        {row.side}
                      </div>

                      <div className="flex items-center gap-2 mt-3 text-[12px] text-[rgba(51,65,85,0.85)]">
                        <Image src={time} alt="" className="w-4 h-4 shrink-0 opacity-70" />
                        <span>
                          <span className="font-semibold text-[#0f172a]">Called</span>{" "}
                          {new Date(row.ts).toLocaleString()}
                        </span>
                      </div>
                      <a
                        href={`https://solscan.io/tx/${row.depositSig}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#059669] mt-1 truncate hover:underline"
                      >
                        View deposit on Solscan
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
