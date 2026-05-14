"use client";

import { useState } from "react";

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchSidebar({ isOpen, onClose }: SearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const browseOptions = [
    { icon: "📈", label: "Trending", badge: null },
    { icon: "✨", label: "New", badge: "2" },
    { icon: "🔥", label: "Popular", badge: null },
    { icon: "⚔️", label: "Competitive", badge: null },
    { icon: "⏰", label: "Ending Soon", badge: "2" },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className="fixed left-0 top-0 h-full w-[280px] bg-[#0a0a0a] border-r border-[#DD8D15]/20 z-50 p-6 transition-transform duration-300 ease-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white text-3xl leading-none transition-colors"
        >
          ×
        </button>

        {/* Search bar */}
        <div className="relative mb-8 mt-2">
          <input
            type="text"
            placeholder="Search coins"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 font-pp-neue text-sm focus:outline-none focus:border-[#DD8D15]/50 transition-all"
            autoFocus
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-xs font-pp-neue bg-white/5 px-2 py-1 rounded">
            /
          </span>
        </div>

        {/* Browse section */}
        <div>
          <h3 className="text-white/50 text-[10px] font-pp-neue font-medium uppercase tracking-wider mb-4">
            BROWSE
          </h3>
          <div className="space-y-1">
            {browseOptions.map((option) => (
              <button
                key={option.label}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#DD8D15]/10 transition-all group"
              >
                <span className="text-lg">{option.icon}</span>
                <span className="text-white font-pp-neue text-sm group-hover:text-[#DD8D15] transition-colors">
                  {option.label}
                </span>
                {option.badge && (
                  <span className="ml-auto bg-[#DD8D15] text-black text-xs font-pp-neue font-semibold px-2 py-0.5 rounded-full">
                    {option.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-white/70 text-xs font-pp-neue text-center">
              More coins coming soon! 🚀
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

