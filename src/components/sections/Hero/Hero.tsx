import styles from "./hero.module.scss";
import fryzjer from "../../../assets/images/fryzjer.jpg";
import { useInView } from "../../../hooks/useInView";
import { useCounters } from "../../../hooks/useCounters";
import { useMagnetic } from "../../../hooks/useMagnetic";

type HeroProps = {
  onBook?: () => void;
};

const STAT_CONFIGS = [
  { target: 4.9, duration: 1200, decimals: 1 },
  { target: 30,  duration: 900  },
  { target: 70,  duration: 1100 },
  { target: 20,  duration: 800  },
] as const;

export function Hero({ onBook }: HeroProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15 });
  const magnetic = useMagnetic(0.28);

  const [rating, timeMin, timeMax, bookSec] = useCounters(
    STAT_CONFIGS as unknown as { target: number; duration?: number; decimals?: number }[],
    inView
  );

  return (
    <section className={styles.hero} id="top" aria-label="Sekcja główna" ref={ref}>
      <div className={styles.inner}>

        <div className={styles.copy}>
          <p className={styles.kicker} aria-hidden="true">
            <span className={styles.kickerNum}>01</span>
            Night Studio / Editorial Cuts
          </p>

          <h1 className={styles.title}>
            BarberSpace.
            <span className={styles.titleBreak}>
              Wygląd,<br />który działa.
            </span>
          </h1>

          <p className={styles.lead}>
            Premium strzyżenia i broda w klimacie night studio.
            Szybka rezerwacja, perfekcyjny detal, zero chaosu.
          </p>

          <div className={styles.actions}>
            {onBook ? (
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={onBook}
                ref={magnetic.ref}
                onMouseEnter={magnetic.onMouseEnter}
                onMouseMove={magnetic.onMouseMove}
                onMouseLeave={magnetic.onMouseLeave}
              >
                Umów wizytę
              </button>
            ) : (
              <a className={styles.primary} href="#rezerwacja">
                Umów wizytę
              </a>
            )}

            <a className={styles.secondary} href="#cennik">
              Zobacz cennik
            </a>
          </div>

          <div className={styles.stats} aria-label="Szybkie informacje">
            <div className={styles.stat}>
              <div className={styles.valRow}>
                <span className={styles.val}>{rating}</span>
                <span className={styles.statUnit}>/5</span>
              </div>
              <span className={styles.top}>Ocena klientów</span>
            </div>
            <div className={styles.stat}>
              <div className={styles.valRow}>
                <span className={styles.val}>{timeMin}–{timeMax}</span>
                <span className={styles.statUnit}>min</span>
              </div>
              <span className={styles.top}>Czas usługi</span>
            </div>
            <div className={styles.stat}>
              <div className={styles.valRow}>
                <span className={styles.val}>~{bookSec}</span>
                <span className={styles.statUnit}>sek</span>
              </div>
              <span className={styles.top}>Rezerwacja online</span>
            </div>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.showcase}>
            <img
              src={fryzjer}
              alt="Barber podczas precyzyjnego strzyżenia w BarberSpace"
              className={styles.image}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className={styles.frame} />
            <div className={styles.tag}>Premium Studio</div>
            <div className={styles.sweep} />
          </div>
        </div>

      </div>
    </section>
  );
}
