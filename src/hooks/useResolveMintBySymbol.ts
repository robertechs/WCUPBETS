import { useQuery } from "@tanstack/react-query";
import { getKnownMintForSymbol, searchTokenBySymbol } from "@/lib/dexscreener";

const storageKey = (sym: string) => `wcupbets:mint:${sym.toUpperCase()}`;

export function useResolveMintBySymbol(symbol: string | undefined) {
  const clean = symbol
    ? symbol.replace(/^\$/, "").trim().toUpperCase()
    : "";

  return useQuery({
    queryKey: ["dexscreener", "mint", clean],
    enabled: clean.length > 0,
    queryFn: async () => {
      const canonical = getKnownMintForSymbol(clean);
      if (canonical) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(storageKey(clean), canonical);
        }
        return canonical;
      }
      if (typeof window !== "undefined") {
        const cached = sessionStorage.getItem(storageKey(clean));
        if (cached) return cached;
      }
      const mint = await searchTokenBySymbol(clean);
      if (!mint) throw new Error(`No Solana mint found for ${clean}`);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(storageKey(clean), mint);
      }
      return mint;
    },
    staleTime: 1000 * 60 * 60 * 24,
    retry: 2,
  });
}
