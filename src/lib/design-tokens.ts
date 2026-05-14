/**
 * Design tokens extracted from https://worldcupcoins.org/styles.css
 * (authored stylesheet linked from the site HTML). Selector citations
 * refer to rules in that file.
 */
export const worldcupCoinsDesignTokens = {
  root: {
    /** :root */
    white: "rgba(255, 255, 255, 0.92)",
    glass: "rgba(255, 255, 255, 0.80)",
    ink: "#0f172a",
    muted: "rgba(255, 255, 255, 0.92)",
    muted2: "rgba(255, 255, 255, 0.78)",
    shadow: "0 22px 50px rgba(6, 78, 59, 0.22)",
  },
  fonts: {
    /** body */
    outfitStack:
      '"Outfit", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    /** .hero h1, .name .title, .board h2, .stat .big, … */
    bebasStack: '"Bebas Neue", sans-serif',
    /** .stat .mono, .mint, code */
    monoStack:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    /** Google Fonts weights loaded on reference: 400, 600, 700, 800 */
    outfitWeights: [400, 600, 700, 800] as const,
  },
  pageBackground: {
    /** .bg-base */
    base: `radial-gradient(circle at 50% 12%, rgba(147, 197, 253, 0.20), transparent 46%),
      radial-gradient(circle at 14% 22%, rgba(59, 130, 246, 0.22), transparent 46%),
      radial-gradient(circle at 88% 26%, rgba(96, 165, 250, 0.14), transparent 52%),
      radial-gradient(circle at 50% 112%, rgba(34, 197, 94, 0.12), transparent 56%),
      linear-gradient(180deg, #05061a 0%, #07122c 45%, #0b2a5a 100%)`,
    /** .bg-stripes */
    stripesOpacity: 0.2,
    stripesBlendMode: "soft-light" as const,
    stripes:
      "repeating-linear-gradient(90deg, transparent, transparent 52px, rgba(255,255,255,0.06) 52px, rgba(255,255,255,0.06) 54px)",
    /** .bg-stadium — url resolved to /public/worldcupcoins/bg-stadium.svg */
    stadiumImage: "/worldcupcoins/bg-stadium.svg",
    stadiumOpacity: 0.34,
    stadiumBlendMode: "normal" as const,
    /** .bg-trophy */
    trophyImage: "/worldcupcoins/bg-trophy.svg",
    trophyPosition: "center 120px",
    trophySize: "min(820px, 80vw)",
    trophyOpacity: 0.36,
    trophyBlendMode: "normal" as const,
    /** .bg-confetti */
    confettiOpacity: 0.18,
    confettiBlendMode: "screen" as const,
    /** .bg-gloss */
    gloss: `radial-gradient(circle at 50% 40%, transparent 35%, rgba(0,0,0,0.55) 100%),
      linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 35%, rgba(255,255,255,0.06) 100%)`,
  },
  wrap: {
    /** .wrap */
    maxWidth: "1120px",
    padding: "40px 16px 60px",
    gap: "36px",
  },
  siteTab: {
    /** .site-tabs */
    tabsGap: "10px",
    /** .site-tab */
    borderRadius: "999px",
    padding: "10px 22px",
    fontSize: "15px",
    fontWeight: 800,
    background: "rgba(255, 255, 255, 0.22)",
    color: "#fff",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    /** .site-tab:hover */
    hoverBackground: "rgba(255, 255, 255, 0.32)",
    /** .site-tab-active */
    activeBackground: "rgba(253, 224, 71, 0.95)",
    activeColor: "#064e3b",
  },
  card: {
    /** .card */
    borderRadius: "26px",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(255,255,255,0.55)",
    padding: "18px",
    boxShadow: "0 22px 50px rgba(6, 78, 59, 0.22)" /* var(--shadow) */,
    transition: "transform .14s ease, box-shadow .14s ease",
    /** .card:hover */
    hoverTransform: "translateY(-2px)",
    hoverBoxShadow: "0 28px 70px rgba(6, 78, 59, 0.24)",
    /** .glow */
    glowBackground: "rgba(74, 222, 128, 0.25)",
    glowBlur: "34px",
    glowHoverBackground: "rgba(253, 224, 71, 0.30)",
  },
  grid: {
    /** .grid */
    gap: "14px",
  },
  flag: {
    /** .flag */
    width: "56px",
    height: "40px",
    borderRadius: "10px",
    border: "1px solid rgba(226, 232, 240, 0.95)",
    boxShadow: "0 10px 24px rgba(2, 6, 23, 0.12)",
  },
  nameTitle: {
    /** .name .title */
    fontSize: "28px",
    letterSpacing: "0.02em",
    color: "#052e16",
  },
  btnPump: {
    /** .btn-pump */
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: 900,
    color: "#fff",
    background: "#059669",
    hoverBackground: "#047857",
    boxShadow: "0 8px 20px rgba(5, 46, 22, 0.22)",
  },
  stat: {
    /** .stats */
    marginTop: "14px",
    gridGap: "10px",
    /** .stat */
    borderRadius: "18px",
    padding: "12px",
    border: "1px solid rgba(226, 232, 240, 0.90)",
    defaultBackground:
      "linear-gradient(135deg, rgba(236,253,245,0.90), rgba(224,242,254,0.85))",
    /** .stat.vol */
    volBackground:
      "linear-gradient(135deg, rgba(245,243,255,0.95), rgba(224,231,255,0.88))",
    volBorderColor: "rgba(196, 181, 253, 0.75)",
    /** .stat.gold */
    goldBackground:
      "linear-gradient(135deg, rgba(255,251,235,0.95), rgba(255,237,213,0.88))",
    /** .stat dt */
    labelFontSize: "12px",
    labelColor: "rgba(51, 65, 85, 0.85)",
    /** .stat .big */
    bigFontSize: "28px",
    bigColorMc: "#064e3b",
    bigColorVol: "#1e1b4b",
    /** .stat .mono */
    monoFontSize: "11px",
    monoLineHeight: 1.35,
    monoFontWeight: 700,
    monoColor: "#0f172a",
    /** .mint */
    mintColor: "rgba(71, 85, 105, 0.92)",
    mintFontSize: "11px",
  },
  ctaBtn: {
    /** .btn */
    borderRadius: "999px",
    background: "rgba(253, 224, 71, 0.95)",
    color: "#064e3b",
    fontWeight: 900,
    fontSize: "14px",
    padding: "12px 16px",
    boxShadow: "0 18px 40px rgba(6, 78, 59, 0.20)",
  },
  boardHeading: {
    /** .board h2 */
    fontSize: "44px",
    letterSpacing: "0.02em",
    color: "rgba(255,255,255,0.96)",
    textShadow: "0 16px 45px rgba(0,0,0,0.2)",
  },
  hint: {
    /** .hint */
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.78)" /* var(--muted2) */,
  },
  /** .footer */
  footer: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.78)",
    linkColor: "rgba(253, 230, 138, 0.95)",
    linkFontWeight: 700,
    linkUnderlineOffset: "2px",
  },
  /** .countdown */
  countdown: {
    textAlign: "center" as const,
    borderRadius: "18px",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    background: "rgba(255, 255, 255, 0.14)",
    padding: "18px 16px 20px",
    backdropFilter: "blur(8px)",
  },
  /** .countdown-kicker */
  countdownKicker: {
    fontFamily: '"Bebas Neue", sans-serif',
    letterSpacing: "0.2em",
    fontSize: "15px",
    color: "rgba(253, 230, 138, 0.95)",
  },
  /** .match-card (schedule) */
  matchCard: {
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.45)",
    background: "rgba(255, 255, 255, 0.92)",
    padding: "14px 16px",
    boxShadow: "0 12px 32px rgba(6, 78, 59, 0.12)",
  },
  /** .match-flag */
  matchFlag: {
    width: "28px",
    height: "20px",
    borderRadius: "4px",
    border: "1px solid rgba(226, 232, 240, 0.95)",
    boxShadow: "0 2px 8px rgba(2, 6, 23, 0.08)",
  },
} as const;

export type WorldcupCoinsDesignTokens = typeof worldcupCoinsDesignTokens;
