import { useState } from "react";
import { Header } from "../components/layout/Header/Header";
import { Footer } from "../components/layout/Footer/Footer";

import { Hero } from "../components/sections/Hero/Hero";
import { Services } from "../components/sections/Services/Services";
import { Pricing } from "../components/sections/Pricing/Pricing";
import { CTA } from "../components/sections/CTA/CTA";

import { QuickBookingDrawer } from "../components/sections/Booking/QuickBookingDrawer";
import type { BookingServiceId } from "../data/content";

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [prefillServiceId, setPrefillServiceId] = useState<BookingServiceId | null>(null);

  const openBooking = (serviceId?: BookingServiceId) => {
    if (serviceId) setPrefillServiceId(serviceId);
    setBookingOpen(true);
  };

  const closeBooking = () => setBookingOpen(false);

  return (
    <>
      <Header onBook={() => openBooking()} />

      <main id="main">
        <Hero onBook={() => openBooking()} />
        <Services />
        <Pricing onPick={(id) => openBooking(id)} />
        <CTA />
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
