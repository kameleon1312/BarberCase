import { useState } from "react";
import { Header } from "../components/layout/Header/Header";
import { Footer } from "../components/layout/Footer/Footer";

import { Hero } from "../components/sections/Hero/Hero";
import { Services } from "../components/sections/Services/Services";
import { Pricing } from "../components/sections/Pricing/Pricing";
import { CTA } from "../components/sections/CTA/CTA";

import { QuickBookingDrawer } from "../components/sections/Booking/QuickBookingDrawer";

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = () => setBookingOpen(true);
  const closeBooking = () => setBookingOpen(false);

  return (
    <>
      {/* A11y: szybkie przejście do treści */}
      <a href="#main" style={{ position: "absolute", left: -9999, top: 0 }}>
        Przejdź do treści
      </a>

      {/* Header */}
      <Header onBook={openBooking} />

      {/* Main */}
      <main id="main">
        {/* Hero też otwiera Quick Booking */}
       <Hero onBook={openBooking} />
        <Services />
        <Pricing />
        <CTA />
      </main>

      <Footer />

      {/* Global Drawer */}
      <QuickBookingDrawer open={bookingOpen} onClose={closeBooking} />
    </>
  );
}
