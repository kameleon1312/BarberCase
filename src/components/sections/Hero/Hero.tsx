import styles from "./hero.module.scss";
import fryzjer from "../../../assets/images/fryzjer.jpg";

type HeroProps = {
  onBook?: () => void;
};

export function Hero({ onBook }: HeroProps) {
  return (
    <section className={styles.hero} id="top" aria-label="Sekcja główna">
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
              <button type="button" className={styles.primaryBtn} onClick={onBook}>
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
                <span className={styles.val}>4.9</span>
                <span className={styles.statUnit}>/5</span>
              </div>
              <span className={styles.top}>Ocena klientów</span>
            </div>
            <div className={styles.stat}>
              <div className={styles.valRow}>
                <span className={styles.val}>30–70</span>
                <span className={styles.statUnit}>min</span>
              </div>
              <span className={styles.top}>Czas usługi</span>
            </div>
            <div className={styles.stat}>
              <div className={styles.valRow}>
                <span className={styles.val}>~20</span>
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
