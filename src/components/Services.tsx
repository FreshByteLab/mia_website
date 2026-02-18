import { site } from "@/content/site";
import Container from "@/components/ui/Container";

export default function Services() {
  return (
    <section id="services" className="py-28">
      <Container>
        <div className="mb-14 flex items-center gap-4">
          <span className="h-px w-10 bg-white/30" />
          <span className="text-xs uppercase tracking-[0.4em] text-white/40">
            Services
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.services.map((service, i) => (
            <div key={service.title} className="glass-panel p-8 flex flex-col gap-4">
              <span className="text-xs font-blade uppercase tracking-widest text-white/25">
                0{i + 1}
              </span>
              <h3 className="font-display text-lg font-semibold text-white">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/60">{service.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
