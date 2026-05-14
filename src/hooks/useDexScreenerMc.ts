import { useQuery } from "@tanstack/react-query";
import { fetchTokenByMint } from "@/lib/dexscreener";

export const DEX_REFETCH_MS = 30_000;

export function useDexScreenerMc(mint: string | undefined) {
  return useQuery({
    queryKey: ["dexscreener", "token", mint],
    queryFn: () => fetchTokenByMint(mint!),
    enabled: Boolean(mint && mint.length > 20),
    refetchInterval: DEX_REFETCH_MS,
    refetchIntervalInBackground: true,
    staleTime: 15_000,
  });
}
