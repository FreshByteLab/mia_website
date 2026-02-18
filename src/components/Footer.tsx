import Image from "next/image";
import { site } from "@/content/site";
import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 py-10">
      <Container className="flex flex-col gap-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <Image
          src={site.logos.footer}
          alt={site.name}
          width={80}
          height={32}
          className="h-7 w-auto object-contain opacity-50"
        />
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
