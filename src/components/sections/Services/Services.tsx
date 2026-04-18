import { useState } from "react";
import styles from "./services.module.scss";
import { services } from "../../../data/content";
import { useInView } from "../../../hooks/useInView";

import hairBg from "../../../assets/images/wlosy.jpg?w=1400";
import beardBg from "../../../assets/images/maszynka.jpg?w=1400";
import comboBg from "../../../assets/images/fryzjer.jpg?w=1400";

const bgByTitle: Record<string, string> = {
  Strzyżenie: hairBg,
  Broda: beardBg,
  Combo: comboBg,
};

export function Services() {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView<HTMLElement>();
  const rv = inView ? "visible" : "hidden";

  const current = services[active];

  return (
    <section
      className={styles.section}
      id="uslugi"
      aria-label="Usługi"
      ref={ref}
    >
      <div className={styles.inner}>
        <div className={styles.layout}>

          <div className={styles.copy}>
            <header className={styles.header} data-reveal={rv}>
              <p className={styles.eyebrow} aria-hidden="true">
                <span className={styles.eyebrowNum}>02</span>
                Usługi
              </p>
              <h2 className={styles.title}>Wybierz usługę.<br />Resztę dowozimy my.</h2>
              <p className={styles.subtitle}>
                Premium strzyżenie i broda w klimacie „night studio". Szybki wybór, powtarzalny efekt i zero chaosu.
              </p>
            </header>

            <ol className={styles.list} aria-label="Lista usług">
              {services.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    className={`${styles.listItem} ${i === active ? styles.listItemActive : ""}`}
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    data-reveal={rv}
                    style={{ "--reveal-delay": `${120 + i * 90}ms` } as React.CSSProperties}
                  >
                    <span className={styles.listNum} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className={styles.listBody}>
                      <span className={styles.listTitle}>{s.title}</span>
                      <span className={styles.listMeta}>{s.meta}</span>
                    </div>
                    <span className={styles.listArrow} aria-hidden="true">→</span>
                  </button>
                </li>
              ))}
            </ol>

            <a
              className={styles.cta}
              href="#rezerwacja"
              aria-label="Przejdź do rezerwacji"
              data-reveal={rv}
              style={{ "--reveal-delay": "420ms" } as React.CSSProperties}
            >
              Rezerwuj termin
              <span className={styles.ctaArrow} aria-hidden="true">→</span>
            </a>
          </div>

          <article
            className={styles.preview}
            aria-label={`Podgląd usługi: ${current.title}`}
            data-reveal={rv}
            style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
          >
            <div className={styles.previewBg}>
              {services.map((s, i) => (
                <img
                  key={s.title}
                  src={bgByTitle[s.title] ?? hairBg}
                  alt=""
                  aria-hidden="true"
                  className={styles.previewBgImg}
                  data-active={i === active ? "true" : "false"}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}
            </div>

            <div className={styles.previewTop}>
              <div className={styles.previewTitleWrap}>
                <h3 className={styles.previewTitle}>{current.title}</h3>
                <p className={styles.previewDesc}>{current.desc}</p>
              </div>
              <span className={styles.badge}>{current.meta}</span>
            </div>

            <div className={styles.previewBottom}>
              <a className={styles.previewCta} href="#rezerwacja" aria-label="Umów wizytę dla tej usługi">
                Umów wizytę <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
