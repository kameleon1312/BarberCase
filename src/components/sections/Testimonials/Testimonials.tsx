import styles from "./testimonials.module.scss";
import { testimonials } from "../../../data/content";
import { useInView } from "../../../hooks/useInView";

export function Testimonials() {
  const { ref, inView } = useInView<HTMLElement>();
  const rv = inView ? "visible" : "hidden";

  return (
    <section
      className={styles.section}
      id="opinie"
      aria-label="Opinie klientów"
      ref={ref}
    >
      <div className={styles.inner}>
        <header className={styles.header} data-reveal={rv}>
          <p className={styles.eyebrow} aria-hidden="true">
            <span className={styles.eyebrowNum}>06</span>
            Opinie
          </p>
          <h2 className={styles.title}>Co mówią klienci.</h2>
        </header>

        <div className={styles.grid}>
          {testimonials.map((item, i) => (
            <blockquote
              key={i}
              className={styles.card}
              data-reveal={rv}
              style={{ "--reveal-delay": `${100 + i * 110}ms` } as React.CSSProperties}
            >
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
