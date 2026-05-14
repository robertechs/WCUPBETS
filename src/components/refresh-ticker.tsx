"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DEX_REFETCH_MS } from "@/hooks/useDexScreenerMc";

export function RefreshTicker() {
  const queryClient = useQueryClient();
  const [secsLeft, setSecsLeft] = useState(DEX_REFETCH_MS / 1000);
  const [justRefreshed, setJustRefreshed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecsLeft((prev) => {
        if (prev <= 1) {
          void queryClient.invalidateQueries({ queryKey: ["dexscreener", "token"] });
          void queryClient.invalidateQueries({ queryKey: ["marketPools"] });
          setJustRefreshed(true);
          setTimeout(() => setJustRefreshed(false), 1200);
          return DEX_REFETCH_MS / 1000;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [queryClient]);

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{
        background: justRefreshed
          ? "rgba(74,222,128,0.22)"
          : "rgba(255,255,255,0.13)",
        color: justRefreshed ? "#4ade80" : "rgba(255,255,255,0.65)",
        transition: "background 0.4s ease, color 0.4s ease",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        style={{
          animation: justRefreshed ? "spin 0.6s linear" : undefined,
        }}
      >
        <path
          d="M9 5A4 4 0 1 1 5.5 1.05"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M5.5 1.05 7 3l-2-.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {justRefreshed ? "Updated!" : `Refreshing in ${secsLeft}s`}
    </span>
  );
}
