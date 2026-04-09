import { useMemo } from "react";
import styles from "./pricing.module.scss";
import { pricing } from "../../../data/content";
import type { BookingServiceId } from "../../../data/content";
import { useInView } from "../../../hooks/useInView";

type PricingProps = {
  onPick?: (serviceId: BookingServiceId) => void;
};

function toServiceId(name: string): BookingServiceId {
  const n = name.toLowerCase();
  if (n.includes("broda")) return "beard";
  if (n.includes("combo")) return "combo";
  if (n.includes("fade") || n.includes("skin")) return "fade";
  return "hair";
}

type ServiceMeta = {
  eyebrow: string;
  headline: string;
  bullets: string[];
};

export function Pricing({ onPick }: PricingProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const rv = inView ? "visible" : "hidden";

  const metaByService = useMemo<Record<BookingServiceId, ServiceMeta>>(
    () => ({
      hair: {
        eyebrow: "Klasyka / Nowoczesność",
        headline: "Strzyżenie dopasowane do kształtu twarzy",
        bullets: ["Konsultacja + dobór cięcia", "Precyzyjne cieniowanie", "Stylizacja i wskazówki pielęgnacji"],
      },
      fade: {
        eyebrow: "Fade / Skin Fade",
        headline: "Perfekcyjny gradient i czyste linie",
        bullets: ["Równe przejścia", "Wykończenie konturów", "Stylizacja pod efekt końcowy"],
      },
      beard: {
        eyebrow: "Broda",
        headline: "Geometria, symetria i clean look",
        bullets: ["Trymowanie + linie", "Dopasowanie do twarzy", "Pielęgnacja / olejek / balsam"],
      },
      combo: {
        eyebrow: "Combo",
        headline: "Pełen pakiet: włosy + broda",
        bullets: ["Spójny look całości", "Precyzyjne linie", "Stylizacja i dopracowanie detali"],
      },
    }),
    []
  );

  return (
    <section
      className={styles.section}
      id="cennik"
      aria-label="Cennik"
      ref={ref}
    >
      <div className={styles.inner}>
        <header className={styles.header} data-reveal={rv}>
          <p className={styles.eyebrow} aria-hidden="true">
            <span className={styles.eyebrowNum}>04</span>
            Cennik
          </p>
          <h2 className={styles.title}>Transparentnie.<br />Bez niespodzianek.</h2>
          <p className={styles.subtitle}>
            Płacisz za jakość i powtarzalny efekt. Zero ukrytych kosztów.
          </p>
        </header>

        <div className={styles.grid} role="list" aria-label="Lista usług i cen">
          {pricing.map((p, i) => {
            const serviceId = toServiceId(p.name);
            const featured = !!p.featured;
            const meta = metaByService[serviceId];

            return (
              <button
                key={p.name}
                type="button"
                className={`${styles.card} ${featured ? styles.featured : ""}`}
                role="listitem"
                onClick={() => onPick?.(serviceId)}
                aria-label={`Wybierz ${p.name} i przejdź do rezerwacji`}
                data-reveal={rv}
                style={{ "--reveal-delay": `${80 + i * 100}ms` } as React.CSSProperties}
              >
                <div className={styles.cardTop}>
                  <div className={styles.kicker}>{meta.eyebrow}</div>
                  {featured ? <span className={styles.badge}>Najczęściej</span> : null}
                </div>

                <div className={styles.nameRow}>
                  <div className={styles.name}>{p.name}</div>
                  {p.note ? <div className={styles.note}>• {p.note}</div> : null}
                </div>

                <div className={styles.desc}>{meta.headline}</div>

                <div className={styles.meta}>
                  <span className={styles.time}>{p.time}</span>
                  <span className={styles.metaDot} aria-hidden="true">•</span>
                  <span className={styles.metaHint}>Kliknij, aby zarezerwować</span>
                </div>

                <ul className={styles.features} aria-label="W pakiecie">
                  {meta.bullets.map((b) => (
                    <li key={b} className={styles.feature}>
                      <span className={styles.check} aria-hidden="true">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.cardBottom}>
                  <div className={styles.priceWrap}>
                    <div className={styles.price}>{p.price}</div>
                    <div className={styles.small}>Cena finalna po konsultacji (jeśli trzeba)</div>
                  </div>

                  <div className={styles.cta}>
                    <span className={styles.ctaText}>Rezerwuj termin</span>
                    <span className={styles.ctaArrow} aria-hidden="true">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p
          className={styles.hint}
          data-reveal={rv}
          style={{ "--reveal-delay": "480ms" } as React.CSSProperties}
        >
          * Czas zależy od długości włosów i oczekiwanego efektu. Zawsze dogadamy szczegóły przed startem.
        </p>
      </div>
    </section>
  );
}
