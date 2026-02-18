/**
 * THE MARK — Logo symbolism reference
 * ─────────────────────────────────────────────────────────────
 * Aperture (outer ring)
 *   A camera aperture controls what light enters the frame — with
 *   precision and intent. → Disciplined, targeted market exposure.
 *
 * Bull (inner negative space)
 *   Inside the aperture, the form of a bull emerges.
 *   → Constructive conviction. Fundamentally bullish on markets.
 *
 * Three triangles → M · I · A (straddle payoff diagram)
 *   The three triangles spell the initials AND trace the payoff
 *   of a straddle options strategy — profits from large moves in
 *   EITHER direction. → Volatility-aware, asymmetric positioning.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Maverick Investment Aperture",
  shortName: "MIA",
  tagline: "Precision exposure. Decisive conviction.",
  description:
    "An independent investment firm built on contrarian research, rigorous risk management, and a volatility-aware approach to generating durable, risk-adjusted returns.",

  nav: [
    { label: "About", href: "#about", id: "about" },
    { label: "Services", href: "#services", id: "services" },
    { label: "Contact", href: "#contact", id: "contact" },
  ],

  hero: {
    headline: "Maverick\nInvestment\nAperture",
    subheadline:
      "Like a camera aperture, we control what enters the frame — with precision, intent, and a clear view of the opportunity ahead.",
    cta: { label: "Get in Touch", href: "#contact" },
    ctaSecondary: { label: "Our Approach", href: "#about" },
  },

  about: {
    headline: "About",
    body: "Our mark encodes our philosophy. The aperture — a precision opening that controls what light enters — represents our disciplined approach to market exposure. Inside it, the form of a bull signals our constructive conviction: we believe markets reward those who act with clarity and courage. The three triangles that spell M·I·A trace the payoff of a straddle — a structure that profits from decisive moves in either direction. Together they express an investment approach that is precise, convicted, and volatility-aware.",
    pillars: [
      {
        title: "Aperture",
        text: "Controlled exposure. We open and close our view on markets with precision — letting in only the opportunities where the risk/reward is unambiguously clear.",
      },
      {
        title: "Bull",
        text: "Constructive conviction. We hold a fundamentally bullish view on human ingenuity and capital markets, expressed through independent, research-driven positions.",
      },
      {
        title: "Straddle",
        text: "Volatility-aware positioning. Like a straddle, we are structured to benefit from significant market dislocations — in either direction — rather than being crushed by them.",
      },
    ],
  },

  services: [
    {
      title: "Portfolio Management",
      text: "Conviction-driven, multi-asset mandates for institutional investors and family offices. Every position is sized with the discipline of a straddle — defined risk, asymmetric upside.",
    },
    {
      title: "Investment Research",
      text: "Independent, bottom-up research through a quantitative lens. We open the aperture wide enough to see what consensus misses, and close it tight enough to act with precision.",
    },
    {
      title: "Risk Advisory",
      text: "Portfolio stress-testing, volatility analysis, and risk-adjusted return optimisation. We help you understand not just the expected return — but the full payoff diagram.",
    },
  ],

  contact: {
    email: "info@maverickinvestmentaperture.com",
    headline: "Contact",
    body: "Interested in working with us? Reach out directly.",
  },

  logos: {
    // Website (dark background) — navy variants
    navbar: "/logos/sideward_navy.png",
    hero: "/logos/Final.png",
    footer: "/logos/final_small.png",
    // Bright backgrounds (reports, print, light UI)
    navbarLight: "/logos/sideward_white.png",
    heroLight: "/logos/Final_white.png",
    footerLight: "/logos/final_small_white.png",
  },
};
