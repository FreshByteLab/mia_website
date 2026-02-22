import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";

export default function ResearchLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="top" className="pb-24 pt-14">
        <Container className="space-y-10">{children}</Container>
      </main>
      <Footer />
    </>
  );
}
