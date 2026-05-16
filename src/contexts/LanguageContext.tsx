"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem('language') as Language;
    if (saved === 'en' || saved === 'zh') {
      setLanguage(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language);
    }
  }, [language, mounted]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: Record<string, unknown> | string = language === 'en' ? translations.en : translations.zh;
    
    for (const k of keys) {
      if (typeof value === 'object' && value !== null) {
        value = (value as Record<string, unknown>)[k] as Record<string, unknown> | string;
      }
      if (value === undefined) return key;
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

// Translations
const translations = {
  en: {
    nav: {
      markets: 'Markets',
      myBets: 'My Bets',
      howItWorks: 'How it Works',
      connectWallet: 'Connect Wallet',
      disconnect: 'Disconnect',
      disconnectWallet: 'Disconnect Wallet',
      chinese: '中文'
    },
    hero: {
      title: 'WCupBets',
      subtitle: 'The prediction market built for World Cup country coin traders.',
      cta: 'Make Your Call',
      xAccount: 'Twitter',
      account: '',
      tagline: 'Make your call on every country coin',
      caLabel: 'Contract address',
      caPlaceholder: 'HSu9YSmPgvgpnS51bhNQ8Sp1PYcXKWPSNKVNQMVDpump'
    },
    home: {
      mostPopular: 'Featured market',
      latest: 'Open markets',
      yes: 'Yes',
      no: 'No',
      ends: 'Ends',
      chance: 'Chance',
      volume: 'Volume'
    },
    markets: {
      bnbPrice: 'Market',
      binanceLife: 'Market',
      czTweet: 'Market',
      palu: 'Market',
      fourSpot: 'Market'
    },
    myBets: {
      title: 'My calls',
      connectPrompt: 'Connect your Solana wallet to see on-chain calls and payouts.',
      bettingHistory: 'Betting History',
      totalBets: 'Total Bets',
      totalWagered: 'Total Wagered',
      cashbackEarned: 'Cashback Earned',
      currentPositions: 'Current Positions',
      activePositions: 'Active Positions',
      recentBets: 'Recent Bets',
      noActive: 'No active positions',
      noRecent: 'No recent bets',
      youBet: 'You Bet',
      amount: 'Amount',
      potentialEarnings: 'Potential Earnings',
      cashback: 'Cashback',
      result: 'Result',
      won: 'WON',
      ended: 'Ended',
      connectedWallet: 'Connected wallet'
    },
    betting: {
      selectAmount: 'Select Amount',
      youWillGet: 'You Will Get',
      placeYes: 'YES',
      placeNo: 'NO',
      placing: 'Placing…',
      success: 'Your call is in.',
      failed: 'Something broke',
      viewOnBscscan: 'Explorer',
      close: 'Close',
      tryAgain: 'Try Again'
    },
    wallet: {
      connectTitle: 'Connect Wallet',
      connecting: 'Connecting...'
    },
    howItWorks: {
      title: 'How WCUPBETS works',
      subtitle: 'Structured YES/NO on World Cup country coins — real SOL, parimutuel pools, DexScreener resolution.',
      step1Title: 'Connect your wallet',
      step1Desc: 'Use Phantom on Solana mainnet.',
      step2Title: 'Pick a country coin',
      step2Desc: 'Every market ties to a Pump.fun squad coin from the worldcupcoins.org ecosystem.',
      step3Title: 'Make your call',
      step3Desc: 'YES / NO on MC targets or head-to-head FDV. Live data from DexScreener every 30s.',
      step4Title: 'Claim SOL on resolution',
      step4Desc: 'After the deadline, markets auto-resolve from DexScreener; winners receive SOL from the vault (2% fee).',
    }
  },
  zh: {
    nav: {
      markets: 'Markets',
      myBets: 'My Bets',
      howItWorks: 'How it Works',
      connectWallet: '连接钱包',
      disconnect: 'Disconnect',
      disconnectWallet: 'Disconnect Wallet',
      chinese: '中文'
    },
    hero: {
      title: 'WCupBets',
      subtitle: 'The prediction market built for World Cup country coin traders.',
      cta: 'Make Your Call',
      xAccount: 'Twitter',
      account: '',
      tagline: 'Make your call on every country coin',
      caLabel: '合约地址',
      caPlaceholder: 'HSu9YSmPgvgpnS51bhNQ8Sp1PYcXKWPSNKVNQMVDpump'
    },
    home: {
      mostPopular: 'Featured market',
      latest: 'Open markets',
      yes: 'Yes',
      no: 'No',
      ends: 'Ends',
      chance: 'Chance',
      volume: 'Volume'
    },
    markets: {
      bnbPrice: 'Market',
      binanceLife: 'Market',
      czTweet: 'Market',
      palu: 'Market',
      fourSpot: 'Market'
    },
    myBets: {
      title: 'My calls',
      connectPrompt: 'Connect your Solana wallet to see on-chain calls and payouts.',
      bettingHistory: '投注历史',
      totalBets: '总投注',
      totalWagered: '总下注额',
      cashbackEarned: '获得的返现',
      currentPositions: '当前仓位',
      activePositions: '活跃仓位',
      recentBets: '最近投注',
      noActive: '没有活跃仓位',
      noRecent: '没有最近投注',
      youBet: '您投注了',
      amount: '金额',
      potentialEarnings: '潜在收益',
      cashback: '返现',
      result: '结果',
      won: '赢了',
      ended: '已结束',
      connectedWallet: '已连接钱包'
    },
    betting: {
      selectAmount: '选择金额',
      youWillGet: '您将获得',
      placeYes: 'YES',
      placeNo: 'NO',
      placing: 'Placing…',
      success: 'Your call is in.',
      failed: 'Something broke',
      viewOnBscscan: 'Explorer',
      close: '关闭',
      tryAgain: '重试'
    },
    wallet: {
      connectTitle: '连接钱包',
      connecting: '连接中...'
    },
    howItWorks: {
      title: 'How WCUPBETS works',
      subtitle: 'Structured YES/NO on World Cup country coins — real SOL, parimutuel pools, DexScreener resolution.',
      step1Title: 'Connect your wallet',
      step1Desc: 'Use Phantom on Solana mainnet.',
      step2Title: 'Pick a country coin',
      step2Desc: 'Every market ties to a Pump.fun squad coin from the worldcupcoins.org ecosystem.',
      step3Title: 'Make your call',
      step3Desc: 'YES / NO on MC targets or head-to-head FDV. Live data from DexScreener every 30s.',
      step4Title: 'Claim SOL on resolution',
      step4Desc: 'After the deadline, markets auto-resolve from DexScreener; winners receive SOL from the vault (2% fee).',
    }
  }
};

