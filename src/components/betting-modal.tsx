"use client";

import React, { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { Transaction } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import check from "@/../public/check.svg";
import { ModalPortal } from "./modal-portal";
import { useMarketPools } from "@/hooks/useMarketPools";
import { useWallet } from "@/contexts/WalletContext";
import { useQueryClient } from "@tanstack/react-query";

const SOL_LAMPORTS = 1_000_000_000;

export interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketId: string;
  title: string;
  betType: "yes" | "no";
  /** Flag image(s) or emoji for header */
  headerFlags: ReactNode;
  maxBet?: string;
}

const GREEN = "#22c55e";

export default function BettingModal({
  isOpen,
  onClose,
  marketId,
  title,
  betType,
  headerFlags,
  maxBet = "5",
}: BettingModalProps) {
  const maxBetNum = parseFloat(maxBet);
  const [sliderValue, setSliderValue] = useState(0.01);
  const [inputVal, setInputVal] = useState("0.01");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { connection } = useConnection();
  const { address, signTransaction } = useWallet();
  const queryClient = useQueryClient();
  const marketData = useMarketPools(marketId);

  useEffect(() => {
    if (!isOpen) {
      setSuccessModalOpen(false);
      setSliderValue(0.01);
      setInputVal("0.01");
      setIsSubmitting(false);
      setTxSig(null);
      setSubmitError(null);
    }
  }, [isOpen]);

  const commitInput = (raw: string) => {
    const parsed = parseFloat(raw);
    const clamped = isNaN(parsed) ? 0.01 : Math.min(maxBetNum, Math.max(0.01, parsed));
    setSliderValue(clamped);
    setInputVal(clamped.toFixed(2));
  };

  const payout = marketData.calculatePayout(sliderValue, betType === "yes");

  const handlePlaceBet = async () => {
    if (!address || !signTransaction) {
      setSubmitError("Connect your wallet first.");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const lamports = BigInt(Math.floor(sliderValue * SOL_LAMPORTS));
      const res = await fetch("/api/bets/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId,
          side: betType === "yes" ? "YES" : "NO",
          amountLamports: lamports.toString(),
          userPubkey: address,
        }),
      });
      const json = (await res.json()) as {
        error?: string;
        txBase64?: string;
        blockhash?: string;
        lastValidBlockHeight?: number;
      };
      if (!res.ok) throw new Error(json.error ?? "Could not build transaction");

      const tx = Transaction.from(Buffer.from(json.txBase64!, "base64"));
      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
      });
      await connection.confirmTransaction(
        {
          signature: sig,
          blockhash: json.blockhash!,
          lastValidBlockHeight: json.lastValidBlockHeight!,
        },
        "confirmed",
      );

      setTxSig(sig);
      void queryClient.invalidateQueries({ queryKey: ["marketPools", marketId] });
      marketData.refetch();
      setSuccessModalOpen(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        onClick={onClose}
        style={{ zIndex: 9999 }}
      >
        <div className="absolute inset-0 bg-[rgba(5,6,26,0.72)] backdrop-blur-sm" />

        {!successModalOpen && (
          <div
            className="relative w-[600px] wc-card p-6 mx-4 md:mx-0 modal-content-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
            .wcup-slider {
              -webkit-appearance: none;
              appearance: none;
              background: transparent;
              height: 7px;
              border-radius: 9999px;
              outline: none;
            }
            .wcup-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: ${GREEN};
              border: 3px solid ${GREEN};
              cursor: pointer;
            }
            .wcup-slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: ${GREEN};
              cursor: pointer;
              border: none;
            }
          `}</style>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#1C1C1C] hover:text-[#1C1C1C]/40 text-2xl w-8 h-8 flex items-center justify-center cursor-pointer"
              type="button"
            >
              ×
            </button>

            <div className="flex items-center mb-6 gap-4 min-w-0">
              <div className="shrink-0 w-[56px] h-[40px] flex items-center justify-center rounded-lg bg-[#1a472a]/10 overflow-hidden">
                {headerFlags}
              </div>
              <div className="flex flex-col font-pp-neue font-medium min-w-0">
                <span className="text-[#1C1C1C] text-[16px]">Make Your Call</span>
                <span className="text-[#1C1C1C]/70 text-[14px] truncate">{title}</span>
              </div>
            </div>

            {submitError && (
              <p className="text-red-600 text-sm mb-3">{submitError}</p>
            )}

            <div className="mt-[26px]">
              <div className="flex items-center gap-2 mb-[28px] font-pp-neue">
                <div className="flex items-center pl-[18px] pr-1 flex-1 w-full justify-between bg-[#C7C7C7]/24 border border-[#C4C4C4]/20 rounded-lg h-[40px]">
                  <input
                    type="number"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onBlur={(e) => commitInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && commitInput(inputVal)}
                    min="0.01"
                    max={maxBetNum}
                    step="0.01"
                    className="bg-transparent w-full rounded-lg text-[#1C1C1C] text-sm font-medium focus:outline-none"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                      appearance: "none",
                    }}
                  />
                  <span className="text-sm font-medium px-3 text-[#1C1C1C]">
                    SOL
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(maxBetNum, parseFloat((sliderValue + 0.01).toFixed(2)));
                    setSliderValue(next);
                    setInputVal(next.toFixed(2));
                  }}
                  className="font-medium bg-[#C7C7C7]/24 border border-[#C4C4C4]/20 cursor-pointer hover:bg-[#3a3a3a]/10 w-[50px] h-[40px] rounded-lg text-[#1C1C1C] text-sm"
                >
                  +0.01
                </button>
              </div>

              <div className="mb-[6px]">
                <input
                  type="range"
                  min="0.01"
                  max={maxBetNum}
                  step="0.01"
                  value={sliderValue}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setSliderValue(v);
                    setInputVal(v.toFixed(2));
                  }}
                  className="w-full cursor-pointer focus:outline-none wcup-slider"
                  style={{
                    background: `linear-gradient(to right, ${GREEN} ${
                      ((sliderValue - 0.01) / (maxBetNum - 0.01)) * 100
                    }%, #333 ${
                      ((sliderValue - 0.01) / (maxBetNum - 0.01)) * 100
                    }%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[#1C1C1C] text-xs font-pp-neue font-medium">
                <span>0.01 SOL</span>
                <span>{maxBet} SOL</span>
              </div>
            </div>

            <div
              className="bg-[#C7C7C7]/24 rounded-lg px-[20px] py-[18px] mb-6 mt-[22px] font-medium border border-[#C4C4C4]/20"
              key={`payout-${sliderValue}-${betType}`}
            >
              <div className="text-[#1C1C1C] text-xs font-pp-neue mb-2">
                Potential payout if {betType === "yes" ? "YES" : "NO"} wins:
              </div>
              <div
                className="text-[24px] font-pp-neue font-semibold mb-1"
                style={{ color: GREEN }}
              >
                {payout.gross.toFixed(3)} SOL
              </div>
              <div className="text-[#1C1C1C] text-xs font-pp-neue">
                Net after 2% fee:{" "}
                <span style={{ color: GREEN }}>{payout.net.toFixed(3)} SOL</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handlePlaceBet()}
              disabled={isSubmitting}
              className="w-full wc-btn-pump !py-4 !text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {isSubmitting
                ? "Confirming..."
                : `Make Your Call • ${betType.toUpperCase()} • ${sliderValue.toFixed(2)} SOL`}
            </button>
            <p className="text-center text-[#7E7E7E] text-[10px] font-pp-neue mt-3">
              SOL is sent to the protocol vault on-chain. Payouts run after the market resolves.
            </p>
          </div>
        )}

        {successModalOpen && (
          <div
            className="relative w-[490px] wc-card py-14 px-6 mx-4 md:mx-0 modal-content-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseSuccess}
              className="absolute top-4 right-4 text-[#1C1C1C] hover:text-[#1C1C1C]/60 text-2xl w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
            <div className="flex justify-center">
              <div className="w-[74px] h-[74px] rounded-full flex items-center justify-center bg-[#059669]">
                <Image src={check} alt="" />
              </div>
            </div>
            <h2 className="text-[#1C1C1C] text-[24px] font-pp-neue font-medium text-center mb-[13px]">
              Your call is in.
            </h2>
            <p className="text-[#1C1C1C]/70 text-[12px] font-pp-neue text-center break-all px-2">
              {betType.toUpperCase()} for {sliderValue.toFixed(2)} SOL — transaction{" "}
              {txSig ? (
                <a
                  href={`https://solscan.io/tx/${txSig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#059669] underline"
                >
                  {txSig.slice(0, 8)}…
                </a>
              ) : (
                "submitted"
              )}
              .
            </p>
          </div>
        )}
      </div>
    </ModalPortal>
  );
}
