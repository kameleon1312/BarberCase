import styles from "./hero.module.scss";
import fryzjer from "../../../assets/images/fryzjer.jpg";

export function Hero() {
  return (
    <section className={styles.hero} id="top" aria-label="Sekcja główna">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.kicker}>NIGHT STUDIO / EDITORIAL CUTS</p>

          <h1 className={styles.title}>
            BarberSpace.
            <span className={styles.accent}> Wygląd, który działa.</span>
          </h1>

          <p className={styles.lead}>
            Premium strzyżenia i broda w klimacie “night studio”. Szybka rezerwacja,
            perfekcyjny detal, zero chaosu.
          </p>

          <div className={styles.actions}>
            <a className={styles.primary} href="#rezerwacja">
              Umów wizytę
            </a>
            <a className={styles.secondary} href="#cennik">
              Zobacz cennik
            </a>
          </div>

          <div className={styles.stats} aria-label="Szybkie informacje">
            <div className={styles.stat}>
              <span className={styles.top}>Ocena</span>
              <span className={styles.val}>4.9/5</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.top}>Czas</span>
              <span className={styles.val}>30–70 min</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.top}>Rezerwacja</span>
              <span className={styles.val}>~20 sek</span>
            </div>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.showcase}>
            <img src={fryzjer} alt="" className={styles.image} />
            <div className={styles.frame} />
            <div className={styles.tag}>SIGNATURE LOOK</div>
            <div className={styles.sweep} />
          </div>
        </div>
      </div>
    </section>
  );
}
