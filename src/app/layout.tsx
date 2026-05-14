import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/nav-bar";
import { Providers } from "./providers";
import { LoadingBar } from "@/components/loading-bar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wcupbets.com"),
  title: "WCUPBETS",
  description:
    "The prediction market for world cup country coins on pump.fun",
  // Icons: src/app/favicon.ico (many browsers request this first), icon.png, apple-icon.png — keep them in sync.
  openGraph: {
    title: "WCUPBETS",
    description:
      "The prediction market for world cup country coins on pump.fun",
    images: [
      {
        url: "/og-image.png",
        width: 1000,
        height: 1000,
        alt: "WCupBets",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WCUPBETS",
    description:
      "The prediction market for world cup country coins on pump.fun",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${bebasNeue.variable}`}>
      <body className="antialiased px-4 py-8 md:p-12">
        <div className="wc-bg" aria-hidden>
          <div className="wc-bg-base" />
          <div className="wc-bg-stripes" />
          <div className="wc-bg-stadium" />
          <div className="wc-bg-trophy" />
          <div className="wc-bg-confetti" />
          <div className="wc-bg-gloss" />
        </div>

        <div className="relative z-10 min-h-[100dvh] isolate">
          <Providers>
            <LoadingBar />
            <Navbar />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
