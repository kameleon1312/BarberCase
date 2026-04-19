import { useState } from "react";
import { Header } from "../components/layout/Header/Header";
import { Footer } from "../components/layout/Footer/Footer";
import { Ticker } from "../components/layout/Ticker/Ticker";

import { Hero } from "../components/sections/Hero/Hero";
import { Services } from "../components/sections/Services/Services";
import { Process } from "../components/sections/Process/Process";
import { Pricing } from "../components/sections/Pricing/Pricing";
import { Gallery } from "../components/sections/Gallery/Gallery";
import { Testimonials } from "../components/sections/Testimonials/Testimonials";
import { Team } from "../components/sections/Team/Team";
import { FAQ } from "../components/sections/FAQ/FAQ";
import { CTA } from "../components/sections/CTA/CTA";

import { QuickBookingDrawer } from "../components/sections/Booking/QuickBookingDrawer";
import type { BookingServiceId } from "../data/content";
import { useLenis } from "../hooks/useLenis";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [prefillServiceId, setPrefillServiceId] = useState<BookingServiceId | null>(null);

  const reducedMotion = usePrefersReducedMotion();

  useLenis(reducedMotion, bookingOpen);

  const openBooking = (serviceId?: BookingServiceId) => {
    if (serviceId) setPrefillServiceId(serviceId);
    setBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingOpen(false);
    setPrefillServiceId(null);
  };

  return (
    <>
      <a href="#main" className="skip-link">Przejdź do treści</a>

      <Header onBook={() => openBooking()} />

      <main id="main">
        <Hero onBook={() => openBooking()} />
        <Ticker />
        <Services />
        <Process />
        <Pricing onPick={(id) => openBooking(id)} />
        <Gallery />
        <Ticker />
        <Testimonials />
        <Team />
        <FAQ />
        <CTA onBook={() => openBooking()} />
      </main>

      <Footer />

      <QuickBookingDrawer
        open={bookingOpen}
        onClose={closeBooking}
        preselectServiceId={prefillServiceId ?? undefined}
      />
    </>
  );
}
