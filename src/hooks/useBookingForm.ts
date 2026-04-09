import { useEffect, useMemo, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { bookingServices } from "../data/content";
import type { BookingServiceId } from "../data/content";

type FormState = {
  serviceId: BookingServiceId;
  date: string;
  time: string;
  name: string;
  phone: string;
  note: string;
};

export type SendStatus = "idle" | "sending" | "success" | "error";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function buildTimeSlots(startHour = 10, endHour = 20, stepMin = 30) {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += stepMin) {
      slots.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return slots;
}

export function useBookingForm(open: boolean, preselectServiceId?: BookingServiceId) {
  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  const slots = useMemo(() => buildTimeSlots(10, 20, 30), []);

  const [form, setForm] = useState<FormState>(() => ({
    serviceId: bookingServices[0].id,
    date: today,
    time: "12:00",
    name: "",
    phone: "",
    note: "",
  }));

  const [status, setStatus] = useState<SendStatus>("idle");

  const serviceSelectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    if (!open) return;
    if (!preselectServiceId) return;

    requestAnimationFrame(() => {
      setForm((p) =>
        p.serviceId === preselectServiceId ? p : { ...p, serviceId: preselectServiceId }
      );
      serviceSelectRef.current?.focus();
      serviceSelectRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, [open, preselectServiceId]);

  useEffect(() => {
    if (open) setStatus("idle");
  }, [open]);

  const service = useMemo(
    () => bookingServices.find((s) => s.id === form.serviceId) ?? bookingServices[0],
    [form.serviceId]
  );

  const priceLabel =
    service.priceFrom === service.priceTo
      ? `${service.priceFrom} zł`
      : `${service.priceFrom}–${service.priceTo} zł`;

  const canSubmit =
    status !== "sending" &&
    form.name.trim().length >= 2 &&
    form.phone.trim().length >= 7 &&
    !!form.date &&
    !!form.time;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("sending");

    const templateParams = {
      service_name: service.name,
      booking_date: form.date,
      booking_time: form.time,
      duration: `${service.durationMin} min`,
      price: priceLabel,
      client_name: form.name,
      client_phone: form.phone,
      client_note: form.note || "—",
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  return {
    form,
    setField,
    status,
    service,
    priceLabel,
    canSubmit,
    today,
    slots,
    serviceSelectRef,
    submit,
  };
}
