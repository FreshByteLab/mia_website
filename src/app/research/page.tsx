import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Research | Maverick Investment Aperture",
  description:
    "Long-horizon capital market research with ex-ante CMA studies and ex-post realized risk-return analysis.",
};

export default function ResearchPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-accent/70">Research</p>
        <h1 className="font-display text-4xl text-white sm:text-5xl">
          Long-Horizon Capital Market Research
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg">
          Run scenario-based Capital Market Assumption studies (ex-ante) and realized historical
          risk-return studies (ex-post) with a shared output schema built for repeatable research.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/research/ex-ante" className="glass-panel glass-panel-hover block p-7">
          <p className="mb-2 text-xs uppercase tracking-[0.28em] text-accent/60">Ex-Ante</p>
          <h2 className="font-display text-2xl text-white">Capital Market Assumptions (CMA)</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Build forward-looking expected return, volatility, and correlation studies by asset
            universe, currency, hedge ratio, and horizon.
          </p>
        </Link>

        <Link href="/research/ex-post" className="glass-panel glass-panel-hover block p-7">
          <p className="mb-2 text-xs uppercase tracking-[0.28em] text-accent/60">Ex-Post</p>
          <h2 className="font-display text-2xl text-white">Historical Risk &amp; Return</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Analyze realized returns, volatility, drawdowns, and rolling risk across custom windows
            with downloadable outputs.
          </p>
        </Link>
      </div>

      <div className="pt-2">
        <Link
          href="/research/methodology"
          className="inline-flex items-center rounded-full border border-white/20 px-5 py-2.5 text-xs uppercase tracking-[0.22em] text-white/75 transition hover:border-white/40 hover:text-white"
        >
          View Methodology
        </Link>
      </div>
    </section>
  );
}
