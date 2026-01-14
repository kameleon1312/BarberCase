import styles from "./cta.module.scss";

export function CTA() {
  return (
    <section className={styles.section} id="kontakt" aria-label="Kontakt i rezerwacja">
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.left}>
            <h2 className={styles.title}>Zarezerwuj termin</h2>
            <p className={styles.subtitle}>
              Najprościej: kliknij i zarezerwuj. Jeśli wolisz — napisz lub zadzwoń.
            </p>

            <div className={styles.actions} id="rezerwacja">
              <a className={styles.primary} href="#">
                Rezerwacja online
              </a>
              <a className={styles.secondary} href="tel:+48123123123">
                Zadzwoń
              </a>
              <a className={styles.secondary} href="mailto:kontakt@barberspace.pl">
                Napisz
              </a>
            </div>

            <div className={styles.meta}>
              <div className={styles.item}>
                <span className={styles.key}>Adres</span>
                <span className={styles.val}>Warszawa • Centrum</span>
              </div>
              <div className={styles.item}>
                <span className={styles.key}>Godziny</span>
                <span className={styles.val}>Pn–Sb • 10:00–20:00</span>
              </div>
            </div>
          </div>

          <div className={styles.right} aria-hidden="true">
            <div className={styles.mapMock}>
              <div className={styles.mapFrame} />
              <div className={styles.pin}>📍</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
