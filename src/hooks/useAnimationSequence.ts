'use client'
import { useState, useEffect } from 'react';

export const useAnimationSequence = () => {
  /** Start shell + home content visible so the page is never an empty dark canvas if timers lag. */
  const [animations, setAnimations] = useState({
    navbar: true,
    hero: true,
    mostPopularHeader: true,
    mostPopularCards: true,
    latestHeader: true,
    cards: true,
    blurryCards: false,
    modalContent: false,
    trustDiv: false,
    myBetsHistoryHeader: true,
    myBetsStats: true,
    myBetsActiveHeader: true,
    myBetsActiveCards: true,
    myBetsRecentHeader: true,
    myBetsRecentCards: true,
  });

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimations(prev => ({ ...prev, navbar: true })), 200);
    const timer2 = setTimeout(() => setAnimations(prev => ({ ...prev, hero: true })), 600);
    const timer3 = setTimeout(() => setAnimations(prev => ({ ...prev, mostPopularHeader: true })), 1000);
    const timer4 = setTimeout(() => setAnimations(prev => ({ ...prev, mostPopularCards: true })), 1200);
    const timer5 = setTimeout(() => setAnimations(prev => ({ ...prev, latestHeader: true })), 1600);
    const timer6 = setTimeout(() => setAnimations(prev => ({ ...prev, cards: true })), 1800);
    const timer7 = setTimeout(() => setAnimations(prev => ({ ...prev, blurryCards: true })), 2200);
    const timer8 = setTimeout(() => setAnimations(prev => ({ ...prev, modalContent: true })), 2600);
    const timer9 = setTimeout(() => setAnimations(prev => ({ ...prev, trustDiv: true })), 3000);
    const timer10 = setTimeout(() => setAnimations(prev => ({ ...prev, myBetsHistoryHeader: true })), 200);
    const timer11 = setTimeout(() => setAnimations(prev => ({ ...prev, myBetsStats: true })), 600);
    const timer12 = setTimeout(() => setAnimations(prev => ({ ...prev, myBetsActiveHeader: true })), 1000);
    const timer13 = setTimeout(() => setAnimations(prev => ({ ...prev, myBetsActiveCards: true })), 1200);
    const timer14 = setTimeout(() => setAnimations(prev => ({ ...prev, myBetsRecentHeader: true })), 1600);
    const timer15 = setTimeout(() => setAnimations(prev => ({ ...prev, myBetsRecentCards: true })), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
      clearTimeout(timer8);
      clearTimeout(timer9);
      clearTimeout(timer10);
      clearTimeout(timer11);
      clearTimeout(timer12);
      clearTimeout(timer13);
      clearTimeout(timer14);
      clearTimeout(timer15);
    };
  }, []);

  return animations;
};
