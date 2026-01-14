import styles from "./services.module.scss";
import { services } from "../../../data/content";

export function Services() {
  return (
    <section className={styles.section} id="uslugi" aria-label="Usługi">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Usługi</h2>
          <p className={styles.subtitle}>
            Krótko, konkretnie i premium. Wybierasz — my dowozimy detal.
          </p>
        </header>

        <div className={styles.grid}>
          {services.map((s) => (
            <article key={s.title} className={styles.card}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <span className={styles.meta}>{s.meta}</span>
              </div>
              <p className={styles.desc}>{s.desc}</p>
              <div className={styles.line} />
              <div className={styles.pillRow}>
                <span className={styles.pill}>Precyzja</span>
                <span className={styles.pill}>Czystość</span>
                <span className={styles.pill}>Styl</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
