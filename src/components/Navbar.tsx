"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import Container from "@/components/ui/Container";

const sectionIds = site.nav.map((item) => item.id);
const RESEARCH_NAV = { id: "research", label: "Research", href: "/research" };

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navItems = [
    RESEARCH_NAV,
    ...site.nav.map((item) => ({
      ...item,
      href: isHome ? item.href : `/${item.href}`,
    })),
  ];

  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const visibleSet = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSet.add(entry.target.id);
          else visibleSet.delete(entry.target.id);
        });
        const first = sectionIds.find((id) => visibleSet.has(id));
        if (first) setActiveSection(first);
      },
      { rootMargin: "-20% 0px -35% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome, pathname]);

  const active = isHome
    ? activeSection
    : pathname.startsWith("/research")
      ? RESEARCH_NAV.id
      : "";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-navy/40 bg-ink/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        {/* Logo */}
        <a href={isHome ? "#top" : "/"} className="flex-shrink-0">
          <Image
            src={site.logos.navbar}
            alt={site.name}
            width={160}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-xs uppercase tracking-widest text-white/60 md:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                "relative transition-colors hover:text-white",
                active === item.id ? "text-white" : ""
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute -bottom-1.5 left-0 h-px w-full bg-accent/70 transition-opacity",
                  active === item.id ? "opacity-100" : "opacity-0"
                )}
              />
            </a>
          ))}
        </nav>

        {/* Mobile active section pill */}
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 md:hidden">
          {navItems.find((item) => item.id === active)?.label ?? "Menu"}
        </span>
      </Container>

      {/* Mobile nav row */}
      <div className="border-t border-white/5 md:hidden">
        <Container className="flex gap-3 overflow-x-auto py-3">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-xs transition",
                active === item.id
                  ? "border-accent/50 bg-white/10 text-white"
                  : "border-white/10 text-white/60 hover:text-white"
              )}
            >
              {item.label}
            </a>
          ))}
        </Container>
      </div>
    </header>
  );
}
