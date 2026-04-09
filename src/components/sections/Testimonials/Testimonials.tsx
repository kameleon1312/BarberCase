import styles from "./testimonials.module.scss";
import { testimonials } from "../../../data/content";

export function Testimonials() {
  return (
    <section className={styles.section} id="opinie" aria-label="Opinie klientów">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow} aria-hidden="true">
            <span className={styles.eyebrowNum}>05</span>
            Opinie
          </p>
          <h2 className={styles.title}>Co mówią klienci.</h2>
        </header>

        <div className={styles.grid}>
          {testimonials.map((item, i) => (
            <blockquote key={i} className={styles.card}>
              <div className={styles.quoteSign} aria-hidden="true">"</div>
              <p className={styles.text}>{item.quote}</p>
              <footer className={styles.author}>
                <span className={styles.authorName}>{item.author}</span>
                <span className={styles.authorMeta}>
                  {item.service}&nbsp;·&nbsp;{item.date}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
