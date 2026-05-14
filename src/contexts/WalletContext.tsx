"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Transaction, VersionedTransaction } from "@solana/web3.js";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";

export type AppWalletContextValue = {
  isConnected: boolean;
  address: string | null;
  connectModalOpen: boolean;
  openConnectModal: () => void;
  closeConnectModal: () => void;
  disconnect: () => Promise<void>;
  /** @deprecated no-op; kept for gradual migration */
  connectStub: () => void;
  signTransaction:
    | ((tx: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>)
    | undefined;
  sendTransaction:
    | ((
        tx: Transaction | VersionedTransaction,
        connection: import("@solana/web3.js").Connection,
        options?: import("@solana/wallet-adapter-base").SendTransactionOptions,
      ) => Promise<string>)
    | undefined;
};

const AppWalletContext = createContext<AppWalletContextValue | undefined>(undefined);

export function AppWalletProvider({ children }: { children: React.ReactNode }) {
  const {
    publicKey,
    connected,
    disconnect,
    signTransaction,
    sendTransaction,
  } = useSolanaWallet();
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  const openConnectModal = useCallback(() => setConnectModalOpen(true), []);
  const closeConnectModal = useCallback(() => setConnectModalOpen(false), []);

  const disconnectAll = useCallback(async () => {
    await disconnect();
    setConnectModalOpen(false);
  }, [disconnect]);

  const connectStub = useCallback(() => {
    setConnectModalOpen(false);
  }, []);

  const value = useMemo<AppWalletContextValue>(
    () => ({
      isConnected: connected,
      address: publicKey?.toBase58() ?? null,
      connectModalOpen,
      openConnectModal,
      closeConnectModal,
      connectStub,
      disconnect: disconnectAll,
      signTransaction,
      sendTransaction,
    }),
    [
      connected,
      publicKey,
      connectModalOpen,
      openConnectModal,
      closeConnectModal,
      connectStub,
      disconnectAll,
      signTransaction,
      sendTransaction,
    ],
  );

  return (
    <AppWalletContext.Provider value={value}>{children}</AppWalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(AppWalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within AppWalletProvider");
  }
  return ctx;
}
