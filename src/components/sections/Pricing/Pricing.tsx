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

export function Pricing({ onPick }: PricingProps) {
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
          <div className={styles.carousel} role="list">
            {pricing.map((p) => {
              const serviceId = toServiceId(p.name);
              const featured = !!p.featured;

              return (
                <button
                  key={p.name}
                  type="button"
                  className={`${styles.card} ${featured ? styles.featured : ""}`}
                  role="listitem"
                  onClick={() => onPick?.(serviceId)}
                  aria-label={`Wybierz ${p.name} i przejdź do rezerwacji`}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.name}>
                      {p.name}
                      {p.note ? <span className={styles.note}> • {p.note}</span> : null}
                    </div>

                    {featured ? <span className={styles.badge}>Najczęściej</span> : null}
                  </div>

                  <div className={styles.meta}>
                    <span className={styles.time}>{p.time}</span>
                    <span className={styles.dot} aria-hidden="true">
                      •
                    </span>
                    <span className={styles.metaHint}>Kliknij, aby zarezerwować</span>
                  </div>

                  <div className={styles.price}>{p.price}</div>
                </button>
              );
            })}
          </div>

          <div className={styles.fadeL} aria-hidden="true" />
          <div className={styles.fadeR} aria-hidden="true" />
        </div>

        <div className={styles.hint}>
          * Czas zależy od długości włosów i oczekiwanego efektu. Zawsze dogadamy szczegóły przed startem.
        </div>
      </div>
    </section>
  );
}
