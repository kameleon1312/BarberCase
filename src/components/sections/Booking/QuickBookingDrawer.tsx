import { useEffect, useRef } from "react";
import styles from "./quick-booking-drawer.module.scss";
import { bookingServices } from "../../../data/content";
import type { BookingServiceId } from "../../../data/content";
import { useBookingForm } from "../../../hooks/useBookingForm";
import { useFocusTrap } from "../../../hooks/useFocusTrap";

type Props = {
  open: boolean;
  onClose: () => void;
  preselectServiceId?: BookingServiceId;
};

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

export function QuickBookingDrawer({ open, onClose, preselectServiceId }: Props) {
  useLockBodyScroll(open);

  const panelRef = useRef<HTMLElement>(null);

  const {
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
  } = useBookingForm(open, preselectServiceId);

  const handleClose = () => {
    reset();
    onClose();
  };

  useFocusTrap(open, panelRef, handleClose);

  const successCloseRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (status === "success") {
      successCloseRef.current?.focus();
    }
  }, [status]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
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

          <button type="button" className={styles.close} onClick={handleClose} aria-label="Zamknij">
            ✕
          </button>
        </div>

        {status === "success" ? (
          <div className={styles.successState}>
            <div className={styles.successIcon} aria-hidden="true">✓</div>
            <h3 className={styles.successTitle}>Rezerwacja wysłana!</h3>
            <p className={styles.successDesc}>
              Skontaktujemy się z Tobą wkrótce, aby potwierdzić termin{" "}
              <strong>{form.date}</strong> o <strong>{form.time}</strong>.
            </p>
            <button type="button" className={styles.primary} onClick={handleClose} ref={successCloseRef}>
              Zamknij
            </button>
          </div>
        ) : (
          <>
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

            <form className={styles.form} onSubmit={submit} noValidate>
              {/* honeypot — hidden from real users, bots fill it */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                className={styles.honeypot}
              />

              <label className={styles.field}>
                <span className={styles.label}>Usługa</span>
                <select
                  ref={serviceSelectRef}
                  className={styles.control}
                  value={form.serviceId}
                  onChange={(e) => setField("serviceId", e.target.value as BookingServiceId)}
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
                    onChange={(e) => setField("date", e.target.value)}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Godzina</span>
                  <select
                    className={styles.control}
                    value={form.time}
                    onChange={(e) => setField("time", e.target.value)}
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
                  onChange={(e) => setField("name", e.target.value)}
                  autoComplete="name"
                  maxLength={80}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Telefon</span>
                <input
                  className={`${styles.control} ${phoneError ? styles.controlError : ""}`}
                  type="tel"
                  placeholder="Np. 600 000 000"
                  value={form.phone}
                  onChange={(e) => {
                    setPhoneError(false);
                    setField("phone", e.target.value);
                  }}
                  onBlur={() => {
                    if (form.phone.trim().length > 0) setPhoneError(!isPhoneValid);
                  }}
                  autoComplete="tel"
                  maxLength={20}
                  aria-describedby={phoneError ? "phone-error" : undefined}
                  aria-invalid={phoneError}
                />
                {phoneError && (
                  <span id="phone-error" className={styles.fieldError} role="alert">
                    Podaj poprawny numer telefonu (np. 600 000 000 lub +48 600 000 000)
                  </span>
                )}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Uwagi (opcjonalnie)</span>
                <textarea
                  className={styles.controlArea}
                  placeholder="Np. broda 2 cm, preferuję naturalne wykończenie…"
                  value={form.note}
                  onChange={(e) => setField("note", e.target.value)}
                  rows={3}
                  maxLength={300}
                />
              </label>

              {status === "error" && (
                <p className={styles.errorMsg} role="alert">
                  Coś poszło nie tak. Spróbuj ponownie lub zadzwoń do nas bezpośrednio.
                </p>
              )}

              <div className={styles.actions}>
                <button type="button" className={styles.secondary} onClick={handleClose}>
                  Anuluj
                </button>

                <button
                  type="submit"
                  className={styles.primary}
                  disabled={!canSubmit}
                  aria-busy={status === "sending"}
                >
                  {status === "sending" ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true" />
                      Wysyłanie…
                    </>
                  ) : (
                    <>
                      Wyślij rezerwację
                      <span className={styles.arrow} aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </div>

              <div className={styles.hint}>
                Po wysłaniu rezerwacji skontaktujemy się z Tobą, aby potwierdzić termin.
              </div>
            </form>
          </>
        )}
      </aside>
    </>
  );
}
