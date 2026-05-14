"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function LoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Start loading when pathname changes
    setIsLoading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 30;
      });
    }, 100);

    // Complete loading after a short delay
    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 300);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[9999]">
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(to right, rgba(253, 224, 71, 0.95), #059669)",
        }}
      />
    </div>
  );
}
