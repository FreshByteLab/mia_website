import { site } from "@/content/site";
import Container from "@/components/ui/Container";

export default function About() {
  return (
    <section id="about" className="py-28">
      <Container>
        <div className="mb-14 flex items-center gap-4">
          <span className="h-px w-10 bg-accent/40" />
          <span className="text-xs uppercase tracking-[0.4em] text-accent/60">
            {site.about.headline}
          </span>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          {/* Body copy */}
          <div>
            <p className="text-lg leading-relaxed text-white/70 lg:text-xl">
              {site.about.body}
            </p>
          </div>

          {/* Pillars */}
          <div className="grid gap-6 sm:grid-cols-1">
            {site.about.pillars.map((pillar) => (
              <div key={pillar.title} className="glass-panel p-6">
                <h3 className="mb-2 font-blade text-sm uppercase tracking-widest text-accent">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
