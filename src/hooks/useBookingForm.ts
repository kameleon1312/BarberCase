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
  website: string; // honeypot — must stay empty
};

export type SendStatus = "idle" | "sending" | "success" | "error";

const PHONE_RE = /^(\+?48)?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;
const MIN_INTERACTION_MS = 3000;

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
    website: "",
  }));

  const [status, setStatus] = useState<SendStatus>("idle");
  const [phoneError, setPhoneError] = useState(false);

  const serviceSelectRef = useRef<HTMLSelectElement | null>(null);
  const openedAtRef = useRef<number>(0);

  useEffect(() => {
    if (!open) return;
    openedAtRef.current = Date.now();
    if (!preselectServiceId) return;

    requestAnimationFrame(() => {
      setForm((p) =>
        p.serviceId === preselectServiceId ? p : { ...p, serviceId: preselectServiceId }
      );
      serviceSelectRef.current?.focus();
      serviceSelectRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, [open, preselectServiceId]);

  const reset = () => {
    setStatus("idle");
    setPhoneError(false);
  };

  const service = useMemo(
    () => bookingServices.find((s) => s.id === form.serviceId) ?? bookingServices[0],
    [form.serviceId]
  );

  const priceLabel =
    service.priceFrom === service.priceTo
      ? `${service.priceFrom} zł`
      : `${service.priceFrom}–${service.priceTo} zł`;

  const isPhoneValid = PHONE_RE.test(form.phone.trim());

  const canSubmit =
    status !== "sending" &&
    form.name.trim().length >= 2 &&
    isPhoneValid &&
    !!form.date &&
    !!form.time;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.website.length > 0) return; // honeypot triggered — silent drop

    if (Date.now() - openedAtRef.current < MIN_INTERACTION_MS) return; // time-gate

    if (!isPhoneValid) {
      setPhoneError(true);
      return;
    }

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
    phoneError,
    setPhoneError,
    isPhoneValid,
    reset,
    service,
    priceLabel,
    canSubmit,
    today,
    slots,
    serviceSelectRef,
    submit,
  };
}
