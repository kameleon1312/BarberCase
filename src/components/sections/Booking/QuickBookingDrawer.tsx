import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./quick-booking-drawer.module.scss";
import { bookingServices } from "../../../data/content";
import type { BookingServiceId } from "../../../data/content";

type Props = {
  open: boolean;
  onClose: () => void;
  preselectServiceId?: BookingServiceId;
};

type FormState = {
  serviceId: BookingServiceId;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  name: string;
  phone: string;
  note: string;
};

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

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

function useFocusTrap(
  active: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
  onEscape: () => void
) {
  useEffect(() => {
    if (!active) return;

    const el = containerRef.current;
    if (!el) return;

    const focusables = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((x) => !x.hasAttribute("disabled") && !x.getAttribute("aria-hidden"));

    // Focus first element
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusables();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (!activeEl || activeEl === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, containerRef, onEscape]);
}

export function QuickBookingDrawer({ open, onClose, preselectServiceId }: Props) {
  useLockBodyScroll(open);

  const panelRef = useRef<HTMLElement>(null);
  useFocusTrap(open, panelRef, onClose);

  const serviceSelectRef = useRef<HTMLSelectElement | null>(null);

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

 
  useEffect(() => {
    if (!open) return;
    if (!preselectServiceId) return;

 
    requestAnimationFrame(() => {
      setForm((p) => (p.serviceId === preselectServiceId ? p : { ...p, serviceId: preselectServiceId }));
      serviceSelectRef.current?.focus();
      serviceSelectRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, [open, preselectServiceId]);

  const service = useMemo(
    () => bookingServices.find((s) => s.id === form.serviceId) ?? bookingServices[0],
    [form.serviceId]
  );

  const priceLabel =
    service.priceFrom === service.priceTo
      ? `${service.priceFrom} zł`
      : `${service.priceFrom}–${service.priceTo} zł`;

  const canSubmit =
    form.name.trim().length >= 2 &&
    form.phone.trim().length >= 7 &&
    !!form.date &&
    !!form.time;

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const subject = `Rezerwacja — ${service.name} (${form.date} ${form.time})`;
    const body = [
      `Usługa: ${service.name}`,
      `Termin: ${form.date} ${form.time}`,
      `Czas: ~${service.durationMin} min`,
      `Cena: ${priceLabel}`,
      "",
      `Imię: ${form.name}`,
      `Telefon: ${form.phone}`,
      form.note ? `Uwagi: ${form.note}` : "",
      "",
      "— wysłane ze strony BarberSpace",
    ]
      .filter(Boolean)
      .join("\n");

    const mail = "barberspace@example.com"; 
    const url = `mailto:${encodeURIComponent(mail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = url;
    onClose();
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        onMouseDown={onBackdropClick}
      />

      <aside
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Szybka rezerwacja"
        ref={panelRef}
      >
        <div className={styles.top}>
          <div className={styles.topText}>
            <div className={styles.title}>Quick Booking</div>
            <div className={styles.sub}>Wybierz usługę i termin — bez chaosu.</div>
          </div>

          <button type="button" className={styles.close} onClick={onClose} aria-label="Zamknij">
            ✕
          </button>
        </div>

        <div className={styles.summary} aria-label="Podsumowanie usługi">
          <div className={styles.summaryMain}>
            <div className={styles.summaryName}>{service.name}</div>
            <div className={styles.summaryDesc}>{service.desc}</div>
          </div>

          <div className={styles.summaryMeta}>
            <div className={styles.pill}>
              <span className={styles.pillTop}>Czas</span>
              <span className={styles.pillVal}>{service.durationMin} min</span>
            </div>
            <div className={styles.pill}>
              <span className={styles.pillTop}>Cena</span>
              <span className={styles.pillVal}>{priceLabel}</span>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <label className={styles.field}>
            <span className={styles.label}>Usługa</span>
            <select
              ref={serviceSelectRef}
              className={styles.control}
              value={form.serviceId}
              onChange={(e) =>
                setForm((p) => ({ ...p, serviceId: e.target.value as BookingServiceId }))
              }
            >
              {bookingServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} • ~{s.durationMin} min
                </option>
              ))}
            </select>
          </label>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>Data</span>
              <input
                className={styles.control}
                type="date"
                min={today}
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Godzina</span>
              <select
                className={styles.control}
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
              >
                {slots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Imię</span>
            <input
              className={styles.control}
              type="text"
              placeholder="Np. Szymon"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              autoComplete="name"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Telefon</span>
            <input
              className={styles.control}
              type="tel"
              placeholder="Np. 600 000 000"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              autoComplete="tel"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Uwagi (opcjonalnie)</span>
            <textarea
              className={styles.controlArea}
              placeholder="Np. broda 2 cm, preferuję naturalne wykończenie…"
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              rows={3}
            />
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={onClose}>
              Anuluj
            </button>

            <button type="submit" className={styles.primary} disabled={!canSubmit}>
              Wyślij rezerwację
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </button>
          </div>

          <div className={styles.hint}>
            ESC zamyka • Kliknij tło, aby wrócić • Na start wysyłamy mail — później podepniesz API.
          </div>
        </form>
      </aside>
    </>
  );
}
