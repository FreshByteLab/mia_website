export const site = {
  name: "Maverick Investment Aperture",
  shortName: "MIA",
  tagline: "Independent conviction. Disciplined execution.",
  description:
    "An independent investment firm built on contrarian research, rigorous risk management, and a long-term perspective.",

  nav: [
    { label: "About", href: "#about", id: "about" },
    { label: "Services", href: "#services", id: "services" },
    { label: "Contact", href: "#contact", id: "contact" },
  ],

  hero: {
    headline: "Maverick\nInvestment\nAperture",
    subheadline:
      "Precision exposure to exceptional opportunity. We combine independent research with disciplined risk management to generate durable, risk-adjusted returns.",
    cta: { label: "Get in Touch", href: "#contact" },
    ctaSecondary: { label: "Our Approach", href: "#about" },
  },

  about: {
    headline: "About",
    body: "Maverick Investment Aperture is an independent investment firm guided by contrarian conviction, quantitative rigour, and an unwavering focus on capital preservation. We approach markets with a long-term lens, selecting only the opportunities where our edge is clear and the risk is well-understood.",
    pillars: [
      {
        title: "Independence",
        text: "Free from institutional constraints, we pursue conviction-driven ideas that the consensus overlooks.",
      },
      {
        title: "Precision",
        text: "Every position is sized, stress-tested, and monitored with quantitative discipline.",
      },
      {
        title: "Long-term",
        text: "We invest for compounding — not for quarters — aligning our interests fully with our clients.",
      },
    ],
  },

  services: [
    {
      title: "Portfolio Management",
      text: "Tailored multi-asset mandates for institutional investors and family offices, with full transparency and rigorous reporting.",
    },
    {
      title: "Investment Research",
      text: "Proprietary, bottom-up research driven by independent analysis and quantitative frameworks across asset classes.",
    },
    {
      title: "Risk Advisory",
      text: "Portfolio diagnostics, scenario analysis, and risk-adjusted return optimisation for existing portfolios.",
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
