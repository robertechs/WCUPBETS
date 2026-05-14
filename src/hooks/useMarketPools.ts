"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export type MarketPoolsSnapshot = {
  yesPool: number;
  noPool: number;
  isResolved: boolean;
  outcome: "YES" | "NO" | null;
};

async function fetchPools(marketId: string): Promise<MarketPoolsSnapshot> {
  const res = await fetch(`/api/markets/${encodeURIComponent(marketId)}/pools`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(j.error ?? res.statusText);
  }
  return res.json() as Promise<MarketPoolsSnapshot>;
}

/** Parimutuel pool + UI odds; replaces demo `useMockMarketState`. */
export function useMarketPools(marketId: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["marketPools", marketId],
    queryFn: () => fetchPools(marketId),
    staleTime: 10_000,
    refetchInterval: 15_000,
    retry: 1,
    placeholderData: {
      yesPool: 0,
      noPool: 0,
      isResolved: false,
      outcome: null,
    },
  });

  const pools = useMemo(
    () => ({
      yesPool: query.data?.yesPool ?? 0,
      noPool: query.data?.noPool ?? 0,
    }),
    [query.data?.yesPool, query.data?.noPool],
  );

  const totalPoolNum = pools.yesPool + pools.noPool;
  const yesPct =
    totalPoolNum > 0 ? Math.round((pools.yesPool / totalPoolNum) * 100) : 50;
  const percentage = `${yesPct}%`;

  const odds = useMemo(() => {
    if (pools.yesPool <= 0 || pools.noPool <= 0) return null;
    return {
      yesMultiplier: totalPoolNum / pools.yesPool,
      noMultiplier: totalPoolNum / pools.noPool,
    };
  }, [pools.noPool, pools.yesPool, totalPoolNum]);

  const calculatePayout = useCallback(
    (betAmount: number, isYes: boolean) => {
      const currentYes = pools.yesPool;
      const currentNo = pools.noPool;
      if (currentYes === 0 && currentNo === 0) {
        const gross = betAmount;
        return { gross, net: gross * 0.98 };
      }
      const newYes = isYes ? currentYes + betAmount : currentYes;
      const newNo = !isYes ? currentNo + betAmount : currentNo;
      const newTotal = newYes + newNo;
      if ((isYes && newNo === 0) || (!isYes && newYes === 0)) {
        return { gross: betAmount, net: betAmount * 0.98 };
      }
      const winningPool = isYes ? newYes : newNo;
      const multiplier = newTotal / winningPool;
      const gross = betAmount * multiplier;
      const fee = gross * 0.02;
      return { gross, net: gross - fee };
    },
    [pools.yesPool, pools.noPool],
  );

  const refetch = useCallback(() => {
    void qc.invalidateQueries({ queryKey: ["marketPools", marketId] });
  }, [qc, marketId]);

  const placeBet = useCallback(() => {
    /* on-chain: use betting modal + /api/bets/build */
  }, []);

  return useMemo(
    () => ({
      pools,
      totalPool: totalPoolNum.toFixed(4),
      percentage,
      odds,
      calculatePayout,
      placeBet,
      refetch,
      isResolved: query.data?.isResolved ?? false,
      hasClaimed: false,
      userBets: { yes: "0", no: "0", total: "0" },
      deadline: 0,
    }),
    [
      calculatePayout,
      odds,
      percentage,
      placeBet,
      pools,
      refetch,
      totalPoolNum,
      query.data?.isResolved,
    ],
  );
}
