"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAnimationSequence } from "@/hooks/useAnimationSequence";
import { useLanguage } from "@/contexts/LanguageContext";
import x from "@/../public/twitter.svg";

function Hero() {
  const { hero } = useAnimationSequence();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyCA = () => {
    const ca = t("hero.caPlaceholder");
    navigator.clipboard.writeText(ca).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className={`flex flex-col justify-center gap-4 items-center mt-[80px] sm:mt-[95px] px-4 sm:px-6 md:px-8 transition-all duration-1000 ease-out ${
        hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <a
        href="https://x.com/i/communities/1943664016188207289"
        target="_blank"
        rel="noopener noreferrer"
        className="wc-btn-cta !text-xs !py-2 !px-4 h-auto inline-flex items-center gap-1.5 no-underline"
      >
        <Image src={x} alt="X" width={11} height={11} className="brightness-0 opacity-80" />
        <span className="font-semibold tracking-tight">Twitter</span>
      </a>
      <div className="flex flex-col items-center gap-2 text-center max-w-[720px]">
        <h1
          className="text-white text-[clamp(56px,7vw,88px)] leading-[0.95] tracking-wide"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            textShadow: "0 18px 55px rgba(0,0,0,0.25)",
          }}
        >
          World Cup Bets
        </h1>
        <p className="text-[rgba(255,255,255,0.92)] text-[clamp(0.95rem,2.5vw,1.125rem)] leading-relaxed text-shadow-[0_12px_45px_rgba(0,0,0,0.2)]">
          {t("hero.subtitle")}
        </p>
        <p className="text-[rgba(255,255,255,0.78)] text-sm mt-1">{t("hero.tagline")}</p>
      </div>
      <div className="flex flex-col items-center gap-1 mt-2 text-[rgba(253,230,138,0.95)]">
        <span className="text-sm font-semibold">$WCUP</span>
        <button
          type="button"
          onClick={handleCopyCA}
          title="Click to copy CA"
          className="flex flex-col items-center gap-0.5 mt-1 max-w-[min(100%,26rem)] px-3 cursor-pointer bg-transparent border-0 group"
        >
          <span className="text-[10px] uppercase tracking-[0.12em] text-white/45 font-medium">
            {copied ? "Copied!" : t("hero.caLabel")}
          </span>
          <span className="text-[11px] font-mono text-center tracking-tight flex items-center gap-1.5 transition-colors group-hover:text-white/90 text-white/65">
            {t("hero.caPlaceholder")}
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 shrink-0">
              {copied
                ? <path d="M20 6L9 17l-5-5" />
                : <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>
              }
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

export default Hero;
