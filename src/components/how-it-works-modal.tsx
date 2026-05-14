"use client";
import React from "react";
import { ModalPortal } from "./modal-portal";
import how1 from "@/../public/Vector.svg";
import how3 from "@/../public/Vector-2.svg";
import how4 from "@/../public/cup.svg";
import qm from "@/../public/questionmark.svg";
import Image from "next/image";
import { DeskGlobeIcon } from "@/components/icons/DeskGlobeIcon";
import { useLanguage } from "@/contexts/LanguageContext";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center "
        onClick={onClose}
        style={{ zIndex: 9999 }}
      >
        <div className="absolute inset-0 bg-[rgba(5,6,26,0.72)] backdrop-blur-sm" />
        <div
          className="relative w-[90%] max-w-[480px] max-h-[90vh] wc-card wc-card--scroll mx-4 md:mx-0 modal-content-enter min-h-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#1C1C1C]/50 hover:text-[#1C1C1C] text-2xl w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            ×
          </button>

          {/* Title Section */}
          <div className="px-6 pt-6 pb-2">
            <div className="flex justify-center mb-3">
              <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center bg-[#059669]">
                  <Image src={qm} alt="" width={32} height={32} />
              </div>
            </div>
            <h2 className="text-[#0f172a] text-xl font-semibold text-center mb-2 mt-1 px-2 break-words text-balance">
              {t('howItWorks.title')}
            </h2>
            <p className="text-[#334155] text-xs text-center mb-4 px-2 sm:px-4 break-words leading-relaxed">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          {/* Four Steps */}
          <div className="px-4 sm:px-6 pb-6 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mx-auto">
              {/* Step 1: Connect Wallet */}
              <div className="rounded-lg p-3 sm:p-4 text-left sm:text-center border border-[#3B3B3B]/10 bg-white/40 min-w-0">
                <div className="w-9 h-9 mx-auto mb-2 flex items-center justify-center">
                  <Image src={how1} alt="" height={26} width={26} />
                </div>
                <h3 className="text-[#0f172a] font-medium text-sm mb-1 break-words text-balance">
                  {t('howItWorks.step1Title')}
                </h3>
                <p className="text-[#334155] text-xs leading-relaxed break-words">
                  {t('howItWorks.step1Desc')}
                </p>
              </div>

              {/* Step 2: Pick Your Coin — globe icon */}
              <div className="rounded-lg p-3 sm:p-4 text-left sm:text-center border border-[#3B3B3B]/10 bg-white/40 min-w-0">
                <div className="w-9 h-9 mx-auto mb-2 flex items-center justify-center">
                  <DeskGlobeIcon className="h-[30px] w-[30px] shrink-0" style={{ color: "#ca9b2a" }} />
                </div>
                <h3 className="text-[#0f172a] font-medium text-sm mb-1 break-words text-balance">
                  {t('howItWorks.step2Title')}
                </h3>
                <p className="text-[#334155] text-xs leading-relaxed break-words">
                  {t('howItWorks.step2Desc')}
                </p>
              </div>

              {/* Step 3: Watch the Market */}
              <div className="rounded-lg p-3 sm:p-4 text-left sm:text-center border border-[#3B3B3B]/10 bg-white/40 min-w-0">
                <div className="w-9 h-9 mx-auto mb-2 flex items-center justify-center">
                  <Image src={how3} alt="" height={30} width={30} />
                </div>
                <h3 className="text-[#0f172a] font-medium text-sm mb-1 break-words text-balance">
                  {t('howItWorks.step3Title')}
                </h3>
                <p className="text-[#334155] text-xs leading-relaxed break-words">
                  {t('howItWorks.step3Desc')}
                </p>
              </div>

              {/* Step 4: Claim SOL */}
              <div className="rounded-lg p-3 sm:p-4 text-left sm:text-center border border-[#3B3B3B]/10 bg-white/40 min-w-0">
                <div className="w-9 h-9 mx-auto mb-2 flex items-center justify-center">
                  <Image src={how4} alt="" height={30} width={30} />
                </div>
                <h3 className="text-[#0f172a] font-medium text-sm mb-1 break-words text-balance">
                  {t('howItWorks.step4Title')}
                </h3>
                <p className="text-[#334155] text-xs leading-relaxed break-words">
                  {t('howItWorks.step4Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
