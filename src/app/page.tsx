import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ModelPortfolio from "@/components/ModelPortfolio";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <Services />
        <ModelPortfolio />
        <Contact />
        <About />
      </main>
      <Footer />
    </>
  );
}
