import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Methodology | Maverick Investment Aperture",
  description:
    "Methodology for ex-ante CMA and ex-post historical risk-return studies, including return, FX, hedging, and annualization conventions.",
};

export default function ResearchMethodologyPage() {
  return (
    <section className="space-y-7">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-accent/70">Methodology</p>
        <h1 className="font-display text-4xl text-white sm:text-5xl">Research Framework</h1>
      </div>

      <div className="glass-panel space-y-6 p-7 text-sm leading-relaxed text-white/70 sm:text-base">
        <div>
          <h2 className="mb-2 font-display text-xl text-white">Ex-Ante vs Ex-Post</h2>
          <p>
            Ex-ante studies are forward-looking and rely on Capital Market Assumptions (CMA) for
            expected return, volatility, and correlation. Ex-post studies are backward-looking and
            measure realized outcomes from observed time series.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-xl text-white">Return Construction</h2>
          <p>
            Period returns are computed as simple returns from index levels: R_t = P_t / P_(t-1) - 1.
            Total return indices are normalized to 100 and compounded from periodic returns.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-xl text-white">FX Conversion</h2>
          <p>
            For non-base-currency series, returns are translated into the selected base currency
            through monthly FX returns aligned on the same observation dates.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-xl text-white">Hedging Approximation</h2>
          <p>
            Hedge ratio is modeled as a linear reduction of FX return exposure (0%, 50%, 100%).
            Hedge carry cost is set to 0 in this MVP and is designed as an extension point for
            interest-differential or forwards-based estimates.
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-xl text-white">Annualization Conventions</h2>
          <p>
            With monthly data, annualized return is geometric and annualized volatility is the
            standard deviation scaled by sqrt(12). Sharpe is reported with risk-free rate set to 0.
            Max drawdown and worst month/quarter are reported in ex-post mode only.
          </p>
        </div>
      </div>
    </section>
  );
}
