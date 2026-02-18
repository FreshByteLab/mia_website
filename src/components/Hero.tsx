import Image from "next/image";
import { site } from "@/content/site";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden py-32 text-center">
      {/* Soft glow behind logo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-navy/20 blur-[120px]" />
        <div className="absolute h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <Container className="relative flex flex-col items-center gap-10">
        {/* Logo mark — screen blend dissolves the dark PNG background into the site bg */}
        <Image
          src={site.logos.hero}
          alt={site.name}
          width={400}
          height={400}
          className="h-56 w-auto object-contain sm:h-64 lg:h-72"
          style={{ mixBlendMode: "screen" }}
          priority
        />

        {/* Divider */}
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-accent/30" />
          <span className="text-xs uppercase tracking-[0.4em] text-accent/60">
            {site.shortName}
          </span>
          <span className="h-px w-12 bg-accent/30" />
        </div>

        {/* Tagline */}
        <h1 className="font-blade text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          {site.tagline}
        </h1>

        {/* Sub-copy */}
        <p className="max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
          {site.hero.subheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button label={site.hero.cta.label} href={site.hero.cta.href} variant="primary" />
          <Button label={site.hero.ctaSecondary.label} href={site.hero.ctaSecondary.href} variant="secondary" />
        </div>
      </Container>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <span className="h-6 w-px bg-white/20" />
      </div>
    </section>
  );
}
