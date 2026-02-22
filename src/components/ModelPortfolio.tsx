import { site } from "@/content/site";
import Container from "@/components/ui/Container";

export default function ModelPortfolio() {
  return (
    <section id="modelportfolio" className="py-28">
      <Container>
        <div className="mb-14 flex items-center gap-4">
          <span className="h-px w-10 bg-accent/40" />
          <span className="text-xs uppercase tracking-[0.4em] text-accent/60">
            {site.modelPortfolio.headline}
          </span>
        </div>

        <div className="mb-10 max-w-3xl">
          <p className="text-base leading-relaxed text-white/65 sm:text-lg">
            {site.modelPortfolio.body}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.modelPortfolio.portfolios.map((portfolio) => (
            <article
              key={portfolio.name}
              className="glass-panel glass-panel-hover flex h-full flex-col gap-4 p-8"
            >
              <h3 className="font-display text-lg font-semibold text-white">
                {portfolio.name}
              </h3>
              <p className="text-xs font-blade uppercase tracking-wider text-accent/70">
                {portfolio.profile}
              </p>
              <p className="text-sm leading-relaxed text-white/60">
                {portfolio.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent/40" />
            <span className="text-xs uppercase tracking-[0.4em] text-accent/60">
              {site.modelPortfolio.attribution.headline}
            </span>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {site.modelPortfolio.attribution.subsections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-wider text-white/70 transition hover:border-white/35 hover:text-white"
              >
                {section.label}
              </a>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {site.modelPortfolio.attribution.subsections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="glass-panel glass-panel-hover flex flex-col gap-3 p-8"
              >
                <p className="text-xs font-blade uppercase tracking-widest text-accent/70">
                  {section.label}
                </p>
                <h3 className="font-display text-xl font-semibold text-white">
                  {section.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  {section.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
