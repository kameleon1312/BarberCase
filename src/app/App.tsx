import { Header } from "../components/layout/Header/Header";
import { Footer } from "../components/layout/Footer/Footer";

import { Hero } from "../components/sections/Hero/Hero";
import { Services } from "../components/sections/Services/Services";
import { Pricing } from "../components/sections/Pricing/Pricing";
import { CTA } from "../components/sections/CTA/CTA";

export default function App() {
  return (
    <div className="bg-shell">
      <a className="skip-link" href="#main">
        Przejdź do treści
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Services />
        <Pricing />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
