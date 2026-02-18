import { site } from "@/content/site";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Contact() {
  return (
    <section id="contact" className="py-28">
      <Container>
        <div className="mb-14 flex items-center gap-4">
          <span className="h-px w-10 bg-white/30" />
          <span className="text-xs uppercase tracking-[0.4em] text-white/40">
            {site.contact.headline}
          </span>
        </div>

        <div className="glass-panel max-w-2xl p-12 text-center mx-auto">
          <p className="mb-8 text-base leading-relaxed text-white/60">
            {site.contact.body}
          </p>
          <Button
            label={site.contact.email}
            href={`mailto:${site.contact.email}`}
            variant="secondary"
          />
        </div>
      </Container>
    </section>
  );
}
