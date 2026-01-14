import styles from "./pricing.module.scss";
import { pricing } from "../../../data/content";

export function Pricing() {
  return (
    <section className={styles.section} id="cennik" aria-label="Cennik">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Cennik</h2>
          <p className={styles.subtitle}>
            Transparentnie. Bez niespodzianek. Płacisz za jakość i powtarzalny efekt.
          </p>
        </header>

        <div className={styles.table} role="table" aria-label="Tabela cennika">
          {pricing.map((p) => (
            <div
              key={p.name}
              className={`${styles.row} ${p.featured ? styles.featured : ""}`}
              role="row"
            >
              <div className={styles.left} role="cell">
                <div className={styles.name}>
                  {p.name}
                  {p.note ? <span className={styles.note}> • {p.note}</span> : null}
                </div>
                <div className={styles.time}>{p.time}</div>
              </div>

              <div className={styles.price} role="cell">
                {p.price}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.hint}>
          * Czas zależy od długości włosów i oczekiwanego efektu. Zawsze dogadamy szczegóły przed startem.
        </div>
      </div>
    </section>
  );
}
