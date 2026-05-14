"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import questionIcon from "@/../public/question.svg";
import { HowItWorksModal } from "./how-it-works-modal";
import { useAnimationSequence } from "@/hooks/useAnimationSequence";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWallet } from "@/contexts/WalletContext";

function Navbar() {
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address, isConnected, openConnectModal, disconnect } = useWallet();
  const { navbar } = useAnimationSequence();
  const pathname = usePathname();
  const { t } = useLanguage();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const pillLink = (href: string, active: boolean) =>
    `wc-nav-pill ${active ? "wc-nav-pill-active" : ""}`;

  return (
    <>
      <div
        className={`flex flex-wrap justify-between items-center gap-y-3 max-w-[1120px] mx-auto md:px-0 px-4 transition-all duration-1000 ease-out ${
          navbar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex-shrink-0 flex items-center gap-1">
            <Image src="/wcupbets-logo.png" alt="WCupBets logo" width={42} height={42} className="object-contain translate-y-[-2px]" />
            <span
              className="text-xl tracking-wide text-white leading-none"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                textShadow: "0 8px 30px rgba(0,0,0,0.25)",
              }}
            >
              WCupBets
            </span>
          </Link>
        </div>

        <div className="hidden md:flex flex-wrap items-center justify-center gap-2.5 flex-1">
          <Link href="/" className={pillLink("/", pathname === "/")}>
            {t("nav.markets")}
          </Link>
          <Link href="/my-bets" className={pillLink("/my-bets", pathname === "/my-bets")}>
            {t("nav.myBets")}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-wrap justify-end">
          <a
            href="https://x.com/0xricch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-white/70 transition-colors tracking-wide mr-1"
          >
            dev: @0xricch
          </a>
          <button
            onClick={() => setHowItWorksModalOpen(true)}
            className="wc-nav-pill !px-4 !py-2 !text-sm gap-2"
            type="button"
          >
            <Image
              src={questionIcon}
              alt=""
              width={16}
              height={16}
              className={
                pathname === "/" ? "brightness-0 opacity-90" : "invert opacity-90"
              }
            />
            {t("nav.howItWorks")}
          </button>

          {!isConnected ? (
            <button
              onClick={() => openConnectModal()}
              type="button"
              className="wc-btn-pump !text-sm !px-4 !py-2.5"
            >
              {t("nav.connectWallet")}
            </button>
          ) : (
            <div className="flex gap-2 items-center">
              <button
                onClick={disconnect}
                className="wc-nav-pill !text-xs !px-3 !py-2 !font-semibold"
                type="button"
              >
                {t("nav.disconnect")}
              </button>
              <span
                className="inline-flex items-center max-w-[160px] truncate rounded-full px-3 py-2 text-xs font-mono text-[#0f172a] bg-[rgba(255,255,255,0.92)] border border-[rgba(226,232,240,0.95)] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                title={address ?? ""}
              >
                {address
                  ? `${address.slice(0, 4)}…${address.slice(-4)}`
                  : "…"}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex flex-col gap-1 p-2 rounded-lg bg-white/10"
          type="button"
          aria-label="Menu"
        >
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 md:hidden border-l border-white/20 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #07122c 0%, #0b2a5a 100%)",
        }}
      >
        <div className="flex flex-col h-full text-white">
          <div className="flex justify-between items-center p-4 border-b border-white/15">
            <span style={{ fontFamily: "var(--font-bebas), sans-serif" }} className="text-lg">
              WCupBets
            </span>
            <button onClick={closeMobileMenu} className="p-2" type="button" aria-label="Close">
              <div className="w-6 h-0.5 bg-white rotate-45" />
              <div className="w-6 h-0.5 bg-white -rotate-45 -translate-y-0.5" />
            </button>
          </div>
          <div className="flex flex-col p-4 gap-3">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={pillLink("/", pathname === "/")}
            >
              {t("nav.markets")}
            </Link>
            <Link
              href="/my-bets"
              onClick={closeMobileMenu}
              className={pillLink("/my-bets", pathname === "/my-bets")}
            >
              {t("nav.myBets")}
            </Link>
          </div>
          <div className="mt-auto p-4 border-t border-white/15 space-y-3">
            <button
              onClick={() => {
                setHowItWorksModalOpen(true);
                closeMobileMenu();
              }}
              className="w-full wc-nav-pill justify-center gap-2"
              type="button"
            >
              <Image src={questionIcon} alt="" width={16} height={16} className="invert" />
              {t("nav.howItWorks")}
            </button>
            {!isConnected ? (
              <button
                onClick={() => {
                  openConnectModal();
                  closeMobileMenu();
                }}
                type="button"
                className="w-full wc-btn-pump justify-center py-3"
              >
                {t("nav.connectWallet")}
              </button>
            ) : (
              <button
                onClick={() => {
                  disconnect();
                  closeMobileMenu();
                }}
                type="button"
                className="w-full wc-nav-pill justify-center py-3"
              >
                {t("nav.disconnectWallet")}
              </button>
            )}
          </div>
        </div>
      </div>

      <HowItWorksModal
        isOpen={howItWorksModalOpen}
        onClose={() => setHowItWorksModalOpen(false)}
      />
    </>
  );
}

export default Navbar;
