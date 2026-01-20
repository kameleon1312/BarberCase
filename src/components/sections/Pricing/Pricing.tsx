import { useMemo, useState } from "react";
import styles from "./pricing.module.scss";
import { pricing } from "../../../data/content";
import type { BookingServiceId } from "../../../data/content";

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
  const [paused, setPaused] = useState(false);

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

 
  const loopItems = useMemo(() => [...pricing, ...pricing], []);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <section className={styles.section} id="cennik" aria-label="Cennik">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Cennik</h2>
          <p className={styles.subtitle}>
            Transparentnie. Bez niespodzianek. Płacisz za jakość i powtarzalny efekt.
          </p>
        </header>

        <div className={styles.carouselWrap} aria-label="Karuzela cennika">
          <div
            className={styles.viewport}
            onMouseEnter={pause}
            onMouseLeave={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
          >
            <div
              className={`${styles.track} ${paused ? styles.paused : ""}`}
              role="list"
              aria-roledescription="carousel"
            >
              {loopItems.map((p, idx) => {
                const serviceId = toServiceId(p.name);
                const featured = !!p.featured;
                const meta = metaByService[serviceId];

                
                const handlePick = () => onPick?.(serviceId);

                return (
                  <button
                    key={`${p.name}-${idx}`}
                    type="button"
                    className={`${styles.card} ${featured ? styles.featured : ""}`}
                    role="listitem"
                    onClick={handlePick}
                    aria-label={`Wybierz ${p.name} i przejdź do rezerwacji`}
                    
                    onMouseEnter={pause}
                    onMouseLeave={resume}
                    onFocus={pause}
                    onBlur={resume}
                    onTouchStart={pause}
                    onTouchEnd={resume}
                  >
                    <div className={styles.cardGlow} aria-hidden="true" />

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
                      <span className={styles.dot} aria-hidden="true">
                        •
                      </span>
                      <span className={styles.metaHint}>Kliknij, aby zarezerwować</span>
                    </div>

                    <ul className={styles.features} aria-label="W pakiecie">
                      {meta.bullets.map((b) => (
                        <li key={`${b}-${idx}`} className={styles.feature}>
                          <span className={styles.check} aria-hidden="true">
                            ✓
                          </span>
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
                        <span className={styles.ctaArrow} aria-hidden="true">
                          →
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className={styles.fadeL} aria-hidden="true" />
            <div className={styles.fadeR} aria-hidden="true" />
          </div>
        </div>

        <div className={styles.hint}>
          * Czas zależy od długości włosów i oczekiwanego efektu. Zawsze dogadamy szczegóły przed startem.
        </div>
      </div>
    </section>
  );
}
