"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppWalletProvider } from "@/contexts/WalletContext";
import { SolanaWalletProviders } from "@/components/solana-wallet-providers";
import { WalletConnectModal } from "@/components/wallet-connect-modal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
      networkMode: "always",
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SolanaWalletProviders>
        <AppWalletProvider>
          <LanguageProvider>
            {children}
            <WalletConnectModal />
          </LanguageProvider>
        </AppWalletProvider>
      </SolanaWalletProviders>
    </QueryClientProvider>
  );
}
