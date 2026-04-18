import { useState } from "react";
import styles from "./faq.module.scss";
import { faq } from "../../../data/content";
import { useInView } from "../../../hooks/useInView";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, inView } = useInView<HTMLElement>();
  const rv = inView ? "visible" : "hidden";

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      className={styles.section}
      id="faq"
      aria-label="Często zadawane pytania"
      ref={ref}
    >
      <div className={styles.inner}>
        <header className={styles.header} data-reveal={rv}>
          <p className={styles.eyebrow} aria-hidden="true">
            <span className={styles.eyebrowNum}>08</span>
            FAQ
          </p>
          <h2 className={styles.title}>Najczęstsze pytania.</h2>
        </header>

        <dl
          className={styles.list}
          data-reveal={rv}
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
        >
          {faq.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
              >
                <dt>
                  <button
                    type="button"
                    className={styles.question}
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                  >
                    <span className={styles.questionText}>{item.question}</span>
                    <span className={styles.icon} aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </dt>
                <dd
                  id={`faq-${i}`}
                  className={`${styles.answer} ${isOpen ? styles.answerOpen : ""}`}
                  aria-hidden={!isOpen}
                >
                  <p className={styles.answerText}>{item.answer}</p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
