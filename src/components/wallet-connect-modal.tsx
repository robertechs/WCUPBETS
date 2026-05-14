"use client";

import Image from "next/image";
import React, { useState } from "react";
import type { WalletName } from "@solana/wallet-adapter-base";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import phantomIcon from "@/../public/phantom-icon.png";
import wallet from "@/../public/wallet_icon.svg";
import { ModalPortal } from "./modal-portal";
import { useWallet } from "@/contexts/WalletContext";

const WALLET_ORDER = ["Phantom"] as const;

function isPhantom(name: string) {
  return name.toLowerCase().includes("phantom");
}

export function WalletConnectModal() {
  const { connectModalOpen, closeConnectModal } = useWallet();
  const { wallets, select, connect, connecting, connected } = useSolanaWallet();
  const [error, setError] = useState<string | null>(null);

  if (!connectModalOpen) return null;

  const orderedWallets = WALLET_ORDER.map((want) =>
    wallets.find((w) => w.adapter.name === want),
  ).filter((w): w is NonNullable<typeof w> => Boolean(w));

  const handleConnectInstalled = async (adapterName: string) => {
    setError(null);
    try {
      await select(adapterName as WalletName);
      await connect();
      closeConnectModal();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not connect");
    }
  };

  const handleRowActivate = (
    adapterName: string,
    readyState: WalletReadyState,
    installUrl: string,
  ) => {
    if (
      readyState === WalletReadyState.Installed ||
      readyState === WalletReadyState.Loadable
    ) {
      void handleConnectInstalled(adapterName);
      return;
    }
    if (installUrl) {
      window.open(installUrl, "_blank", "noopener,noreferrer");
    } else {
      setError(`Install ${adapterName} to continue.`);
    }
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        onClick={closeConnectModal}
        style={{ zIndex: 9999 }}
      >
        <div className="absolute inset-0 bg-[rgba(5,6,26,0.72)] backdrop-blur-sm" />
        <div
          className="relative w-[490px] wc-card px-6 mx-4 md:mx-0 modal-content-enter py-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={closeConnectModal}
            className="absolute top-4 right-4 text-[#1C1C1C] hover:text-black text-2xl w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            ×
          </button>
          <div className="flex justify-center mb-4 mt-[10px]">
            <div className="flex w-[75px] h-[75px] items-center justify-center rounded-full bg-[#059669]">
              <Image src={wallet} alt="" />
            </div>
          </div>
          <h2 className="text-[#1C1C1C] text-[24px] font-pp-neue font-medium text-center mb-2">
            Connect Wallet
          </h2>
          <p className="text-[#1C1C1C]/69 text-[12px] font-pp-neue text-center mb-4">
            Connect a Solana wallet on mainnet to place calls.
          </p>
          {connected && (
            <p className="text-emerald-700 text-xs text-center mb-2">Wallet connected.</p>
          )}
          {error && (
            <p className="text-red-600 text-xs text-center mb-2">{error}</p>
          )}
          <div className="space-y-3 mb-2">
            {orderedWallets.map((w) => {
              const name = w.adapter.name;
              const ready = w.readyState;
              const canConnect =
                ready === WalletReadyState.Installed ||
                ready === WalletReadyState.Loadable;
              const hint = !canConnect
                ? "Click to install"
                : connecting
                  ? "Connecting…"
                  : "Click to connect";

              return (
                <button
                  key={name}
                  type="button"
                  disabled={connecting && canConnect}
                  onClick={() => handleRowActivate(name, ready, w.adapter.url)}
                  className="w-full cursor-pointer bg-[#C7C7C7]/24 border border-[#C4C4C4]/20 hover:bg-[#22c55e]/10 transition-colors rounded-lg py-4 px-4 flex items-center justify-between disabled:opacity-60"
                >
                  <div className="flex items-center gap-6">
                    {isPhantom(name) ? (
                      <Image
                        src={phantomIcon}
                        alt=""
                        width={32}
                        height={32}
                        className="size-8 shrink-0 rounded-md object-contain"
                      />
                    ) : w.adapter.icon ? (
                      // Adapter-provided icon; often a data URL.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={w.adapter.icon}
                        alt=""
                        className="size-8 shrink-0 rounded-md object-contain"
                      />
                    ) : (
                      <div className="size-8 shrink-0 rounded-md bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {name.slice(0, 2)}
                      </div>
                    )}
                    <div className="text-left">
                      <div className="text-[#1C1C1C] font-pp-neue font-medium text-[20px]">
                        {name}
                      </div>
                      <div className="text-[#7E7E7E] text-xs font-pp-neue">{hint}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
